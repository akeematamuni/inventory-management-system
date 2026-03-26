export class StockAlertNotFoundException extends Error {
    constructor(id: string) {
        super(`Stock alert with id "${id}" was not found`);
        this.name = 'StockAlertNotFoundException';
    }
}
