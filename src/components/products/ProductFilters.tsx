"use client";
import React from "react";
import { SlidersHorizontal, Star } from "lucide-react";
import { ProductFilters as IProductFilters } from "@/types/product";

interface ProductFiltersProps {
  filters: IProductFilters;
  onUpdateFilter: <K extends keyof IProductFilters>(
    key: K,
    value: IProductFilters[K]
  ) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  showFilters: boolean;
}

export function ProductFilters({
  filters,
  onUpdateFilter,
  onClearFilters,
  activeFiltersCount,
  showFilters,
}: ProductFiltersProps) {
  return (
    <aside
      className={`lg:block ${showFilters ? "block" : "hidden"} lg:col-span-1`}
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sticky top-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Free Delivery Filter */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Delivery
          </h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.freeDeliveryOnly}
              onChange={(e) =>
                onUpdateFilter("freeDeliveryOnly", e.target.checked)
              }
              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Free Delivery
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onUpdateFilter("inStockOnly", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700 dark:text-gray-300">In Stock</span>
          </label>
        </div>

        {/* Price Range */}
        <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Price Range
          </h3>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onUpdateFilter("priceRange", [0, parseInt(e.target.value)])
              }
              className="w-full accent-green-600"
            />
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Minimum Rating
          </h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => onUpdateFilter("minRating", rating)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <div className="flex items-center gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-gray-700 dark:text-gray-300 ml-1">
                    & Up
                  </span>
                </div>
              </label>
            ))}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === 0}
                onChange={() => onUpdateFilter("minRating", 0)}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                All Ratings
              </span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
