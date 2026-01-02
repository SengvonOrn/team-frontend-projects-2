import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-Toast";
import { UserData } from "@/types/user";
import {
  fetchUserProfile,
  updateUserPassword,
  updateUserProfile,
} from "@/lib/profile/profile";
import { mapUserToState, resetFormData } from "@/lib/profile/profileHelpers";
import { Backend_URL } from "@/constants/ConstantsUrl";
import { EMPTY_USER } from "@/constants/emptyUser";

export const useUserProfile = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData>(EMPTY_USER);

  // =======================================================
  //  Acces Token callback
  //========================================================
  const getAccessToken = useCallback(() => {
    const token = (session as any)?.backendTokens?.accessToken;
    if (!token) {
      toast({
        title: "Error",
        description: "No access token found. Please login again.",
        variant: "destructive",
      });
      return null;
    }
    return token;
  }, [session, toast]);

  // ===============================
  // callback data load
  //================================
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      if (!token) return;

      const user = await fetchUserProfile(token);
      const mappedUser = mapUserToState(user);
      setUserData(mappedUser);
      return mappedUser;
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  // ===============================
  // User Update Data get props
  //================================

  const update = useCallback(
    async (formData: FormData) => {
      try {
        setSaving(true);
        const token = getAccessToken();
        if (!token) return;
        //===============================
        const updatedUser = await updateUserProfile(
          token,
          formData,
          Backend_URL
        );
        const mappedUser = mapUserToState(updatedUser);
        setUserData(mappedUser);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });

        return mappedUser;
      } catch (error) {
        handleError(error);
      } finally {
        setSaving(false);
      }
    },
    [getAccessToken, toast]
  );

  //==============================
  // Update password
  //=============================

  // ===============================
  // Update password
  //===============================
  const updatePassword = useCallback(
    async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      try {
        const token = getAccessToken();
        if (!token) return;

        await updateUserPassword(token, data, Backend_URL);

        toast({
          title: "Success",
          description: "Password updated successfully",
        });
      } catch (error) {
        handleError(error);
        throw error; // allow UI to react if needed
      }
    },
    [getAccessToken, toast]
  );

  // ===============================
  // Handler Error
  //================================
  const handleError = (error: any) => {
    console.error("Profile error:", error);
    const message = error instanceof Error ? error.message : "Operation failed";

    if (message === "SESSION_EXPIRED") {
      toast({
        title: "Session expired",
        description: "Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  return {
    loading,
    saving,
    userData,
    setUserData,
    load,
    update,
    updatePassword, // ✅ add this
    resetFormData: () => resetFormData(userData),
  };
};
