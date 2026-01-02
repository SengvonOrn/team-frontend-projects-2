"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { productsData } from "@/constants/productsData";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { BreadcrumbItem } from "@/lib/breakcrumb/navigationBreadcrumb";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { ActiveFiltersBanner } from "@/components/products/ActiveFiltersBanner";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyProductsState } from "@/components/products/EmptyProductsState";
import { useProductFilters } from "@/hooks/useProductFilters";
import { filterAndSortProducts } from "@/lib/product/productUtils";
import { ViewMode, SortOption } from "@/types/product";

export default function ProductsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const { filters, updateFilter, clearFilters, activeFiltersCount } =
    useProductFilters();

  const filteredProducts = useMemo(
    () => filterAndSortProducts(productsData, filters, sortBy),
    [filters, sortBy]
  );

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
  ];

  const handleClearFreeDelivery = () => {
    updateFilter("freeDeliveryOnly", false);
    router.push("/products");
  };

  return (
    <DashboardLayout
      title="Products"
      description="Browse our collection of products"
      showBreadcrumb={true}
      customBreadcrumbItems={breadcrumbItems}
    >
      <div className="space-y-6">
        <ProductsHeader
          title={
            filters.freeDeliveryOnly ? "Free Delivery Products" : "All Products"
          }
          productsCount={filteredProducts.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={activeFiltersCount}
        />

        {filters.freeDeliveryOnly && (
          <ActiveFiltersBanner onClear={handleClearFreeDelivery} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ProductFilters
            filters={filters}
            onUpdateFilter={updateFilter}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
            showFilters={showFilters}
          />

          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <EmptyProductsState onClearFilters={clearFilters} />
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    showTrending={index % 3 === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
