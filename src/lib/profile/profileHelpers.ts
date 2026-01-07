import { UserData } from "@/types/user";
import { boolean } from "zod";

// ===============================
// Map backend user → frontend state
// ===============================
export const mapUserToState = (user: any): UserData => ({
  id: user.id,
  name: user.name,
  email: user.email,
  username: user.username,
  image: user.image,
  role: user.role,
  hasStore: user.hasStore,
  followersCount: user.followersCount,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,

  profileImage: user.profileImage ?? [],
  customers: user.customers ?? [],
  comments: user.comments ?? [],
  cartItems: user.cartItems ?? [],
  locations: user.locations ?? [],
  store: user.store ?? [],
});

// ===============================
// Build update payload (NO userProfile)
// ===============================
export const buildUpdateData = (formData: any, userData: UserData) => {
  const updateData: any = {};

  if (formData.name && formData.name !== userData.name) {
    updateData.name = formData.name;
  }

  if (formData.email && formData.email !== userData.email) {
    updateData.email = formData.email;
  }

  if (formData.username && formData.username !== userData.username) {
    updateData.username = formData.username;
  }

  if (formData.password?.trim()) {
    updateData.password = formData.password;
  }

  // // Optional profile fields (flat)
  // if (formData.bio) updateData.bio = formData.bio;
  // if (formData.phone) updateData.phone = formData.phone;
  // if (formData.address) updateData.address = formData.address;

  return updateData;
};

// ===============================
// Reset form
// ===============================
export const resetFormData = (userData: UserData) => ({
  name: userData.name,
  email: userData.email,
  username: userData.username || "",
  password: "",
  // bio: "",
  // phone: "",
  // address: "",
});
