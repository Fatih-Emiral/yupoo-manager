export type Category = 'T-shirt' | 'Pull' | 'Manteau' | 'Jean' | 'Jogging' | 'Short' | 'Chaussure' | 'Bijou' | 'Montre' | 'Autre';

export interface Seller {
  id: string;
  name: string;
  yupooUrl: string;
  description?: string;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  seller: string;       // Ancien format (conservé pour compatibilité)
  sellerId?: string;    // Nouveau système de relation
  yupooUrl: string;
  mainImage: string;
  images: string[];
  priceCny: number;
  priceEur: number;
  description: string;
  favorite: boolean;
  createdAt: number;
  resalePrice: number;
  shippingCost: number;
  otherCosts: number;
  roi?: number;
}

export interface AppSettings {
  exchangeRate: number;
  roiThresholds: {
    medium: number;
    good: number;
    excellent: number;
  };
}