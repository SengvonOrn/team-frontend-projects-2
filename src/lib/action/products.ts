"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Backend_URL } from "@/constants/ConstantsUrl";
import {
  AddProductInput,
  Product,
  ProductsResponse,
  ProductVariantInput,
} from "@/types/addProducts";
import { getServerSession } from "next-auth";

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// HELPER: Get Auth Token
// ============================================
async function getAuthToken(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.backendTokens?.accessToken) {
      return session.backendTokens.accessToken;
    }
    return null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

// ============================================
// HELPER: Get Auth Headers
// ============================================
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

//==========================================================
//
//==========================================================

export async function moveProductToTrashAction(
  productId: string,
  storeId?: string
): Promise<ActionResponse<Product>> {
  try {
    const headers = await getAuthHeaders();

    const url = new URL(`${Backend_URL}/api/products/${productId}`);
    if (storeId) {
      url.searchParams.append("storeId", storeId);
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      if (response.status === 403) {
        return {
          success: false,
          error: "Forbidden. You don't have permission to delete this product.",
        };
      }
      if (response.status === 404) {
        return { success: false, error: "Product not found" };
      }
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to move product to trash",
      };
    }

    const data = await response.json();
    return { success: true, data: data.product };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to move product to trash",
    };
  }
}
//==========================================================
//
//==========================================================

export async function restoreProductAction(
  productId: string,
  storeId?: string
): Promise<ActionResponse<Product>> {
  try {
    const headers = await getAuthHeaders();

    const url = new URL(`${Backend_URL}/api/products/${productId}/restore`); // trash/bulk-restore
    if (storeId) {
      url.searchParams.append("storeId", storeId);
    }

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      if (response.status === 403) {
        return {
          success: false,
          error:
            "Forbidden. You don't have permission to restore this product.",
        };
      }
      if (response.status === 404) {
        return { success: false, error: "Product not found" };
      }
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to restore product",
      };
    }

    const data = await response.json();
    return { success: true, data: data.product };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to restore product",
    };
  }
}

export async function permanentDeleteProductAction(
  productId: string,
  storeId?: string
): Promise<ActionResponse<any>> {
  try {
    const headers = await getAuthHeaders();

    const url = new URL(`${Backend_URL}/api/products/${productId}/permanent`);
    if (storeId) {
      url.searchParams.append("storeId", storeId);
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      if (response.status === 403) {
        return {
          success: false,
          error:
            "Forbidden. You don't have permission to delete this product permanently.",
        };
      }
      if (response.status === 404) {
        return { success: false, error: "Product not found" };
      }
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to permanently delete product",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to permanently delete product",
    };
  }
}

export async function getTrashProductsAction(
  storeId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }
): Promise<ActionResponse<ProductsResponse>> {
  try {
    const url = new URL(`${Backend_URL}/api/products/trash/${storeId}`);

    if (params?.page) url.searchParams.append("page", params.page.toString());
    if (params?.limit)
      url.searchParams.append("limit", params.limit.toString());
    if (params?.search) url.searchParams.append("search", params.search);
    if (params?.category) url.searchParams.append("category", params.category);

    const headers = await getAuthHeaders();

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      return { success: false, error: "Failed to fetch trash products" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch trash products",
    };
  }
}
export async function getTrashStatsAction(storeId: string): Promise<
  ActionResponse<{
    total: number;
    deletedLast24h: number;
    deletedLast7Days: number;
    byCategory: Record<string, number>;
  }>
> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${Backend_URL}/api/products/trash/${storeId}/stats`,
      {
        method: "GET",
        headers,
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      return { success: false, error: "Failed to fetch trash statistics" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch trash statistics",
    };
  }
}

export async function bulkRestoreProductsAction(
  productIds: string[],
  storeId?: string
): Promise<ActionResponse<{ restoredCount: number; failedIds: string[] }>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${Backend_URL}/api/products/trash/bulk-restore`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ productIds, storeId }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to restore products",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        restoredCount: data.restoredCount,
        failedIds: data.failedIds,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to restore products",
    };
  }
}

export async function bulkPermanentDeleteProductsAction(
  productIds: string[],
  storeId?: string
): Promise<ActionResponse<{ deletedCount: number; failedIds: string[] }>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${Backend_URL}/api/products/trash/bulk-delete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ productIds, storeId }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to delete products",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        deletedCount: data.deletedCount,
        failedIds: data.failedIds,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete products",
    };
  }
}

