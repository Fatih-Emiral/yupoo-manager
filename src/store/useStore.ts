import { create } from 'zustand';
import type { Product, AppSettings, Seller } from '../types';

// --- SYSTÈME DE STOCKAGE HAUTE CAPACITÉ (INDEXED-DB) ---
// Contourne la limite de 5Mo du localStorage classique
const DB_NAME = 'YupooMgrDB';
const STORE_NAME = 'store';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbGet(key: string): Promise<any> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbSet(key: string, value: any): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
// --------------------------------------------------------

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

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  trashedProducts: [],
  settings: {
    exchangeRate: 7.8,
    roiThresholds: { medium: 20, good: 40, excellent: 60 }
  },
  sellers: [],

  // --- PRODUITS ---
  loadProducts: async () => {
    try {
      // 1. On cherche dans la grande mémoire
      let data = await dbGet('yupoomgr_products');
      
      // 2. MIGRATION AUTOMATIQUE : Si c'est vide, on récupère tes anciens produits du localStorage
      if (!data && localStorage.getItem('yupoomgr_products')) {
        data = localStorage.getItem('yupoomgr_products');
        if (data) await dbSet('yupoomgr_products', data);
      }

      let trashData = await dbGet('yupoomgr_trashed_products');
      if (!trashData && localStorage.getItem('yupoomgr_trashed_products')) {
        trashData = localStorage.getItem('yupoomgr_trashed_products');
        if (trashData) await dbSet('yupoomgr_trashed_products', trashData);
      }

      if (data) set({ products: JSON.parse(data) });
      if (trashData) set({ trashedProducts: JSON.parse(trashData) });
    } catch (e) {
      console.error("Erreur de chargement", e);
    }
  },
  
  addProduct: async (product) => {
    const newProducts = [product, ...get().products];
    set({ products: newProducts });
    await dbSet('yupoomgr_products', JSON.stringify(newProducts));
  },

  updateProduct: async (product) => {
    const newProducts = get().products.map(p => p.id === product.id ? product : p);
    set({ products: newProducts });
    await dbSet('yupoomgr_products', JSON.stringify(newProducts));
  },
  
  deleteProduct: async (id) => {
    const productToTrash = get().products.find(p => p.id === id);
    if (!productToTrash) return;
    
    const newProducts = get().products.filter(p => p.id !== id);
    const newTrashed = [productToTrash, ...get().trashedProducts];
    
    set({ products: newProducts, trashedProducts: newTrashed });
    await dbSet('yupoomgr_products', JSON.stringify(newProducts));
    await dbSet('yupoomgr_trashed_products', JSON.stringify(newTrashed));
  },

  restoreProduct: async (id) => {
    const productToRestore = get().trashedProducts.find(p => p.id === id);
    if (!productToRestore) return;
    
    const newTrashed = get().trashedProducts.filter(p => p.id !== id);
    const newProducts = [productToRestore, ...get().products];
    
    set({ trashedProducts: newTrashed, products: newProducts });
    await dbSet('yupoomgr_trashed_products', JSON.stringify(newTrashed));
    await dbSet('yupoomgr_products', JSON.stringify(newProducts));
  },

  hardDeleteProduct: async (id) => {
    const newTrashed = get().trashedProducts.filter(p => p.id !== id);
    set({ trashedProducts: newTrashed });
    await dbSet('yupoomgr_trashed_products', JSON.stringify(newTrashed));
  },

  emptyTrash: async () => {
    set({ trashedProducts: [] });
    await dbSet('yupoomgr_trashed_products', JSON.stringify([]));
  },
  
  toggleFavorite: (id) => {
    const newProducts = get().products.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p);
    set({ products: newProducts });
    dbSet('yupoomgr_products', JSON.stringify(newProducts));
  },

  // --- PARAMÈTRES ---
  updateSettings: async (settings) => set({ settings }),

  // --- REVENDEURS ---
  loadSellers: async () => {
    try {
      let data = await dbGet('yupoomgr_sellers');
      if (!data && localStorage.getItem('yupoomgr_sellers')) {
        data = localStorage.getItem('yupoomgr_sellers');
        if (data) await dbSet('yupoomgr_sellers', data);
      }
      if (data) set({ sellers: JSON.parse(data) });
    } catch (e) {
      console.error("Erreur chargement vendeurs", e);
    }
  },

  addSeller: async (seller) => {
    const newSellers = [...get().sellers, seller];
    set({ sellers: newSellers });
    await dbSet('yupoomgr_sellers', JSON.stringify(newSellers));
  },

  updateSeller: async (seller) => {
    const newSellers = get().sellers.map(s => s.id === seller.id ? seller : s);
    set({ sellers: newSellers });
    await dbSet('yupoomgr_sellers', JSON.stringify(newSellers));
  },

  deleteSeller: async (id) => {
    const newSellers = get().sellers.filter(s => s.id !== id);
    set({ sellers: newSellers });
    await dbSet('yupoomgr_sellers', JSON.stringify(newSellers));
  }
}));