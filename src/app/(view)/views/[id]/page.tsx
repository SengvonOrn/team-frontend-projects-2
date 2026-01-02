// "use client";
// import { useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { useCart } from "@/context/cart/CartContext";
// import { productsData } from "@/constants/productsData";
// import { Home, Star, Heart, Share2 } from "lucide-react";
// import { Header } from "@/components/navbar-hover";

// export default function ProductDetailPage() {
//   const params = useParams();
//   const productId = Number(params.id);
//   const product = productsData.find((p) => p.id === productId);
//   const { addToCart } = useCart();

//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedVariations, setSelectedVariations] = useState({
//     screenSize: product?.variations?.screenSize?.[0] || null,
//     resolution: product?.variations?.resolution?.[0] || null,
//   });
//   const [showZoom, setShowZoom] = useState(false);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

//   if (!product) {
//     return (
//       <>
//         <Header />
//         <div className="container mx-auto px-4 py-12 text-center min-h-screen">
//           <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
//           <Link href="/" className="text-orange-500 underline">
//             Return to Home
//           </Link>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   const images = product.images || [product.image];

//   const renderStars = (rating: number) => {
//     return [...Array(5)].map((_, i) => (
//       <Star
//         key={i}
//         className={`w-4 h-4 ${
//           i < Math.floor(rating)
//             ? "fill-orange-400 text-orange-400"
//             : "text-gray-300 dark:text-gray-600"
//         }`}
//       />
//     ));
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width) * 100;
//     const y = ((e.clientY - rect.top) / rect.height) * 100;
//     setZoomPosition({ x, y });
//   };

//   const handleMouseEnter = () => setShowZoom(true);
//   const handleMouseLeave = () => setShowZoom(false);

//   return (
//     <>
//       {/* <Header /> */}
//       <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
//         <div className="container mx-auto px-4 py-6">
//           {/* Breadcrumb */}
//           <div className="flex items-center gap-2 text-sm mb-6 text-gray-600 dark:text-gray-400">
//             <Link
//               href="/"
//               className="hover:text-orange-500 dark:hover:text-orange-400"
//             >
//               Consumer Electronics
//             </Link>
//             <span>›</span>
//             <Link
//               href="/views"
//               className="hover:text-orange-500 dark:hover:text-orange-400"
//             >
//               Computer hardware software
//             </Link>
//             <span>›</span>
//             <Link
//               href="/views"
//               className="hover:text-orange-500 dark:hover:text-orange-400"
//             >
//               Monitor
//             </Link>
//             <span>›</span>
//             <span className="text-gray-900 dark:text-gray-100 font-medium">
//               {product.name}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//             {/* Left Side - Images */}
//             <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
//               <div className="flex gap-4">
//                 {/* Vertical Thumbnails */}
//                 {images.length > 1 && (
//                   <div className="flex flex-col gap-2">
//                     {images.map((img, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => setSelectedImage(idx)}
//                         className={`w-20 h-20 border-2 rounded overflow-hidden transition-all flex-shrink-0 ${
//                           selectedImage === idx
//                             ? "border-blue-500 dark:border-blue-400"
//                             : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
//                         }`}
//                       >
//                         <img
//                           src={img}
//                           alt=""
//                           className="w-full h-full object-cover"
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 )}

//                 {/* Main Image with Zoom */}
//                 <div className="flex-1 relative">
//                   <div
//                     className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden cursor-crosshair"
//                     onMouseMove={handleMouseMove}
//                     onMouseEnter={handleMouseEnter}
//                     onMouseLeave={handleMouseLeave}
//                   >
//                     <img
//                       src={images[selectedImage]}
//                       alt={product.name}
//                       className="w-full h-[500px] object-contain"
//                     />
//                     {showZoom && (
//                       <div className="absolute inset-0 pointer-events-none">
//                         <div
//                           className="absolute w-32 h-32 border-2 border-orange-500 bg-white/20"
//                           style={{
//                             left: `${zoomPosition.x}%`,
//                             top: `${zoomPosition.y}%`,
//                             transform: "translate(-50%, -50%)",
//                           }}
//                         />
//                       </div>
//                     )}
//                     <button className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 z-10">
//                       <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                     </button>
//                     <button className="absolute top-4 right-16 bg-white dark:bg-gray-800 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 z-10">
//                       <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                     </button>
//                   </div>

