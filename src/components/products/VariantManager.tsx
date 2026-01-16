// // app/components/products/VariantsManager.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Plus, X, Grid, Hash, Palette } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";

// interface VariantAttribute {
//   name: string;
//   values: string[];
// }

// interface VariantOption {
//   [key: string]: string;
// }

// interface ProductVariant {
//   id?: string;
//   sku: string;
//   price: number;
//   salePrice?: number;
//   costPrice?: number;
//   stockQuantity: number;
//   attributes: VariantOption;
//   images?: string[];
//   isActive: boolean;
// }

// interface VariantsManagerProps {
//   productId: string;
//   existingVariants?: ProductVariant[];
//   onVariantsUpdate: (variants: ProductVariant[]) => void;
// }

// export default function VariantsManager({
//   productId,
//   existingVariants = [],
//   onVariantsUpdate,
// }: VariantsManagerProps) {
//   const [attributes, setAttributes] = useState<VariantAttribute[]>([
//     { name: "Size", values: ["S", "M", "L", "XL"] },
//     { name: "Color", values: ["Red", "Blue", "Green", "Black"] },
//   ]);
  
//   const [variants, setVariants] = useState<ProductVariant[]>(existingVariants);
//   const [newAttribute, setNewAttribute] = useState({ name: "", value: "" });
//   const [generating, setGenerating] = useState(false);

//   // Generate all possible combinations of attribute values
//   const generateVariants = () => {
//     setGenerating(true);
    
//     if (attributes.length === 0) {
//       setGenerating(false);
//       return;
//     }

//     // Generate all combinations
//     const combinations = generateCombinations(attributes);
    
//     const generatedVariants: ProductVariant[] = combinations.map(combo => {
//       const existingVariant = variants.find(v => 
//         JSON.stringify(v.attributes) === JSON.stringify(combo)
//       );
      
//       if (existingVariant) {
//         return existingVariant;
//       }
      
//       const variantName = Object.values(combo).join(" ");
//       return {
//         sku: `${productId}-${variantName.replace(/\s+/g, "-").toLowerCase()}`,
//         price: 0,
//         stockQuantity: 0,
//         attributes: combo,
//         isActive: true,
//       };
//     });
    
//     setVariants(generatedVariants);
//     onVariantsUpdate(generatedVariants);
//     setGenerating(false);
//   };

//   const generateCombinations = (attrs: VariantAttribute[]): VariantOption[] => {
//     if (attrs.length === 0) return [];
    
//     const generate = (index: number, current: VariantOption): VariantOption[] => {
//       if (index === attrs.length) {
//         return [current];
//       }
      
//       const attr = attrs[index];
//       const combinations: VariantOption[] = [];
      
//       attr.values.forEach(value => {
//         combinations.push(
//           ...generate(index + 1, { ...current, [attr.name]: value })
//         );
//       });
      
//       return combinations;
//     };
    
//     return generate(0, {});
//   };

//   const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
//     const updated = [...variants];
//     updated[index] = { ...updated[index], [field]: value };
//     setVariants(updated);
//     onVariantsUpdate(updated);
//   };

//   const addAttribute = () => {
//     if (newAttribute.name.trim() && newAttribute.value.trim()) {
//       const existingAttrIndex = attributes.findIndex(
//         attr => attr.name.toLowerCase() === newAttribute.name.toLowerCase()
//       );
      
//       if (existingAttrIndex >= 0) {
//         // Add value to existing attribute
//         const updated = [...attributes];
//         if (!updated[existingAttrIndex].values.includes(newAttribute.value)) {
//           updated[existingAttrIndex].values.push(newAttribute.value);
//         }
//         setAttributes(updated);
//       } else {
//         // Create new attribute
//         setAttributes([
//           ...attributes,
//           {
//             name: newAttribute.name.trim(),
//             values: [newAttribute.value.trim()],
//           },
//         ]);
//       }
      
//       setNewAttribute({ name: "", value: "" });
//     }
//   };

//   const addAttributeValue = (attrIndex: number, value: string) => {
//     if (value.trim()) {
//       const updated = [...attributes];
//       if (!updated[attrIndex].values.includes(value.trim())) {
//         updated[attrIndex].values.push(value.trim());
//         setAttributes(updated);
//       }
//     }
//   };

//   const removeAttributeValue = (attrIndex: number, valueIndex: number) => {
//     const updated = [...attributes];
//     updated[attrIndex].values.splice(valueIndex, 1);
    
//     // Remove attribute if no values left
//     if (updated[attrIndex].values.length === 0) {
//       updated.splice(attrIndex, 1);
//     }
    
//     setAttributes(updated);
    
//     // Remove variants that had this value
//     const attrName = updated[attrIndex]?.name;
//     if (attrName) {
//       const filteredVariants = variants.filter(
//         v => !v.attributes[attrName] || v.attributes[attrName] !== valueIndex
//       );
//       setVariants(filteredVariants);
//       onVariantsUpdate(filteredVariants);
//     }
//   };

//   const removeVariant = (index: number) => {
//     const updated = variants.filter((_, i) => i !== index);
//     setVariants(updated);
//     onVariantsUpdate(updated);
//   };

