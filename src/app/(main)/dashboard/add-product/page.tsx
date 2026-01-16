"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { IStore } from "@/types/store";
import { getMyStores } from "@/lib/action/stores";
import { AddProducts } from "@/components/store/AddProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stores, setStores] = useState<IStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FETCH STORE
  // ============================================
  const fetchStore = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMyStores();

      if (!result.success) {
        setError(result.message);
        setStores(null);
        return;
      }

      if (result.data) {
        if (Array.isArray(result.data)) {
          setStores(result.data.length > 0 ? result.data[0] : null);
        } else {
          setStores(result.data as IStore);
        }
      } else {
        setStores(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch stores";
      setError(errorMessage);
      setStores(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    if (status === "authenticated") {
      fetchStore();
    }
  }, [status]);

  // ============================================
  // RENDER
  // ============================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!stores?.id) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Store Found</AlertTitle>
            <AlertDescription>
              Please create a store before adding products.
            </AlertDescription>
          </Alert>
          <Link href="/dashboard/stores/create" className="mt-4 inline-block">
            <Button>Create Store</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Add New Product
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Add a new product to your store
        </p>
      </div>

      {/* Add Product Form */}
      <AddProducts storeId={stores.id} />
    </div>
  );
}
