"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Product,
  ProductFormData,
  ProductStatus,
  ProductVariant,
  ProductVariantForm,
} from "@/types/addProducts";

interface ProductFormInitialData
  extends Omit<Partial<Product>, "tags" | "variants"> {
  tags?: string[];
  variants?: ProductVariant[] | ProductVariantForm[];
}

interface ProductFormProps {
  initialData?: ProductFormInitialData;
  onSubmit: (data: ProductFormData) => void;
  onChange?: (data: ProductFormData) => void;
  isSubmitting: boolean;
  mode?: "create" | "edit";
}

export default function ProductForm({
  initialData,
  onSubmit,
  onChange,
  isSubmitting,
  mode = "create",
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    brand: "",
    status: ProductStatus.DRAFT,
    variants: [
      {
        name: "",
        sku: "",
        price: 0,
        compareAtPrice: undefined,
        stock: 0,
      },
    ],
  });

  const [hasHydrated, setHasHydrated] = useState(false);

  // ✅ FIX: Initialize form data only once after hydration
  useEffect(() => {
    if (!initialData || hasHydrated) return;

    let variantsArray: ProductVariantForm[] = [];

    if (Array.isArray(initialData.variants)) {
      variantsArray = initialData.variants.map((v) => {
        const hasProductId = "productId" in v;
        const hasCreatedAt = "createdAt" in v;

        if (hasProductId || hasCreatedAt) {
          const variant = v as ProductVariant;
          return {
            id: variant?.id,
            name: variant?.name || "",
            sku: variant?.sku || "",
            price: variant?.price ?? 0,
            compareAtPrice: variant?.compareAtPrice,
            stock: variant?.stock ?? 0,
          };
        } else {
          return v as ProductVariantForm;
        }
      });
    } else {
      variantsArray = [
        {
          name: "",
          sku: "",
          price: 0,
          compareAtPrice: undefined,
          stock: 0,
        },
      ];
    }

    const newFormData: ProductFormData = {
      name: initialData.name ?? "",
      description: initialData.description ?? "",
      category: initialData.category ?? "",
      brand: initialData.brand ?? "",
      status: Object.values(ProductStatus).includes(
        initialData.status as ProductStatus
      )
        ? (initialData.status as ProductStatus)
        : ProductStatus.DRAFT,
      variants: variantsArray,
    };

    setFormData(newFormData);
    setHasHydrated(true);
  }, [initialData, hasHydrated]);

  // Call onChange separately when formData changes
  useEffect(() => {
    if (onChange && hasHydrated) {
      onChange(formData);
    }
  }, [formData, onChange, hasHydrated]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "number" ? (value === "" ? 0 : parseFloat(value)) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariantForm,
    value: any
  ) => {
    const variants = [...formData.variants];

    let processedValue = value;

    if (field === "price" || field === "stock") {
      processedValue = Number(value) || 0;
    } else if (field === "compareAtPrice") {
      processedValue =
        value === "" || value === null ? undefined : Number(value);
    }

    variants[index] = {
      ...variants[index],
      [field]: processedValue,
    };

    setFormData({ ...formData, variants });
  };

  const addVariant = () => {
    // ✅ FIX: Use a static value or generate client-only
    const variantSku = `VAR-${Math.floor(Math.random() * 10000)}`; // Simple random

    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          name: `Variant ${formData.variants.length + 1}`,
          sku: variantSku,
          price: 0,
          compareAtPrice: undefined,
          stock: 0,
        },
      ],
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) {
      return;
    }

    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categories = [
    "electronics",
    "clothing",
    "accessories",
    "home",
    "sports",
    "beauty",
    "books",
    "toys",
    "food",
    "health",
  ];

  const statusOptions = [
    { value: ProductStatus.DRAFT, label: "Draft" },
    { value: ProductStatus.ACTIVE, label: "Active" },
    { value: ProductStatus.OUT_OF_STOCK, label: "Out of Stock" },
    { value: ProductStatus.ARCHIVED, label: "Archived" },
  ];

  // ✅ FIX: Return loading state until hydrated
  if (!hasHydrated && mode === "edit") {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing & Inventory Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>
                Set prices and manage inventory for your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Variants</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                  >
                    Add Variant
                  </Button>
                </div>

                {formData.variants?.map((variant, index) => (
                  <div
                    key={variant.id || index}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        Variant {index + 1}
                        {index === 0 && " (Default)"}
                      </h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`variant-name-${index}`}>
                          Variant Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`variant-name-${index}`}
                          value={variant.name}
                          onChange={(e) =>
                            handleVariantChange(index, "name", e.target.value)
                          }
                          placeholder="e.g., Red - Large"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`variant-sku-${index}`}>
                          Variant SKU
                        </Label>
                        <Input
                          id={`variant-sku-${index}`}
                          value={variant.sku}
                          onChange={(e) =>
                            handleVariantChange(index, "sku", e.target.value)
                          }
                          placeholder="e.g., VAR-001"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`variant-price-${index}`}>
                          Price <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`variant-price-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`variant-comparePrice-${index}`}>
                          Compare at Price
                        </Label>
                        <Input
                          id={`variant-comparePrice-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.compareAtPrice ?? ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "compareAtPrice",
                              e.target.value
                            )
                          }
                          placeholder="Original price for discount"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`variant-stock-${index}`}>
                          Stock <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`variant-stock-${index}`}
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(index, "stock", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>Saving...</>
          ) : mode === "edit" ? (
            <>Update Product</>
          ) : (
            <>Create Product</>
          )}
        </Button>
      </div>
    </form>
  );
}