//                   {/* Zoomed Image Panel - Amazon Style */}
//                   {showZoom && (
//                     <div className="absolute left-full top-0 ml-4 w-[500px] h-[500px] border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-white dark:bg-gray-800 z-50 hidden xl:block">
//                       <div
//                         className="w-full h-full bg-cover bg-no-repeat"
//                         style={{
//                           backgroundImage: `url(${images[selectedImage]})`,
//                           backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
//                           backgroundSize: "250%",
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Tabs below image */}
//               <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
//                 <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
//                   <button className="pb-2 px-4 border-b-2 border-orange-500 dark:border-orange-400 font-medium text-orange-500 dark:text-orange-400">
//                     Video
//                   </button>
//                   <button className="pb-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
//                     Photos
//                   </button>
//                   <button className="pb-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
//                     Attributes
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side - Product Details */}
//             <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
//               {/* Shipping Badge */}
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950 px-3 py-2 rounded border border-orange-100 dark:border-orange-900">
//                   <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">
//                     🚚 FREE Shipping
//                   </span>
//                   <span className="text-gray-600 dark:text-gray-400 text-sm">
//                     Capped at $20 on $20+ order
//                   </span>
//                 </div>
//                 <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">
//                   ⏱ 6 days
//                 </span>
//               </div>

//               <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
//                 {product.name}
//               </h1>

//               {/* Description */}
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
//                   Products Description <span className="text-red-500">*</span>
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
//                   {product.description}
//                 </p>
//               </div>

//               {/* Rating */}
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="flex items-center gap-1">
//                   {renderStars(product.rating)}
//                 </div>
//                 <span className="font-semibold text-gray-900 dark:text-gray-100">
//                   {product.rating}
//                 </span>
//                 <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-sm">
//                   ({product.reviews} reviews)
//                 </span>
//                 <span className="text-gray-600 dark:text-gray-400 text-sm">
//                   · {product.sold}
//                 </span>
//               </div>

//               {/* Price */}
//               <div className="mb-6">
//                 <div className="flex items-baseline gap-3">
//                   <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
//                     ${product.price.toFixed(0)}-
//                     {(product.price + 25).toFixed(0)}
//                   </span>
//                   {product.discount && (
//                     <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
//                       ${product.discount} off
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Quantity */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-4">
//                   <span className="font-medium text-gray-700 dark:text-gray-300">
//                     Number Quality :
//                   </span>
//                   <div className="flex items-center">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="w-10 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium"
//                     >
//                       −
//                     </button>
//                     <span className="mx-4 font-semibold text-lg min-w-[30px] text-center text-gray-900 dark:text-gray-100">
//                       {quantity < 10 ? `0${quantity}` : quantity}
//                     </span>
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       className="w-10 h-10 border-2 border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 rounded-full flex items-center justify-center hover:bg-orange-50 dark:hover:bg-orange-950 font-medium"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Add to Cart Button */}
//               <Button
//                 onClick={() =>
//                   addToCart({
//                     id: product.id,
//                     name: product.name,
//                     price: product.price,
//                   })
//                 }
//                 className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-4 text-base font-semibold rounded-lg mb-6"
//               >
//                 Add card
//               </Button>

//               {/* Variations */}
//               <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
//                     Variations :
//                   </h3>
//                   <button className="text-orange-500 dark:text-orange-400 text-sm font-medium hover:underline">
//                     Select now
//                   </button>
//                 </div>

//                 {product.variations?.screenSize && (
//                   <div className="mb-4">
//                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                       model number: OEM
//                     </p>
//                     <div className="flex gap-2 flex-wrap mb-4">
//                       <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
//                         OEM
//                       </button>
//                     </div>

