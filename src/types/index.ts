export type Category = 'T-shirt' | 'Pull' | 'Manteau' | 'Jean' | 'Jogging' | 'Short' | 'Chaussure' | 'Bijou' | 'Montre' | 'Autre';

export interface Product {
  id: string;
  name: string;
  category: Category;
  seller: string;
  yupooUrl: string;
  mainImage: string;      // Image principale
  images: string[];       // Toutes les images (galerie)
  priceCny: number;
  priceEur: number;
  description: string;
  favorite: boolean;
  createdAt: number;
  resalePrice: number;
  shippingCost: number;
  otherCosts: number;
  roi?: number;           // Ajout de la propriété ROI pour corriger l'erreur
}

export interface AppSettings {
  exchangeRate: number; // 1 EUR = X CNY
  roiThresholds: {
    medium: number;    // % à partir duquel le ROI est moyen
    good: number;      // % à partir duquel le ROI est intéressant
    excellent: number; // % à partir duquel le ROI est excellent
  };
}