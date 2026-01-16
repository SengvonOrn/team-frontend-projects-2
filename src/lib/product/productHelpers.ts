// lib/utils/productHelpers.ts
export const transformProductForForm = (product: any): any => {
  return {
    ...product,
    tags: product.tags ? product.tags.split(",").filter(Boolean) : [],
    seoKeywords: product.seoKeywords ? product.seoKeywords.split(",").filter(Boolean) : [],
    variantAttributes: product.variantAttributes || [],
    specifications: product.specifications || [],
    relatedProducts: product.relatedProducts || [],
  };
};

export const transformFormForAPI = (formData: any): any => {
  return {
    ...formData,
    tags: Array.isArray(formData.tags) ? formData.tags.join(",") : formData.tags,
    seoKeywords: Array.isArray(formData.seoKeywords) ? formData.seoKeywords.join(",") : formData.seoKeywords,
    variantAttributes: formData.variantAttributes || [],
    specifications: formData.specifications || [],
    relatedProducts: formData.relatedProducts || [],
  };
};