//                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                       Screen size
//                     </p>
//                     <div className="flex gap-2 flex-wrap">
//                       {product.variations.screenSize.map((size) => (
//                         <button
//                           key={size}
//                           onClick={() =>
//                             setSelectedVariations({
//                               ...selectedVariations,
//                               screenSize: size,
//                             })
//                           }
//                           className={`px-4 py-2 border rounded text-sm font-medium transition-all ${
//                             selectedVariations.screenSize === size
//                               ? "border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950"
//                               : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
//                           }`}
//                         >
//                           {size}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {product.variations?.resolution && (
//                   <div className="mb-4">
//                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                       Resolution
//                     </p>
//                     <div className="flex gap-2 flex-wrap">
//                       {product.variations.resolution.map((res) => (
//                         <button
//                           key={res}
//                           onClick={() =>
//                             setSelectedVariations({
//                               ...selectedVariations,
//                               resolution: res,
//                             })
//                           }
//                           className={`px-4 py-2 border rounded text-sm font-medium transition-all ${
//                             selectedVariations.resolution === res
//                               ? "border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950"
//                               : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
//                           }`}
//                         >
//                           {res}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Seller Info */}
//               {product.seller && (
//                 <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
//                         <span className="text-gray-600 dark:text-gray-400 font-bold text-sm">
//                           {product.seller.name.substring(0, 2).toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h3 className="font-semibold text-gray-900 dark:text-gray-100">
//                             {product.seller.name}
//                           </h3>
//                           {product.seller.verified && (
//                             <span className="text-blue-500 dark:text-blue-400">
//                               ✓
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           📍 {product.seller.location}
//                         </p>
//                       </div>
//                     </div>
//                     <Button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white text-sm px-6 rounded-full">
//                       Followe
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Bottom Section - Reviews/Supplier/Discussion tabs */}
//           <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
//             <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800">
//               <button className="pb-3 font-medium text-gray-400 dark:text-gray-500">
//                 Products review
//               </button>
//               <button className="pb-3 font-medium border-b-2 border-orange-500 dark:border-orange-400 text-gray-900 dark:text-gray-100">
//                 Store review
//               </button>
//               <button className="pb-3 font-medium text-gray-400 dark:text-gray-500">
//                 Supplier
//               </button>
//               <button className="pb-3 font-medium text-gray-400 dark:text-gray-500">
//                 Discussion
//               </button>
//             </div>

//             {/* Seller Performance */}
//             {product.seller && product.seller.totalReviews && (
//               <div className="mt-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded flex items-center justify-center">
//                       <span className="text-blue-600 dark:text-blue-400 text-xl">
//                         🏪
//                       </span>
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-semibold text-gray-900 dark:text-gray-100">
//                           {product.seller.name}
//                         </h3>
//                         <span className="text-blue-500 dark:text-blue-400">
//                           ✓
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         📍 Located in {product.seller.location}
//                       </p>
//                     </div>
//                   </div>
//                   <Button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white text-sm px-6 rounded">
//                     Followe
//                   </Button>
//                 </div>

//                 <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
//                   Top Performance
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//                   Performance arrage of store 🎯
//                 </p>

//                 <div className="grid grid-cols-3 gap-4 mb-6">
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
//                       Total Reviews
//                     </p>
//                     <div className="flex items-baseline gap-2">
//                       <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                         {product.seller.totalReviews}
//                       </p>
//                       <span className="text-green-500 dark:text-green-400 text-sm flex items-center">
//                         ↑ 12%
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
//                       Growth on review in this year
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
//                       Average Ratting
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                         {product.seller.averageRating}
//                       </p>
//                       <div className="flex">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
//                       Average Ratting in this year
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
//                       On-time delivery rate
//                     </p>
//                     <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                       {product.seller.onTimeDelivery}
//                     </p>
//                     <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
//                       Average Ratting in this year
//                     </p>
//                   </div>
//                 </div>

