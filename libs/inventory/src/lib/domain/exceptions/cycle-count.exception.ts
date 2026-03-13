export class CycleCountNotFoundException extends Error {
    constructor(id: string) {
        super(`Cycle count with id "${id}" was not found`);
        this.name = 'CycleCountNotFoundException';
    }
}

export class CycleCountLineNotFoundException extends Error {
    constructor(lineId: string, cycleCountId: string) {
        super(`Line "${lineId}" was not found on cycle count "${cycleCountId}"`);
        this.name = 'CycleCountLineNotFoundException';
    }
}

export class CycleCountNotPendingApprovalException extends Error {
    constructor(id: string) {
        super(`Cycle count "${id}" is not in PENDING_APPROVAL status`);
        this.name = 'CycleCountNotPendingApprovalException';
    }
}
