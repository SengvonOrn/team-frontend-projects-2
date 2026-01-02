import { BreadcrumbItem } from "@/lib/breakcrumb/navigationBreadcrumb";
import { ReactNode } from "react";
import { UserData } from "./user";

export interface Product {
  id: number;
  name: string;
  description: string;
  originalPrice?: number;
  discount?: number;
  price: number;
  reviews?: number;
  rating: number;
  image?: string;
  // images?: string[];
}


export interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showBreadcrumb?: boolean;
  customBreadcrumbItems?: BreadcrumbItem[];
  showUserInfo?: boolean;
  userData?: UserData;
}




export const getAvatarColor = (name: string) => {
  const colors = [
    "from-blue-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-pink-500 to-purple-600",
    "from-indigo-500 to-blue-600",
    "from-cyan-500 to-blue-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-green-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
// Get user initials first text
export const getInitails = (name: string) => {
  return name
    .split("")
    .map((n) => n[0])
    .join("")
    .toLowerCase()
    .slice(0, 2);
};
export type ViewMode = "grid" | "list";
export type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest";



export interface ProductFilters {
  selectedCategories: string[];
  priceRange: [number, number];
  minRating: number;
  freeDeliveryOnly: boolean;
  inStockOnly: boolean;
}
