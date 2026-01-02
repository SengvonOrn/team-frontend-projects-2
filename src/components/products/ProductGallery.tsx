"use client";

import { useState } from "react";
import { Heart, Share2, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // ShadCN UI Button

export default function ProductGallery({ product }: { product: any }) {
  const images = product.images || [product.image];

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
        <img
          src={images[selectedImage]}
          alt={product.name}
          className="w-full h-full object-cover transition duration-300 ease-in-out"
        />

        {/* BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              -{product.discount}% OFF
            </span>
          )}
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium">
            <Truck className="w-4 h-4" />
            FREE DELIVERY
          </span>
        </div>

        {/* ACTION ICONS */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant={isFavorite ? "destructive" : "outline"}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={isFavorite ? "fill-current" : ""} />
          </Button>
          <Button size="icon" variant="outline">
            <Share2 />
          </Button>
        </div>

        {/* NAVIGATION */}
        <button
          onClick={() =>
            setSelectedImage((prev) =>
              prev > 0 ? prev - 1 : images.length - 1
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() =>
            setSelectedImage((prev) =>
              prev < images.length - 1 ? prev + 1 : 0
            )
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight />
        </button>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 justify-center">
        {images.map((img: any, index: any) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition
              ${
                selectedImage === index
                  ? "border-green-600 dark:border-green-400"
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-500"
              }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
