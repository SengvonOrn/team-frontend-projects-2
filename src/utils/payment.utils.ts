import { PaymentMethodType } from "@/types/payment.types";
import { paymentMethodOptions } from "@/constants/payment.constants";

export const getMethodLabel = (type: PaymentMethodType): string => {
  return paymentMethodOptions.find((opt) => opt.value === type)?.label || type;
};

export const getMethodLogo = (type: PaymentMethodType): string => {
  return paymentMethodOptions.find((opt) => opt.value === type)?.logo || "🏦";
};