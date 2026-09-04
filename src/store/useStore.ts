import { create } from 'zustand';
import type { Product, AppSettings, Seller } from '../types';

interface StoreState {
  // Données
  products: Product[];
  settings: AppSettings;
  sellers: Seller[];
  
  // Actions Produits
  loadProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => void;
  
  // Actions Paramètres
  updateSettings: (settings: AppSettings) => Promise<void>;

  // Actions Revendeurs
  loadSellers: () => Promise<void>;
  addSeller: (seller: Seller) => Promise<void>;
  updateSeller: (seller: Seller) => Promise<void>;
  deleteSeller: (id: string) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  settings: {
    exchangeRate: 7.8,
    roiThresholds: { medium: 20, good: 40, excellent: 60 }
  },
  sellers: [],

  // --- PRODUITS ---
  loadProducts: async () => {
    const data = localStorage.getItem('yupoomgr_products');
    if (data) set({ products: JSON.parse(data) });
  },
  
  addProduct: async (product) => {
    set((state) => {
      const newProducts = [product, ...state.products];
      localStorage.setItem('yupoomgr_products', JSON.stringify(newProducts));
      return { products: newProducts };
    });
  },

  updateProduct: async (product) => {
    set((state) => {
      const newProducts = state.products.map(p => p.id === product.id ? product : p);
      localStorage.setItem('yupoomgr_products', JSON.stringify(newProducts));
      return { products: newProducts };
    });
  },
  
  deleteProduct: async (id) => {
    set((state) => {
      const newProducts = state.products.filter(p => p.id !== id);
      localStorage.setItem('yupoomgr_products', JSON.stringify(newProducts));
      return { products: newProducts };
    });
  },
  
  toggleFavorite: (id) => {
    set((state) => {
      const newProducts = state.products.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p);
      localStorage.setItem('yupoomgr_products', JSON.stringify(newProducts));
      return { products: newProducts };
    });
  },

  // --- PARAMÈTRES ---
  updateSettings: async (settings) => {
    set(() => {
      // Si tu sauvegardes tes paramètres en local, on peut le rajouter ici
      return { settings };
    });
  },

  // --- REVENDEURS ---
  addSeller: async (seller) => {
    set((state) => {
      const newSellers = [...state.sellers, seller];
      localStorage.setItem('yupoomgr_sellers', JSON.stringify(newSellers));
      return { sellers: newSellers };
    });
  },

  updateSeller: async (seller) => {
    set((state) => {
      const newSellers = state.sellers.map(s => s.id === seller.id ? seller : s);
      localStorage.setItem('yupoomgr_sellers', JSON.stringify(newSellers));
      return { sellers: newSellers };
    });
  },

  deleteSeller: async (id) => {
    set((state) => {
      const newSellers = state.sellers.filter(s => s.id !== id);
      localStorage.setItem('yupoomgr_sellers', JSON.stringify(newSellers));
      return { sellers: newSellers };
    });
  },

  loadSellers: async () => {
    const data = localStorage.getItem('yupoomgr_sellers');
    if (data) set({ sellers: JSON.parse(data) });
  }
}));