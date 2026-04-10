import { DataSource } from 'typeorm';
import { Connection } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { publicDataSourceConfig } from './datasource.config';
import mongoose from 'mongoose';

config();

const currency = 'USD';

// Fixed IDs so seed is safe to run multiple times (idempotent)
const IDS = {
    warehouses: {
        war: '181f18ed-4b02-4e9e-8107-27976471f192',
        lag: '13fb9997-05b4-4162-b669-f45241a7cce9',
    },
    products: {
        helmet: { id: 'b8823ab5-891e-4a86-bd54-4a37ed84291d', unitCost: 45.75 },
        gloves: { id: 'c06905d0-f1c4-4db1-9c07-bdf62e657c29', unitCost: 25.00 },
        boots: { id: '013cb052-35ef-4d8b-a572-3a0bc508f9b4', unitCost: 200.00 },
        vest: { id: 'b1afc60b-f7b0-4c87-a2c1-2d7b39e59dbd', unitCost: 20.00 },
        goggles: { id: '01728e46-1ac8-4fb9-b9b6-39af40c0edb9', unitCost: 50.00 },
        earmuffs: { id: 'eb9d8b30-44ca-406a-87fe-10062d8f1d60', unitCost: 35.00 },
        harness: { id: 'a9fa58c0-4040-4436-916f-3b7a97d0a109', unitCost: 500.00 },
        aprons: { id: '1c2ec47c-f70f-4c9a-b64c-a8374f380b1d', unitCost: 15.00 }
    },
    users: {
        sammy: '85ff38da-b5e9-4e40-b392-e30b724e7f66',
        jason:  'e1cad67f-0eae-4751-9eaf-8af47967ae38',
        adam:  '30e07da7-16a8-4b45-9bb0-1e4571a65508',
        kate:  'd7fca28c-7d19-4fb2-b2f4-a528dab2b8dd',
    },
    purchaseOrders: {
        po001: 'e5e84b59-b119-4f7f-91b5-2b4d29f8876c',
        po002: '29f2c8b9-5a96-42aa-8b00-d40f2f01b6ce',
    },
    stockTransfers: {
        tr001: 'e054da29-021d-4327-96b1-6c0fc1120c65',
    },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function seedMongo(connection: Connection): Promise<void> {
    console.log('Seeding warehouses and products in MongoDB');

    const warehouseCol = connection.collection('warehouses');
    const productCol = connection.collection('products');

    // Delete existing seed data before reinserting
    await warehouseCol.deleteMany({
        _id: { $in: Object.values(IDS.warehouses) as any },
    });
    await productCol.deleteMany({
        _id: { $in: Object.values(IDS.products) as any },
    });

    // Warehouses
    await warehouseCol.insertMany([
        {
            _id: IDS.warehouses.war as any,
            name: 'Warri Warehouse',
            code: 'WAR',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            _id: IDS.warehouses.lag as any,
            name: 'Lagos Branch',
            code: 'LAG',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
    ]);

    // Products
    await productCol.insertMany([
        {
            _id: IDS.products.helmet.id as any,
            sku: 'PPE-001001',
            name: 'Safety Helmet Type 1',
            description: 'Hard hat. Available in white.',
            unitCost: IDS.products.helmet.unitCost,
            currency,
            reorderPoint: 50,
            barcode: '6009701438001',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            _id: IDS.products.gloves.id,
            sku: 'PPE-001002',
            name: 'Cut-Resistant Work Gloves',
            description: 'Level 5 cut resistance. Size L.',
            unitCost: IDS.products.gloves.unitCost,
            currency,
            reorderPoint: 200,
            barcode: '6009701438002',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            _id: IDS.products.boots.id,
            sku: 'PPE-001003',
            name: 'Steel Toe Safety Boots',
            description: 'S3 rated. Sizes 6-12.',
            unitCost: IDS.products.boots.unitCost,
            currency,
            reorderPoint: 30,
            barcode: '6009701438003',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            _id: IDS.products.vest.id,
            sku: 'PPE-001004',
            name: 'High-Visibility Vest',
            description: 'Orange. Size XL.',
            unitCost: IDS.products.vest.unitCost,
            currency,
            reorderPoint: 100,
            barcode: '6009701438004',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            _id: IDS.products.goggles.id,
            sku: 'PPE-001005',
            name: 'Chemical Splash Goggles',
            description: 'Indirect Vented. Clear Polycarbonate Lens.',
            unitCost: IDS.products.goggles.unitCost,
            currency,
            reorderPoint: 40,
            barcode: '6009701438005',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            _id: IDS.products.earmuffs.id,
            sku: 'PPE-001006',
            name: 'Ear Muffs SNR 32dB',
            description: 'Suitable for high-noise environments.',
            unitCost: IDS.products.earmuffs.unitCost,
            currency,
            reorderPoint: 60,
            barcode: '6009701438006',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            _id: IDS.products.harness.id,
            sku: 'PPE-001007',
            name: 'Full Body Safety Harness',
            description: 'Suitable for working at heights.',
            unitCost: IDS.products.harness.unitCost,
            currency,
            reorderPoint: 10,
            barcode: '6009701438007',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            _id: IDS.products.aprons.id,
            sku: 'PPE-001008',
            name: 'Splash Resistant Apron',
            description: 'Industry treated for multiple enviroment',
            unitCost: IDS.products.aprons.unitCost,
            currency,
            reorderPoint: 150,
            barcode: '6009701438008',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
    ]);

    console.log('MongoDB has been seeded with 2 warehouses and 8 products');
}


async function seedPostgres(dataSource: DataSource): Promise<void> {
    console.log('Seeding PostgreSQL (settings, balances, ledger, orders)...');

    await dataSource.transaction(async manager => {
        // 1. Settings
        await manager.query(
            `DELETE FROM "product_settings" WHERE "id" = ANY($1::uuid[])`, 
            [Object.values(IDS.products).map(p => p.id)]
        );

        await manager.query(
            `
            INSERT INTO "product_settings" 
                ("id", "reorder_point", "is_active")
            VALUES 
                ($1, 50, true), 
                ($2, 200, true), 
                ($3, 30, true), 
                ($4, 100, true),
                ($5, 40, true),
                ($6, 60, true),
                ($7, 10, true),
                ($8, 150, true)
            `,
            [
                IDS.products.helmet.id,
                IDS.products.gloves.id,
                IDS.products.boots.id,
                IDS.products.vest.id,
                IDS.products.goggles.id,
                IDS.products.earmuffs.id,
                IDS.products.harness.id,
                IDS.products.aprons.id,
            ]
        );

        // 2. Opening stock balances
        // WAR warehouse opening stock
        const warBalances = [
            { productId: IDS.products.helmet.id, qty: 480 },
            { productId: IDS.products.gloves.id, qty: 1200 },
            { productId: IDS.products.boots.id, qty: 87 },
            { productId: IDS.products.vest.id, qty: 320 },
            { productId: IDS.products.goggles.id, qty: 95 },
            { productId: IDS.products.earmuffs.id, qty: 140 },
            { productId: IDS.products.harness.id, qty: 22 },
            { productId: IDS.products.aprons.id, qty: 100 }, // below reorder
        ];

        // LAG warehouse opening stock
        const lagBalances = [
            { productId: IDS.products.helmet.id, qty: 120 },
            { productId: IDS.products.gloves.id, qty: 400 },
            { productId: IDS.products.boots.id, qty: 28 }, // below reorder
            { productId: IDS.products.vest.id, qty: 80 }, // below reorder
            { productId: IDS.products.goggles.id, qty: 45 },
            { productId: IDS.products.earmuffs.id, qty: 55 }, // below reorder
            { productId: IDS.products.harness.id, qty: 8 }, // below reorder
            { productId: IDS.products.aprons.id, qty: 200 },
        ];

        // Delete existing balances
        await manager.query(
            `DELETE FROM "stock_balances" WHERE "warehouse_id" = ANY($1::uuid[])`, 
            [[IDS.warehouses.war, IDS.warehouses.lag]]
        );

        // Delete existing ledger entries for warehouses
        await manager.query(
            `DELETE FROM "stock_ledger_entry" WHERE "warehouse_id" = ANY($1::uuid[])`, 
            [[IDS.warehouses.war, IDS.warehouses.lag]]
        );

        // Insert balances and ledger entries together
        for (const balance of warBalances) {
            const balanceId = randomUUID();
            const ledgerId = randomUUID();

            const product = Object.values(IDS.products).find(p => p.id === balance.productId);

            await manager.query(
                `
                INSERT INTO "stock_balances" ("id", "product_id", "warehouse_id", "quantity", "updated_at")
                VALUES ($1, $2, $3, $4, now())
                `, 
                [balanceId, balance.productId, IDS.warehouses.war, balance.qty]
            );

            await manager.query(
                `
                INSERT INTO "stock_ledger_entries" (
                    "id", 
                    "product_id", 
                    "warehouse_id",
                    "movement_type",
                    "unit_cost",
                    "currency", 
                    "quantity_change",
                    "balance_after",
                    "reference_id", 
                    "reference_type",
                    "performed_by", 
                    "occurred_at"
                    ) 
                VALUES ($1, $2, $3, 'OPENING_STOCK', $4, $5, $6, $6, $2, 'OPENING_STOCK', $7, now())
                `, 
                [
                    ledgerId, 
                    balance.productId, 
                    IDS.warehouses.war, 
                    product.unitCost, 
                    currency, 
                    balance.qty, 
                    IDS.users.kate
                ]
            );
        }

        for (const balance of lagBalances) {
            const balanceId = randomUUID();
            const ledgerId = randomUUID();

            const product = Object.values(IDS.products).find(p => p.id === balance.productId);

            await manager.query(
                `
                INSERT INTO "stock_balances" ("id", "product_id", "warehouse_id", "quantity", "updated_at")
                VALUES ($1, $2, $3, $4, now())
                `, 
                [balanceId, balance.productId, IDS.warehouses.lag, balance.qty]
            );

            await manager.query(
                `
                INSERT INTO "stock_ledger_entries" (
                    "id", 
                    "product_id", 
                    "warehouse_id",
                    "movement_type",
                    "unit_cost",
                    "currency", 
                    "quantity_change",
                    "balance_after",
                    "reference_id", 
                    "reference_type",
                    "performed_by", 
                    "occurred_at"
                    ) 
                VALUES ($1, $2, $3, 'OPENING_STOCK', $4, $5, $6, $6, $2, 'OPENING_STOCK', $7, now())
                `, 
                [
                    ledgerId, 
                    balance.productId, 
                    IDS.warehouses.lag, 
                    product.unitCost, 
                    currency, 
                    balance.qty, 
                    IDS.users.sammy
                ]
            );
        }

        // 3. Stock alerts for items below reorder point
        await manager.query(
            `DELETE FROM "stock_alerts" WHERE "warehouse_id" = ANY($1::uuid[])`, 
            [[IDS.warehouses.war, IDS.warehouses.lag]]
        );

        const alerts = [
            { product: IDS.products.aprons, warehouse: IDS.warehouses.war, balance: 100, reorder: 150 },
            { product: IDS.products.boots, warehouse: IDS.warehouses.lag, balance: 28, reorder: 30 },
            { product: IDS.products.vest, warehouse: IDS.warehouses.lag, balance: 80, reorder: 100 },
            { product: IDS.products.earmuffs, warehouse: IDS.warehouses.lag, balance: 55, reorder: 60 },
            { product: IDS.products.harness, warehouse: IDS.warehouses.lag, balance: 8, reorder: 10 },
        ];

        for (const alert of alerts) {
            await manager.query(
                `
                INSERT INTO "stock_alerts" 
                    (
                    "id", 
                    "product_id", 
                    "warehouse_id",
                    "current_balance", 
                    "reorder_point",
                    "status", 
                    "created_at"
                    )
                VALUES ($1, $2, $3, $4, $5, 'UNRESOLVED', now())
                `, 
                [randomUUID(), alert.product, alert.warehouse, alert.balance, alert.reorder]
            );
        }

        // 4. Purchase order, open and partially received

        // await manager.query(
        //     `DELETE FROM "purchase_order_lines" WHERE "purchase_order_id" = ANY($1::uuid[])`,
        //     [[IDS.purchaseOrders.po001, IDS.purchaseOrders.po002]]
        // );

        await manager.query(
            `DELETE FROM "purchase_orders" WHERE "id" = ANY($1::uuid[])`, 
            [[IDS.purchaseOrders.po001, IDS.purchaseOrders.po002]]
        );

        // PO-001: open order to demonstrate the receiving workflow
        await manager.query(
            `
            INSERT INTO "purchase_orders"
                ("id", "warehouse_id", "supplier_name", "status", "created_by", "created_at", "updated_at")
            VALUES 
                ($1, $2, 'SafetyGear Ltd', 'OPEN', $3, now(), now())
            `, 
            [IDS.purchaseOrders.po001, IDS.warehouses.war, IDS.users.adam]
        );

        await manager.query(
            `
            INSERT INTO "purchase_order_lines"
                (
                    "id", 
                    "purchase_order_id", 
                    "product_id", 
                    "quantity_ordered", 
                    "quantity_received", 
                    "unit_cost_at_order", 
                    "currency"
                )
            VALUES
                ($1, $2, $3, 500, 0, 45.50, 'USD'),
                ($4, $2, $5, 300, 0, 25.00, 'USD')
            `, 
            [
                randomUUID(), IDS.purchaseOrders.po001, IDS.products.helmet.id,
                randomUUID(), IDS.products.gloves.id,
            ]
        );

        // PO-002: partially received to demonstrates variance tracking
        await manager.query(
            `
            INSERT INTO "purchase_orders"
                ("id", "warehouse_id", "supplier_name", "status", "created_by", "created_at", "updated_at")
            VALUES
                ($1, $2, 'ProSafe Distributors', 'PARTIALLY_RECEIVED', $3, now(), now())
            `, 
            [IDS.purchaseOrders.po002, IDS.warehouses.lag, IDS.users.jason]
        );

        await manager.query(
            `
            INSERT INTO "purchase_order_lines"
                (
                    "id", 
                    "purchase_order_id", 
                    "product_id", 
                    "quantity_ordered", 
                    "quantity_received", 
                    "unit_cost_at_order", 
                    "currency"
                )
            VALUES
                ($1, $2, $3, 100, 100, 205.00, 'USD'),
                ($4, $2, $5, 50,  28,  498.00, 'USD')
            `, 
            [
                randomUUID(), IDS.purchaseOrders.po002, IDS.products.boots.id,
                randomUUID(), IDS.products.harness.id,
            ]
        );

        // 5. Stock transfer, dispatched, awaiting receipt
        await manager.query(
            `DELETE FROM "stock_transfer_lines" WHERE "stock_transfer_id" = $1`, 
            [IDS.stockTransfers.tr001]
        );

        await manager.query(
            `DELETE FROM "stock_transfers" WHERE "id" = $1`, 
            [IDS.stockTransfers.tr001]
        );

        await manager.query(
            `
            INSERT INTO "stock_transfers" 
                (
                    "id", 
                    "source_warehouse_id", 
                    "destination_warehouse_id",
                    "status", 
                    "notes", 
                    "created_by", 
                    "created_at", 
                    "updated_at"
                ) 
            VALUES 
                ($1, $2, $3, 'DISPATCHED', 'Urgent replenishment for LAG vest shortage', $4, now(), now())
            `, 
            [IDS.stockTransfers.tr001, IDS.warehouses.war, IDS.warehouses.lag, IDS.users.kate]
        );

        await manager.query(
            `
            INSERT INTO "stock_transfer_lines" 
                (
                    "id", 
                    "stock_transfer_id", 
                    "product_id",
                    "quantity_requested", 
                    "quantity_dispatched", 
                    "quantity_received"
                )
            VALUES
                ($1, $2, $3, 100, 100, 0),
                ($4, $2, $5, 50,  50,  0)
            `, 
            [
                randomUUID(), IDS.stockTransfers.tr001, IDS.products.vest.id,
                randomUUID(), IDS.products.aprons.id,
            ]
        );
    });

    console.log('PostgreSQL seeded with settings, balances, ledger, purchase orders, transfer, alerts');
}

export async function seedDatabase(): Promise<void> {
    const dataSource = new DataSource({
        ...publicDataSourceConfig,
        synchronize: false,
        logging: false,
    });

    await dataSource.initialize();
    console.log('PostgreSQL connected');

    await mongoose.connect(process.env.MONGO_URI);
    const connection = mongoose.connection;
    console.log('MongoDB connected');

    try {
        await seedMongo(connection);
        await seedPostgres(dataSource);
    } finally {
        await dataSource.destroy();
        await mongoose.disconnect();
        console.log('Connections closed');
    }
}

if (require.main === module && !process.argv[1].includes('main.js')) {
    seedDatabase().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
