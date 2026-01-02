"use client";
import React, { useState } from "react";
import { usePaginatedDeals } from "@/hooks/usePaginatedDeals";
import { Button } from "@/components/ui/button";
import { TopDealProps } from "@/types/deals";
import { useCart } from "@/context/cart/CartContext";
import Link from "next/link";
import { ShoppingCart, Star, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-Toast";

export function TopDeal({ topDeals }: TopDealProps) {
  const { page, setPage, visibleDeals, getPages, totalPages, renderStars } =
    usePaginatedDeals(topDeals, 3, 5);

  const { addToCart } = useCart();
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* 🔥 Header */}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 p-5 text-white shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Flame className="w-5 h-5" /> Top Deals
        </h2>
        <Link href="/views" className="text-sm underline hover:opacity-80">
          View all
        </Link>
      </div>

      {/* 🧱 Product Grid */}
      {visibleDeals.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {visibleDeals.map((deal) => (
            <Link
              key={deal.id}
              href={`/products/${deal.id}`}
              className="group relative rounded-xl border bg-white/80 dark:bg-gray-900/80 backdrop-blur p-3 transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Badge */}
              <span className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white font-semibold">
                HOT
              </span>

              {/* Image */}
              {deal.image && (
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              )}

              {/* Info */}
              <div className="mt-3 space-y-1">
                <h3 className="text-sm font-semibold line-clamp-1">
                  {deal.name}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {deal.description}
                </p>

                {/* Rating */}
                {deal.rating && (
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {renderStars(deal.rating)}
                  </div>
                )}

                {/* Price */}
                <p className="text-base font-bold text-emerald-600 mt-1">
                  ${deal.price?.toFixed(2)}
                </p>
              </div>

              {/* 🛒 Add to Cart */}
              <Button
                className="mt-3 w-full flex items-center gap-2"
                disabled={loadingId === deal.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLoadingId(deal.id);

                  addToCart({
                    id: deal.id,
                    name: deal.name,
                    price: deal.price || 0,
                    image: deal.image || "",
                  });

                  toast({
                    title: "Added to cart 🛒",
                    description: `${deal.name} is now in your cart`,
                  });

                  setTimeout(() => setLoadingId(null), 500);
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                {loadingId === deal.id ? "Adding..." : "Add to Cart"}
              </Button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No deals available right now 😔
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          {getPages().map((p, i) =>
            p === "..." ? (
              <span key={i} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <Button
                key={i}
                variant={p === page ? "default" : "outline"}
                onClick={() => setPage(Number(p))}
              >
                {p}
              </Button>
            )
          )}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
