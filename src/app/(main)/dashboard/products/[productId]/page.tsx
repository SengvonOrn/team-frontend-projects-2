"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Upload, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/addProducts";
import { getProductAction, deleteProductAction } from "@/lib/action/products";
import ImageGallery from "@/components/products/ImageGallery";
// import ProductVariants from "@/components/products/ProductVariants";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { BreadcrumbItem } from "@/lib/breakcrumb/navigationBreadcrumb";

interface ProductDetailPageProps {
  params: {
    productId: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { productId } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getProductAction(productId);

      if (!result.success || !result.data) {
        setError(result.error || "Product not found");
        return;
      }

      setProduct(result.data);
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/products/${productId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleting(true);
    try {
      const result = await deleteProductAction(productId);

      if (result.success) {
        router.push("/dashboard/products");
        router.refresh();
      } else {
        alert(result.error || "Failed to delete product");
      }
    } catch (err) {
      alert("An error occurred while deleting the product");
    } finally {
      setDeleting(false);
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Products", path: "/dashboard/products" },
    { label: `${productId}`, path: "/edited" },
  ];

  const getStatusColor = (status?: string): string => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-500";
      case "DRAFT":
        return "bg-yellow-500";
      case "OUT_OF_STOCK":
        return "bg-red-500";
      case "ARCHIVED":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error || "Product not found"}</AlertDescription>
        </Alert>
        <Button
          onClick={() => router.push("/dashboard/products")}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Views"
      description="Happy with products"
      showBreadcrumb={true}
      customBreadcrumbItems={breadcrumbItems}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/products")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  SKU: {product.variants?.map((p) => p.sku).join(", ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Product
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageGallery images={product.images || []} />
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                </CardHeader>

                <CardContent>
                  {/* <ProductVariants variants={product.variants} /> */}
                  {/* {product.variants.map((p) => p.sku).join(", ")} */}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold">
                    ${product.variants?.[0]?.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
                {product.variants?.[0]?.compareAtPrice && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Compare at Price
                    </p>
                    <p className="text-lg line-through text-muted-foreground">
                      ${product.variants[0].compareAtPrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="text-2xl font-bold">
                    {product.variants?.map((p) => p.stock)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="text-lg font-semibold">
                    {product.variants?.map((p) => p.sku).join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Category & Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Categories & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Category</p>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {/* {product.tags.map((tag: any, index: any) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))} */}
                      Tage soon
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Brand</p>
                  <p>{product.brand || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p>{product.images?.map((m) => m.height) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dimensions</p>
                  <p>
                    {product.variants?.map(
                      (m) => m.inventory?.quantityInStock
                    ) || "N/A"}
                  </p>
                  Soon
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs for Additional Info */}
        <div className="mt-8">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">
                        Shipping Information
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>Weight: N /A</li>
                        <li>Dimensions: N/A</li>
                        <li>Shipping Class: Standard</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Additional Info</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          Created:{" "}
                          {new Date(product.createdAt).toLocaleDateString()}
                        </li>
                        <li>
                          Last Updated:{" "}
                          {new Date(product.updatedAt).toLocaleDateString()}
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Product created</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(product.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">Last updated</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(product.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
