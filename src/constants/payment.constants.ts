import { PaymentMethodOption, PaymentMethodType } from "@/types/payment.types";

export const paymentMethodOptions: PaymentMethodOption[] = [
  { value: "aba", label: "ABA Bank", logo: "🏦" },
  { value: "acleda", label: "Acleda Bank", logo: "🏛️" },
  { value: "wing", label: "Wing Bank", logo: "💸" },
  { value: "truemoney", label: "True Money", logo: "💰" },
  { value: "paypal", label: "PayPal", logo: "💳" },
  { value: "stripe", label: "Stripe", logo: "⚡" },
];