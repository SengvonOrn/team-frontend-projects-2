"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus, Grid3x3, List, Trash2, Eye } from "lucide-react";
import { IStore } from "@/types/store";
import { Product } from "@/types/addProducts";
import { getMyStores } from "@/lib/action/stores";
import {
  getProductsAction,
  getTrashProductsAction,
  moveProductToTrashAction,
  restoreProductAction,
  permanentDeleteProductAction,
} from "@/lib/action/products";
import { useUserProfile } from "@/hooks/useUserProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { BreadcrumbItem } from "@/lib/breakcrumb/navigationBreadcrumb";

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"active" | "trash">("active");

  // Store state
  const [stores, setStores] = useState<IStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

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
  const fetchProducts = async (storeId: string): Promise<void> => {
    setProductsLoading(true);

    try {
      const activeResult = await getProductsAction(storeId, {
        page: 1,
        limit: 100,
        search: searchQuery || undefined,
      });

      const trashResult = await getTrashProductsAction(storeId);

      if (!activeResult.success) {
        toast({
          title: "Error",
          description: activeResult.error || "Failed to load products",
          variant: "destructive",
        });
        setProducts([]);
        return;
      }

      const allActiveProducts = activeResult.data?.data || [];
      const activeProducts = allActiveProducts.filter((p) => !p.isDeleted);

      const trashProducts = trashResult.success
        ? trashResult.data?.data || []
        : [];

      setProducts(activeProducts);
      setDeletedProducts(trashProducts);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
      setProducts([]);
      setDeletedProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // ============================================
  // DELETE PRODUCT
  // ============================================
  const handleDeleteProduct = async (productId: string): Promise<void> => {
    try {
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

  // ============================================
  // PERMANENT DELETE
  // ============================================
  const handlePermanentDelete = async (productId: string): Promise<void> => {
    try {
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

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    if (status === "authenticated") {
      fetchStore();
    }
  }, [status]);

  useEffect(() => {
    if (stores?.id) {
      fetchProducts(stores.id);
    }
  }, [stores?.id]);

  useEffect(() => {
    if (stores?.id) {
      const timer = setTimeout(() => {
        fetchProducts(stores.id);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchQuery, stores?.id]);

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

  if (!stores?.id) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Store Found</AlertTitle>
            <AlertDescription>
              Please create a store before managing products.
            </AlertDescription>
          </Alert>
          <Link href="/dashboard/stores/create" className="mt-4 inline-block">
            <Button>Create Store</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const displayProducts = activeTab === "active" ? products : deletedProducts;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "dashboard", path: "/" },
    { label: "Products", path: "/products" },
  ];

  return (
    <DashboardLayout
      title="products"
      description="Browse our collection of products"
      showBreadcrumb={true}
      customBreadcrumbItems={breadcrumbItems}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Products
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {activeTab === "active"
                ? `${products.length} active products`
                : `${deletedProducts.length} deleted products`}
            </p>
          </div>
          {activeTab === "active" && (
            <Link href="/dashboard/add-product">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus size={18} className="mr-2" />
                Add Product
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "active"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-600 dark:text-slate-400"
            }`}
          >
            Active Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("trash")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "trash"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-600 dark:text-slate-400"
            }`}
          >
            Trash ({deletedProducts.length})
          </button>
        </div>

        {/* Products Grid/List */}
        {productsLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner />
          </div>
        ) : displayProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                {activeTab === "active"
                  ? "No active products yet. Create one to get started!"
                  : "No deleted products"}
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    ${product.variants?.map((p) => p.price)}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        <Eye size={16} className="mr-2" />
                        View
                      </Button>
                    </Link>
                    {activeTab === "active" ? (
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleRestoreProduct(product.id)}
                        >
                          Restore
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handlePermanentDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left px-6 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Stock
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      ${product.variants?.map((p) => p.price)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      ${product.variants?.map((p) => p.stock)}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/dashboard/products/${product.id}/edit`)
                        }
                      >
                        Edit
                      </Button>
                      {activeTab === "active" ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestoreProduct(product.id)}
                          >
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handlePermanentDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
