// hooks/useUserProfile.ts
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-Toast";
import { UserData } from "@/types/user";
import { 
  getUserProfile, 
  updateUserProfile, 
  updateUserPassword 
} from "@/lib/action/profile"; // Updated import
import { mapUserToState, resetFormData } from "@/lib/profile/profileHelpers";
import { EMPTY_USER } from "@/constants/emptyUser";

export const useUserProfile = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData>(EMPTY_USER);

  // ✅ REMOVED: getAccessToken - No longer needed!
  // ✅ REMOVED: fetchUserProfile, updateUserProfile, updateUserPassword imports

  // ===============================
  // Load user profile
  //================================
  const load = useCallback(async () => {
    try {
      setLoading(true);
      
      // ✅ SIMPLIFIED: Direct Server Action call
      const result = await getUserProfile();
      
      if (!result.success) {
        handleError(new Error(result.message));
        return;
      }



      const mappedUser = mapUserToState(result.data);
      setUserData(mappedUser);
      return mappedUser;

      

    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ No dependencies needed!

  // ===============================
  // Update profile
  //================================
  const update = useCallback(
    async (formData: FormData) => {
      try {
        setSaving(true);
        
        // ✅ SIMPLIFIED: Direct Server Action call
        const result = await updateUserProfile(formData);
        
        if (!result.success) {
          handleError(new Error(result.message));
          return;
        }

        const mappedUser = mapUserToState(result.data);
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
    [toast]
  );

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
        // ✅ SIMPLIFIED: Direct Server Action call
        const result = await updateUserPassword(data);
        
        if (!result.success) {
          handleError(new Error(result.message));
          throw new Error(result.message);
        }

        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        
        return result;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [toast]
  );

  // ===============================
  // Handle Error
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
      // Optional: Trigger sign out
      // signOut({ callbackUrl: '/login' });
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
    updatePassword,
    resetFormData: () => resetFormData(userData),
  };
};