"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Backend_URL } from "@/constants/ConstantsUrl";

// Helper to get access token
const getTokenFromSession = async () => {
  const session = await getServerSession(authOptions);
  return session?.backendTokens?.accessToken;
};

// Create a new store
export async function createStore(storeData: {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: "No access token available",
        status: 401,
      };
    }

    const { name, description, address, city, state } = storeData;

    if (!name?.trim()) {
      return {
        success: false,
        message: "Store name is required",
        status: 400,
      };
    }

    // Endpoint: POST /stores/register
    const response = await fetch(`${Backend_URL}/api/stores/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to create store",
        status: response.status,
      };
    }

    const data = await response.json();

    console.log(`createStore - Store created for user ${session.user.id}`);

    return {
      success: true,
      message: "Store created successfully",
      data,
      status: 201,
    };
  } catch (error) {
    console.error("createStore error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: String(error),
      status: 500,
    };
  }
}

// Get all stores (with pagination)
export async function getAllStores(options?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: "No access token available",
        status: 401,
      };
    }

    const { page = 1, limit = 10, search = "" } = options || {};

    // Build query string
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    // Endpoint: GET /stores/stores?page=1&limit=10&search=...
    const response = await fetch(
      `${Backend_URL}/api/stores/stores?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to fetch stores",
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Stores retrieved successfully",
      data,
      status: 200,
    };
  } catch (error) {
    console.error("getAllStores error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: String(error),
      status: 500,
    };
  }
}

// Get my stores (stores for current user)
export async function getMyStores(options?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: "No access token available",
        status: 401,
      };
    }

    const { page = 1, limit = 10, search = "" } = options || {};

    // Build query string
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    // Endpoint: GET /stores/my-stores?page=1&limit=10&search=...
    const response = await fetch(`${Backend_URL}/api/stores/my-stores`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to fetch your stores",
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Your stores retrieved successfully",
      data,
      status: 200,
    };
  } catch (error) {
    console.error("getMyStores error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: String(error),
      status: 500,
    };
  }
}

// Search stores
export async function searchStores(
  query: string,
  options?: {
    page?: number;
    limit?: number;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: "No access token available",
        status: 401,
      };
    }

    const { page = 1, limit = 10 } = options || {};

    // Build query string
    const queryParams = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    // Endpoint: GET /stores/search?q=query&page=1&limit=10
    const response = await fetch(
      `${Backend_URL}/api/stores/search?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to search stores",
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Stores search completed successfully",
      data,
      status: 200,
    };
  } catch (error) {
    console.error("searchStores error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: String(error),
      status: 500,
    };
  }
}

// Get store by ID
export async function getStoreById(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: "No access token available",
        status: 401,
      };
    }

    // Endpoint: GET /stores/:id
    const response = await fetch(`${Backend_URL}/api/stores/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to fetch store",
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Store retrieved successfully",
      data,
      status: 200,
    };
  } catch (error) {
    console.error("getStoreById error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: String(error),
      status: 500,
    };
  }
}

// Get stores by user ID
export async function getStoresByUserId(
  userId: string,
  options?: {
    page?: number;
    limit?: number;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: "No access token available",
        status: 401,
      };
    }

    const { page = 1, limit = 10 } = options || {};

    // Build query string
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Endpoint: GET /stores/stores/:userId?page=1&limit=10
    const response = await fetch(
      `${Backend_URL}/api/stores/stores/${userId}?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to fetch user stores",
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "User stores retrieved successfully",
      data,
      status: 200,
    };
  } catch (error) {
    console.error("getStoresByUserId error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: String(error),
      status: 500,
    };
  }
}

// Get states (for dropdown)
export async function getStates() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: "No access token available",
        status: 401,
      };
    }

    // Endpoint: GET /stores/state
    const response = await fetch(`${Backend_URL}/api/stores/state`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to fetch states",
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "States retrieved successfully",
      data,
      status: 200,
    };
  } catch (error) {
    console.error("getStates error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: String(error),
      status: 500,
    };
  }
}

//========================================================
// Update store
//=========================================================
export async function updateStore(
  id: string,
  storeData: {
    name?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: "No access token available",
        status: 401,
      };
    }
    // Endpoint: PATCH /stores/:id
    const response = await fetch(`${Backend_URL}/api/stores/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storeData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to update store",
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Store updated successfully",
      data,
      status: 200,
    };
  } catch (error) {
    console.error("updateStore error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: String(error),
      status: 500,
    };
  }
}

//=======================================================
// Delete store
export async function deleteStore(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        success: false,
        message: "No access token available",
        status: 401,
      };
    }

    // Endpoint: DELETE /stores/:id
    const response = await fetch(`${Backend_URL}/api/stores/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to delete store",
        status: response.status,
      };
    }

    return {
      success: true,
      message: "Store deleted successfully",
      status: 200,
    };
  } catch (error) {
    console.error("deleteStore error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: String(error),
      status: 500,
    };
  }
}
