"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TimeLeft, useCountdown } from "@/lib/useCountdown";
import { productsData } from "@/constants/productsData";
import { Star, TrendingUp, Zap, Award, ShoppingCart } from "lucide-react";

export default function FreeDeliverySection() {
  const timeLeft: TimeLeft = useCountdown({
    days: 10,
    hours: 23,
    minutes: 59,
    seconds: 0,
  });

  const freeDeliveryProducts = productsData.slice(0, 10);

  return (
    <section className="w-full space-y-8 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Free Delivery Deals
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Limited time offers with free shipping
          </p>
        </div>
        <Link
          href="/products?filter=free-delivery"
          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm flex items-center gap-2 group"
        >
          View All
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>

      {/* Countdown Banner */}
      <div className="w-full py-8 px-6 md:px-10 rounded-2xl bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-950 dark:to-teal-950 relative overflow-hidden shadow-lg">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-between">
          {/* LEFT SIDE CONTENT */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 text-white p-2 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 dark:text-green-100">
                Free Delivery
              </h2>
            </div>

            <p className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2 mb-4">
              <span>Offer ends in</span>
              <span className="text-xl">🎁</span>
            </p>

            {/* Countdown Timer */}
            <div className="flex flex-wrap gap-3">
              {Object.entries(timeLeft).map(([label, value], idx) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg overflow-hidden">
                    <div className="text-2xl md:text-3xl font-bold px-4 py-3">
                      {value.toString().padStart(2, "0")}
                    </div>
                    <div className="bg-red-700 text-xs font-semibold px-4 py-1 text-center uppercase">
                      {label}
                    </div>
                  </div>
                  {idx < 3 && (
                    <span className="text-3xl text-gray-700 dark:text-gray-300 font-bold">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE IMAGES - Hidden on mobile */}
          <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 items-center space-x-6">
            <Image
              src="/images/plant.png"
              alt="Plant"
              width={150}
              height={150}
              className="object-contain drop-shadow-xl"
            />
            <Image
              src="/images/Truck.png"
              alt="Delivery Truck"
              width={200}
              height={150}
              className="object-contain drop-shadow-xl animate-bounce"
            />
            <Image
              src="/images/plane.png"
              alt="Plane"
              width={300}
              height={200}
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {freeDeliveryProducts.map((product, index) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
              {/* Product Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="aspect-square relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Quick View Text (appears on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Badges Container */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  {/* Free Delivery Badge */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1 backdrop-blur-sm">
                    <span>🚚</span>
                    <span>FREE</span>
                  </div>

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-lg">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Special Badges (bottom) */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  {/* Trending Badge */}
                  {index % 3 === 0 && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Trending</span>
                    </div>
                  )}

                  {/* Best Seller Badge */}
                  {index % 4 === 0 && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>Best</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info Container */}
              <div className="p-4 flex flex-col flex-1">
                {/* Product Name */}
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {product.name}
                </h3>

                {/* Rating Section */}
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

                {/* Price Section */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                          Save $
                          {(product.originalPrice - product.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-auto">
                  {/* Delivery Info */}
                  <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold mb-3">
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

                  {/* Quick Add Button - Appears on Hover */}
                  <button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-sm flex items-center justify-center gap-2 shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to cart logic here
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Quick Add
                  </button>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-6">
        <Link
          href="/products?filter=free-delivery"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>View All Free Delivery Products</span>
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
