"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IStore } from "@/types/store";
import { getStoreById } from "@/lib/action/stores";
import LoadingSpinner from "@/components/LoadingSpinner";
import StoreProfileForm from "@/components/seller/StoreProfileForm";

interface EditStorePageProps {
  params: {
    storeId: string;
  };
}

export default function EditStorePage({ params }: EditStorePageProps) {
  const router = useRouter();
  const [store, setStore] = useState<IStore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStore() {
      try {
        // ✅ Use params.storeId
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
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Store</h1>
          <p className="text-muted-foreground">{store.name}</p>
        </div>
      </div>

      <StoreProfileForm store={store} isLoading={false} />
    </div>
  );
}
