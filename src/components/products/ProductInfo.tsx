"use client";

import { useState } from "react";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProductInfo({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-sm text-muted-foreground">Product Details</p>
      </div>

      {/* RATING */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex text-yellow-400">★★★★☆</div>
        <span className="text-muted-foreground">(780 reviews)</span>
        <span className="text-green-600 font-medium">In Stock</span>
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-orange-500">
          ${product.price}
        </span>
        <span className="line-through text-muted-foreground">$39.99</span>
        <span className="rounded-md bg-red-100 dark:bg-red-950 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400">
          Save $15.00
        </span>
      </div>

      {/* SIZE OPTIONS */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Size: <span className="font-semibold">{selectedSize}</span>
        </p>

        <div className="flex flex-wrap gap-2">
          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <Button
              key={size}
              variant="outline"
              size="sm"
              onClick={() => setSelectedSize(size)}
              className={`rounded-lg ${
                selectedSize === size
                  ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "hover:border-green-500"
              }`}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* COLOR OPTIONS */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Color: <span className="font-semibold">{selectedColor}</span>
        </p>

        <div className="flex flex-wrap gap-2">
          {["Black", "White", "Gray", "Navy", "Red"].map((color) => (
            <Button
              key={color}
              variant="outline"
              size="sm"
              onClick={() => setSelectedColor(color)}
              className={`rounded-lg ${
                selectedColor === color
                  ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "hover:border-green-500"
              }`}
            >
              {color}
            </Button>
          ))}
        </div>
      </div>

      {/* QUANTITY */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Quantity</p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            −
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
          <span className="text-xs text-muted-foreground">
            Only 12 items left in stock!
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1 gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </Button>

        <Button
          onClick={() => {
            // Add to cart logic here
            router.push("/cart?checkout=true"); // Navigate to cart with checkout flag
          }}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          Buy Now
        </Button>
      </div>

      {/* EXTRA ACTIONS */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <button className="flex items-center gap-1 hover:text-foreground">
          <Heart size={16} /> Wishlist
        </button>
        <button className="flex items-center gap-1 hover:text-foreground">
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
}
