"use client";

import { useState } from "react";
import ProductReviews from "./ProductReviews";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProductTabs({ product }: any) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-950">
      <Tabs defaultValue="description">
        {/* TAB HEADER */}
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* DESCRIPTION */}
        <TabsContent value="description" className="p-6 space-y-6">
          {/* PRODUCT OWNER */}
          <div className="flex items-center justify-between rounded-xl border p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Seller Store
                </p>
                <p className="text-sm text-muted-foreground">Verified Seller</p>
              </div>
            </div>

            <Button
              variant={following ? "outline" : "default"}
              onClick={() => setFollowing(!following)}
            >
              {following ? "Following" : "Follow"}
            </Button>
          </div>

          {/* DESCRIPTION TEXT */}
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              {product.name} is a premium quality product designed with
              attention to detail and crafted from the finest materials. This
              item combines functionality with style, making it perfect for
              everyday use.
            </p>

            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>High-quality materials for long-lasting durability</li>
              <li>Ergonomic design for maximum comfort</li>
              <li>Easy to maintain and clean</li>
              <li>Eco-friendly production</li>
            </ul>
          </div>
        </TabsContent>

        {/* SPECIFICATIONS */}
        <TabsContent value="specifications" className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Brand</span>
              <span className="font-medium">TechStore</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium">USB-C Hub 7-in-1</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Warranty</span>
              <span className="font-medium">2 Years</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">Free Delivery</span>
            </div>
          </div>
        </TabsContent>

        {/* REVIEWS */}
        <TabsContent value="reviews" className="p-6 space-y-6">
          {/* REVIEW FORM */}
          <ProductReviews />

          {/* USER COMMENTS */}
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border p-4 bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm font-semibold">User {i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      ★★★★☆ • 2 days ago
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Great product! The quality is excellent and delivery was fast.
                  Highly recommended.
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
