export interface deals {
  id: number;
  name: string;
  description: string;
  image?: string;
  price: number;
  rating: number;
  category: string;
  // Add these optional fields for product detail page
  originalPrice?: number;
  discount?: number;
  reviews?: number;
  sold?: string;
  images?: string[];
  variations?: {
    screenSize?: string[];
    resolution?: string[];
    [key: string]: string[] | undefined;
  };
  seller?: {
    name: string;
    location: string;
    verified: boolean;
    totalReviews?: string;
    averageRating?: number;
    onTimeDelivery?: string;
  };
}

export interface TopDealProps {
  topDeals: deals[];
}
