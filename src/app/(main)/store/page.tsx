"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Star,
  Grid,
  List,
  Plus,
  X,
  Upload,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { products } from "@/app/data";
import Sidebar from "@/components/seller/Sidebar";
import Header from "@/components/seller/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { FormData, Product } from "@/types/types";
import OverviewPage from "@/components/seller/Overview";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IPaginatedResponse, IStore } from "@/types/store";
import { Backend_URL } from "@/constants/ConstantsUrl";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { getMyStores } from "@/lib/action/stores";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StoreProfileForm from "@/components/seller/StoreProfileForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
export default function SellerStorePage() {
  const { userData, load } = useUserProfile();
  //========================================================
  //
  //========================================================

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "add-product" | "analytics" | "settings"
  >("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();

  const router = useRouter();

  const [stores, setStores] = useState<IStore>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = session?.backendTokens?.accessToken;

  //==================================================
  // fetch store using server
  //=================================================

  const fetchStore = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMyStores();
      if (!result.success) {
        setError(result.message);
        return;
      }
      setStores(result.data || []);
    } catch (error) {
      setError("Failed to fetch stores");
      console.error("Fetch stores error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //===============================================
  //
  //==============================================

  useEffect(() => {
    if (status === "authenticated") {
      fetchStore();
      load();
    }
  }, [status, load]);
  useEffect(() => {
    if (status === "authenticated" && token) fetchStore();
  }, [status, session?.user?.id]);

  //===========================================================
  //
  //===========================================================

  const [formData, setFormData] = useState<FormData>({
    name: "",
    sku: "",
    category: "electronics",
    price: "",
    originalPrice: "",
    stock: "",
    description: "",
    image: null,
    imagePreview: "",
  });

  const categories = [
    { id: "all", name: "All Products", count: 256 },
    { id: "electronics", name: "Electronics", count: 64 },
    { id: "fashion", name: "Fashion", count: 89 },
    { id: "home", name: "Home & Garden", count: 45 },
    { id: "sports", name: "Sports", count: 34 },
    { id: "books", name: "Books", count: 24 },
  ];

  const filteredProducts = useMemo(() => {
    //========================================================
    //
    //========================================================

    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, priceRange]);

  //========================================================
  //
  //========================================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  //========================================================
  //
  //========================================================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //========================================================
  //
  //========================================================

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product submitted:", formData);
    setActiveTab("products");
    setFormData({
      name: "",
      sku: "",
      category: "electronics",
      price: "",
      originalPrice: "",
      stock: "",
      description: "",
      image: null,
      imagePreview: "",
    });
  };

  //========================================================
  //
  //========================================================

  const handleAddProduct = () => {
    setActiveTab("add-product");
  };

  const discount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "out-of-stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const hasActiveSearch = searchQuery.trim() !== "";

  function handleUpdateStore(
    data: Partial<IStore>
  ): Promise<{ success: boolean; message: string }> {
    throw new Error("Function not implemented.");
  }

  return (
    <DashboardLayout
      title="My Profile"
      description="Manage your profile information and settings"
      showBreadcrumb={true}
      // customBreadcrumbItems={breadcrumbItems}
      userData={userData}
    >
      <div className="flex mt-5 h-screen bg-background">
        {/* Custom Scrollbar Styles */}
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          currentStore={stores}
          setSidebarOpen={setSidebarOpen}
          products={products}
          isLoading={isLoading}
          error={error}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header - Sticky */}
          <div className="sticky top-0 z-40">
            <Header
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSidebarOpen={setSidebarOpen}
              sidebarOpen={sidebarOpen}
              onAddProduct={handleAddProduct}
            />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1">
            <div className="p-6 space-y-6">
              {/* Search Results Info - Only show on products tab */}
              {activeTab === "products" && hasActiveSearch && (
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          Found {filteredProducts.length}{" "}
                          {filteredProducts.length === 1
                            ? "product"
                            : "products"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Searching for:{" "}
                          <span className="font-medium">"{searchQuery}"</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear search
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Overview Dashboard */}
              {activeTab === "overview" && <OverviewPage products={products} />}
              {/* Products Management */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">
                      {hasActiveSearch
                        ? `${filteredProducts.length} results`
                        : `${products.length} total products`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters */}
                    <div className="lg:col-span-1">
                      <div className="space-y-6 sticky top-0">
                        <Card>
                          <CardHeader>
                            <CardTitle>Categories</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {categories.map((cat) => (
                                <Button
                                  key={cat.id}
                                  variant={
                                    selectedCategory === cat.id
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="w-full justify-between"
                                  onClick={() => setSelectedCategory(cat.id)}
                                >
                                  <span>{cat.name}</span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {cat.count}
                                  </Badge>
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Price Range</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[1]}
                                onChange={(e) =>
                                  setPriceRange([
                                    priceRange[0],
                                    parseInt(e.target.value),
                                  ])
                                }
                                className="w-full h-2 bg-muted rounded-lg cursor-pointer accent-primary"
                              />
                              <div className="flex justify-between text-sm">
                                <span className="font-semibold">
                                  ${priceRange[0]}
                                </span>
                                <span className="font-semibold">
                                  ${priceRange[1]}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                          <Button
                            variant={
                              viewMode === "grid" ? "secondary" : "ghost"
                            }
                            size="icon"
                            onClick={() => setViewMode("grid")}
                          >
                            <Grid className="w-5 h-5" />
                          </Button>
                          <Button
                            variant={
                              viewMode === "list" ? "secondary" : "ghost"
                            }
                            size="icon"
                            onClick={() => setViewMode("list")}
                          >
                            <List className="w-5 h-5" />
                          </Button>
                        </div>

                        <Select defaultValue="newest">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="popular">
                              Most Popular
                            </SelectItem>
                            <SelectItem value="price-low">
                              Price: Low to High
                            </SelectItem>
                            <SelectItem value="price-high">
                              Price: High to Low
                            </SelectItem>
                            <SelectItem value="rating">Best Rated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Grid View */}
                      {filteredProducts.length > 0 ? (
                        viewMode === "grid" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                              <Card
                                key={product.id}
                                className="group overflow-hidden hover:shadow-xl transition-all"
                              >
                                <div className="relative h-48 bg-muted overflow-hidden">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                  {product.badge && (
                                    <Badge className="absolute top-3 left-3">
                                      {product.badge}
                                    </Badge>
                                  )}
                                  {product.originalPrice &&
                                    product.originalPrice > product.price && (
                                      <Badge
                                        variant="destructive"
                                        className="absolute top-3 right-3"
                                      >
                                        -
                                        {discount(
                                          product.originalPrice,
                                          product.price
                                        )}
                                        %
                                      </Badge>
                                    )}
                                </div>

                                <CardContent className="p-4">
                                  <h3 className="font-semibold mb-2 line-clamp-2">
                                    {product.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={cn(
                                            "w-3 h-3",
                                            i < Math.floor(product.rating)
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-muted"
                                          )}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      ({product.reviews})
                                    </span>
                                  </div>

                                  <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-lg font-bold">
                                      ${product.price}
                                    </span>
                                    {product.originalPrice > product.price && (
                                      <span className="text-sm text-muted-foreground line-through">
                                        ${product.originalPrice}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex gap-2">
                                    <Button size="sm" className="flex-1">
                                      <Edit2 className="w-4 h-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="px-3"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          /* List View */
                          <Card>
                            <CardContent className="p-0">
                              {filteredProducts.map((product, index) => (
                                <div
                                  key={product.id}
                                  className={cn(
                                    "p-4 flex gap-4 hover:bg-muted transition",
                                    index !== filteredProducts.length - 1 &&
                                      "border-b"
                                  )}
                                >
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <h3 className="font-semibold">
                                      {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                      <span>${product.price}</span>
                                      <span>•</span>
                                      <span>{product.sold} sold</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      className={getStatusColor(product.status)}
                                    >
                                      {product.status === "active"
                                        ? "Active"
                                        : product.status === "draft"
                                        ? "Draft"
                                        : "Out of Stock"}
                                    </Badge>
                                    <Button size="icon" variant="ghost">
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )
                      ) : (
                        <Card>
                          <CardContent className="text-center py-12">
                            <p className="text-lg font-semibold mb-2">
                              No products found
                            </p>
                            <p className="text-muted-foreground mb-4">
                              {hasActiveSearch
                                ? `No products match "${searchQuery}"`
                                : "Try adjusting your filters"}
                            </p>
                            {hasActiveSearch && (
                              <Button
                                variant="link"
                                onClick={() => setSearchQuery("")}
                              >
                                Clear search
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Add Product Form */}
              {activeTab === "add-product" && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold">Add New Product</h1>
                    <p className="text-muted-foreground">
                      Fill in the details below
                    </p>
                  </div>

                  <Card>
                    <CardContent className="p-8">
                      <form
                        onSubmit={handleSubmitProduct}
                        className="space-y-6"
                      >
                        {/* Image Upload */}
                        <div>
                          <Label>Product Image</Label>
                          <div className="mt-2 border-2 border-dashed rounded-xl p-8 text-center">
                            {formData.imagePreview ? (
                              <div className="relative inline-block">
                                <img
                                  src={formData.imagePreview}
                                  alt="Preview"
                                  className="w-48 h-48 object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="absolute -top-2 -right-2"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      image: null,
                                      imagePreview: "",
                                    }))
                                  }
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <label className="cursor-pointer">
                                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                                <p className="text-sm font-semibold mb-1">
                                  Click to upload image
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG up to 10MB
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter product name"
                            />
                          </div>

                          <div>
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                              id="sku"
                              name="sku"
                              value={formData.sku}
                              onChange={handleInputChange}
                              placeholder="e.g., PRODUCT-001"
                            />
                          </div>

                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  category: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="electronics">
                                  Electronics
                                </SelectItem>
                                <SelectItem value="fashion">Fashion</SelectItem>
                                <SelectItem value="home">
                                  Home & Garden
                                </SelectItem>
                                <SelectItem value="sports">Sports</SelectItem>
                                <SelectItem value="books">Books</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input
                              id="stock"
                              name="stock"
                              type="number"
                              value={formData.stock}
                              onChange={handleInputChange}
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={handleInputChange}
                              placeholder="0.00"
                            />
                          </div>

                          <div>
                            <Label htmlFor="originalPrice">
                              Original Price
                            </Label>
                            <Input
                              id="originalPrice"
                              name="originalPrice"
                              type="number"
                              step="0.01"
                              value={formData.originalPrice}
                              onChange={handleInputChange}
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Enter product description"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                          <Button type="submit" className="flex-1">
                            Add Product
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setActiveTab("products");
                              setFormData({
                                name: "",
                                sku: "",
                                category: "electronics",
                                price: "",
                                originalPrice: "",
                                stock: "",
                                description: "",
                                image: null,
                                imagePreview: "",
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
              {/* Analytics */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">
                      Track your store performance
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">
                        Analytics dashboard coming soon...
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
              {/* Settings */}
              {activeTab === "settings" && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold">Store Settings</h1>
                    <p className="text-muted-foreground">
                      Manage your store profile and preferences
                    </p>
                  </div>

                  {isLoading ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <LoadingSpinner />
                      </CardContent>
                    </Card>
                  ) : error ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  ) : stores ? (
                    <StoreProfileForm store={stores} isLoading={isLoading} />
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground mb-4">
                          No store found. Please create a store first.
                        </p>
                        <Button
                          onClick={() => router.push("/seller/create-store")}
                        >
                          Create Store
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
