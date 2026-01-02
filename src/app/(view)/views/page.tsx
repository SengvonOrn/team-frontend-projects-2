// "use client";
// import { useState } from "react";
// // import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// // import ProductCard from "@/components/ProductCard";
// import { Button } from "@/components/ui/button";
// import { productsData } from "@/constants/productsData";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import ProductCard from "@/components/products/ProductCard";

// export default function AllProductsPage() {
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 12;
//   const totalPages = Math.ceil(productsData.length / itemsPerPage);
//   const startIndex = (page - 1) * itemsPerPage;
//   const visibleProducts = productsData.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   return (
//     <>
//       {/* <Header /> */}
//       <div className="container mx-auto px-4 py-6 min-h-screen">
//         <h1 className="text-3xl font-bold mb-6">All Products</h1>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           {visibleProducts.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 mt-8">
//             <Button
//               variant="outline"
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </Button>

//             {[...Array(totalPages)].map((_, idx) => (
//               <Button
//                 key={idx}
//                 variant={page === idx + 1 ? "default" : "outline"}
//                 onClick={() => setPage(idx + 1)}
//               >
//                 {idx + 1}
//               </Button>
//             ))}

//             <Button
//               variant="outline"
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//             >
//               <ChevronRight className="w-5 h-5" />
//             </Button>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }

// File: app/(view)/views/page.tsx

"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { productsData } from "@/constants/productsData";
import {
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  LayoutList,
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  TrendingUp,
  Filter,
  X,
} from "lucide-react";

type ViewMode = "grid" | "list";
type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest";

export default function AllProductsPage() {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const itemsPerPage = 12;

  // Sort products
  const sortedProducts = useMemo(() => {
    let sorted = [...productsData];

    // Apply filters
    sorted = sorted.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (minRating > 0) {
      sorted = sorted.filter((p) => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort((a, b) => b.id - a.id);
        break;
    }

    return sorted;
  }, [sortBy, priceRange, minRating]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visibleProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSelectedCategories([]);
  };

  const activeFiltersCount = minRating > 0 ? 1 : 0;

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 text-gray-600 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-orange-500 dark:hover:text-orange-400"
            >
              Home
            </Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              All Products
            </span>
          </div>

          {/* Header Section */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                All Products
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {sortedProducts.length} products available
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
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
                  <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <aside
              className={`lg:block ${
                showFilters ? "block" : "hidden"
              } lg:col-span-1`}
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                  </h2>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold"
                    >
                      Clear All
                    </button>
                  )}
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
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, parseInt(e.target.value)])
                      }
                      className="w-full accent-orange-600"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
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
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500"
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
                        checked={minRating === 0}
                        onChange={() => setMinRating(0)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        All Ratings
                      </span>
                    </label>
                  </div>
                </div>

                {/* Categories - Placeholder */}
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Electronics",
                      "Computers",
                      "Monitors",
                      "Accessories",
                      "Smart Watches",
                    ].map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid/List */}
            <div className="lg:col-span-3">
              {visibleProducts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
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
                    onClick={clearFilters}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                        : "space-y-4"
                    }
                  >
                    {visibleProducts.map((product, index) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group"
                      >
                        <article
                          className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1 ${
                            viewMode === "list" ? "flex gap-6" : ""
                          }`}
                        >
                          {/* Product Image */}
                          <div
                            className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 ${
                              viewMode === "list" ? "w-48 flex-shrink-0" : ""
                            }`}
                          >
                            <div
                              className={
                                viewMode === "grid"
                                  ? "aspect-square relative"
                                  : "aspect-square relative"
                              }
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                              {product.discount && (
                                <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-lg">
                                  -{product.discount}%
                                </div>
                              )}
                            </div>

                            {index % 3 === 0 && (
                              <div className="absolute bottom-3 left-3">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>Hot</span>
                                </div>
                              </div>
                            )}

                            {/* Wishlist Button */}
                            <button className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800">
                              <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </div>

                          {/* Product Info */}
                          <div
                            className={`p-4 ${
                              viewMode === "list"
                                ? "flex-1 flex flex-col justify-between"
                                : "space-y-2"
                            }`}
                          >
                            <div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                {product.name}
                              </h3>

                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < Math.floor(product.rating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300 dark:text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {product.rating}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  ({product.reviews})
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                  ${product.price}
                                </span>
                                {product.originalPrice && (
                                  <>
                                    <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                      ${product.originalPrice}
                                    </span>
                                  </>
                                )}
                              </div>

                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                Sold: {product.sold}
                              </div>

                              {viewMode === "list" && (
                                <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                  <ShoppingCart className="w-4 h-4" />
                                  Add to Cart
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="border-gray-300 dark:border-gray-600"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>

                      {[...Array(totalPages)].map((_, idx) => {
                        // Show first, last, current, and adjacent pages
                        if (
                          idx === 0 ||
                          idx === totalPages - 1 ||
                          (idx >= page - 2 && idx <= page)
                        ) {
                          return (
                            <Button
                              key={idx}
                              variant={page === idx + 1 ? "default" : "outline"}
                              onClick={() => setPage(idx + 1)}
                              className={
                                page === idx + 1
                                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                                  : "border-gray-300 dark:border-gray-600"
                              }
                            >
                              {idx + 1}
                            </Button>
                          );
                        } else if (idx === page - 3 || idx === page + 1) {
                          return (
                            <span key={idx} className="text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="border-gray-300 dark:border-gray-600"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
