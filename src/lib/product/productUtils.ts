import { Product, ProductFilters, SortOption } from "@/types/product";

export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilters,
  sortBy: SortOption
): Product[] {
  let filtered = [...products];

  // Apply filters
  if (filters.freeDeliveryOnly) {
    // Filter logic for free delivery
    filtered = filtered.filter(() => true);
  }

  if (filters.selectedCategories.length > 0) {
    // filtered = filtered.filter(p => filters.selectedCategories.includes(p.category));
  }

  filtered = filtered.filter(
    (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
  );

  if (filters.minRating > 0) {
    filtered = filtered.filter((p) => p.rating >= filters.minRating);
  }

  // Sort
  switch (sortBy) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      filtered.sort((a, b) => b.id - a.id);
      break;
    default:
      break;
  }

  return filtered;
}