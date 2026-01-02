// "use client";
// import Link from "next/link";
// import { Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useCart } from "@/context/cart/CartContext";
// import { Product } from "@/types/product";

// interface ProductCardProps {
//   product: Product;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const { addToCart } = useCart();

//   const renderStars = (rating: number) => {
//     return [...Array(5)].map((_, i) => (
//       <Star
//         key={i}
//         className={`w-4 h-4 ${
//           i < Math.floor(rating)
//             ? "fill-yellow-400 text-yellow-400"
//             : "text-gray-300"
//         }`}
//       />
//     ));
//   };

//   return (
//     <Link
//       href={`/views/${product.id}`}
//       className="border rounded-lg p-3 hover:shadow-xl hover:scale-105 transition-all duration-300 dark:bg-gray-900 cursor-pointer block group"
//     >
//       <img
//         src={product.image}
//         alt={product.name}
//         className="w-full h-40 object-cover rounded-md mb-3"
//       />

//       <h3 className="text-sm font-semibold line-clamp-2 mb-2 group-hover:text-orange-500">
//         {product.name}
//       </h3>

//       <div className="flex items-center gap-1 mb-2">
//         {renderStars(product.rating)}
//       </div>

//       <p className="text-lg font-bold text-green-600">
//         ${product.price.toFixed(2)}
//       </p>

//       <Button
//         className="mt-2 w-full"
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           addToCart({
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             image: product.image || "",
//           });
//         }}
//       >
//         Add to Cart
//       </Button>
//     </Link>
//   );
// }




"use client";
import React from "react";
import Link from "next/link";
import { Star, TrendingUp, Zap, ShoppingCart } from "lucide-react";
import { Product, ViewMode } from "@/types/product";

interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
  showTrending?: boolean;
}

export function ProductCard({
  product,
  viewMode,
  showTrending = false,
}: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
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
          <div className="aspect-square relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
              <span>🚚</span>
              <span>FREE</span>
            </div>
            {product.discount && (
              <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-lg">
                -{product.discount}%
              </div>
            )}
          </div>

          {showTrending && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Trending</span>
              </div>
            </div>
          )}
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
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
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
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>
                Free delivery by{" "}
                {new Date(
                  Date.now() + 6 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {viewMode === "list" && (
              <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
