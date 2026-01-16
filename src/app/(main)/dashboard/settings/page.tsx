"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Settings as SettingsIcon,
  Edit2,
  Bell,
  Lock,
  Trash2,
} from "lucide-react";
import { IStore } from "@/types/store";
import { getMyStores } from "@/lib/action/stores";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CreateStoreModal } from "@/components/store/CreateStoreModal";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [stores, setStores] = useState<IStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditStoreOpen, setIsEditStoreOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // ============================================
  // FETCH STORE
  // ============================================
  const fetchStore = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMyStores();

      if (!result.success) {
        setError(result.message);
        setStores(null);
        return;
      }

      if (result.data) {
        if (Array.isArray(result.data)) {
          setStores(result.data.length > 0 ? result.data[0] : null);
        } else {
          setStores(result.data as IStore);
        }
      } else {
        setStores(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch stores";
      setError(errorMessage);
      setStores(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleEditStoreSuccess = () => {
    setIsEditStoreOpen(false);
    fetchStore();
    toast({
      title: "Success",
      description: "Store settings updated successfully",
    });
  };

  const handleDeleteStore = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this store? This action cannot be undone."
    );
    if (confirmed) {
      toast({
        title: "Info",
        description: "Store deletion feature coming soon",
      });
    }
  };

  const handleChangePassword = () => {
    toast({
      title: "Info",
      description: "Password change feature coming soon",
    });
  };

  const handleToggle2FA = () => {
    toast({
      title: "Info",
      description: "Two-factor authentication coming soon",
    });
  };

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    if (status === "authenticated") {
      fetchStore();
    }
  }, [status]);

  // ============================================
  // RENDER
  // ============================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon size={32} />
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Manage your store settings and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <div className="space-y-6">
        {/* Store Profile Settings */}
        {stores ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Store Profile</CardTitle>
              <Button
                onClick={() => setIsEditStoreOpen(true)}
                className="gap-2"
              >
                <Edit2 size={18} />
                Edit Store
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Store Name
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {stores.name}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Store ID
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white font-mono text-sm">
                      {stores.id}
                    </p>
                  </div>
                  {stores.description && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg md:col-span-2">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Description
                      </p>
                      <p className="text-slate-900 dark:text-white mt-1">
                        {stores.description}
                      </p>
                    </div>
                  )}
                  {/* Fixed: Changed stores.banner to stores.address */}
                  {stores.address && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg md:col-span-2">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Location
                      </p>
                      <p className="text-slate-900 dark:text-white">
                        {stores.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Store Found</AlertTitle>
                <AlertDescription>
                  Please create a store before managing settings.
                </AlertDescription>
              </Alert>
              <Link
                href="/dashboard/stores/create"
                className="mt-4 inline-block"
              >
                <Button>Create Store</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Order Notifications
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get notified when you receive new orders
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Email Alerts
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Receive email alerts for important events
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Low Stock Alerts
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get notified when product stock is low
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Change Password
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Update your password regularly to keep your account secure
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleChangePassword}>
                Change Password
              </Button>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleToggle2FA}>
                Enable 2FA
              </Button>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                💡 <strong>Tip:</strong> Enable two-factor authentication to
                protect your account from unauthorized access.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-900/30">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 size={20} />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                Delete Store
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                This action cannot be undone. All products and data associated
                with this store will be permanently deleted. Please be certain
                before proceeding.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteStore}
                className="gap-2"
              >
                <Trash2 size={18} />
                Delete Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Store Modal - Fixed: Now properly rendered */}
      {stores && (
        <CreateStoreModal
          isOpen={isEditStoreOpen}
          onClose={() => setIsEditStoreOpen(false)}
          onSuccess={handleEditStoreSuccess}
          isEditing={true}
          store={stores}
        />
      )}
    </div>
  );
}
