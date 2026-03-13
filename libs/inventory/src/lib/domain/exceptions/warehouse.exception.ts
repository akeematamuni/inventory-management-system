export class WarehouseNotFoundException extends Error {
    constructor(id: string) {
        super(`Warehouse with id "${id}" was not found`);
        this.name = 'WarehouseNotFoundException';
    }
}

export class WarehouseCodeAlreadyExistsException extends Error {
    constructor(code: string) {
        super(`Warehouse with code "${code}" already exists`);
        this.name = 'WarehouseCodeAlreadyExistsException';
    }
}

export class WarehouseInactiveException extends Error {
    constructor(id: string) {
        super(`Warehouse "${id}" is inactive and cannot be used for stock operations`);
        this.name = 'WarehouseInactiveException';
    }
}
