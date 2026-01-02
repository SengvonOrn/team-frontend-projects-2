"use client";
import React from "react";
import {
  ChevronDown,
  Grid3x3,
  LayoutList,
  Filter,
} from "lucide-react";
import { ViewMode, SortOption } from "@/types/product";

interface ProductsHeaderProps {
  title: string;
  productsCount: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
}

export function ProductsHeader({
  title,
  productsCount,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  activeFiltersCount,
}: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {productsCount} products found
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-600 dark:text-gray-400" />
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-green-500 text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-colors ${
              viewMode === "list"
                ? "bg-green-500 text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <LayoutList className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 font-medium text-gray-900 dark:text-gray-100"
        >
          <Filter className="w-5 h-5" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}