import React, { useState } from "react";
import {
  Plus,
  X,
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  QrCode,
  Check,
  Lock,
  ChevronRight,
} from "lucide-react";

// ==================== TYPES ====================
type CartItem = {
  id: number;
  name: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
  image: string;
};

type PaymentMethodHeaderProps =
  | {
      showAddForm: boolean;
      onToggleForm: () => void;
      cartItems?: never;
      totalAmount?: never;
      onBack?: never;
      onPaymentComplete?: never;
    }
  | {
      cartItems: CartItem[];
      totalAmount: number;
      onBack: () => void;
      onPaymentComplete: (paymentData: any) => void;
      showAddForm?: never;
      onToggleForm?: never;
    };

// ==================== UI COMPONENTS ====================

const PaymentMethodCard = ({
  icon: Icon,
  label,
  isSelected,
  onClick,
  accent = "green",
}: {
  icon: any;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  accent?: "green" | "blue" | "red" | "orange";
}) => {
  const accentColors = {
    green:
      "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    blue: "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    red: "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
    orange:
      "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative p-6 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
        isSelected
          ? accentColors[accent]
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`p-3 rounded-xl transition-all duration-300 ${
            isSelected
              ? "bg-white dark:bg-gray-800 shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
          }`}
        >
          <Icon
            className={`w-7 h-7 transition-colors ${
              isSelected
                ? "text-green-600 dark:text-green-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          />
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </p>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3 bg-green-600 rounded-full p-1 animate-in zoom-in duration-200">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  maxLength?: number;
  icon?: any;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full ${
          Icon ? "pl-12" : "pl-4"
        } pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none`}
      />
    </div>
  </div>
);

const QRModal = ({
  show,
  onClose,
  amount,
  method,
  onConfirm,
  isProcessing,
}: {
  show: boolean;
  onClose: () => void;
  amount: number;
  method: string;
  onConfirm: () => void;
  isProcessing: boolean;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Scan to Pay
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl mb-6 shadow-inner">
          <div className="w-full aspect-square bg-white dark:bg-gray-950 rounded-xl flex items-center justify-center shadow-lg">
            <QrCode className="w-32 h-32 text-gray-300 dark:text-gray-700 animate-pulse" />
          </div>
        </div>

        <div className="text-center mb-6 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Amount to pay
          </p>
          <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ${amount.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
            Open your{" "}
            <span className="font-semibold">
              {method.replace("_qr", "").toUpperCase()}
            </span>{" "}
            app and scan this QR code
          </p>
        </div>

        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            "I've Completed Payment"
          )}
        </button>
      </div>
    </div>
  );
};

