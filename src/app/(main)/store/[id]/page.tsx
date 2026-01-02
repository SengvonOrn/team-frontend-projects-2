"use client";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { StoreManagementDashboard } from "@/components/store/StoreManagementDashboard";
import { AddProductModal } from "@/components/store/AddProductModal";
import { Product } from "@/types/types";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, Trash2, PackageSearch } from "lucide-react";

const StorePage = ({ params }: { params: { id: string } }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storeData = {
    id: params.id,
    name: "My Awesome Store",
    category: "Clothing",
    description: "Your one-stop shop for amazing clothing!",
    status: "active" as const,
    createdAt: new Date().toISOString(),
  };

  const handleAddProductSuccess = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };



  
  return (
    <DashboardLayout title={storeData.name} description={storeData.description}>
      <div className="container mx-auto pb-10">
        <StoreManagementDashboard
          storeData={storeData}
          stats={{
            totalProducts: products.length,
            totalOrders: 10,
            totalRevenue: 500,
            totalCustomers: 20,
          }}
          onAddProduct={() => setIsModalOpen(true)}
          onEditStore={() => console.log("Edit Store")}
        />

        {/* Product List Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Your Inventory
            </h2>
            <p className="text-sm text-muted-foreground">
              {products.length} Products found
            </p>
          </div>

          {products.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/20 py-12">
              <CardContent className="flex flex-col items-center justify-center">
                <PackageSearch className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No products yet</p>
                <p className="text-sm text-muted-foreground">
                  Click "Add New Product" to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden group hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg truncate">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-primary font-bold">
                        ${product.price}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-destructive/10 rounded-full text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProductSuccess}
        />
      </div>
    </DashboardLayout>
  );
};

export default StorePage;
