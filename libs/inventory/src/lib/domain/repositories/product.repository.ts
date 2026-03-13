import { ProductEntity } from '../entities/product.entity';

export interface IProductRepository {
    save(product: ProductEntity, manager?: unknown): Promise<ProductEntity>;

    findById(id: string, manager?: unknown): Promise<ProductEntity | null>;
    findBySku(sku: string, manager?: unknown): Promise<ProductEntity | null>;
    findByBarcode(barcode: string, manager?: unknown): Promise<ProductEntity | null>;
    findAll(manager?: unknown): Promise<ProductEntity[]>;

    exists(id: string, manager?: unknown): Promise<boolean>;
    skuExists(sku: string, manager?: unknown): Promise<boolean>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
