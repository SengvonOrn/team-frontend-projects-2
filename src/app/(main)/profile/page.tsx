"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { TabType } from "@/constants/userSideProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { BreadcrumbItem } from "@/lib/breakcrumb/navigationBreadcrumb";
import { AddProducts } from "@/components/profile/AddProduct";
import { Settings } from "@/components/profile/Settings";
import LocationTracker from "@/components/profile/LocationTracker";
import { PaymentMethod } from "@/components/profile/PaymentsMethod";
import { LocationData } from "@/types/user";

export default function UserProfilePage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, saving, userData, load, update, resetFormData } =
    useUserProfile();
  // Get tab from URL query parameter
  const tabFromUrl = searchParams.get("tab") as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl || "overview");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    username: string;
    // phone: string;
    // address: string;
    businessLocation: LocationData;
  }>({
    name: "",
    email: "",
    password: "",
    username: "",
    // phone: "",
    // address: "",
    businessLocation: {
      latitude: null,
      longitude: null,
      address: "",
      city: "",
      country: "",
    },
  });

  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  //===================================
  //
  //===================================

  useEffect(() => {
    if (status === "authenticated") {
      load();
    }
  }, [status, load]);

  useEffect(() => {
    const baseFormData = resetFormData();

    setFormData({
      ...baseFormData,
      businessLocation: userData.locations?.[0] ?? {
        latitude: null,
        longitude: null,
        address: "",
        city: "",
        country: "",
      },
    });
  }, [userData]);

  //==============================
  //
  //==============================

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL without page reload
    router.push(`/profile?tab=${tab}`, { scroll: false });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationUpdate = (locationData: LocationData) => {
    setFormData((prev) => ({
      ...prev,
      businessLocation: locationData,
    }));
  };

  //=====================================
  //
  //=====================================

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const fd = new FormData();
  //   fd.append("name", formData.name);
  //   fd.append("email", formData.email);
  //   fd.append("username", formData.username);

  //   if (avatarFile) {
  //     fd.append("profile", avatarFile);
  //   }
  //   await update(formData);
  //   // Clear file states
  //   setAvatarFile(null);
  //   setCoverFile(null);

  //   setActiveTab("overview");
  //   router.push("/profile?tab=overview", { scroll: false });
  // };

  //==================================================
  //
  //=================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append("username", formData.username);

    if (avatarFile) fd.append("profile", avatarFile);
    if (coverFile) fd.append("thumbnail", coverFile);

    await update(fd); // ✅ SEND FormData

    setAvatarFile(null);
    setCoverFile(null);
    setActiveTab("overview");
    router.push("/profile?tab=overview", { scroll: false });
  };

  //======================================================
  // UserLocations
  //======================================================

  const handleLocationSave = async (
    location: LocationData,
    icon?: File | null
  ) => {
    const fd = new FormData();
    fd.append("businessLocation", JSON.stringify(location));
    if (icon) fd.append("icon", icon);

    await fetch("/api/location", {
      method: "POST",
      body: fd,
    });

    setActiveTab("overview");
    router.push("/profile?tab=overview", { scroll: false });
  };

  //======================================================
  // Breakcrubs Events
  //======================================================

  // Generate breadcrumb items based on active tab
  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    const baseItems: BreadcrumbItem[] = [
      { label: "Profile", path: "/profile" },
    ];
    switch (activeTab) {
      case "overview":
        return baseItems;
      case "edit":
        return [...baseItems, { label: "Edit Profile", path: "/profile" }];
      case "products":
        return [...baseItems, { label: "Add Product", path: "/profile" }];
      case "location":
        return [...baseItems, { label: "Business Location", path: "/profile" }];
      case "settings":
        return [...baseItems, { label: "Settings", path: "/profile" }];
      case "storedashboard":
        return [
          ...baseItems,
          { label: "storedashboard", path: "/storedashboard" },
        ];
      default:
        return baseItems;
    }
  }, [activeTab]);

  //====================================================

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return null;
  }
  return (
    <DashboardLayout
      title="My Profile"
      description="Manage your profile information and settings"
      showBreadcrumb={true}
      customBreadcrumbItems={breadcrumbItems}
      userData={userData}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === "overview" && (
              <ProfileOverview
                userData={userData}
                onEdit={() => setActiveTab("edit")}
              />
            )}

            {activeTab === "edit" && (
              <EditProfileForm
                formData={formData}
                saving={saving}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setActiveTab("overview");
                  setAvatarFile(null);
                  setCoverFile(null);
                  router.push("/profile?tab=overview", { scroll: false });
                }}
                currentAvatar={userData?.profileImage?.profile}
                currentCover={userData?.profileImage?.thumbnail}
                onAvatarChange={setAvatarFile}
                onCoverChange={setCoverFile}
              />
            )}
            {activeTab === "location" && (
              <LocationTracker
                currentLocation={formData.businessLocation}
                onLocationUpdate={handleLocationUpdate}
                onSave={handleSubmit}
                saving={saving}
              />
            )}
            {/* =============================================================== */}

            {activeTab === "products" && <AddProducts />}

            {activeTab === "payment" && <PaymentMethod />}

            {activeTab === "settings" && <Settings />}

            {/* ============================================================ */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
