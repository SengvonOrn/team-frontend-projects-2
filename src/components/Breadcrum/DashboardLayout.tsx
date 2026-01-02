"use client";
import React, { useState } from "react";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardLayoutProps,
  getAvatarColor,
  getInitails,
} from "@/types/product";
import { StoreFlowIndicator } from "../store/StoreFlowIndicator";
import { CreateStoreModal, StoreFormData } from "../store/CreateStoreModal";
import { AddProductModal, ProductFormData } from "../store/AddProductModal";
import { Product } from "@/types/types";
import { Breadcrumb } from "./Breadcrumb";

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  description,
  showBreadcrumb = true,
  customBreadcrumbItems,
  showUserInfo = true,
  userData,
}) => {
  const router = useRouter();

  // Modal & state
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const [createdStore, setCreatedStore] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeStats, setStoreStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const { items: defaultItems, currentPath: defaultCurrentPath } =
    useBreadcrumb();
  const pathname = usePathname();
  const items = customBreadcrumbItems || defaultItems;
  const currentPath = customBreadcrumbItems ? pathname : defaultCurrentPath;

  const displayTitle = showUserInfo && userData?.name ? userData.name : title;
  const displayDescription =
    showUserInfo && userData?.email ? userData.email : description;

  // ==============================
  // STORE HANDLERS
  // ==============================



  const handleCreateStore = async (data: StoreFormData) => {
    try {
      console.log("Creating store with data:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newStore = {
        id: `store_${Date.now()}`,
        name: data.name,
        addess: data.address,
        description: data.description,
        status: "active" as const,
        createdAt: new Date().toISOString(),
      };
      setCreatedStore(newStore);
      // Redirect to the store page after creation
      router.push(`/store/${newStore.id}`);
      alert("Store created successfully!");
    } catch (error) {
      console.error("Error creating store:", error);
      alert("Failed to create store. Please try again.");
      throw error;
    }
  };

  



  // ==============================
  // PRODUCT HANDLERS
  // ==============================
  const handleAddProduct = async (data: ProductFormData) => {
    try {
      console.log("Adding product:", data);

      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        sku: data.sku,
        image: data.images[0] ? URL.createObjectURL(data.images[0]) : undefined,
        status: "active",
        createdAt: new Date().toISOString(),
      };

      setProducts((prev) => [...prev, newProduct]);
      setStoreStats((prev) => ({
        ...prev,
        totalProducts: prev.totalProducts + 1,
      }));

      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
      throw error;
    }
  };

  const handleEditProduct = (product: Product) => {
    alert(`Edit ${product.name} - connect to your API`);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setStoreStats((prev) => ({
        ...prev,
        totalProducts: Math.max(0, prev.totalProducts - 1),
      }));
      alert("Product deleted successfully!");
    }
  };

  const handleViewProduct = (product: Product) => {
    alert(`View ${product.name} - connect to product detail page`);
  };

  const handleBulkDelete = (productIds: string[]) => {
    setProducts((prev) => prev.filter((p) => !productIds.includes(p.id)));
  };

  return (
    <div className="min-h-screen mt-3 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          {showBreadcrumb && (
            <div>
              <Breadcrumb items={items} currentPath={currentPath} />
            </div>
          )}
          <StoreFlowIndicator
            userData={userData}
            onCreateStore={() => setIsCreateStoreOpen(true)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {showUserInfo && userData && (
          <div className="mb-8 flex items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              {userData.profileImage?.profile ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${userData.profileImage.profile}`}
                  alt={userData.name || "User"}
                  className="w-20 h-20 rounded-full border-4 border-primary/20 object-cover shadow-xl transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/20"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarColor(
                    userData.name || ""
                  )} flex items-center justify-center border-4 border-primary/20 shadow-xl transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/20`}
                >
                  <span className="text-3xl font-bold text-white">
                    {getInitails(userData.name || "U")}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-4 border-background shadow-lg animate-pulse" />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {displayTitle}
              </h1>
              {displayDescription && (
                <p className="text-muted-foreground mt-2 text-lg">
                  {displayDescription}
                </p>
              )}
            </div>
          </div>
        )}
        {children}
      </div>

      {/* MODALS */}
      <CreateStoreModal
        isOpen={isCreateStoreOpen}
        onClose={() => setIsCreateStoreOpen(false)}
        onSubmit={handleCreateStore} // <-- match camelCase
      />
    </div>
  );
};
