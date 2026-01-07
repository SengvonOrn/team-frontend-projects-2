import { ReactNode } from "react";

 export type SettingsState = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorAuth: boolean;
  privateProfile: boolean;
  showActivity: boolean;
  allowMessages: boolean;
  marketingEmails: boolean;
  dataCollection: boolean;
}

export type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type PasswordError = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

export  type SectionId =
  | "account"
  | "security"
  | "notifications"
  | "preferences"
  | "danger";


  
export interface Product {
  id?: number | string; // Changed from string to number
  name?: string;
  price: number;
  originalPrice: number;
  category?: string;
  rating: number;
  reviews?: number;
  description?: string;
  image?: string;
  badge?: string | null;
  inStock?: boolean;
  sku?: string;
  stock?: number;
  sold?: number;
  status?: "active" | "draft" | "out_of_stock";
  createdAt: string;
}






export interface FormData {
  name: string;
  sku: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  description: string;
  image: File | null;
  imagePreview: string;
}


