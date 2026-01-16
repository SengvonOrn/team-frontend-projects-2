// ============================================
// DISPLAY PRODUCT TYPE (For UI/Frontend)
// ============================================

export interface Seller {
  name: string;
  location?: string;
  verified?: boolean;
  totalReviews?: string;
  averageRating?: number;
  onTimeDelivery?: string;
}

export interface ProductVariations {
  [key: string]: string[];
}

export interface DisplayProduct {
  id?: string | number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews?: number;
  slug: string;
  sold?: string;
  image?: string;
  images?: string[];
  variations?: ProductVariations;
  seller?: Seller;
}

// ============================================
// DATABASE PRODUCT TYPE (Full Schema)
// ============================================

export enum ImageType {
  MAIN = "MAIN",
  GALLERY = "GALLERY",
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  imageType: ImageType;
  width?: number;
  height?: number;
  fileSize?: number;
  mimetype?: string;
  altText?: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  id: string;
  productVariantId: string;
  quantityInStock: number;
  reorderLevel?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  stock: number;
  inventory?: Inventory;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewUser {
  id: string;
  name: string;
  image?: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment?: string;
  user: ReviewUser;
}

export interface Store {
  id: string;
  name: string;
  userId: string | number;
}

export enum ProductStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  category?: string;
  tags?: string;
  sku?: string;
  status: ProductStatus | string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: Date;
  updatedAt: Date;
  store: Store;
  variants?: ProductVariant[];
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  reviews?: Review[];
  wishlists?: any[];
  comments?: any[];
}

// ============================================
// INPUT TYPES
// ============================================

export interface AddProductInput {
  storeId: string;
  name: string;
  description: string;
  brand?: string;
  category: string;
  slug: string;
  status?: ProductStatus | "ACTIVE" | "DRAFT" | "ARCHIVED" | "OUT_OF_STOCK";
  tags?: string[];
  sku?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  brand?: string;
  category?: string;
  slug?: string;
  status?: ProductStatus | string;
  tags?: string[];
  sku?: string;
}

export interface ProductVariantForm {
  id?: string;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface ProductVariantInput {
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  sku?: string;
  slug?: string;
  category: string;
  brand?: string;
  status: ProductStatus | string;
  variants: ProductVariantForm[];
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductsResponse {
  data: Product[];
  pagination: PaginationMeta;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DeleteResponse {
  message: string;
}

export interface DeleteMultipleResponse {
  deleted: number;
  failed: number;
}

// ============================================
// FILTER & SORT TYPES
// ============================================

export type ViewMode = "grid" | "list";
export type SortOption =
  | "featured"
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "rating"
  | "best-selling";

export interface ProductSearchFilters {
  storeId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface ProductListFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  freeDeliveryOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
}