const OrderSummary = ({
  cartItems,
  totalAmount,
}: {
  cartItems: CartItem[];
  totalAmount: number;
}) => (
  <div className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl sticky top-8">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
        <Wallet className="w-5 h-5 text-blue-600" />
      </div>
      Order Summary
    </h2>
    <div className="space-y-4 mb-6">
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex justify-between text-sm py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
        >
          <span className="text-gray-600 dark:text-gray-400">
            {item.name} × {item.quantity}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
    <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mb-6">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          Total
        </span>
        <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          ${totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
      <p className="text-xs text-center text-green-800 dark:text-green-300 flex items-center justify-center gap-2">
        <Lock className="w-4 h-4" />
        <span className="font-medium">Secure checkout with SSL encryption</span>
      </p>
    </div>
  </div>
);

const CreditCardForm = ({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  expiry,
  setExpiry,
  cvv,
  setCvv,
  onSubmit,
  isProcessing,
  totalAmount,
}: {
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardName: string;
  setCardName: (val: string) => void;
  expiry: string;
  setExpiry: (val: string) => void;
  cvv: string;
  setCvv: (val: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  totalAmount: number;
}) => (
  <div className="space-y-5">
    <InputField
      label="Card Number"
      value={cardNumber.replace(/(.{4})/g, "$1 ").trim()}
      onChange={(e) =>
        setCardNumber(e.target.value.replace(/\s/g, "").slice(0, 16))
      }
      placeholder="1234 5678 9012 3456"
      icon={CreditCard}
    />
    <InputField
      label="Cardholder Name"
      value={cardName}
      onChange={(e) => setCardName(e.target.value)}
      placeholder="John Doe"
    />
    <div className="grid grid-cols-2 gap-4">
      <InputField
        label="Expiry Date"
        value={expiry}
        onChange={(e) => {
          let val = e.target.value.replace(/\D/g, "");
          if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
          setExpiry(val);
        }}
        placeholder="MM/YY"
        maxLength={5}
      />
      <InputField
        label="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
        placeholder="123"
        type="password"
      />
    </div>
    <button
      onClick={onSubmit}
      disabled={isProcessing || !cardNumber || !cardName || !expiry || !cvv}
      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 text-lg font-bold rounded-xl mt-6 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3"
    >
      {isProcessing ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Lock className="w-5 h-5" />
          Pay ${totalAmount.toFixed(2)}
        </>
      )}
    </button>
  </div>
);

const WalletPaymentOptions = ({
  onPayment,
  isProcessing,
}: {
  onPayment: (wallet: string) => void;
  isProcessing: boolean;
}) => (
  <div className="space-y-4">
    <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
      Choose your preferred wallet provider
    </p>
    <button
      onClick={() => onPayment("paypal")}
      disabled={isProcessing}
      className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg font-semibold flex items-center justify-between px-6"
    >
      <span>Pay with PayPal</span>
      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </button>
    <button
      onClick={() => onPayment("apple_pay")}
      disabled={isProcessing}
      className="group w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg font-semibold flex items-center justify-between px-6"
    >
      <span>Pay with Apple Pay</span>
      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </button>
    <button
      onClick={() => onPayment("google_pay")}
      disabled={isProcessing}
      className="group w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg font-semibold flex items-center justify-between px-6"
    >
      <span>Pay with Google Pay</span>
      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </button>
  </div>
);

const LocalBankForm = ({
  bankType,
  accountNumber,
  setAccountNumber,
  onCardPayment,
  onQRPayment,
  isProcessing,
  color,
}: {
  bankType: string;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  onCardPayment: () => void;
  onQRPayment: () => void;
  isProcessing: boolean;
  color: "blue" | "red" | "orange";
}) => {
  const colorClasses = {
    blue: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    red: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
    orange:
      "from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800",
  };

  return (
    <div className="space-y-5">
      <InputField
        label={`${bankType.toUpperCase()} Account Number / Phone Number`}
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        placeholder="012 345 678"
        icon={Smartphone}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onCardPayment}
          disabled={isProcessing || !accountNumber}
          className={`bg-gradient-to-r ${colorClasses[color]} disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg font-semibold`}
        >
          {isProcessing ? "Processing..." : "Pay with Card"}
        </button>
        <button
          onClick={onQRPayment}
          disabled={isProcessing}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg font-semibold flex items-center justify-center gap-2"
        >
          <QrCode className="w-5 h-5" />
          Pay with QR
        </button>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
      <CreditCard className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 dark:text-gray-400 text-lg">
      Select a payment method to continue
    </p>
  </div>
);

// ==================== MAIN COMPONENTS ====================

const CheckoutMode = ({
  cartItems,
  totalAmount,
  onBack,
  onPaymentComplete,
}: {
  cartItems: CartItem[];
  totalAmount: number;
  onBack: () => void;
  onPaymentComplete: (data: any) => void;
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrPaymentMethod, setQrPaymentMethod] = useState("");
  const [abaNumber, setAbaNumber] = useState("");
  const [aceledaNumber, setAceledaNumber] = useState("");
  const [bakongNumber, setBakongNumber] = useState("");

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentComplete({
        method: selectedMethod,
        amount: totalAmount,
        cardLast4: cardNumber.slice(-4),
        timestamp: new Date().toISOString(),
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleWalletPayment = (walletType: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentComplete({
        method: walletType,
        amount: totalAmount,
        timestamp: new Date().toISOString(),
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleLocalBankPayment = (bankType: string, accountNumber: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentComplete({
        method: bankType,
        amount: totalAmount,
        accountNumber: accountNumber,
        timestamp: new Date().toISOString(),
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleQRPayment = (method: string) => {
    setQrPaymentMethod(method);
    setShowQRModal(true);
  };

  const confirmQRPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentComplete({
        method: qrPaymentMethod,
        amount: totalAmount,
        paymentType: "qr_code",
        timestamp: new Date().toISOString(),
      });
      setIsProcessing(false);
      setShowQRModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-in slide-in-from-top duration-500">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-5 py-2.5 mb-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 text-gray-700 dark:text-gray-300 transition-all duration-300 hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Cart</span>
          </button>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Complete your purchase securely
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 animate-in slide-in-from-left duration-500">
            <div className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                Payment Method
              </h2>

              <div className="mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <PaymentMethodCard
                    icon={CreditCard}
                    label="Credit Card"
                    isSelected={selectedMethod === "card"}
                    onClick={() => setSelectedMethod("card")}
                  />
                  <PaymentMethodCard
                    icon={Wallet}
                    label="Digital Wallet"
                    isSelected={selectedMethod === "wallet"}
                    onClick={() => setSelectedMethod("wallet")}
                  />
                  <PaymentMethodCard
                    icon={Smartphone}
                    label="ABA Bank"
                    isSelected={selectedMethod === "aba"}
                    onClick={() => setSelectedMethod("aba")}
                    accent="blue"
                  />
                  <PaymentMethodCard
                    icon={Smartphone}
                    label="ACLEDA Bank"
                    isSelected={selectedMethod === "acleda"}
                    onClick={() => setSelectedMethod("acleda")}
                    accent="red"
                  />
                  <PaymentMethodCard
                    icon={Smartphone}
                    label="Bakong"
                    isSelected={selectedMethod === "bakong"}
                    onClick={() => setSelectedMethod("bakong")}
                    accent="orange"
                  />
                </div>
              </div>

              <div className="animate-in fade-in duration-500">
                {selectedMethod === "card" && (
                  <CreditCardForm
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    cardName={cardName}
                    setCardName={setCardName}
                    expiry={expiry}
                    setExpiry={setExpiry}
                    cvv={cvv}
                    setCvv={setCvv}
                    onSubmit={handleSubmit}
                    isProcessing={isProcessing}
                    totalAmount={totalAmount}
                  />
                )}

                {selectedMethod === "wallet" && (
                  <WalletPaymentOptions
                    onPayment={handleWalletPayment}
                    isProcessing={isProcessing}
                  />
                )}

                {selectedMethod === "aba" && (
                  <LocalBankForm
                    bankType="ABA"
                    accountNumber={abaNumber}
                    setAccountNumber={setAbaNumber}
                    onCardPayment={() =>
                      handleLocalBankPayment("aba", abaNumber)
                    }
                    onQRPayment={() => handleQRPayment("aba_qr")}
                    isProcessing={isProcessing}
                    color="blue"
                  />
                )}

                {selectedMethod === "acleda" && (
                  <LocalBankForm
                    bankType="ACLEDA"
                    accountNumber={aceledaNumber}
                    setAccountNumber={setAceledaNumber}
                    onCardPayment={() =>
                      handleLocalBankPayment("acleda", aceledaNumber)
                    }
                    onQRPayment={() => handleQRPayment("acleda_qr")}
                    isProcessing={isProcessing}
                    color="red"
                  />
                )}

                {selectedMethod === "bakong" && (
                  <LocalBankForm
                    bankType="Bakong"
                    accountNumber={bakongNumber}
                    setAccountNumber={setBakongNumber}
                    onCardPayment={() =>
                      handleLocalBankPayment("bakong", bakongNumber)
                    }
                    onQRPayment={() => handleQRPayment("bakong_qr")}
                    isProcessing={isProcessing}
                    color="orange"
                  />
                )}

                {!selectedMethod && <EmptyState />}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 animate-in slide-in-from-right duration-500">
            <OrderSummary cartItems={cartItems} totalAmount={totalAmount} />
          </div>
        </div>
      </div>

      <QRModal
        show={showQRModal}
        onClose={() => setShowQRModal(false)}
        amount={totalAmount}
        method={qrPaymentMethod}
        onConfirm={confirmQRPayment}
        isProcessing={isProcessing}
      />
    </div>
  );
};

const SettingsMode = ({
  showAddForm,
  onToggleForm,
}: {
  showAddForm: boolean;
  onToggleForm: () => void;
}) => (
  <div className="flex items-center justify-between mb-8 animate-in slide-in-from-top duration-500">
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-2">
        Payment Methods
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Manage your business payment receiving methods
      </p>
    </div>
    <button
      onClick={onToggleForm}
      className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
    >
      {showAddForm ? (
        <>
          <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
          Cancel
        </>
      ) : (
        <>
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          Add Method
        </>
      )}
    </button>
  </div>
);

// ==================== MAIN EXPORT ====================

export const PaymentMethodHeader: React.FC<PaymentMethodHeaderProps> = (
  props
) => {
  const isCheckoutMode = "cartItems" in props && props.cartItems !== undefined;

  if (isCheckoutMode) {
    return (
      <CheckoutMode
        cartItems={props.cartItems}
        totalAmount={props.totalAmount}
        onBack={props.onBack}
        onPaymentComplete={props.onPaymentComplete}
      />
    );
  }

  return (
    <SettingsMode
      showAddForm={props.showAddForm}
      onToggleForm={props.onToggleForm}
    />
  );
};
