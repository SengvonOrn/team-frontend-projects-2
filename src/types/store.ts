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
  open?: string;      // e.g., "09:00"
  close?: string;     // e.g., "18:00"
  days?: string[];    // e.g., ["Monday", "Tuesday", ...]
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
  country?: string;
  postalCode?: string;
  
  // Contact
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  
  // Media
  logo?: string;
  banner?: string;
  
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