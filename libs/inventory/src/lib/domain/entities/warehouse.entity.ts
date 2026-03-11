import { Entity, BaseId } from "@inventory/core/domain";

export interface WarehouseProps {
    name: string;
    code: string;
    address?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateWarehouseProps {
    name: string;
    code: string;
    address?: string | null;
}

/**
 * Represents a physical location where stock is held.
 * Designed for single-warehouse MVP, ready for multi-warehouse extension.
*/
export class WarehouseEntity extends Entity<WarehouseProps> {
    private static CODE_FORMAT = /^[A-Z0-9]{2,10}$/;

    private constructor(props: WarehouseProps, id: string) {
        super(props, id);
    }

    public static create(props: CreateWarehouseProps): WarehouseEntity {
        if (!props.name.trim()) throw new Error('Warehouse name cannot be empty');

        if (!this.CODE_FORMAT.test(props.code.trim().toUpperCase())) {
            throw new Error(`Invalid warehouse code: "${props.code}". Use 2-10 uppercase alphanumeric characters`);
        }

        const now = new Date();
        return new WarehouseEntity(
            {
                name: props.name.trim(),
                code: props.code.trim().toUpperCase(),
                address: props.address?.trim() ?? null,
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            BaseId.generate().value
        );
    }

    public static reconstitute(props: WarehouseProps, id: string): WarehouseEntity {
        return new WarehouseEntity(props, id);
    }

    public update(name?: string, address?: string): void {
        if (name?.trim()) this.props.name = name;
        if (address?.trim()) this.props.address = address;
    }

    public deactivate(): void {
        if (!this.props.isActive) throw new Error('Warehouse is already deactivated');
        this.props.isActive = false;
    }

    get name(): string {
        return this.props.name;
    }

    get code(): string {
        return this.props.code;
    }

    get address(): string | null | undefined {
        return this.props.address;
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
