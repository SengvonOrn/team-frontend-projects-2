// // components/common/Pagination.tsx
// "use client";

// import { ChevronLeft, ChevronRight } from "lucide-react";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: PaginationProps) => {
//   const getPageNumbers = () => {
//     const pages: (number | string)[] = [];
//     const maxVisible = 5;

//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) {
//           pages.push(i);
//         }
//         pages.push("...");
//         pages.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1);
//         pages.push("...");
//         for (let i = totalPages - 3; i <= totalPages; i++) {
//           pages.push(i);
//         }
//       } else {
//         pages.push(1);
//         pages.push("...");
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//           pages.push(i);
//         }
//         pages.push("...");
//         pages.push(totalPages);
//       }
//     }

//     return pages;
//   };

//   return (
//     <div className="flex items-center justify-center gap-2">
//       <Button
//         variant="outline"
//         size="icon"
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         <ChevronLeft className="w-4 h-4" />
//       </Button>

//       {getPageNumbers().map((page, index) =>
//         typeof page === "number" ? (
//           <Button
//             key={index}
//             variant={currentPage === page ? "default" : "outline"}
//             onClick={() => onPageChange(page)}
//           >
//             {page}
//           </Button>
//         ) : (
//           <span key={index} className="px-2">
//             {page}
//           </span>
//         )
//       )}

//       <Button
//         variant="outline"
//         size="icon"
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       >
//         <ChevronRight className="w-4 h-4" />
//       </Button>
//     </div>
//   );
// };

// // // ============================================
// // // components/common/LoadingSpinner.tsx
// // // ============================================
// // "use client";

// // import React from "react";
// // import { Loader2 } from "lucide-react";

// // export const LoadingSpinner = () => {
// //   return (
// //     <div className="flex items-center justify-center min-h-[400px]">
// //       <div className="text-center space-y-4">
// //         <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
// //         <p className="text-muted-foreground">Loading...</p>
// //       </div>
// //     </div>
// //   );
// // };

// // // ============================================
// // // components/common/EmptyState.tsx
// // // ============================================
// // "use client";

// // import React from "react";
// // import { Card, CardContent } from "@/components/ui/card";

// // interface EmptyStateProps {
// //   icon?: React.ReactNode;
// //   title: string;
// //   description?: string;
// //   action?: React.ReactNode;
// // }

// // export const EmptyState = ({
// //   icon,
// //   title,
// //   description,
// //   action,
// // }: EmptyStateProps) => {
// //   return (
// //     <Card>
// //       <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center py-12">
// //         {icon && <div className="text-muted-foreground mb-4">{icon}</div>}
// //         <h3 className="text-xl font-semibold mb-2">{title}</h3>
// //         {description && (
// //           <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
// //         )}
// //         {action && <div>{action}</div>}
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // // ============================================
// // // components/common/SearchBar.tsx
// // // ============================================
// // "use client";

// // import React, { useState, useEffect } from "react";
// // import { Search, X } from "lucide-react";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";

// // interface SearchBarProps {
// //   placeholder?: string;
// //   defaultValue?: string;
// //   onSearch: (query: string) => void;
// //   debounceMs?: number;
// // }

// // export const SearchBar = ({
// //   placeholder = "Search...",
// //   defaultValue = "",
// //   onSearch,
// //   debounceMs = 500,
// // }: SearchBarProps) => {
// //   const [query, setQuery] = useState(defaultValue);

// //   useEffect(() => {
// //     const timeoutId = setTimeout(() => {
// //       onSearch(query);
// //     }, debounceMs);

// //     return () => clearTimeout(timeoutId);
// //   }, [query, debounceMs, onSearch]);

// //   return (
// //     <div className="relative">
// //       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
// //       <Input
// //         type="text"
// //         placeholder={placeholder}
// //         value={query}
// //         onChange={(e) => setQuery(e.target.value)}
// //         className="pl-9 pr-9"
// //       />
// //       {query && (
// //         <Button
// //           variant="ghost"
// //           size="icon"
// //           className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
// //           onClick={() => setQuery("")}
// //         >
// //           <X className="w-4 h-4" />
// //         </Button>
// //       )}
// //     </div>
// //   );
// // };