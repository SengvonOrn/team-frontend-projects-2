"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Upload, X } from "lucide-react";
import { Product } from "@/types/types";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  stock: number;
  sku: string;
  images: File[];
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    category: "",
    stock: 0,
    sku: "",
    images: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: formData.name || "",
        description: formData.description || "",
        price: formData.price,
        category: formData.category || "",
        rating: 0,
        originalPrice: formData.originalPrice || formData.price,
        reviews: 0,
        image: formData.images[0]
          ? URL.createObjectURL(formData.images[0])
          : "",
        badge: null,
        inStock: (formData.stock || 0) > 0,
        sku: formData.sku || "",
        stock: formData.stock || 0,
        sold: 0,
        status: "active",
        createdAt: new Date().toISOString(),
      };

      onSubmit(newProduct);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        category: "",
        stock: 0,
        sku: "",
        images: [],
      });

      setImagePreviews([]);
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.price > 0 &&
    formData.category.trim() &&
    formData.stock >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Add New Product</DialogTitle>
              <DialogDescription className="mt-1">
                Fill in the product details to add it to your store
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Product Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Wireless Headphones"
                className="h-11"
                disabled={isLoading}
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Price ($) *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ""}
                onChange={handleInputChange}
                placeholder="0.00"
                className="h-11"
                disabled={isLoading}
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-medium">
                Stock Quantity *
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock || ""}
                onChange={handleInputChange}
                placeholder="0"
                className="h-11"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg bg-background"
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home & Garden</option>
              </select>
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-sm font-medium">
                SKU
              </Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="e.g., WH-001"
                className="h-11"
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                className="min-h-[100px] resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Product Images */}
            <div className="col-span-2 space-y-2">
              <Label className="text-sm font-medium">Product Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isLoading}
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload images
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Add Product
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
