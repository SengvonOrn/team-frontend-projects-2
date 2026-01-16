"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  List,
  Edit2,
  Trash2,
  AlertCircle,
  Archive,
  ArchiveRestore,
  RotateCcw,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/addProducts";
import { cn } from "@/utils/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductsViewProps {
  products: Product[];
  deletedProducts?: Product[];
  productsLoading: boolean;
  productsError: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  onDeleteProduct?: (productId: string) => Promise<void>;

  onRestoreProduct?: (productId: string) => Promise<void>;
  onPermanentDelete?: (productId: string) => Promise<void>;
  isTrash?: boolean;
}

export const EnhancedProductsView = ({
  products,
  deletedProducts = [],
  productsLoading,
  productsError,
  searchQuery,
  setSearchQuery,
  onDeleteProduct,
  onRestoreProduct,
  onPermanentDelete,
  isTrash = false,
}: ProductsViewProps) => {
  //================================================================

  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState(isTrash ? "deleted" : "active");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getProductPrice = (product: Product): number => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].price;
    }
    return 0;
  };

  //
  const getComparePrice = (product: Product): number | undefined => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].compareAtPrice;
    }
    return undefined;
  };
  //

  const getMainImage = (product: Product): string => {
    const mainImage = product.images?.find((img) => img.imageType === "MAIN");
    return (
      mainImage?.imageUrl || product.images?.[0]?.imageUrl || "/placeholder.jpg"
    );
  };
  //

  const getDiscount = (product: Product): number | null => {
    const comparePrice = getComparePrice(product);
    const price = getProductPrice(product);

    if (!comparePrice || comparePrice <= price) {
      return null;
    }

    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  //

  const getStatusColor = (status?: string): string => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "OUT_OF_STOCK":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ARCHIVED":
      case "DELETED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  //

  const formatDeletedDate = (dateString?: string): string => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ============================================
  // CATEGORIES
  // ============================================

  const categories = useMemo(() => {
    const activeProducts = activeTab === "active" ? products : deletedProducts;

    return [
      { id: "all", name: "All Products", count: activeProducts.length },
      {
        id: "electronics",
        name: "Electronics",
        count: activeProducts.filter((p) => p.category === "electronics")
          .length,
      },
      {
        id: "clothing",
        name: "Clothing",
        count: activeProducts.filter((p) => p.category === "clothing").length,
      },
      {
        id: "accessories",
        name: "Accessories",
        count: activeProducts.filter((p) => p.category === "accessories")
          .length,
      },
      {
        id: "home",
        name: "Home & Garden",
        count: activeProducts.filter((p) => p.category === "home").length,
      },
      {
        id: "sports",
        name: "Sports",
        count: activeProducts.filter((p) => p.category === "sports").length,
      },
      {
        id: "beauty",
        name: "Beauty",
        count: activeProducts.filter((p) => p.category === "beauty").length,
      },
      {
        id: "books",
        name: "Books",
        count: activeProducts.filter((p) => p.category === "books").length,
      },
    ];
  }, [products, deletedProducts, activeTab]);

  // ============================================
  // FILTERED & SORTED PRODUCTS
  // ============================================

  const filteredAndSortedProducts = useMemo(() => {
    const activeProducts = activeTab === "active" ? products : deletedProducts;

    //==============================================
    // Filter
    //==============================================
    let filtered = activeProducts.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const productPrice = getProductPrice(product);
      const matchesPrice =
        productPrice >= priceRange[0] && productPrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    //===========================================
    // Sort
    //===========================================
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "popular":
          return (b.reviews?.length || 0) - (a.reviews?.length || 0);
        case "price-low":
          return getProductPrice(a) - getProductPrice(b);
        case "price-high":
          return getProductPrice(b) - getProductPrice(a);
        case "deleted-date":
          // For deleted products, sort by deletion date
          const aDeleted = new Date(a.deletedAt || a.updatedAt || a.createdAt);
          const bDeleted = new Date(b.deletedAt || b.updatedAt || b.createdAt);
          return bDeleted.getTime() - aDeleted.getTime();
        default:
          return 0;
      }
    });

    //=================================================
    //
    //=================================================

    return filtered;
  }, [
    products,
    deletedProducts,
    activeTab,
    searchQuery,
    selectedCategory,
    priceRange,
    sortBy,
  ]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleEditProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/products/${productId}/edit`);
  };

  // =================================================
  //
  //=================================================

  const handleDeleteProduct = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  // =================================================
  //
  //=================================================

  const handleRestoreProduct = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setRestoreDialogOpen(true);
  };

  const handlePermanentDelete = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setPermanentDeleteDialogOpen(true);
  };

  // ========================================================
  //  Handler comfirm to trash
  //=========================================================
  const handleConfirmDelete = async () => {
    if (!selectedProduct || !onDeleteProduct) return;

    setIsProcessing(true);
    try {
      await onDeleteProduct(selectedProduct.id);
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmRestore = async () => {
    if (!selectedProduct || !onRestoreProduct) return;

    setIsProcessing(true);
    try {
      await onRestoreProduct(selectedProduct.id);
      setRestoreDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error restoring product:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPermanentDelete = async () => {
    if (!selectedProduct || !onPermanentDelete) return;

    setIsProcessing(true);
    try {
      await onPermanentDelete(selectedProduct.id);
      setPermanentDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error permanently deleting product:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewProduct = (productId: string) => {
    if (activeTab === "active") {
      router.push(`/dashboard/products/${productId}`);
    }
  };

  const hasActiveSearch = searchQuery.trim() !== "";

  // ============================================
  // DIALOGS Deleted
  // ============================================

  const renderDeleteDialog = () => (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move to Trash</DialogTitle>
          <DialogDescription>
            Are you sure you want to move "{selectedProduct?.name}" to trash?
            This product will be archived and can be restored later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isProcessing}
          >
            {isProcessing ? "Moving..." : "Move to Trash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  //===================================================
  //
  //===================================================

  const renderRestoreDialog = () => (
    <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to restore "{selectedProduct?.name}"? The
            product will be moved back to active products.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setRestoreDialogOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmRestore} disabled={isProcessing}>
            {isProcessing ? "Restoring..." : "Restore Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  //=======================================================================
  //
  //=======================================================================
  const renderPermanentDeleteDialog = () => (
    <Dialog
      open={permanentDeleteDialogOpen}
      onOpenChange={setPermanentDeleteDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permanently Delete</DialogTitle>
          <DialogDescription className="text-destructive">
            Warning: This action cannot be undone. This will permanently delete
            "{selectedProduct?.name}" and all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPermanentDeleteDialogOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmPermanentDelete}
            disabled={isProcessing}
          >
            {isProcessing ? "Deleting..." : "Delete Forever"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">
          {productsLoading
            ? "Loading..."
            : hasActiveSearch
            ? `${filteredAndSortedProducts.length} results`
            : activeTab === "active"
            ? `${products.length} active products`
            : `${deletedProducts.length} deleted products`}
        </p>
      </div>

      {/* Search Info */}
      {hasActiveSearch && !productsLoading && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  Found {filteredAndSortedProducts.length}{" "}
                  {filteredAndSortedProducts.length === 1
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

      {/* Loading State */}
      {productsLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <LoadingSpinner />
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {productsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{productsError}</AlertDescription>
        </Alert>
      )}

      {/* Products */}
      {!productsLoading && !productsError && (
        <div className="space-y-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              {/* ================== */}
              <TabsTrigger value="active">
                Active Products
                <Badge variant="secondary" className="ml-2">
                  {products.length}
                </Badge>
              </TabsTrigger>

              {/* ================== */}
              <TabsTrigger value="deleted">
                <Archive className="w-4 h-4 mr-2" />
                Trash
                <Badge variant="secondary" className="ml-2">
                  {deletedProducts.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ============================================== */}
            {/* Filters Sidebar */}
            {/* ============================================== */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-0">
                {/* Categories */}
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
                            selectedCategory === cat.id ? "default" : "ghost"
                          }
                          className="w-full justify-between"
                          onClick={() => setSelectedCategory(cat.id)}
                        >
                          <span>{cat.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {cat.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* =========================================== */}
                {/* Price Range */}
                {/* ========================================== */}
                <Card>
                  <CardHeader>
                    <CardTitle>Price Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="10000"
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
                        <span className="font-semibold">${priceRange[0]}</span>
                        <span className="font-semibold">${priceRange[1]}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ================================================= */}
                {/* Deleted Info (only show in deleted tab) */}
                {/* ================================================= */}
                {activeTab === "deleted" && deletedProducts.length > 0 && (
                  <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-800 dark:text-amber-300">
                            Trash
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                            Deleted products are kept for 30 days before being
                            permanently removed.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* ==================================================== */}
            {/* Products Grid/List */}
            {/* ==================================================== */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTab === "active" ? (
                      <>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="deleted-date">
                          Recently Deleted
                        </SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Products Display */}
              {filteredAndSortedProducts.length > 0 ? (
                viewMode === "grid" ? (
                  // Grid View
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedProducts.map((product) => {
                      const price = getProductPrice(product);
                      const comparePrice = getComparePrice(product);
                      const discount = getDiscount(product);
                      const mainImage = getMainImage(product);

                      return (
                        <Card
                          key={product.id}
                          className={cn(
                            "group overflow-hidden hover:shadow-xl transition-all",
                            activeTab === "active" && "cursor-pointer",
                            activeTab === "deleted" && "border-dashed"
                          )}
                          onClick={() => {
                            if (activeTab === "active") {
                              handleViewProduct(product.id);
                            }
                          }}
                        >
                          <div className="relative h-48 bg-muted overflow-hidden">
                            <img
                              src={mainImage}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {discount && activeTab === "active" && (
                              <Badge
                                variant="destructive"
                                className="absolute top-3 right-3"
                              >
                                -{discount}%
                              </Badge>
                            )}
                            {activeTab === "deleted" && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Archive className="w-12 h-12 text-white/50" />
                              </div>
                            )}
                          </div>

                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-2">
                              {product.name}
                            </h3>

                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-lg font-bold">
                                ${price.toFixed(2)}
                              </span>
                              {comparePrice &&
                                comparePrice > price &&
                                activeTab === "active" && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    ${comparePrice.toFixed(2)}
                                  </span>
                                )}
                            </div>

                            {activeTab === "deleted" && (
                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground">
                                  Deleted:{" "}
                                  {formatDeletedDate(product.deletedAt)}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              {activeTab === "active" ? (
                                <>
                                  {/* =============================== */}
                                  {/* deleted */}
                                  {/* =============================== */}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewProduct(product.id);
                                    }}
                                  >
                                    View
                                  </Button>

                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={(e) =>
                                      handleEditProduct(product.id, e)
                                    }
                                  >
                                    {/* =============================== */}
                                    {/* edited */}
                                    {/* =============================== */}
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                  {/* =============================== */}
                                  {/* deleted */}
                                  {/* =============================== */}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="px-3"
                                    onClick={(e) =>
                                      handleDeleteProduct(product, e)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={(e) =>
                                      handleRestoreProduct(product, e)
                                    }
                                  >
                                    <ArchiveRestore className="w-4 h-4 mr-2" />
                                    Restore
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={(e) =>
                                      handlePermanentDelete(product, e)
                                    }
                                  >
                                    <Trash className="w-4 h-4 mr-2" />
                                    Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  // List View
                  <Card>
                    <CardContent className="p-0">
                      {filteredAndSortedProducts.map((product, index) => {
                        const price = getProductPrice(product);
                        const comparePrice = getComparePrice(product);
                        const mainImage = getMainImage(product);

                        return (
                          <div
                            key={product.id}
                            className={cn(
                              "p-4 flex gap-4 hover:bg-muted transition",
                              index !== filteredAndSortedProducts.length - 1 &&
                                "border-b",
                              activeTab === "active" && "cursor-pointer",
                              activeTab === "deleted" && "opacity-70"
                            )}
                            onClick={() => {
                              if (activeTab === "active") {
                                handleViewProduct(product.id);
                              }
                            }}
                          >
                            <div className="relative">
                              <img
                                src={mainImage}
                                alt={product.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              {activeTab === "deleted" && (
                                <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                                  <Archive className="w-6 h-6 text-white/50" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{product.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <span>${price.toFixed(2)}</span>
                                {comparePrice &&
                                  comparePrice > price &&
                                  activeTab === "active" && (
                                    <>
                                      <span>•</span>
                                      <span className="line-through">
                                        ${comparePrice.toFixed(2)}
                                      </span>
                                    </>
                                  )}
                                {activeTab === "deleted" && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      Deleted{" "}
                                      {formatDeletedDate(product.deletedAt)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={getStatusColor(
                                  activeTab === "deleted"
                                    ? "DELETED"
                                    : product.status
                                )}
                              >
                                {activeTab === "deleted"
                                  ? "Deleted"
                                  : product.status}
                              </Badge>
                              {activeTab === "active" ? (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) =>
                                      handleEditProduct(product.id, e)
                                    }
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={(e) =>
                                      handleDeleteProduct(product, e)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) =>
                                      handleRestoreProduct(product, e)
                                    }
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={(e) =>
                                      handlePermanentDelete(product, e)
                                    }
                                  >
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )
              ) : (
                // ======================================================
                // Empty State
                // =======================================================
                <Card>
                  <CardContent className="text-center py-12">
                    {activeTab === "deleted" ? (
                      <>
                        <Archive className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold mb-2">
                          Trash is empty
                        </p>
                        <p className="text-muted-foreground mb-4">
                          No deleted products found
                        </p>
                        <Button onClick={() => setActiveTab("active")}>
                          View Active Products
                        </Button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* Dialogs */}
      {/* =========================================================== */}
      {renderDeleteDialog()}
      {renderRestoreDialog()}
      {renderPermanentDeleteDialog()}
    </div>
  );
};
