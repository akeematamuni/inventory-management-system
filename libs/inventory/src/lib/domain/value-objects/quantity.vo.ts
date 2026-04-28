import { ValueObject } from "@inventory/core/domain";

export interface QuantityProps {
    value: number;
}

/**
 * Represents a non-negative integer stock quantity.
 * All arithmetic returns new instances (immutable).
*/

export class Quantity extends ValueObject<QuantityProps> {
    private constructor(props: QuantityProps) {
        super(props);
    }

    public static create(value: number): Quantity {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error(`Quantity must be a valid non-negative integer, got: ${value}`);
        }

        return new Quantity({ value });
    }

    public static zero(): Quantity {
        return new Quantity({ value: 0 });
    }

    public add(other: Quantity) {
        const value = this.value + other.value;
        return new Quantity({ value });
    }

    public subtract(other: Quantity) {
        if (this.isLessThan(other)) {
            throw new Error('Cannot subtract due to insufficient stock');
        }
        const value = this.value - other.value;
        return new Quantity({ value });
    }

    public isLessThan(other: Quantity): boolean {
        return this.value < other.value;
    }

    public isGreaterThan(other: Quantity) {
        return !this.isLessThan(other) && !this.equals(other);
    }

    public isZero(): boolean {
        return this.value === 0;
    }

    override toString(): string {
        return String(this.value);
    }

    get value(): number {
        return this.props.value;
    }
}
