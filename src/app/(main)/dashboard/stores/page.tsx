"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/seller/Sidebar";
import Header from "@/components/seller/Header";
import OverviewPage from "@/components/seller/Overview";
import StoreProfileForm from "@/components/seller/StoreProfileForm";
import { AddProducts } from "@/components/store/AddProduct";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { IStore } from "@/types/store";
import { Product } from "@/types/addProducts";
import { getMyStores } from "@/lib/action/stores";
import {
  getProductsAction,
  deleteProductAction,
  hardDeleteProductAction,
  moveProductToTrashAction,
  restoreProductAction,
  permanentDeleteProductAction,
  getTrashProductsAction,
} from "@/lib/action/products";
import { useUserProfile } from "@/hooks/useUserProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { EnhancedProductsView } from "@/components/seller/ProductsView";
import AnalyticsPage from "@/components/analytics/page";

export default function SellerStorePage() {
  const { userData, load } = useUserProfile();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "add-product" | "analytics" | "settings"
  >("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Store state
  const [stores, setStores] = useState<IStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [trashProducts, setTrashProducts] = useState<Product[]>([]);

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
  // FETCH PRODUCTS
  // ============================================
  // ============================================
  // FETCH PRODUCTS (UPDATED)
  // ============================================
  const fetchProducts = async (storeId: string): Promise<void> => {
    setProductsLoading(true);
    setProductsError(null);

    try {
      // Fetch active products
      const activeResult = await getProductsAction(storeId, {
        page: 1,
        limit: 100,
        search: searchQuery || undefined,
      });

      // Fetch trash products separately
      const trashResult = await getTrashProductsAction(storeId);

      if (!activeResult.success) {
        setProductsError(activeResult.error || "Failed to load products");
        setProducts([]);
        return;
      }

      // Active products (not deleted)
      const allActiveProducts = activeResult.data?.data || [];
      const activeProducts = allActiveProducts.filter((p) => !p.isDeleted);

      // Trash products
      const trashProducts = trashResult.success
        ? trashResult.data?.data || []
        : [];

      setProducts(activeProducts);
      setDeletedProducts(trashProducts); // This is what shows in the Trash tab
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load products";
      setProductsError(errorMessage);
      setProducts([]);
      setDeletedProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // ============================================
  // DELETE PRODUCT (Move to trash)
  // ============================================
  const handleDeleteProduct = async (productId: string): Promise<void> => {
    try {
      // ✅ Use new moveProductToTrashAction
      const result = await moveProductToTrashAction(productId, stores?.id);

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to delete product",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product moved to trash",
      });

      // Refresh products
      if (stores?.id) {
        await fetchProducts(stores.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // ============================================
  // RESTORE PRODUCT
  // ============================================
  const handleRestoreProduct = async (productId: string): Promise<void> => {
    try {
      // ✅ Use new restoreProductAction
      const result = await restoreProductAction(productId, stores?.id);

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to restore product",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product restored successfully",
      });

      // Refresh products
      if (stores?.id) {
        await fetchProducts(stores.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore product",
        variant: "destructive",
      });
    }
  };

  //==================================================
  // Handle Permission
  //=================================================
  const handlePermanentDelete = async (productId: string): Promise<void> => {
    try {
      // ✅ Use new permanentDeleteProductAction
      const result = await permanentDeleteProductAction(productId, stores?.id);

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to delete product permanently",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product deleted permanently",
      });

      // Refresh products
      if (stores?.id) {
        await fetchProducts(stores.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product permanently",
        variant: "destructive",
      });
    }
  };

  //=========================================================================

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchStore();
      load();
    }
  }, [status, session?.user?.id]);

  // Fetch products when store changes or tab changes
  useEffect(() => {
    if (stores?.id && activeTab === "products") {
      fetchProducts(stores.id);
    }
  }, [stores?.id, activeTab]);

  // Debounced search
  useEffect(() => {
    if (stores?.id && activeTab === "products") {
      const timer = setTimeout(() => {
        fetchProducts(stores.id);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchQuery, stores?.id, activeTab]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleAddProduct = () => {
    setActiveTab("add-product");
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <DashboardLayout
      title="Store Dashboard"
      description="Manage your store and products"
      showBreadcrumb={true}
      userData={userData}
    >
      <div className="flex mt-5 h-screen bg-background">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          currentStore={stores}
          setSidebarOpen={setSidebarOpen}
          products={products}
          isLoading={isLoading}
          error={error}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-40">
            <Header
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSidebarOpen={setSidebarOpen}
              sidebarOpen={sidebarOpen}
              onAddProduct={handleAddProduct}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Overview Tab */}
              {activeTab === "overview" && <OverviewPage products={products} />}

              {/* Products Tab */}
              {activeTab === "products" && (
                <EnhancedProductsView
                  products={products}
                  deletedProducts={deletedProducts}
                  productsLoading={productsLoading}
                  productsError={productsError}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onDeleteProduct={handleDeleteProduct}
                  onRestoreProduct={handleRestoreProduct}
                  onPermanentDelete={handlePermanentDelete}
                  isTrash={false}
                />
              )}

              {/* Add Product Tab */}
              {activeTab === "add-product" && (
                <>
                  {stores?.id ? (
                    <AddProducts storeId={stores.id} />
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>No Store Found</AlertTitle>
                          <AlertDescription>
                            Please create a store before adding products.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">
                      Track your store performance
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-12 text-center">
                      <AnalyticsPage />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold">Store Settings</h1>
                    <p className="text-muted-foreground">
                      Manage your store profile and preferences
                    </p>
                  </div>

                  {isLoading ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <LoadingSpinner />
                      </CardContent>
                    </Card>
                  ) : error ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  ) : stores ? (
                    <StoreProfileForm store={stores} isLoading={isLoading} />
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground mb-4">
                          No store found. Please create a store first.
                        </p>
                        <Button
                          onClick={() => router.push("/seller/create-store")}
                        >
                          Create Store
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
