"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Product,
  ProductFormData,
  ProductStatus,
  ProductVariantForm,
} from "@/types/addProducts";
import { getProductAction, updateProductAction } from "@/lib/action/products";
import LoadingSpinner from "@/components/LoadingSpinner";
import ImageUpload from "@/components/products/ImageUpload";
import ProductForm from "@/components/products/productForm";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { BreadcrumbItem } from "@/lib/breakcrumb/navigationBreadcrumb";

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

// ✅ FIX: Create a wrapper to handle params safely
export default function EditProductPage({ params }: EditProductPageProps) {
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setProductId(resolved.productId);
      } catch (error) {
        console.error("Failed to resolve params:", error);
      }
    };
    resolveParams();
  }, [params]);

  if (!productId) {
    return <LoadingSpinner />;
  }

  return <EditProductContent productId={productId} />;
}

// ✅ FIX: Separate component for the content
function EditProductContent({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<ProductFormData | null>(null);
  const [hasInitializedForm, setHasInitializedForm] = useState(false);

  // Fetch product
  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  const fetchProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getProductAction(id);

      if (!result.success || !result.data) {
        setError(result.error || "Product not found");
        return;
      }

      const productData = result.data;
      setProduct(productData);

      // ✅ FIX: Map variants to ProductVariantForm format
      const variants: ProductVariantForm[] = productData.variants?.map(
        (variant) => ({
          id: variant.id,
          name: variant.name || "",
          sku: variant.sku || "",
          price: variant.price ?? 0,
          compareAtPrice: variant.compareAtPrice,
          stock: variant.stock ?? 0,
        })
      ) || [
        {
          name: "Default",
          sku: productData.sku || `SKU-${Date.now()}`,
          price: 0,
          compareAtPrice: undefined,
          stock: 0,
        },
      ];

      const initialFormData: ProductFormData = {
        name: productData.name || "",
        description: productData.description || "",
        brand: productData.brand || "",
        category: productData.category || "",
        status: productData.status ?? ProductStatus.DRAFT,
        sku: productData.sku || "",
        variants: variants,
      };

      setFormData(initialFormData);
      setHasInitializedForm(true);
    } catch (err) {
      console.error("Failed to load product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIX: Remove onChange handler if not needed, or use it properly
  const handleFormChange = useCallback((data: ProductFormData) => {
    setFormData(data);
  }, []);

  const handleSave = async () => {
    if (!formData || !product) return;

    setSaving(true);
    setError(null);

    try {
      // Include variants in the update payload
      const payload = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        category: formData.category,
        status: formData.status,
        variants: formData.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: parseFloat(variant.price.toString()),
          compareAtPrice: variant.compareAtPrice
            ? parseFloat(variant.compareAtPrice.toString())
            : null,
          stock: parseInt(variant.stock.toString()),
        })),
      };

      console.log("📤 Sending update with variants:", payload);
      const result = await updateProductAction(product.id, payload);
      console.log("📥 Update response:", result);

      if (!result.success) {
        setError(result.error || "Failed to update product");
        return;
      }

      if (result.data) {
        setProduct(result.data);
        alert("Product updated successfully!");
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      setError("An error occurred while updating the product");
    } finally {
      setSaving(false);
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Products", path: "/products" },
    { label: "Edited", path: "/edited" },
  ];

  // ✅ FIX: Add proper loading state
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
      title="Edited"
      description="Products Edited"
      showBreadcrumb={true}
      customBreadcrumbItems={breadcrumbItems}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push(`/dashboard/products/${product.id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Product
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p className="text-muted-foreground">
                Update product information
              </p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ✅ FIX: Only render ProductForm when formData is ready */}
                {formData && hasInitializedForm && (
                  <ProductForm
                    initialData={formData}
                    onSubmit={(data) => {
                      setFormData(data);
                      handleSave();
                    }}
                    onChange={handleFormChange}
                    isSubmitting={saving}
                    mode="edit"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                {product && (
                  <ImageUpload
                    productId={product.id}
                    existingImages={product.images || []}
                    onUploadComplete={() => {
                      fetchProduct(product.id);
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Variants Tab */}
          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage product variants, sizes, colors, and pricing options.
                </p>
                <Button onClick={() => console.log("Manage variants")}>
                  <Upload className="w-4 h-4 mr-2" />
                  Manage Variants
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  SEO settings, shipping rules, and other advanced
                  configurations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  );
}