export async function emptyTrashAction(
  storeId: string,
  daysOld: number = 30
): Promise<ActionResponse<{ deletedCount: number }>> {
  try {
    const headers = await getAuthHeaders();

    const url = new URL(`${Backend_URL}/api/products/trash/${storeId}/empty`);
    url.searchParams.append("days", daysOld.toString());

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to empty trash",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: { deletedCount: data.deletedCount },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to empty trash",
    };
  }
}
// ============================================
// CREATE PRODUCT
// ============================================
export async function createProductAction(
  data: AddProductInput
): Promise<ActionResponse<Product>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Backend_URL}/api/products`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      if (response.status === 403) {
        return {
          success: false,
          error: "Forbidden. You don't have permission to create products.",
        };
      }
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to create product",
      };
    }

    const product = await response.json();
    return { success: true, data: product };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

// ============================================
// UPLOAD IMAGES
// ============================================
export async function uploadProductImagesAction(
  productId: string,
  formData: FormData
): Promise<ActionResponse<Product>> {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${Backend_URL}/api/products/${productId}/images/upload`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to upload images",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload images",
    };
  }
}

// ============================================
// ADD VARIANT
// ============================================
export async function addProductVariantAction(
  productId: string,
  data: ProductVariantInput
): Promise<ActionResponse<any>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${Backend_URL}/api/products/${productId}/variants`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to add variant",
      };
    }

    const variant = await response.json();
    return { success: true, data: variant };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add variant",
    };
  }
}

// ============================================
// GET ALL PRODUCTS
// ============================================
export async function getProductsAction(
  storeId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }
): Promise<ActionResponse<ProductsResponse>> {
  try {
    const query = new URLSearchParams();
    query.append("storeId", storeId);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.category) query.append("category", params.category);

    const headers = await getAuthHeaders();

    const response = await fetch(
      `${Backend_URL}/api/products/store/${storeId}?${query.toString()}`,
      {
        method: "GET",
        headers,
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      return { success: false, error: "Failed to fetch products" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}

// ============================================
// GET SINGLE PRODUCT (FIXED: productId parameter)
// ============================================
export async function getProductAction(
  productId: string // ✅ Changed from 'id' to 'productId'
): Promise<ActionResponse<Product>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Backend_URL}/api/products/${productId}`, {
      method: "GET",
      headers,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      return { success: false, error: "Product not found" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    };
  }
}

// ============================================
// UPDATE PRODUCT (FIXED: productId parameter)
// ============================================
export async function updateProductAction(
  productId: string, // ✅ Changed from 'id' to 'productId'
  data: any
): Promise<ActionResponse<Product>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Backend_URL}/api/products/${productId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      if (response.status === 403) {
        return {
          success: false,
          error: "Forbidden. You don't have permission to update this product.",
        };
      }
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update" };
    }

    const product = await response.json();
    return { success: true, data: product };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

// ============================================
// DELETE PRODUCT (FIXED: productId parameter)
// ============================================
export async function deleteProductAction(
  productId: string
): Promise<ActionResponse<any>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Backend_URL}/api/products/${productId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      if (response.status === 403) {
        return {
          success: false,
          error: "Forbidden. You don't have permission to delete this product.",
        };
      }
      return { success: false, error: "Failed to delete product" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

// ============================================
// HARD DELETE PRODUCT (FIXED: productId parameter)
// ============================================
export async function hardDeleteProductAction(
  productId: string // ✅ Changed from 'id' to 'productId'
): Promise<ActionResponse<any>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${Backend_URL}/api/products/${productId}/hard`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      if (response.status === 403) {
        return {
          success: false,
          error: "Forbidden. Only admins can permanently delete products.",
        };
      }
      return { success: false, error: "Failed to delete product" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

// ============================================
// DELETE IMAGE
// ============================================
export async function deleteProductImageAction(
  imageId: string
): Promise<ActionResponse<void>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${Backend_URL}/api/products/images/${imageId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      return { success: false, error: "Failed to delete image" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}

// ============================================
// DELETE MULTIPLE IMAGES
// ============================================
export async function deleteMultipleImagesAction(
  imageIds: string[]
): Promise<ActionResponse<{ deleted: number; failed: number }>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${Backend_URL}/api/products/images/delete-multiple`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ imageIds }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      return { success: false, error: "Failed to delete images" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete images",
    };
  }
}

//=====================================================
//
//=====================================================
// lib/action/products.ts (add this function)
export async function getCategoriesAction(): Promise<
  ActionResponse<Array<{ id: string; name: string }>>
> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Backend_URL}/api/categories`, {
      method: "GET",
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
      return { success: false, error: "Failed to fetch categories" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}
