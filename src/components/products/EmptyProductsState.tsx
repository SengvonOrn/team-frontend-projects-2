"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";

interface EmptyProductsStateProps {
  onClearFilters: () => void;
}

export function EmptyProductsState({ onClearFilters }: EmptyProductsStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 dark:text-gray-600 mb-4">
        <ShoppingCart className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No products found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Try adjusting your filters
      </p>
      <button
        onClick={onClearFilters}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}