import { create } from 'zustand';
import type { Product, AppSettings } from '../types/index';
import { dbService } from '../services/LocalDB';

interface StoreState {
  products: Product[];
  settings: AppSettings;
  isLoading: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  setExchangeRate: (rate: number) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  sellers: Seller[];
  addSeller: (seller: Seller) => Promise<void>;
  updateSeller: (seller: Seller) => Promise<void>;
  deleteSeller: (id: string) => Promise<void>;
  loadSellers: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  sellers: [],
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
  },
  products: [],
  settings: { 
    exchangeRate: 7.8,
    roiThresholds: { medium: 30, good: 50, excellent: 100 }
  },
  isLoading: true,

  loadProducts: async () => {
    set({ isLoading: true });
    const products = await dbService.getAll();
    set({ products, isLoading: false });
  },

  addProduct: async (product) => {
    await dbService.save(product);
    set((state) => ({ products: [product, ...state.products] }));
  },

  updateProduct: async (product) => {
    await dbService.save(product);
    set((state) => ({
      products: state.products.map(p => p.id === product.id ? product : p)
    }));
  },

  deleteProduct: async (id) => {
    await dbService.delete(id);
    set((state) => ({
      products: state.products.filter(p => p.id !== id)
    }));
  },

  toggleFavorite: async (id) => {
    const product = get().products.find(p => p.id === id);
    if (product) {
      const updated = { ...product, favorite: !product.favorite };
      await dbService.save(updated);
      set((state) => ({
        products: state.products.map(p => p.id === id ? updated : p)
      }));
    }
  },

  setExchangeRate: (rate) => set((state) => ({ 
    settings: { ...state.settings, exchangeRate: rate } 
  })),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  }))
}));