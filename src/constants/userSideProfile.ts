export interface Component {
  title: string;
  href: string;
  description: string;
}

// Define the Deal and Props interfaces
// types.ts
export interface Deal {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  category: string; // added category
}

// data/topDealsData.ts

export const topDealsData: Deal[] = [
  {
    id: 1,
    name: "Smart Watch",
    price: 120,
    image: "/images/watch.png",
    description: "Track your fitness and notifications.",
    rating: 4.5,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 80,
    image: "/images/headphones.png",
    description: "High quality sound and comfort.",
    rating: 4.2,
    category: "Electronics",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 95,
    image: "/images/shoes.png",
    description: "Lightweight shoes for daily running.",
    rating: 4.7,
    category: "Sports",
  },
  {
    id: 4,
    name: "Yoga Mat",
    price: 25,
    image: "/images/yoga-mat.png",
    description: "Comfortable and non-slip mat.",
    rating: 4.3,
    category: "Fitness",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 60,
    image: "/images/speaker.png",
    description: "Portable speaker with deep bass.",
    rating: 4.6,
    category: "Electronics",
  },
];

export type TabType =
  | "overview"
  | "edit"
  | "products"
  | "payment"
  | "settings"
  | "location"
  | "storedashboard";

export const menuItems = [
  {
    id: "overview" as TabType,
    label: "Overview",
    icon: User,
    description: "View your profile information",
  },
  {
    id: "edit" as TabType,
    label: "Edit Profile",
    icon: Edit,
    description: "Update your personal information",
  },
  {
    id: "location" as TabType,
    label: "set Location",
    icon: IconLocation,
    description: "Update your location information",
  },
  {
    id: "payment" as TabType,
    label: "Add Payments",
    icon: Plus,
    description: "Create and manage your payment",
  },
  {
    id: "products" as TabType,
    label: "Add Product",
    icon: Plus,
    description: "Create and manage your products",
  },
  {
    id: "settings" as TabType,
    label: "Settings",
    icon: Settings,
    description: "Account and privacy settings",
  },
  // {
  //   id: "storedashboard" as TabType,
  //   label: "storedashboard",
  //   icon: Settings,
  //   description: "Account and privacy storedashboard",
  // },
];

import { IconLocation } from "@tabler/icons-react";
import Shoe from "../../public/slider/Shoe.jpg";
import Three from "../../public/slider/Three.jpg";
import Two from "../../public/slider/Two.jpg";
import { Edit, Plus, Settings, User } from "lucide-react";

export const slides2 = [
  {
    title: "Black",
    subtitle: "FRIDAY",
    discount: "50% off",
    images: Shoe,
  },
  {
    title: "Cyber",
    subtitle: "MONDAY",
    discount: "70% off",
    images: Three,
  },
  {
    title: "Holiday",
    subtitle: "SALE",
    discount: "40% off",
    images: Two,
  },
];
