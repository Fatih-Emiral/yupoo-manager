import localforage from 'localforage';
import type { Product } from '../types/index';
import type { IProductRepository } from './IStorage';

// Configuration de la base de données locale
localforage.config({
  name: 'YupooManager',
  storeName: 'products'
});

export class LocalProductService implements IProductRepository {
  async getAll(): Promise<Product[]> {
    const products: Product[] = [];
    await localforage.iterate((value: Product) => {
      products.push(value);
    });
    return products.sort((a, b) => b.createdAt - a.createdAt);
  }

  async getById(id: string): Promise<Product | null> {
    return await localforage.getItem<Product>(id);
  }

  async save(product: Product): Promise<void> {
    await localforage.setItem(product.id, product);
  }

  async delete(id: string): Promise<void> {
    await localforage.removeItem(id);
  }
}

// Instance singleton
export const dbService = new LocalProductService();