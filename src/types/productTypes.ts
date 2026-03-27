import { type Seller } from "./sellerTypes";

export interface Category {
  _id?: number; // Optional since id is auto-generated
  name: string;
  categoryId: string;
  parentCategory?: Category; // Optional since a category might not have a parent
  level: number;
}

export interface Product {
  _id?: string; // Optional since id is auto-generated
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  discountPercent?: number;
  quantity?: number;
  color: string;
  images: string[]; // Array of strings for image URLs
  numRatings?: number;
  category?: Category; // Optional since a product might not have a category assigned yet
  seller?: Seller; // Placeholder for Seller interface (assuming it exists)
  createdAt?: Date; // Assuming LocalDateTime can be mapped to Date
  sizes: string; // Changed to string to match formik usage (comma separated or single)

  // New fields
  brand?: string;
  slug?: string;
  sku?: string;
  hsnCode?: string;
  gstPercent?: number;
  countryOfOrigin?: string;
  unitValue?: number;
  unitType?: string;
  weight?: {
    value: number;
    unit: string;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  shippingCharges?: number;
  estimatedDeliveryDays?: number;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}




