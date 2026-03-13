export class AdjustmentNotFoundException extends Error {
    constructor(id: string) {
        super(`Adjustment with id "${id}" was not found`);
        this.name = 'AdjustmentNotFoundException';
    }
}