//                 {/* Customer Review */}
//                 <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-start gap-3">
//                       <div className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
//                         R
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-semibold text-gray-900 dark:text-gray-100">
//                             R***n
//                           </span>
//                           <span className="text-sm text-gray-500 dark:text-gray-400">
//                             Dec 15, 2024
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 mb-2">
//                           <img
//                             src="https://flagcdn.com/w20/kh.png"
//                             alt="Cambodia"
//                             className="w-4 h-3"
//                           />
//                           <span className="text-xs text-gray-600 dark:text-gray-400">
//                             Cambodia
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 mb-2">
//                           <span className="text-xs bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-2 py-0.5 rounded border border-green-100 dark:border-green-900">
//                             ✓ Verified purchase
//                           </span>
//                           <div className="flex">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className="w-3 h-3 fill-orange-400 text-orange-400"
//                               />
//                             ))}
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//                           <span className="font-medium">Color:</span> Silver
//                           steel +Silver silicone
//                         </p>
//                         <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
//                           Le produit est de bonne qualité et il répond aux
//                           attentes....je suis très satisfait...
//                         </p>
//                         <div className="flex gap-2">
//                           <div className="relative w-16 h-16 overflow-hidden rounded border border-gray-200 dark:border-gray-700 group cursor-pointer">
//                             <img
//                               src={product.image}
//                               alt="Review"
//                               className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-150"
//                             />
//                           </div>
//                           <div className="relative w-16 h-16 overflow-hidden rounded border border-gray-200 dark:border-gray-700 group cursor-pointer">
//                             <img
//                               src={product.image}
//                               alt="Review"
//                               className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-150"
//                             />
//                           </div>
//                           <div className="relative w-16 h-16 overflow-hidden rounded border border-gray-200 dark:border-gray-700 group cursor-pointer">
//                             <img
//                               src={product.image}
//                               alt="Review"
//                               className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-150"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400">
//                     <button className="hover:text-gray-700 dark:hover:text-gray-300">
//                       👍 Helpful 1
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Store Recommendations */}
//           <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
//                 Store recommendations for you
//               </h2>
//               <div className="flex gap-2">
//                 <button className="w-8 h-8 border border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
//                   ‹
//                 </button>
//                 <button className="w-8 h-8 border border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
//                   ›
//                 </button>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {productsData.slice(0, 5).map((item) => (
//                 <Link key={item.id} href={`/product/${item.id}`}>
//                   <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/30 transition-shadow cursor-pointer bg-white dark:bg-gray-800 group">
//                     <div className="overflow-hidden">
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-full h-40 object-cover transition-transform duration-300 ease-out group-hover:scale-110"
//                       />
//                     </div>
//                     <div className="p-3">
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
//                         {item.name}
//                       </p>
//                       <div className="flex items-baseline gap-2">
//                         <span className="font-bold text-orange-600 dark:text-orange-400">
//                           ${item.price}
//                         </span>
//                         {item.originalPrice && (
//                           <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
//                             ${item.originalPrice}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Top Sales in Store */}
//           <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
//                   Top Sales in store
//                 </h2>
//                 <span className="text-red-500 text-2xl">🔥</span>
//               </div>
//               <button className="text-orange-500 dark:text-orange-400 text-sm hover:underline">
//                 Pull-view →
//               </button>
//             </div>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               Navigate trends with care driven carts
//             </p>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//               {productsData.slice(0, 6).map((item) => (
//                 <Link key={item.id} href={`/product/${item.id}`}>
//                   <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/30 transition-shadow cursor-pointer bg-white dark:bg-gray-800 group">
//                     <div className="overflow-hidden">
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-full h-32 object-cover transition-transform duration-300 ease-out group-hover:scale-110"
//                       />
//                     </div>
//                     <div className="p-3">
//                       <div className="flex items-baseline gap-2 mb-1">
//                         <span className="font-bold text-red-600 dark:text-red-400">
//                           ${item.price}
//                         </span>
//                         {item.originalPrice && (
//                           <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
//                             ${item.originalPrice}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Products Stock */}
//           <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
//             <div className="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
//                 Products stock
//               </h2>
//               <div className="flex gap-2">
//                 <button className="px-4 py-1.5 text-sm border-b-2 border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 font-medium">
//                   All
//                 </button>
//                 <button className="px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
//                   Chain
//                 </button>
//                 <button className="px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
//                   Smart watch
//                 </button>
//                 <button className="px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
//                   Computer
//                 </button>
//                 <button className="px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
//                   Accessories
//                 </button>
//                 <button className="px-4 py-1.5 text-sm text-red-500 dark:text-red-400 font-medium">
//                   New Arrived
//                 </button>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//               {productsData.slice(0, 12).map((item) => (
//                 <Link key={item.id} href={`/product/${item.id}`}>
//                   <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/30 transition-shadow cursor-pointer bg-white dark:bg-gray-800 group">
//                     <div className="overflow-hidden">
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-full h-40 object-cover transition-transform duration-300 ease-out group-hover:scale-110"
//                       />
//                     </div>
//                     <div className="p-3">
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 h-10">
//                         {item.name}
//                       </p>
//                       <div className="flex items-baseline gap-2">
//                         <span className="font-bold text-gray-900 dark:text-gray-100">
//                           ${item.price}
//                         </span>
//                         {item.originalPrice && (
//                           <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
//                             ${item.originalPrice}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }
"use client";
import React, { useState } from "react";
import {
  Star,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Send,
  Upload,
  X,
} from "lucide-react";

