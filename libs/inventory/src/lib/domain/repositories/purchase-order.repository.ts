import { PurchaseOrderEntity, PurchaseOrderStatus } from '../entities/purchase-order.entity';

export interface IPurchaseOrderRepository {
    save(purchaseOrder: PurchaseOrderEntity, manager?: unknown): Promise<PurchaseOrderEntity>;

    findById(id: string, manager?: unknown): Promise<PurchaseOrderEntity | null>;
    findAll(manager?: unknown): Promise<PurchaseOrderEntity[]>;
    findByStatus(status: PurchaseOrderStatus, manager?: unknown): Promise<PurchaseOrderEntity[]>;

    exists(id: string, manager?: unknown): Promise<boolean>;
}

export const PURCHASE_ORDER_REPOSITORY = Symbol('PURCHASE_ORDER_REPOSITORY');
