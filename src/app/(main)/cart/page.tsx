// "use client";
// import { useContext } from "react";
// import { CartContext } from "@/context/cart/CartContext";
// // import { AuthContext } from "@/context/auth/AuthContext";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export default function CartPage() {
//   const { cartItems, removeItem, decreaseQty, increaseQty } =
//     useContext(CartContext);
//   // const { user } = useContext(AuthContext);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

//       {/* Show message if user is not logged in */}
//       {/* {!user && (
//         <p className="mb-4 text-gray-500">
//           You are not logged in. You can still view your cart.
//         </p>
//       )} */}

//       {/* If cart is empty */}
//       {cartItems.length === 0 ? (
//         <p className="text-gray-500">Your cart is empty.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {cartItems.map((item) => (
//             <Card key={item.id} className="p-4">
//               <h2 className="font-bold text-lg">{item.name}</h2>
//               <p className="text-green-600 font-bold">${item.price}</p>
//               <p>
//                 {item.name} ${item.price} x {item.quantity}
//               </p>

//               <div className="flex gap-2 mt-2">
//                 <Button onClick={() => decreaseQty(item.id)}>-</Button>
//                 <span>{item.quantity}</span>
//                 <Button onClick={() => increaseQty(item.id)}>+</Button>
//               </div>

//               <Button className="mt-2" onClick={() => removeItem(item.id)}>
//                 Remove
//               </Button>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useContext, useState } from "react";
import { CartContext } from "@/context/cart/CartContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentMethodHeader } from "@/components/payments/PaymentMethodHeader"; // Adjust path as needed
import { Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeItem, decreaseQty, increaseQty, clearCart } =
    useContext(CartContext);
  const [showPayment, setShowPayment] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Handle payment completion
  const handlePaymentComplete = (paymentData: any) => {
    console.log("Payment completed:", paymentData);
    // Clear cart after successful payment
    clearCart?.();
    // You can also redirect to order confirmation page
    // router.push('/order-confirmation');
    alert("Order placed successfully! Thank you for your purchase.");
    setShowPayment(false);
  };

  // If showing payment page
  if (showPayment) {
    return (
      <PaymentMethodHeader
        cartItems={cartItems}
        totalAmount={total}
        onBack={() => setShowPayment(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  // Cart view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {/* If cart is empty */}
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button
              onClick={() => (window.location.href = "/products")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {item.name}
                          </h2>
                          {item.size && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Size: {item.size}
                            </p>
                          )}
                          {item.color && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Color: {item.color}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => decreaseQty(item.id)}
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            −
                          </Button>
                          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() => increaseQty(item.id)}
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            +
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < 50 && (
                    <p className="text-xs text-gray-500">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax (10%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  onClick={() => (window.location.href = "/products")}
                  variant="outline"
                  className="w-full mt-3"
                >
                  Continue Shopping
                </Button>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                    🔒 Secure checkout powered by SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

