"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, TrendingUp } from "lucide-react";
import { Product } from "@/types/addProducts";
import { cn } from "@/utils/utils";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  showTrending?: boolean;
}

export function ProductCard({
  product,
  viewMode,
  showTrending = false,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 300);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  // Get main image and first variant
  const mainImage = product.images?.find((img) => img.imageType === "MAIN");
  const imageUrl = mainImage?.imageUrl || product.images?.[0]?.imageUrl;
  const firstVariant = product.variants?.[0];

  // Calculate discount percentage if compareAtPrice exists
  const discountPercentage =
    firstVariant?.compareAtPrice && firstVariant?.price
      ? Math.round(
          ((firstVariant.compareAtPrice - firstVariant.price) /
            firstVariant.compareAtPrice) *
            100
        )
      : 0;

  // Calculate average rating from reviews
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? Math.round(
          (product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length) *
            10
        ) / 10
      : 0;

  const inStock = firstVariant?.stock && firstVariant.stock > 0;

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.slug}`}>
        <div
          className={cn(
            "rounded-lg shadow-sm hover:shadow-md transition-all duration-200",
            "p-4 flex gap-4",
            "bg-background border border-border",
            "dark:bg-slate-950 dark:border-slate-800",
            "hover:border-primary/50 dark:hover:border-primary/50"
          )}
        >
          <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted dark:bg-slate-900">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-semibold">
                -{discountPercentage}%
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-base text-foreground line-clamp-2">
                {product.name}
              </h3>
              {product.brand && (
                <p className="text-muted-foreground text-sm">{product.brand}</p>
              )}
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={cn(
                        i < Math.floor(averageRating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews?.length || 0})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  ${firstVariant?.price || "N/A"}
                </span>
                {firstVariant?.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${firstVariant.compareAtPrice}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                  "px-3 py-2 rounded-lg transition-colors duration-200",
                  "text-white font-medium",
                  inStock
                    ? "bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className={cn(
          "rounded-lg shadow-sm hover:shadow-lg transition-all duration-300",
          "overflow-hidden group h-full flex flex-col",
          "bg-background border border-border",
          "dark:bg-slate-950 dark:border-slate-800",
          "hover:border-primary/50 dark:hover:border-primary/50"
        )}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-muted dark:bg-slate-900 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex gap-2">
              {discountPercentage > 0 && (
                <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-bold">
                  -{discountPercentage}%
                </div>
              )}
              {!inStock && (
                <div className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-bold">
                  Out of Stock
                </div>
              )}
            </div>
            {showTrending && (
              <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 dark:bg-orange-600">
                <TrendingUp size={12} /> Trending
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={cn(
              "absolute top-3 right-3 rounded-full p-2 transition-all duration-200",
              "bg-background border border-border dark:bg-slate-900 dark:border-slate-800",
              "hover:shadow-md hover:bg-background dark:hover:bg-slate-800"
            )}
          >
            <Heart
              size={20}
              className={cn(
                "transition-colors duration-200",
                isFavorite
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground hover:text-destructive"
              )}
            />
          </button>

          {/* Add to Cart Button - Hover State */}
          {inStock && (
            <button
              onClick={handleAddToCart}
              className={cn(
                "absolute bottom-0 left-0 right-0 py-2 px-4",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "dark:bg-primary dark:hover:bg-primary/80",
                "translate-y-full group-hover:translate-y-0",
                "transition-transform duration-300",
                "flex items-center justify-center gap-2 font-semibold"
              )}
            >
              <ShoppingCart size={18} />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {product.brand && (
            <p className="text-muted-foreground text-xs uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          <h3
            className={cn(
              "font-semibold text-foreground line-clamp-2 text-sm",
              "group-hover:text-primary transition-colors duration-200",
              "mt-1"
            )}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={cn(
                    i < Math.floor(averageRating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews?.length || 0})
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground text-xs mt-2 line-clamp-2 flex-1">
              {product.description}
            </p>
          )}

          {/* SKU & Category */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            {product.category && <span>{product.category}</span>}
            {product.sku && <span>SKU: {product.sku}</span>}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-lg font-bold text-foreground">
              ${firstVariant?.price || "N/A"}
            </span>
            {firstVariant?.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${firstVariant.compareAtPrice}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {!inStock && (
            <p className="text-xs text-destructive font-semibold mt-2">
              Out of Stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