// Type definitions
interface Comment {
  id: number;
  user: string;
  avatar: string;
  country: string;
  date: string;
  rating: number;
  verified: boolean;
  color: string;
  comment: string;
  images: string[];
  helpful: number;
}

interface HelpfulClicks {
  [key: number]: number;
}

// Mock product data
const productData = {
  id: 1,
  name: "27-inch 4K Ultra HD Monitor",
  description:
    "Professional grade monitor with stunning 4K resolution, HDR support, and ultra-thin bezels. Perfect for gaming, design work, and entertainment.",
  price: 299,
  originalPrice: 399,
  discount: 100,
  rating: 4.8,
  reviews: 1234,
  sold: "5.2k sold",
  image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
  images: [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800",
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800",
  ],
  variations: {
    screenSize: ["24 inch", "27 inch", "32 inch"],
    resolution: ["1920x1080", "2560x1440", "3840x2160"],
  },
  seller: {
    name: "jain Zhobo Co., Ltd-CN",
    verified: true,
    location: "Guangdong, China",
    totalReviews: 15234,
    averageRating: 4.9,
    onTimeDelivery: "98%",
    followers: 45600,
  },
};

const mockComments: Comment[] = [
  {
    id: 1,
    user: "R***n",
    avatar: "R",
    country: "🇰🇭",
    date: "Dec 15, 2024",
    rating: 5,
    verified: true,
    color: "Silver steel +Silver silicone",
    comment:
      "Le produit est de bonne qualité et il répond aux attentes....je suis très satisfait...",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=200",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200",
    ],
    helpful: 1,
  },
  {
    id: 2,
    user: "Sarah M.",
    avatar: "SM",
    country: "🇬🇧",
    date: "Dec 10, 2024",
    rating: 5,
    verified: true,
    color: "32 inch, 4K",
    comment:
      "Perfect for gaming and work. Colors are vibrant and the refresh rate is smooth. Setup was easy.",
    images: [],
    helpful: 8,
  },
];

const relatedProducts = [
  {
    id: 2,
    name: "Gaming Keyboard RGB",
    price: 79,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
  },
  {
    id: 3,
    name: "Wireless Mouse Pro",
    price: 45,
    originalPrice: 65,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
  },
  {
    id: 4,
    name: "USB-C Hub Adapter",
    price: 35,
    originalPrice: 50,
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
  },
  {
    id: 5,
    name: "Webcam 1080p HD",
    price: 65,
    originalPrice: 95,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400",
  },
  {
    id: 6,
    name: "Monitor Stand Arm",
    price: 55,
    originalPrice: 80,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400",
  },
];

