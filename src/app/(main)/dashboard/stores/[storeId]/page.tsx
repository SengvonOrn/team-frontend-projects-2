"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IStore } from "@/types/store";
import { getStoreById } from "@/lib/action/stores"; // Your action
import LoadingSpinner from "@/components/LoadingSpinner";

interface StorePageProps {
  params: {
    storeId: string;
  };
}

export default function StorePage({ params }: StorePageProps) {
  const router = useRouter();
  const [store, setStore] = useState<IStore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStore() {
      try {
        // ✅ Use params.storeId (matches folder name)
        const result = await getStoreById(params.storeId);
        if (result.success && result.data) {
          setStore(result.data as IStore);
        }
      } catch (err) {
        console.error("Failed to load store:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStore();
  }, [params.storeId]);

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto py-12">
        <p>Store not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{store.name}</h1>
            <p className="text-muted-foreground">{store.description}</p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/stores/${store.id}/edit`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Store
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{store.name}</p>
          </div>
          {store.description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{store.description}</p>
            </div>
          )}
          {store.address && (
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{store.address}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
