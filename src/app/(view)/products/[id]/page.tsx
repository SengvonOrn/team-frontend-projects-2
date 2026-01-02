"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productsData } from "@/constants/productsData";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { BreadcrumbItem } from "@/lib/breakcrumb/navigationBreadcrumb";

import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductTabs from "@/components/products/ProductTabs";
import RelatedProducts from "@/components/products/RelatedProducts";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const found = productsData.find((p) => p.id === productId);
    setProduct(found || null);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full" />
      </div>
    );
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: product.name, path: `/products/${product.id}` },
  ];

  return (
    <DashboardLayout
      title={product.name}
      description="Product Details"
      showBreadcrumb
      customBreadcrumbItems={breadcrumbItems}
    >
      {/* PAGE WRAPPER */}
      <div className="bg-gray-50 dark:bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* TOP SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>

          {/* TABS */}
          <ProductTabs product={product} />

          {/* RELATED PRODUCTS */}
          <RelatedProducts currentProductId={product.id} />
        </div>
      </div>
    </DashboardLayout>
  );
}
