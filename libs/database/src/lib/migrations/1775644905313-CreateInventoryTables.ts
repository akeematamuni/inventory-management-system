import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInventoryTables1775644905313 implements MigrationInterface {
    name = 'CreateInventoryTables1775644905313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."stock_transfers_stock_transfer_status_enum" AS ENUM('PENDING', 'DISPATCHED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "stock_transfers" ("id" uuid NOT NULL, "source_warehouse_id" uuid NOT NULL, "destination_warehouse_id" uuid NOT NULL, "stock_transfer_status" "public"."stock_transfers_stock_transfer_status_enum" NOT NULL, "notes" text, "created_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ef738a3a4a578c7f1802c1bb50a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_160d538ff4f574a6d0a6f5db99" ON "stock_transfers" ("source_warehouse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bd19b098953a9d374520e8c2ff" ON "stock_transfers" ("destination_warehouse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b6f8de97ecbf46d6cae6c516c" ON "stock_transfers" ("stock_transfer_status") `);
        await queryRunner.query(`CREATE TABLE "stock_transfer_lines" ("id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity_requested" integer NOT NULL, "quantity_dispatched" integer NOT NULL DEFAULT '0', "quantity_recieved" integer NOT NULL DEFAULT '0', "stock_transfer_id" uuid NOT NULL, CONSTRAINT "PK_471b427d94a3f10ca3bcd9de9ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."stock_ledger_entry_movement_type_enum" AS ENUM('RECEIPT', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT_UP', 'ADJUSTMENT_DOWN', 'CYCLE_COUNT_ADJ', 'OPENING_STOCK')`);
        await queryRunner.query(`CREATE TABLE "stock_ledger_entry" ("id" uuid NOT NULL, "product_id" uuid NOT NULL, "warehouse_id" uuid NOT NULL, "movement_type" "public"."stock_ledger_entry_movement_type_enum" NOT NULL, "unit_cost" numeric(15,4), "currency" character varying(3), "quantity_change" integer NOT NULL, "balance_after" integer NOT NULL, "reference_id" uuid NOT NULL, "reference_type" character varying(50) NOT NULL, "performed_by" uuid NOT NULL, "notes" text, "occurred_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1326356f8dbced6cc94d4a43ded" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a09c4164a49488a16c8c38bc2a" ON "stock_ledger_entry" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d6b941b16ebd42ad38eaf79621" ON "stock_ledger_entry" ("warehouse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_81810c6eb4bfd9e5dfda586a9d" ON "stock_ledger_entry" ("movement_type") `);
        await queryRunner.query(`CREATE TABLE "stock_balances" ("id" uuid NOT NULL, "product_id" uuid NOT NULL, "warehouse_id" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9ec96c724d589b77f6d43546db2" UNIQUE ("product_id", "warehouse_id"), CONSTRAINT "PK_4c0d249ce58f9a559eb7df31b23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b940a160f793ee34c4a057b7c9" ON "stock_balances" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ec718dfbbf08afb84b0f665fc0" ON "stock_balances" ("warehouse_id") `);
        await queryRunner.query(`CREATE TYPE "public"."stock_alerts_status_enum" AS ENUM('UNRESOLVED', 'RESOLVED')`);
        await queryRunner.query(`CREATE TABLE "stock_alerts" ("id" uuid NOT NULL, "product_id" uuid NOT NULL, "warehouse_id" uuid NOT NULL, "current_balance" integer NOT NULL, "reorder_point" integer NOT NULL, "status" "public"."stock_alerts_status_enum" NOT NULL, "resolved_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1303c87f3abd3736c61cdb29672" UNIQUE ("product_id", "warehouse_id", "status"), CONSTRAINT "PK_3c3bb550b3bf192460bffe3a55b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dad362a1120c7a8b522ed7aaa0" ON "stock_alerts" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c337c57004b541165e6474deba" ON "stock_alerts" ("warehouse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e87076b3b04a974ebe51213236" ON "stock_alerts" ("status") `);
        await queryRunner.query(`CREATE TYPE "public"."purchase_orders_status_enum" AS ENUM('DRAFT', 'OPEN', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "purchase_orders" ("id" uuid NOT NULL, "warehouse_id" uuid NOT NULL, "supplier_name" character varying(150) NOT NULL, "status" "public"."purchase_orders_status_enum" NOT NULL, "notes" text, "created_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05148947415204a897e8beb2553" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_74e4ce03ba3f8bc13de20fc594" ON "purchase_orders" ("warehouse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5272ac3aa931eedb14cd8789d6" ON "purchase_orders" ("status") `);
        await queryRunner.query(`CREATE TABLE "purchase_order_lines" ("id" uuid NOT NULL, "product_id" uuid NOT NULL, "unit_cost_at_order" numeric(15,4) NOT NULL, "quantity_ordered" integer NOT NULL, "quantity_recieved" integer NOT NULL DEFAULT '0', "currency" character varying(3) NOT NULL DEFAULT 'USD', "purchase_order_id" uuid NOT NULL, CONSTRAINT "PK_34a2082d2abb10c5d8713bc19b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_settings" ("id" uuid NOT NULL, "reorder_point" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8a366b7c7a94f8691b9e40b3bb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."cycle_counts_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "cycle_counts" ("id" uuid NOT NULL, "warehouse_id" uuid NOT NULL, "status" "public"."cycle_counts_status_enum" NOT NULL, "created_by" uuid NOT NULL, "approved_by" uuid, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c225dacfee469695d22f085f62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cycle_count_lines" ("id" uuid NOT NULL, "product_id" uuid NOT NULL, "cycle_count_id" uuid NOT NULL, "system_quantity" integer NOT NULL, "counted_quantity" integer, CONSTRAINT "PK_98308d52a97099dea2d0594ec75" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."adjustments_movement_type_enum" AS ENUM('RECEIPT', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT_UP', 'ADJUSTMENT_DOWN', 'CYCLE_COUNT_ADJ', 'OPENING_STOCK')`);
        await queryRunner.query(`CREATE TYPE "public"."adjustments_reason_code_enum" AS ENUM('DAMAGE', 'THEFT', 'EXPIRY', 'COUNTING_ERROR', 'FOUND_STOCK', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "adjustments" ("id" uuid NOT NULL, "product_id" uuid NOT NULL, "warehouse_id" uuid NOT NULL, "movement_type" "public"."adjustments_movement_type_enum" NOT NULL, "quantity" integer NOT NULL, "reason_code" "public"."adjustments_reason_code_enum" NOT NULL, "reason_notes" text, "notes" text, "created_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9236bf670736e5ad5df36dd1eb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6e585de71528fd27ccd3b8ab57" ON "adjustments" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_36e2fc4895b9d7ac4062302ad1" ON "adjustments" ("warehouse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8beb4d2f5cd2fabdb23c38d49c" ON "adjustments" ("movement_type") `);
        await queryRunner.query(`ALTER TABLE "stock_transfer_lines" ADD CONSTRAINT "FK_07d7c822941a526ce016984f884" FOREIGN KEY ("stock_transfer_id") REFERENCES "stock_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "FK_c70f4952f88b5bd649151f631c8" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cycle_count_lines" ADD CONSTRAINT "FK_ec14b31469d1aaf0e694875549b" FOREIGN KEY ("cycle_count_id") REFERENCES "cycle_counts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cycle_count_lines" DROP CONSTRAINT "FK_ec14b31469d1aaf0e694875549b"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_lines" DROP CONSTRAINT "FK_c70f4952f88b5bd649151f631c8"`);
        await queryRunner.query(`ALTER TABLE "stock_transfer_lines" DROP CONSTRAINT "FK_07d7c822941a526ce016984f884"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8beb4d2f5cd2fabdb23c38d49c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_36e2fc4895b9d7ac4062302ad1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6e585de71528fd27ccd3b8ab57"`);
        await queryRunner.query(`DROP TABLE "adjustments"`);
        await queryRunner.query(`DROP TYPE "public"."adjustments_reason_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adjustments_movement_type_enum"`);
        await queryRunner.query(`DROP TABLE "cycle_count_lines"`);
        await queryRunner.query(`DROP TABLE "cycle_counts"`);
        await queryRunner.query(`DROP TYPE "public"."cycle_counts_status_enum"`);
        await queryRunner.query(`DROP TABLE "product_settings"`);
        await queryRunner.query(`DROP TABLE "purchase_order_lines"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5272ac3aa931eedb14cd8789d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74e4ce03ba3f8bc13de20fc594"`);
        await queryRunner.query(`DROP TABLE "purchase_orders"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_orders_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e87076b3b04a974ebe51213236"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c337c57004b541165e6474deba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dad362a1120c7a8b522ed7aaa0"`);
        await queryRunner.query(`DROP TABLE "stock_alerts"`);
        await queryRunner.query(`DROP TYPE "public"."stock_alerts_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ec718dfbbf08afb84b0f665fc0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b940a160f793ee34c4a057b7c9"`);
        await queryRunner.query(`DROP TABLE "stock_balances"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_81810c6eb4bfd9e5dfda586a9d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d6b941b16ebd42ad38eaf79621"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a09c4164a49488a16c8c38bc2a"`);
        await queryRunner.query(`DROP TABLE "stock_ledger_entry"`);
        await queryRunner.query(`DROP TYPE "public"."stock_ledger_entry_movement_type_enum"`);
        await queryRunner.query(`DROP TABLE "stock_transfer_lines"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b6f8de97ecbf46d6cae6c516c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bd19b098953a9d374520e8c2ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_160d538ff4f574a6d0a6f5db99"`);
        await queryRunner.query(`DROP TABLE "stock_transfers"`);
        await queryRunner.query(`DROP TYPE "public"."stock_transfers_stock_transfer_status_enum"`);
    }

}