//   const bulkUpdate = (field: keyof ProductVariant, value: any) => {
//     const updated = variants.map(variant => ({
//       ...variant,
//       [field]: value,
//     }));
//     setVariants(updated);
//     onVariantsUpdate(updated);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Attributes Configuration */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Grid className="h-5 w-5" />
//             Product Attributes
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <Input
//                 placeholder="Attribute name (e.g., Size)"
//                 value={newAttribute.name}
//                 onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
//               />
//               <Input
//                 placeholder="Attribute value (e.g., M)"
//                 value={newAttribute.value}
//                 onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
//                 onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAttribute())}
//               />
//             </div>
//             <Button type="button" onClick={addAttribute}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Attribute
//             </Button>

//             <div className="space-y-4">
//               {attributes.map((attr, attrIndex) => (
//                 <div key={attrIndex} className="border rounded-lg p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <Label className="font-semibold">{attr.name}</Label>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => {
//                         const updated = attributes.filter((_, i) => i !== attrIndex);
//                         setAttributes(updated);
//                       }}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
                  
//                   <div className="flex flex-wrap gap-2 mb-3">
//                     {attr.values.map((value, valueIndex) => (
//                       <Badge key={valueIndex} variant="secondary" className="gap-1">
//                         {value}
//                         <button
//                           type="button"
//                           onClick={() => removeAttributeValue(attrIndex, valueIndex)}
//                           className="ml-1 hover:text-destructive"
//                         >
//                           <X className="h-3 w-3" />
//                         </button>
//                       </Badge>
//                     ))}
//                   </div>
                  
//                   <div className="flex gap-2">
//                     <Input
//                       placeholder={`Add new ${attr.name.toLowerCase()} value`}
//                       onKeyPress={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           addAttributeValue(attrIndex, e.currentTarget.value);
//                           e.currentTarget.value = "";
//                         }
//                       }}
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={(e) => {
//                         const input = e.currentTarget.previousSibling as HTMLInputElement;
//                         addAttributeValue(attrIndex, input.value);
//                         input.value = "";
//                       }}
//                     >
//                       Add
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <Button
//               type="button"
//               onClick={generateVariants}
//               disabled={generating || attributes.length === 0}
//               className="w-full"
//             >
//               {generating ? "Generating Variants..." : "Generate All Variants"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Variants Table */}
//       {variants.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>
//               Product Variants ({variants.length})
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Variant</TableHead>
//                     <TableHead>SKU</TableHead>
//                     <TableHead>Price</TableHead>
//                     <TableHead>Sale Price</TableHead>
//                     <TableHead>Stock</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {variants.map((variant, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <div className="space-y-1">
//                           {Object.entries(variant.attributes).map(([key, value]) => (
//                             <div key={key} className="text-sm">
//                               <span className="font-medium">{key}:</span> {value}
//                             </div>
//                           ))}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Input
//                           value={variant.sku}
//                           onChange={(e) => updateVariant(index, "sku", e.target.value)}
//                           className="w-32"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Input
//                           type="number"
//                           step="0.01"
//                           value={variant.price}
//                           onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value))}
//                           className="w-24"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Input
//                           type="number"
//                           step="0.01"
//                           value={variant.salePrice || ""}
//                           onChange={(e) => updateVariant(
//                             index,
//                             "salePrice",
//                             e.target.value ? parseFloat(e.target.value) : undefined
//                           )}
//                           className="w-24"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Input
//                           type="number"
//                           value={variant.stockQuantity}
//                           onChange={(e) => updateVariant(index, "stockQuantity", parseInt(e.target.value))}
//                           className="w-20"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Select
//                           value={variant.isActive ? "active" : "inactive"}
//                           onValueChange={(value) =>
//                             updateVariant(index, "isActive", value === "active")
//                           }
//                         >
//                           <SelectTrigger className="w-28">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="active">Active</SelectItem>
//                             <SelectItem value="inactive">Inactive</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeVariant(index)}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Bulk Actions */}
//             <div className="mt-6 p-4 border rounded-lg bg-muted/50">
//               <h4 className="font-semibold mb-3">Bulk Actions</h4>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <Label className="text-sm">Update All Prices</Label>
//                   <Input
//                     type="number"
//                     step="0.01"
//                     placeholder="Set price"
//                     onChange={(e) => bulkUpdate("price", parseFloat(e.target.value) || 0)}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-sm">Update All Stock</Label>
//                   <Input
//                     type="number"
//                     placeholder="Set stock"
//                     onChange={(e) => bulkUpdate("stockQuantity", parseInt(e.target.value) || 0)}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-sm">Bulk Status</Label>
//                   <Select onValueChange={(value) => bulkUpdate("isActive", value === "active")}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Set status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="active">Active All</SelectItem>
//                       <SelectItem value="inactive">Inactive All</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="flex items-end">
//                   <Button
//                     variant="outline"
//                     className="w-full"
//                     onClick={() => {
//                       const updated = variants.map(v => ({
//                         ...v,
//                         salePrice: v.price * 0.8, // 20% off
//                       }));
//                       setVariants(updated);
//                       onVariantsUpdate(updated);
//                     }}
//                   >
//                     Set 20% Sale
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }