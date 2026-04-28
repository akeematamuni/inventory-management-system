/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ValueObjectProps {
    [key: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
    protected readonly props: T;

    protected constructor(props: T) {
        this.props = Object.freeze(props);
    }

    private checkEquality(a: any, b: any): boolean {
        // Same memory
        if (a === b) return true;

        // If checking dates
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime();
        }

        // Nullish or primitives
        if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
            return a === b;
        }

        // Objct level similarities
        // if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
        if (a.prototype !== b.prototype) return false;

        // Similar key length
        const keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) return false;

        // Check all recursively on nesting
        return keys.every((key) => this.checkEquality(a[key], b[key]));
    }

    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) return false;
        if (vo.constructor.name !== this.constructor.name) return false;
        
        //return JSON.stringify(this.props) === JSON.stringify(vo.props);
        return this.checkEquality(this.props, vo.props);
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