export default function ProductDetailPage() {
  const [currentProduct, setCurrentProduct] = useState(productData);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState({
    screenSize: "27 inch",
    resolution: "3840x2160",
  });
  const [activeTab, setActiveTab] = useState("video");
  const [activeBottomTab, setActiveBottomTab] = useState("store");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [helpfulClicks, setHelpfulClicks] = useState<HelpfulClicks>({});
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const renderStars = (
    rating: number,
    interactive = false,
    onClick?: (rating: number) => void
  ) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          interactive
            ? "cursor-pointer hover:scale-110 transition-transform"
            : ""
        } ${
          i < Math.floor(rating)
            ? "fill-orange-400 text-orange-400"
            : "text-gray-300"
        }`}
        onClick={() => interactive && onClick && onClick(i + 1)}
      />
    ));
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    alert(
      isFollowing
        ? "✓ Unfollowed seller successfully!"
        : "✓ Now following this seller!"
    );
  };

  const handleHelpfulClick = (commentId: number) => {
    setHelpfulClicks((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setUploadedImages((prev) => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: comments.length + 1,
        user: "You",
        avatar: "Y",
        country: "🇰🇭",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        rating: newCommentRating,
        verified: true,
        color: `${selectedVariations.screenSize}, ${selectedVariations.resolution}`,
        comment: newComment,
        images: uploadedImages,
        helpful: 0,
      };

      setComments([newCommentObj, ...comments]);
      setNewComment("");
      setNewCommentRating(5);
      setUploadedImages([]);
      alert("✓ Review submitted successfully!");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => setShowZoom(false);

  const handleProductClick = (productId: number) => {
    // Simulate loading a different product
    const newProduct = {
      ...productData,
      id: productId,
      name:
        relatedProducts.find((p) => p.id === productId)?.name ||
        productData.name,
      image:
        relatedProducts.find((p) => p.id === productId)?.image ||
        productData.image,
      images: [
        relatedProducts.find((p) => p.id === productId)?.image ||
          productData.image,
        relatedProducts.find((p) => p.id === productId)?.image ||
          productData.image,
        relatedProducts.find((p) => p.id === productId)?.image ||
          productData.image,
      ],
      price:
        relatedProducts.find((p) => p.id === productId)?.price ||
        productData.price,
      originalPrice:
        relatedProducts.find((p) => p.id === productId)?.originalPrice ||
        productData.originalPrice,
    };

    setCurrentProduct(newProduct);
    setSelectedImage(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, 1);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6 text-gray-400">
          <a href="/" className="hover:text-orange-500">
            Consumer Electronics
          </a>
          <span>›</span>
          <a href="/products" className="hover:text-orange-500">
            Computer hardware software
          </a>
          <span>›</span>
          <a href="/monitors" className="hover:text-orange-500">
            Monitor
          </a>
          <span>›</span>
          <span className="text-gray-200">{currentProduct.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left - Image Gallery */}
          <div className="lg:col-span-7 bg-[#0f2744] rounded-lg p-6 border border-gray-800">
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2">
                {currentProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 border-2 rounded overflow-hidden transition-all ${
                      selectedImage === idx
                        ? "border-orange-500"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 relative">
                <div
                  className="bg-gray-900 rounded-lg overflow-hidden cursor-crosshair relative"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={currentProduct.images[selectedImage]}
                    alt={currentProduct.name}
                    className="w-full h-[500px] object-contain"
                  />
                  {showZoom && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div
                        className="absolute w-32 h-32 border-2 border-orange-500 bg-white/20"
                        style={{
                          left: `${zoomPosition.x}%`,
                          top: `${zoomPosition.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </div>
                  )}
                  <button className="absolute top-4 right-4 bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 z-10">
                    <Heart className="w-5 h-5 text-gray-300" />
                  </button>
                  <button className="absolute top-4 right-16 bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 z-10">
                    <Share2 className="w-5 h-5 text-gray-300" />
                  </button>
                </div>

                {/* Zoomed Image Panel - Amazon Style */}
                {showZoom && (
                  <div className="absolute left-full top-0 ml-4 w-[500px] h-[500px] border-2 border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-gray-800 z-50 hidden xl:block">
                    <div
                      className="w-full h-full bg-cover bg-no-repeat"
                      style={{
                        backgroundImage: `url(${currentProduct.images[selectedImage]})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: "250%",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tabs below image */}
            <div className="mt-6 border-t border-gray-800 pt-4">
              <div className="flex gap-6 border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("video")}
                  className={`pb-3 px-4 font-medium ${
                    activeTab === "video"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Video
                </button>
                <button
                  onClick={() => setActiveTab("photos")}
                  className={`pb-3 px-4 font-medium ${
                    activeTab === "photos"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setActiveTab("attributes")}
                  className={`pb-3 px-4 font-medium ${
                    activeTab === "attributes"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Attributes
                </button>
              </div>
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="lg:col-span-5 bg-[#0f2744] rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-2 rounded mb-4 text-sm border border-orange-500/30">
              <span className="text-orange-500 font-medium">
                🚚 FREE Shipping
              </span>
              <span className="text-gray-400">Capped at $20 on $20+ order</span>
              <span className="ml-auto text-orange-500">⏱ 6 days</span>
            </div>

            <h1 className="text-2xl font-bold mb-3 text-white">
              {currentProduct.name}
            </h1>

            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-white">
                Products Description <span className="text-red-500">*</span>
              </h3>
              <p className="text-gray-400 text-sm">
                {currentProduct.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">{renderStars(currentProduct.rating)}</div>
              <span className="font-semibold text-white">
                {currentProduct.rating}
              </span>
              <button
                onClick={() => setActiveBottomTab("store")}
                className="text-blue-400 hover:underline text-sm"
              >
                ({currentProduct.reviews} reviews)
              </button>
              <span className="text-gray-400 text-sm">
                · {currentProduct.sold}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-orange-500">
                  ${currentProduct.price}-{currentProduct.price + 25}
                </span>
                {currentProduct.discount && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    ${currentProduct.discount} off
                  </span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-300">
                  Number Quality :
                </span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 text-gray-300"
                  >
                    −
                  </button>
                  <span className="mx-4 font-semibold text-lg min-w-[30px] text-center text-white">
                    {quantity < 10 ? `0${quantity}` : quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-orange-500 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-500/10"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-base font-semibold rounded-lg mb-6">
              Add card
            </button>

            {/* Variations */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-white">
                  Variations :
                </h3>
                <button className="text-orange-500 text-sm font-medium hover:underline">
                  Select now
                </button>
              </div>

              <p className="text-sm font-medium mb-3 text-gray-300">
                model number: OEM
              </p>
              <div className="flex gap-2 flex-wrap mb-4">
                <button className="px-4 py-2 border border-gray-700 rounded text-sm text-gray-300 bg-gray-800">
                  OEM
                </button>
              </div>

              <p className="text-sm font-medium mb-3 text-gray-300">
                Screen size
              </p>
              <div className="flex gap-2 flex-wrap mb-4">
                {currentProduct.variations.screenSize.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedVariations({
                        ...selectedVariations,
                        screenSize: size,
                      })
                    }
                    className={`px-4 py-2 border rounded text-sm font-medium transition-all ${
                      selectedVariations.screenSize === size
                        ? "border-orange-500 text-orange-500 bg-orange-500/10"
                        : "border-gray-700 hover:border-gray-600 text-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <p className="text-sm font-medium mb-3 text-gray-300">
                Resolution
              </p>
              <div className="flex gap-2 flex-wrap">
                {currentProduct.variations.resolution.map((res) => (
                  <button
                    key={res}
                    onClick={() =>
                      setSelectedVariations({
                        ...selectedVariations,
                        resolution: res,
                      })
                    }
                    className={`px-4 py-2 border rounded text-sm font-medium transition-all ${
                      selectedVariations.resolution === res
                        ? "border-orange-500 text-orange-500 bg-orange-500/10"
                        : "border-gray-700 hover:border-gray-600 text-gray-300"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Seller Info */}
            <div className="border-t border-gray-800 pt-6 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 font-bold text-sm">
                      {productData.seller.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">
                        {productData.seller.name}
                      </h3>
                      {productData.seller.verified && (
                        <span className="text-blue-400">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      📍 {productData.seller.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    isFollowing
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {isFollowing ? "Following" : "Followe"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabs Section */}
        <div className="mt-6 bg-[#0f2744] rounded-lg p-6 border border-gray-800">
          <div className="flex gap-6 border-b border-gray-800">
            <button
              onClick={() => setActiveBottomTab("products")}
              className={`pb-3 font-medium ${
                activeBottomTab === "products"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Products review
            </button>
            <button
              onClick={() => setActiveBottomTab("store")}
              className={`pb-3 font-medium ${
                activeBottomTab === "store"
                  ? "border-b-2 border-orange-500 text-white"
                  : "text-gray-500"
              }`}
            >
              Store review
            </button>
            <button
              onClick={() => setActiveBottomTab("supplier")}
              className={`pb-3 font-medium ${
                activeBottomTab === "supplier"
                  ? "border-b-2 border-orange-500 text-white"
                  : "text-gray-500"
              }`}
            >
              Supplier
            </button>
            <button
              onClick={() => setActiveBottomTab("discussion")}
              className={`pb-3 font-medium ${
                activeBottomTab === "discussion"
                  ? "border-b-2 border-orange-500 text-white"
                  : "text-gray-500"
              }`}
            >
              Discussion
            </button>
          </div>

          <div className="mt-6">
            {activeBottomTab === "store" && (
              <div>
                {/* Seller Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center">
                      <span className="text-blue-400 text-xl">🏪</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {productData.seller.name}
                        </h3>
                        <span className="text-blue-400">✓</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        📍 Located in {productData.seller.location}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-2 rounded font-medium transition-all ${
                      isFollowing
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {isFollowing ? "Following" : "Followe"}
                  </button>
                </div>

                <h3 className="font-bold text-lg mb-2 text-white">
                  Top Performance
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Performance arrage of store 🎯
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Reviews</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-white">
                        {productData.seller.totalReviews.toLocaleString()}
                      </p>
                      <span className="text-green-400 text-sm flex items-center">
                        ↑ 12%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Growth on review in this year
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      Average Ratting
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-white">
                        {productData.seller.averageRating}
                      </p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Average Ratting in this year
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      On-time delivery rate
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {productData.seller.onTimeDelivery}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Average Ratting in this year
                    </p>
                  </div>
                </div>

                {/* Customer Reviews */}
                <div className="border-t border-gray-800 pt-6">
                  {visibleComments.map((comment) => (
                    <div key={comment.id} className="mb-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
                            {comment.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white">
                                {comment.user}
                              </span>
                              <span className="text-sm text-gray-400">
                                {comment.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                src="https://flagcdn.com/w20/kh.png"
                                alt="Flag"
                                className="w-4 h-3"
                              />
                              <span className="text-xs text-gray-400">
                                Cambodia
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-800">
                                ✓ Verified purchase
                              </span>
                              <div className="flex">
                                {renderStars(comment.rating)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                              <span className="font-medium">Color:</span>{" "}
                              {comment.color}
                            </p>
                            <p className="text-sm text-gray-300 mb-3">
                              {comment.comment}
                            </p>
                            {comment.images.length > 0 && (
                              <div className="flex gap-2 mb-3">
                                {comment.images.map((img, idx) => (
                                  <div
                                    key={idx}
                                    className="relative w-16 h-16 overflow-hidden rounded border border-gray-700 group cursor-pointer"
                                  >
                                    <img
                                      src={img}
                                      alt="Review"
                                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-150"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 text-sm text-gray-400 mt-2">
                        <button
                          onClick={() => handleHelpfulClick(comment.id)}
                          className="hover:text-gray-300 flex items-center gap-1"
                        >
                          👍 Helpful{" "}
                          {comment.helpful + (helpfulClicks[comment.id] || 0)}
                        </button>
                      </div>
                    </div>
                  ))}

                  {!showAllComments && comments.length > 1 && (
                    <button
                      onClick={() => setShowAllComments(true)}
                      className="w-full py-3 border-2 border-gray-700 rounded-lg hover:bg-gray-800 font-medium text-gray-300 mb-6"
                    >
                      Show All {comments.length} Reviews
                    </button>
                  )}

                  {/* Write Review Section */}
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <h3 className="font-semibold mb-3 text-white">
                      Write a Review
                    </h3>

                    <div className="mb-3">
                      <label className="text-sm text-gray-400 mb-2 block">
                        Your Rating
                      </label>
                      <div className="flex gap-1">
                        {renderStars(newCommentRating, true, (rating) =>
                          setNewCommentRating(rating)
                        )}
                      </div>
                    </div>

                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500"
                      rows={3}
                    />

                    {/* Image Upload */}
                    <div className="mt-3">
                      <label className="text-sm text-gray-400 mb-2 block">
                        Add Photos (Optional)
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20">
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover rounded border border-gray-700"
                            />
                            <button
                              onClick={() => removeUploadedImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <label className="w-20 h-20 border-2 border-dashed border-gray-700 rounded flex items-center justify-center cursor-pointer hover:border-gray-600">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Upload className="w-6 h-6 text-gray-500" />
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitComment}
                      className="mt-3 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-6 bg-[#0f2744] rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Store recommendations for you
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 text-gray-400">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 text-gray-400">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {relatedProducts.map((item) => (
              <button
                key={item.id}
                onClick={() => handleProductClick(item.id)}
                className="border border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group bg-gray-900 text-left"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {item.name}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-orange-500">
                      ${item.price}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      ${item.originalPrice}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
