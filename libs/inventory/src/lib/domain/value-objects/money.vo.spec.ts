import { Money } from './money.vo';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Money Value Object', () => {
    describe('Creation & Validation', () => {
        const m1 = Money.create(100.501, 'eur');
        const m2 = Money.create(10.123456);

        it('should create valid Money and normalize currency to uppercase', () => {
            // console.log('M1', m1);
            expect(m1.amount).not.toBe(100.5);
            expect(m1.currency).toBe('EUR');
        });

        it('should round amount to 4 decimal places during creation', () => {
            // console.log('M2', m2);
            expect(m2.amount).toBe(10.1235);
        });

        test.each([
            [-1, 'negative number'],
            [NaN, 'NaN'],
            ['100' as any, 'string instead of number'],
        ])('should throw error for invalid amount: %s (%s)', (amount) => {
            expect(() => Money.create(amount)).toThrow();
        });

        test.each([
            ['US', 'too short'],
            ['USDC', 'too long'],
            ['123', 'numbers'],
            ['$', 'special characters'],
        ])('should throw error for invalid currency code: %s (%s)', (currency) => {
            expect(() => Money.create(10, currency)).toThrow('3-letter ISO code');
        });
    });

    describe('Static Helpers', () => {
        const zero = Money.zero();
        const zeroGbp = Money.zero('GBP');

        it('should be zero money with default USD', () => {
            expect(zero.amount).toBe(0);
            expect(zero.currency).toBe('USD');
        });

        it('should be zero money with specific currency', () => {
            expect(zeroGbp.currency).toBe('GBP');
        });
    });

    describe('Calculations & Formatting', () => {
        const m1 = Money.create(10.1234);
        const m2 = Money.create(5);
        const m3 = Money.create(5.999, 'EUR');

        it('should multiply amount and round to 2 decimal places', () => {
            // 10.1234 * 3 = 30.3702 -> rounded to 2 places = 30.37
            const result = m1.multiply(3);
            expect(result).toBe(30.37);
        });

        it('should format to string with 2 decimal places and currency prefix', () => {
            expect(m2.toString()).toBe('USD5.00');
            expect(m3.toString()).toBe('EUR6.00');
        });
    });

    describe('Structural Equality', () => {
        const m1 = Money.create(20, 'USD');
        const m2 = Money.create(20, 'usd');
        const m3 = Money.create(20, 'CAD');

        it('should be equal if amount and currency match', () => {
            expect(m1.equals(m2)).toBe(true);
        });

        it('should NOT be equal if currency differs', () => {
            expect(m1.equals(m3)).toBe(false);
        });
    });
});
