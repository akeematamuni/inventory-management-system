import { ValueObject } from "@inventory/core/domain";

export interface MoneyProps {
    amount: number;
    currency: string;
}

/**
 * Represents a monetary amount with currency.
 * Amount is stored rounded to 4 decimal places for cost precision.
*/

export class Money extends ValueObject<MoneyProps> {
    private static CURR_FORMAT = /^[A-Z]{3}$/;

    private constructor(props: MoneyProps) {
        super(props);
    }

    public static create(amount: number, currency = 'USD'): Money {
        if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
            throw new Error(`Money must be a non-negative number, got: ${amount}`);
        }

        if (!this.CURR_FORMAT.test(currency.toUpperCase())) {
            throw new Error(`Currency must be a 3-letter ISO code, got: ${currency}`);
        }

        return new Money({
            amount: Math.round(amount * 10000) / 10000,
            currency: currency.toUpperCase()
        });
    }

    public static zero(currency = 'USD'): Money {
        if (!this.CURR_FORMAT.test(currency.toUpperCase())) {
            throw new Error(`Currency must be a 3-letter ISO code, got: ${currency}`);
        }

        return new Money({amount: 0, currency: currency.toUpperCase()});
    }

    public multiply(quantity: number): number {
        return Math.round(this.props.amount * quantity * 100) / 100;
    }

    override toString(): string {
        return `${this.props.currency}${this.props.amount.toFixed(2)}`;
    }

    get currency(): string {
        return this.props.currency;
    }

    get amount(): number {
        return this.props.amount;
    }
}
