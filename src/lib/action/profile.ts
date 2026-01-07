// "use server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { Backend_URL } from "@/constants/ConstantsUrl";
// import { UserData } from "@/types/user";

// // Get user profile
// export async function getUserProfile() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.backendTokens?.accessToken) {
//       return {
//         success: false,
//         message: "SESSION_EXPIRED",
//         status: 401,
//       };
//     }

//     const token = session.backendTokens.accessToken;

//     const response = await fetch(`${Backend_URL}/api/auth/profile`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         return {
//           success: false,
//           message: "SESSION_EXPIRED",
//           status: 401,
//         };
//       }

//       const errorText = await response.text();
//       return {
//         success: false,
//         message: "Failed to load user profile",
//         error: errorText,
//         status: response.status,
//       };
//     }

//     const user = await response.json();
//     return {
//       success: true,
//       data: user,
//       message: "Profile fetched successfully",
//       status: 200,
//     };
//   } catch (error) {
//     console.error("getUserProfile error:", error);
//     return {
//       success: false,
//       message: "Internal server error",
//       error: error instanceof Error ? error.message : "Unknown error",
//       status: 500,
//     };
//   }
// }

// // Update user profile
// export async function updateUserProfile(formData: FormData) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.backendTokens?.accessToken) {
//       return {
//         success: false,
//         message: "SESSION_EXPIRED",
//         status: 401,
//       };
//     }

//     const token = session.backendTokens.accessToken;

//     const response = await fetch(`${Backend_URL}/api/auth/profile`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         // No Content-Type header for FormData
//       },
//       body: formData, // Pass FormData directly
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         return {
//           success: false,
//           message: "SESSION_EXPIRED",
//           status: 401,
//         };
//       }

//       const errorData = await response.json().catch(() => ({}));
//       return {
//         success: false,
//         message: errorData?.message || "Failed to update profile",
//         status: response.status,
//       };
//     }

//     const data = await response.json();
//     return {
//       success: true,
//       data,
//       message: "Profile updated successfully",
//       status: 200,
//     };
//   } catch (error) {
//     console.error("updateUserProfile error:", error);
//     return {
//       success: false,
//       message: "Internal server error",
//       error: error instanceof Error ? error.message : "Unknown error",
//       status: 500,
//     };
//   }
// }

// // Update password
// export async function updateUserPassword(data: {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.backendTokens?.accessToken) {
//       return {
//         success: false,
//         message: "SESSION_EXPIRED",
//         status: 401,
//       };
//     }

//     const token = session.backendTokens.accessToken;

//     const response = await fetch(`${Backend_URL}/api/auth/change-password`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         return {
//           success: false,
//           message: "SESSION_EXPIRED",
//           status: 401,
//         };
//       }

//       const errorData = await response.json().catch(() => ({}));
//       return {
//         success: false,
//         message: errorData?.message || "Failed to update password",
//         status: response.status,
//       };
//     }

//     return {
//       success: true,
//       message: "Password updated successfully",
//       status: 200,
//     };
//   } catch (error) {
//     console.error("updateUserPassword error:", error);
//     return {
//       success: false,
//       message: "Internal server error",
//       error: error instanceof Error ? error.message : "Unknown error",
//       status: 500,
//     };
//   }
// }

// app/actions/profile.ts (or update your existing auth.action.ts)
"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Backend_URL } from "@/constants/ConstantsUrl";
import { UserData } from "@/types/user";

// Get user profile
export async function getUserProfile() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.backendTokens?.accessToken) {
      return {
        success: false,
        message: "SESSION_EXPIRED",
        status: 401,
      };
    }

    const token = session.backendTokens.accessToken;
    const response = await fetch(`${Backend_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "SESSION_EXPIRED",
          status: 401,
        };
      }

      const errorText = await response.text();
      return {
        success: false,
        message: "Failed to load user profile",
        error: errorText,
        status: response.status,
      };
    }

    const user = await response.json();
    return {
      success: true,
      data: user,
      message: "Profile fetched successfully",
      status: 200,
    };
  } catch (error) {
    console.error("getUserProfile error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
}

// Update user profile
export async function updateUserProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.backendTokens?.accessToken) {
      return {
        success: false,
        message: "SESSION_EXPIRED",
        status: 401,
      };
    }

    const token = session.backendTokens.accessToken;

    const response = await fetch(`${Backend_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // No Content-Type header for FormData
      },
      body: formData, // Pass FormData directly
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "SESSION_EXPIRED",
          status: 401,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to update profile",
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: "Profile updated successfully",
      status: 200,
    };
  } catch (error) {
    console.error("updateUserProfile error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
}

// Update password
export async function updateUserPassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.backendTokens?.accessToken) {
      return {
        success: false,
        message: "SESSION_EXPIRED",
        status: 401,
      };
    }

    const token = session.backendTokens.accessToken;

    const response = await fetch(`${Backend_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "SESSION_EXPIRED",
          status: 401,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Failed to update password",
        status: response.status,
      };
    }

    return {
      success: true,
      message: "Password updated successfully",
      status: 200,
    };
  } catch (error) {
    console.error("updateUserPassword error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
}
