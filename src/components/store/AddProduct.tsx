"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  DollarSign,
  Package,
  Tag,
  FileText,
  Save,
  ImagePlus,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  addProductVariantAction,
  createProductAction,
  uploadProductImagesAction,
} from "@/lib/action/products";
import { ProductFormData, productFormSchema } from "@/utils/utils";
import { AddProductInput } from "@/types/addProducts";

// REMOVED: Don't define ProductFormData here - it's imported from utils

interface ImageFile {
  id: string;
  url: string;
  file: File;
}

interface AddProductsProps {
  storeId?: string | number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ============================================
// COMPONENT
// ============================================

export const AddProducts = ({ storeId }: AddProductsProps) => {
  const router = useRouter();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //===========================================================
  // ✅ FORM MATCHES SCHEMA
  //============================================================
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      slug: "",
      brand: "",
      price: 0, // number
      compareAtPrice: 0, // number
      status: "ACTIVE",
      sku: "",
      stock: 0,
    },
  });

  //====================================================
  // Auto-generate slug
  //====================================================
  const watchName = form.watch("name");

  useEffect(() => {
    if (watchName && !form.getValues("slug")) {
      form.setValue("slug", generateSlug(watchName));
    }
  }, [watchName, form]);

  // ===== IMAGE HANDLERS =====

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        console.warn(`File ${file.name} is not an image`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`File ${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    const newImages: ImageFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        console.warn(`Dropped file ${file.name} is not an image`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`Dropped file ${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newImages: ImageFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  //==============================================================|

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  //=================================================================|

  // Cleanup image URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  // ============================================
  // FORM SUBMISSION - MATCHES BACKEND ENDPOINTS
  // ============================================

  const onSubmit = async (data: z.infer<typeof productFormSchema>) => {
    try {
      setIsSubmitting(true);

      if (!storeId) {
        throw new Error("Store ID is required");
      }
      //===========================================
      // STEP 1: CREATE PRODUCT
      //===========================================
      const productPayload = {
        storeId: String(storeId),
        name: data.name,
        description: data.description,
        category: data.category,
        brand: data.brand || undefined,
        slug: data.slug,
        status: data.status,
      } as AddProductInput;

      const createResult = await createProductAction(productPayload);
      if (!createResult.success) {
        throw new Error(createResult.error || "Failed to create product");
      }

      //================================================
      //
      //================================================

      const createdProduct = createResult.data!;

      // STEP 2: UPLOAD IMAGES
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("files", img.file));

        const uploadResult = await uploadProductImagesAction(
          createdProduct.id,
          formData
        );
        if (!uploadResult.success) {
          console.warn("Images upload warning:", uploadResult.error);
        }
      }

      //=================================================
      // STEP 3: ADD VARIANT
      //=================================================

      const variantResult = await addProductVariantAction(createdProduct.id, {
        name: data.name,
        price: data.price || 0,
        compareAtPrice: data.compareAtPrice || 0,
        stock: data.stock | 0,
        sku: data.sku && data.sku !== "" ? data.sku : undefined,
      });

      if (!variantResult.success) {
        throw new Error(
          variantResult.error || "Failed to create product variant"
        );
      }

      //===================================================
      //
      //===================================================

      // SUCCESS
      setSubmitSuccess(true);
      images.forEach((img) => URL.revokeObjectURL(img.url));

      setTimeout(() => {
        router.push(`/dashboard/products/${createdProduct.id}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error creating product:", error);
      form.setError("root", {
        message: error.message || "Failed to create product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======================================================================
  // SUCCESS STATE
  //=======================================================================

  if (submitSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Product Created!</h3>
              <p className="text-muted-foreground">
                Your product has been created successfully. Redirecting...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ======================================================================
  // MAIN FORM
  //=======================================================================
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">
                Create a new product for your store
              </p>
            </div>
          </div>
        </div>

        {/* Errors */}
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <CardTitle>Basic Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="product-slug"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Auto-generated from product name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product"
                          rows={5}
                          className="resize-none"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-primary" />
                  <CardTitle>Product Images</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <label
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/25 hover:border-primary"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {isDragging ? "Drop images here" : "Drag & drop or click"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 10MB per image
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image.id)}
                          disabled={isSubmitting}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <CardTitle>Pricing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="0.00"
                              className="pl-7"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : parseFloat(value)
                                );
                              }}
                              disabled={isSubmitting}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="compareAtPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compare at Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="pl-7"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : parseFloat(value)
                                );
                              }}
                              disabled={isSubmitting}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organization */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <CardTitle>Organization</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="accessories">
                            Accessories
                          </SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="beauty">Beauty</SelectItem>
                          <SelectItem value="books">Books</SelectItem>
                          <SelectItem value="toys">Toys</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter brand name"
                          {...field}
                          value={field.value || ""}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle>Inventory</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="PROD-001"
                          {...field}
                          value={field.value || ""}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || !form.formState.isDirty}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Product
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
