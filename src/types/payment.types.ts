export type PaymentMethodType =
  | "aba"
  | "acleda"
  | "wing"
  | "truemoney"
  | "paypal"
  | "stripe";

export interface PaymentAccount {
  id: string;
  type: PaymentMethodType;
  accountName: string;
  accountNumber: string;
  isActive: boolean;
  isPrimary: boolean;
}

export interface PaymentMethodOption {
  value: PaymentMethodType;
  label: string;
  logo: string;
}

export interface PaymentFormData {
  type: PaymentMethodType;
  accountName: string;
  accountNumber: string;
}