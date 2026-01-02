import Category from "@/components/category";
import { HeaderSearchInput } from "@/components/buttonSearch/header-search-input";
import { category } from "@/types/categories";
import { useState } from "react";
import { Search, Camera, Plus } from "lucide-react";

export const CustomHeaderSearchInput = () => {
  const [selectedCategory, setSelectedCategory] = useState(category[0]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>();

  const handleSearch = (query: string, image?: File) => {
    if (image) {
      console.log("Search with image:", image);
    }
  };

  const handleCreateStore = () => {
    console.log("Create store clicked");
    // Add your navigation or modal logic here
  };

  const frequentSearches = [
    "Kid Toy",
    "Headphone",
    "iphone17 ProMax",
    "Desktop computer",
    "monitor",
    "graphic card",
    "HD1T",
  ];

  return (
    <div>
      <div className="bg-muted/50 rounded-2xl p-8 md:p-12 border">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center md:text-left">
            Give All You Need
          </h1>

          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-background border rounded-full shadow-sm p-2 mb-6">
            <div className="flex items-center flex-1 px-3">
              <Search className="w-5 h-5 text-muted-foreground mr-2" />
              <HeaderSearchInput
                placeholder="What Are You Looking For"
                className="flex-1 !bg-transparent !border-none !ring-0 !outline-none !shadow-none focus:!ring-0 focus:!outline-none focus:!shadow-none text-base px-2"
              />
            </div>
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <Camera className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Search
            </button>
          </div>

          {/* Create Store Button - Enhanced */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleCreateStore}
              className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative">Create Your Store</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 border-t border-muted"></div>
            <span className="px-4 text-xs text-muted-foreground font-medium">
              OR BROWSE PRODUCTS
            </span>
            <div className="flex-1 border-t border-muted"></div>
          </div>

          {/* Frequently Searched */}
          <div className="mb-8">
            <span className="text-muted-foreground text-sm mr-3">
              Frequently search :
            </span>
            <div className="inline-flex flex-wrap gap-2">
              {frequentSearches.map((term, index) => (
                <button
                  key={index}
                  className="text-muted-foreground hover:text-orange-500 text-sm transition-colors"
                >
                  {term}
                  {index < frequentSearches.length - 1 && (
                    <span className="ml-2 text-muted-foreground/50">|</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <Category
            category={category}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>
    </div>
  );
};
