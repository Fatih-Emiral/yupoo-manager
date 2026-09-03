import type { Product } from '../types/index';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}