export interface ProductSettings {
    id: string;
    reorderPoint: number;
    isActive: boolean;
}

export interface IProductSettingsRepository {
    save(data: ProductSettings, manager?: unknown): Promise<ProductSettings>;
    findById(id: string, manager?: unknown): Promise<ProductSettings | null>;
}

export const PRODUCT_SETTINGS_REPOSITORY = Symbol('PRODUCT_SETTINGS_REPOSITORY');
