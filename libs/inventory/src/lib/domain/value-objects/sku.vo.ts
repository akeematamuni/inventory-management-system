import { ValueObject } from '@inventory/core/domain';

export interface SkuProps {
    value: string;
}

/**
 * Prefix: 2–6 uppercase letters
 * Separator: hyphen
 * Suffix: 4–8 digits
*/

export class StockKeepingUnit extends ValueObject<SkuProps> {
    private static readonly FORMAT = /^[A-Z]{2,6}-\d{4,8}$/;

    private constructor(props: SkuProps) {
        super(props);
    }

    public static create(value: string): StockKeepingUnit {
        const normalized = value.toUpperCase().trim()

        if (!this.FORMAT.test(normalized)) {
            throw new Error(`Invalid SKU format: ${value}. Expected Format: TOOL-001234`);
        }

        return new StockKeepingUnit({ value: normalized });
    }

    get value(): string {
        return this.props.value;
    }
}
