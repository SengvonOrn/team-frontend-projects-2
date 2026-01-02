//===============================================================
//  fetch User show with token verify
//===============================================================

export const fetchUserProfile = async (accessToken: string) => {
  const response = await fetch("/api/auth/users/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw new Error("Failed to load user profile");
  }

  return response.json();
};

// ==================================================
// Update profile
// ==================================================


export const updateUserProfile = async (
  accessToken: string,
  updateData: any,
  Backend_URL: string
) => {
  const response = await fetch(`${Backend_URL}/api/auth/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },

    body: updateData,
  });

  if (response.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to update profile");
  }
  return response.json();
};

// ==================================================
// Update password
// ==================================================



export const updateUserPassword = async (
  accessToken: string,
  data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
  Backend_URL: string
) => {
  const response = await fetch(`${Backend_URL}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to update password");
  }

  return response.json();
};
