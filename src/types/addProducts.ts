// ============================================
// IMAGE TYPES
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

export interface AddProductImageInput {
  imageUrl: string;
  imageType?: ImageType | "MAIN" | "GALLERY";
  width?: number;
  height?: number;
  fileSize?: number;
  mimetype?: string;
  altText?: string;
  position?: number;
}

// ============================================
// PRODUCT VARIANT TYPES
// ============================================

export interface Inventory {
  id: string;
  productVariantId: string;
  quantityInStock: number;
  reorderLevel?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ FIXED: Matches actual Prisma ProductVariant model
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

// ✅ FIXED: For form input - matches Prisma fields
export interface ProductVariantForm {
  id?: string;
  name: string;           // ✅ Required - variant name
  sku?: string;           // ✅ Optional
  price: number;          // ✅ Required
  compareAtPrice?: number; // ✅ Optional
  stock: number;          // ✅ Required - changed from inventory
}

export interface ProductVariantInput {
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
}

// ============================================
// PRODUCT ATTRIBUTE TYPES
// ============================================

export interface ProductAttribute {
  id: string;
  productId: string;
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// REVIEW TYPES
// ============================================

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

// ============================================
// STORE TYPES
// ============================================

export interface Store {
  id: string;
  name: string;
  userId: string | number;
}

// ============================================
// MAIN PRODUCT TYPES
// ============================================

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
// CREATE PRODUCT INPUT
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

// ============================================
// UPDATE PRODUCT INPUT
// ============================================

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

// ============================================
// PRODUCT FORM DATA (For UI Forms)
// ============================================

// ✅ FIXED: Matches what ProductForm actually uses
export interface ProductFormData {
  name: string;
  description: string;
  sku?: string;
  slug?: string;
  category: string;
  brand?: string;
  status: ProductStatus | string;
  variants: ProductVariantForm[]; // ✅ Now uses correct ProductVariantForm
}

// ============================================
// PRODUCTS RESPONSE
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

// ============================================
// API RESPONSE TYPES
// ============================================

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
// SEARCH FILTERS
// ============================================

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


}
