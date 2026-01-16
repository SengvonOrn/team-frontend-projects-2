// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   Edit,
//   Trash2,
//   Package,
//   DollarSign,
//   Tag,
//   Calendar,
//   ShoppingCart,
//   Star,
//   MoreVertical,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Separator } from "@/components/ui/separator";

// import Image from "next/image";
// import { Product } from "@/types/types";
// import { deleteProductAction } from "@/lib/action/products";

// interface ProductDetailsProps {
//   product: Product;
// }

// export const ProductDetails = ({ product }: ProductDetailsProps) => {
//   const router = useRouter();
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true);
//       await deleteProductAction(product.id);
//       router.push("/dashboard/products");
//       router.refresh();
//     } catch (error) {
//       console.error("Failed to delete product:", error);
//     } finally {
//       setIsDeleting(false);
//       setIsDeleteDialogOpen(false);
//     }
//   };

//   const statusColors = {
//     ACTIVE: "bg-green-100 text-green-800",
//     DRAFT: "bg-gray-100 text-gray-800",
//     ARCHIVED: "bg-red-100 text-red-800",
//     OUT_OF_STOCK: "bg-orange-100 text-orange-800",
//   };

//   const mainImage = product.image?.find((img) => img.imageType === "MAIN");
//   const galleryImages = product.images?.filter(
//     (img) => img.imageType === "GALLERY"
//   );
//   const totalStock =
//     product.variants?.reduce(
//       (sum, v) => sum + (v.inventory?.quantityInStock || 0),
//       0
//     ) || 0;
//   const averageRating = product.reviews?.length
//     ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
//       product.reviews.length
//     : 0;

//   return (
//     <>
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon" onClick={() => router.back()}>
//             <ArrowLeft className="w-5 h-5" />
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold">{product.name}</h1>
//             <p className="text-muted-foreground">SKU: {product.sku || "N/A"}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Badge className={statusColors[product.status]}>
//             {product.status}
//           </Badge>

//           <Button
//             variant="outline"
//             onClick={() =>
//               router.push(`/dashboard/products/${product.id}/edit`)
//             }
//           >
//             <Edit className="w-4 h-4 mr-2" />
//             Edit
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="icon">
//                 <MoreVertical className="w-4 h-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem
//                 className="text-red-600"
//                 onClick={() => setIsDeleteDialogOpen(true)}
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Delete Product
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Images */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Product Images</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {mainImage && (
//                 <div className="relative aspect-video rounded-lg overflow-hidden border">
//                   <Image
//                     src={mainImage.imageUrl}
//                     alt={product.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               )}

//               {galleryImages && galleryImages.length > 0 && (
//                 <div className="grid grid-cols-4 gap-4">
//                   {galleryImages.map((image) => (
//                     <div
//                       key={image.id}
//                       className="relative aspect-square rounded-lg overflow-hidden border"
//                     >
//                       <Image
//                         src={image.imageUrl}
//                         alt={product.name}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {!mainImage && (!galleryImages || galleryImages.length === 0) && (
//                 <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
//                   <div className="text-center">
//                     <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
//                     <p className="text-muted-foreground">No images available</p>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Description */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Description</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground whitespace-pre-wrap">
//                 {product.description}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Variants */}
//           {product.variants && product.variants.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Variants</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {product.variants.map((variant) => (
//                     <div
//                       key={variant.id}
//                       className="flex items-center justify-between p-4 border rounded-lg"
//                     >
//                       <div>
//                         <p className="font-medium">{variant.name}</p>
//                         <p className="text-sm text-muted-foreground">
//                           SKU: {variant.sku || "N/A"}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold">
//                           {formatPrice(variant.price)}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           Stock: {variant.inventory?.quantityInStock || 0}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Reviews */}
//           {product.reviews && product.reviews.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Reviews</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {product.reviews.map((review) => (
//                     <div
//                       key={review.id}
//                       className="border-b pb-4 last:border-0"
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         <div className="flex items-center">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <Star
//                               key={i}
//                               className={`w-4 h-4 ${
//                                 i < review.rating
//                                   ? "fill-yellow-400 text-yellow-400"
//                                   : "text-gray-300"
//                               }`}
//                             />
//                           ))}
//                         </div>
//                         <span className="font-medium">{review.user.name}</span>
//                       </div>
//                       {review.title && (
//                         <p className="font-medium mb-1">{review.title}</p>
//                       )}
//                       {review.comment && (
//                         <p className="text-sm text-muted-foreground">
//                           {review.comment}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Quick Stats */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Stats</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <DollarSign className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">Price</span>
//                 </div>
//                 <span className="font-semibold">
//                   {formatPrice(product.price)}
//                 </span>
//               </div>

//               {product.compareAtPrice && (
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">
//                     Compare Price
//                   </span>
//                   <span className="text-sm line-through text-muted-foreground">
//                     {formatPrice(product.compareAtPrice)}
//                   </span>
//                 </div>
//               )}

//               <Separator />

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Package className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">Stock</span>
//                 </div>
//                 <span className="font-semibold">{totalStock}</span>
//               </div>

//               {averageRating > 0 && (
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Star className="w-4 h-4 text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">
//                       Rating
//                     </span>
//                   </div>
//                   <span className="font-semibold">
//                     {averageRating.toFixed(1)} / 5.0
//                   </span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Product Info */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Product Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div>
//                 <p className="text-sm text-muted-foreground">Category</p>
//                 <p className="font-medium">{product.category}</p>
//               </div>

//               {product.brand && (
//                 <div>
//                   <p className="text-sm text-muted-foreground">Brand</p>
//                   <p className="font-medium">{product.brand}</p>
//                 </div>
//               )}

//               {product.tags && product.tags.length > 0 && (
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-2">Tags</p>
//                   <div className="flex flex-wrap gap-2">
//                     {product.tags.map((tag, index) => (
//                       <Badge key={index} variant="secondary">
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <Separator />

//               <div>
//                 <p className="text-sm text-muted-foreground">Created</p>
//                 <p className="text-sm">
//                   {formmatDateTime(product.createdAt).dateTime}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-sm text-muted-foreground">Last Updated</p>
//                 <p className="text-sm">
//                   {formmatDateTime(product.updatedAt).dateTime}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Store Info */}
//           {product.store && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Store</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="font-medium">{product.store.name}</p>
//                 <Button
//                   variant="link"
//                   className="px-0"
//                   onClick={() =>
//                     router.push(`/dashboard/stores/${product.store?.id}`)
//                   }
//                 >
//                   View Store
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog
//         open={isDeleteDialogOpen}
//         onOpenChange={setIsDeleteDialogOpen}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete "{product.name}" and all associated
//               data. This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               {isDeleting ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// };
