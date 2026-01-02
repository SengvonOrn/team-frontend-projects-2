"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductFilters } from "@/types/product";

export function useProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParam = searchParams.get("filter");

  const [filters, setFilters] = useState<ProductFilters>({
    selectedCategories: [],
    priceRange: [0, 1000],
    minRating: 0,
    freeDeliveryOnly: filterParam === "free-delivery",
    inStockOnly: false,
  });

  useEffect(() => {
    if (filterParam === "free-delivery") {
      setFilters(prev => ({ ...prev, freeDeliveryOnly: true }));
    }
  }, [filterParam]);

  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      selectedCategories: [],
      priceRange: [0, 1000],
      minRating: 0,
      freeDeliveryOnly: false,
      inStockOnly: false,
    });
    router.push("/products");
  };

  const activeFiltersCount =
    filters.selectedCategories.length +
    (filters.freeDeliveryOnly ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return {
    filters,
    updateFilter,
    clearFilters,
    activeFiltersCount,
  };
}