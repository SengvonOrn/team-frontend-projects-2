"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Store, MapPin, Trash2, Edit2, Eye, Plus } from "lucide-react";
import { CreateStoreModal } from "@/components/store/CreateStoreModal";
import { IStore, IPaginatedResponse } from "@/types/store";
import { Backend_URL } from "@/constants/ConstantsUrl";

export default function StoresPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stores, setStores] = useState<IStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<IStore | null>(null);

  const token = session?.backendTokens?.accessToken;
  const fetchStores = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${Backend_URL}/api/stores/stores`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to fetch stores");
      }
      const data: IPaginatedResponse<IStore> = await res.json();
      setStores(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && token) fetchStores();
  }, [status, token]);

  const handleStoreCreated = () => {
    fetchStores();
  };

  const handleEdit = (store: IStore) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  //============================================
  //
  //============================================

  const handleDelete = async (storeId: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this store?")) return;

    try {
      const res = await fetch(`${Backend_URL}/api/stores/${storeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete store");
      fetchStores();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  //============================================
  //
  //============================================

  const handleView = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  const handleAddProduct = (storeId: string) => {
    router.push(`/stores/${storeId}/products`);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-pulse">
          <Store className="w-12 h-12 mx-auto text-primary" />
          <p className="text-gray-500 mt-4">Loading your stores...</p>
        </div>
      </div>
    );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Store className="w-8 h-8 text-primary" /> My Stores
        </h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Store
        </Button>
      </div>

      {stores.length === 0 ? (
        <div className="border-2 border-dashed p-12 rounded-lg text-center text-gray-500">
          No stores yet. Create your first store.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card
              key={store.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{store.name}</CardTitle>
                  {store.description && (
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {store.description}
                    </CardDescription>
                  )}
                  {(store.address || store.city || store.state) && (
                    <div className="flex items-start gap-1 mt-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <div>
                        {store.address && <div>{store.address}</div>}
                        {(store.city || store.state) && (
                          <div>
                            {store.city} {store.city && store.state && ","}{" "}
                            {store.state}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-8 h-8 p-1">
                      ...
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleView(store.id)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(store)}>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddProduct(store.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Product
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(store.id)}>
                      <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardFooter>
                <p className="text-xs text-gray-400">
                  Created {new Date(store.createdAt!).toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateStoreModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStore(null);
        }}
        onSubmit={handleStoreCreated}
      />
    </div>
  );
}
