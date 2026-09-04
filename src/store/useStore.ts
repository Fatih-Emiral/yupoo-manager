import { create } from 'zustand';
import type { Product, AppSettings, Seller } from '../types';

interface StoreState {
  products: Product[];
  trashedProducts: Product[];
  settings: AppSettings;
  sellers: Seller[];
  
  loadProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  restoreProduct: (id: string) => Promise<void>;
  hardDeleteProduct: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  
  updateSettings: (settings: AppSettings) => Promise<void>;

  loadSellers: () => Promise<void>;
  addSeller: (seller: Seller) => Promise<void>;
  updateSeller: (seller: Seller) => Promise<void>;
  deleteSeller: (id: string) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  trashedProducts: [],
  settings: {
    exchangeRate: 7.8,
    roiThresholds: { medium: 20, good: 40, excellent: 60 }
  },
  sellers: [],

  loadProducts: async () => {
    const data = localStorage.getItem('yupoomgr_products');
    const trashData = localStorage.getItem('yupoomgr_trashed_products');
    if (data) set({ products: JSON.parse(data) });
    if (trashData) set({ trashedProducts: JSON.parse(trashData) });
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
  
  // Envoi vers la corbeille au lieu de supprimer définitivement
  deleteProduct: async (id) => {
    set((state) => {
      const productToTrash = state.products.find(p => p.id === id);
      if (!productToTrash) return state;
      
      const newProducts = state.products.filter(p => p.id !== id);
      const newTrashed = [productToTrash, ...state.trashedProducts];
      
      localStorage.setItem('yupoomgr_products', JSON.stringify(newProducts));
      localStorage.setItem('yupoomgr_trashed_products', JSON.stringify(newTrashed));
      return { products: newProducts, trashedProducts: newTrashed };
    });
  },

  restoreProduct: async (id) => {
    set((state) => {
      const productToRestore = state.trashedProducts.find(p => p.id === id);
      if (!productToRestore) return state;
      
      const newTrashed = state.trashedProducts.filter(p => p.id !== id);
      const newProducts = [productToRestore, ...state.products];
      
      localStorage.setItem('yupoomgr_trashed_products', JSON.stringify(newTrashed));
      localStorage.setItem('yupoomgr_products', JSON.stringify(newProducts));
      return { trashedProducts: newTrashed, products: newProducts };
    });
  },

  hardDeleteProduct: async (id) => {
    set((state) => {
      const newTrashed = state.trashedProducts.filter(p => p.id !== id);
      localStorage.setItem('yupoomgr_trashed_products', JSON.stringify(newTrashed));
      return { trashedProducts: newTrashed };
    });
  },

  emptyTrash: async () => {
    set(() => {
      localStorage.setItem('yupoomgr_trashed_products', JSON.stringify([]));
      return { trashedProducts: [] };
    });
  },
  
  toggleFavorite: (id) => {
    set((state) => {
      const newProducts = state.products.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p);
      localStorage.setItem('yupoomgr_products', JSON.stringify(newProducts));
      return { products: newProducts };
    });
  },

  updateSettings: async (settings) => set(() => ({ settings })),

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