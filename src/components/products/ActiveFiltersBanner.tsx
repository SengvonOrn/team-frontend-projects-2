"use client";
import React from "react";
import { Zap } from "lucide-react";

interface ActiveFiltersBannerProps {
  onClear: () => void;
}

export function ActiveFiltersBanner({ onClear }: ActiveFiltersBannerProps) {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Free Delivery Active
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing products with free shipping
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm"
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
}