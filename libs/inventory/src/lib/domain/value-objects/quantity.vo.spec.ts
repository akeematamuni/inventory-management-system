import { Quantity } from './quantity.vo';

describe('Quantity Value Object', () => {
    describe('Creation', () => {
        it('should create a valid quantity', () => {
            const q = Quantity.create(10);
            expect(q.value).toBe(10);
        });

        it('should create a zero quantity using the static helper', () => {
            expect(Quantity.zero().value).toBe(0);
        });

        test.each([
            [-1, 'negative'],
            [1.5, 'decimal'],
            [Infinity, 'infinity'],
            [NaN, 'not a number'],
        ])('should throw error for %s (%s)', (input) => {
            expect(() => Quantity.create(input)).toThrow()
        });
    });

    describe('Basic Arithmetic', () => {
        const q1 = Quantity.create(10);
        const q2 = Quantity.create(5);
        const q3 = Quantity.create(3);

        it('should add two quantities and return a new instance', () => {
            const result = q1.add(q2);
            expect(result.value).toBe(15);
            expect(q1.value).toBe(10);
        });

        it('should subtract and return a new instance', () => {
            expect(q1.subtract(q3).value).toBe(7);
        });

        it('should throw when subtracting a larger value', () => {
            expect(() => q2.subtract(q1)).toThrow();
        });
    });

    describe('Comparison & Utility', () => {
        const q1 = Quantity.create(10);
        const large = Quantity.create(10);
        const small = Quantity.create(5);
        const zero = Quantity.zero();

        it('should correctly compare values', () => {
            expect(small.isLessThan(large)).toBe(true);
            expect(large.isGreaterThan(small)).toBe(true);
            expect(small.isZero()).toBe(false);
            expect(zero.isZero()).toBe(true);
        });

        it('should handle false isGreaterThan', () => {
            expect(large.isGreaterThan(q1)).toBe(false); 
        });

        it('should convert to string', () => {
            expect(small.toString()).toBe('5');
        });

        it('should satisfy structural equality', () => {
            expect(q1.equals(large)).toBe(true);
        });
    });
});
