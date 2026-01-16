/**
 * ================================================================
 * STORE TYPES
 * ================================================================
 */

export interface IProduct {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessHours {
  open?: string; // e.g., "09:00"
  close?: string; // e.g., "18:00"
  days?: string[]; // e.g., ["Monday", "Tuesday", ...]
}

export type ImageType = "LOGO" | "BANNER" | "GALLERY";

export interface IStoreImage {
  id: string;
  storeId: string;
  imageUrl: string;
  imageType: ImageType;
  cloudinaryPublicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStore {
  id: string;
  userId: number;

  // Basic Info
  name: string;
  description?: string;

  // Location
  address?: string;
  city?: string;
  state?: string;

  // Media
  images?: IStoreImage[];

  // Convenience getters for frontend
  logo?: string; // derived from images
  banner?: string; // derived from images

  // Status & Hours
  isActive?: boolean;
  businessHours?: BusinessHours;

  // Relations
  products?: IProduct[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * ================================================================
 * STORE REQUEST/RESPONSE TYPES
 * ================================================================
 */

export interface CreateStoreRequest {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  isActive?: boolean;
  businessHours?: BusinessHours;
}

export interface UpdateStoreRequest extends Partial<CreateStoreRequest> {}

export interface StoreResponse {
  success: boolean;
  message: string;
  data?: IStore | IStore[];
}

/**
 * ================================================================
 * PAGINATED STORE RESPONSE
 * ================================================================
 */

export interface IPaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
