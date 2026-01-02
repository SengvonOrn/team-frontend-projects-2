export interface IStore {
  id: string;
  userId: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  createdAt: string;
  updatedAt: string;
  products?: IProduct[];
}

export interface IProduct {
  id: string;
  storeId: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface IStoreQuery {
  page: number;
  limit: number;
  search?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateStoreDto {
  userId: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
}

export interface UpdateStoreDto {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
}

export interface IStoreStats {
  totalStores: number;
  storeWithProducts: number;
  totalProducts: number;
}