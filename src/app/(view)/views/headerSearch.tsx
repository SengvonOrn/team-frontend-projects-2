import Category from "@/components/category";
import { HeaderSearchInput } from "@/components/buttonSearch/header-search-input";
import { category } from "@/types/categories";
import { useState } from "react";
import { Search, Camera } from "lucide-react";

type Props = {};
export const CustomHeaderSearchInput = ({}: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(category[0]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>();
  const handleSearch = (query: string, image?: File) => {
    if (image) {
      console.log("Search with image:", image);
    }
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
