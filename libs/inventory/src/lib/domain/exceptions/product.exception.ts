export class ProductNotFoundException extends Error {
    constructor(id: string) {
        super(`Product with id "${id}" was not found`);
        this.name = 'ProductNotFoundException';
    }
}

export class ProductSkuAlreadyExistsException extends Error {
    constructor(sku: string) {
        super(`Product with SKU "${sku}" already exists`);
        this.name = 'ProductSkuAlreadyExistsException';
    }
}

export class ProductInactiveException extends Error {
    constructor(id: string) {
        super(`Product "${id}" is inactive and cannot be used for stock operations`);
        this.name = 'ProductInactiveException';
    }
}
