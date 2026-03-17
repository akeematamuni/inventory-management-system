import { Entity, BaseId } from "@inventory/core/domain";
import { StockKeepingUnit } from "../value-objects/sku.vo";
import { Money } from "../value-objects/money.vo";

export interface ProductProps {
    name: string;
    sku: StockKeepingUnit;
    description?: string | null;
    unitCost: Money;
    reorderPoint: number;
    barcode?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductProps {
    name: string;
    sku: StockKeepingUnit;
    description?: string | null;
    unitCost: Money;
    reorderPoint: number;
    barcode?: string | null;
}

export interface UpdateProductProps {
    name?: string;
    description?: string;
    unitCost?: Money;
    reorderPoint?: number;
    barcode?: string;
}

/**
 * Represents a single SKU in the product catalogue.
 * Variant-ready: designed so ProductVariant can be introduced later without restructuring this aggregate.
*/
export class ProductEntity extends Entity<ProductProps> {
    private constructor(props: ProductProps, id: string) {
        super(props, id);
    }

    public static create(props: CreateProductProps): ProductEntity {
        if (!props.name.trim()) throw new Error('Product name cannot be empty');
        
        const now = new Date();
        return new ProductEntity(
            {
                sku: props.sku,
                name: props.name.trim(),
                unitCost: props.unitCost,
                description: props.description?.trim() ?? null,
                barcode: props.barcode?.trim() ?? null,
                reorderPoint: props.reorderPoint ?? 0,
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            BaseId.generate().value
        );
    }

    public static reconstitute(props: ProductProps, id: string): ProductEntity {
        return new ProductEntity(props, id);
    }

    public update(props: UpdateProductProps): void {
        if (props.name?.trim()) this.props.name = props.name.trim();
        if (props.description?.trim()) this.props.description = props.description;
        if (props.unitCost) this.props.unitCost = props.unitCost;
        if (props.reorderPoint) this.props.reorderPoint = props.reorderPoint;
        if (props.barcode?.trim()) this.props.barcode = props.barcode;
    }

    public deactivate(): void {
        if (!this.props.isActive) throw new Error('Product is already deactivated');
        this.props.isActive = false;
    }

    public activate(): void {
        if (this.props.isActive) throw new Error('Product is already active');
        this.props.isActive = true;
    }

    get sku(): StockKeepingUnit {
        return this.props.sku;
    }

    get name(): string {
        return this.props.name;
    }

    get description(): string | null | undefined {
        return this.props.description;
    }

    get unitCost(): Money {
        return this.props.unitCost;
    }

    get reorderPoint(): number {
        return this.props.reorderPoint;
    }

    get barcode(): string | null | undefined {
        return this.props.barcode;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt; 
    }
}
