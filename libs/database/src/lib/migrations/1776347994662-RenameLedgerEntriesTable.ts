import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameLedgerEntriesTable1776347994662 implements MigrationInterface {
    name = 'RenameLedgerEntriesTable1776347994662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."stock_ledger_entry_movement_type_enum" RENAME TO "stock_ledger_entries_movement_type_enum"`);

        await queryRunner.query(`ALTER TABLE "stock_ledger_entry" RENAME TO "stock_ledger_entries"`);
        await queryRunner.query(`ALTER INDEX "IDX_a09c4164a49488a16c8c38bc2a" RENAME TO "IDX_781c135bcac4ceed2b9957eec5"`);
        await queryRunner.query(`ALTER INDEX "IDX_d6b941b16ebd42ad38eaf79621" RENAME TO "IDX_3eb3489ac4ad943c3cfe68455c"`);
        await queryRunner.query(`ALTER INDEX "IDX_81810c6eb4bfd9e5dfda586a9d" RENAME TO "IDX_d96e4d1f5352ec7fabd9af4c76"`);
        await queryRunner.query(`ALTER TABLE "stock_ledger_entries" RENAME CONSTRAINT "PK_1326356f8dbced6cc94d4a43ded" TO "PK_ce332a237ab9d7e46edd9078657"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_ledger_entries" RENAME CONSTRAINT "PK_ce332a237ab9d7e46edd9078657" TO "PK_1326356f8dbced6cc94d4a43ded"`);
        await queryRunner.query(`ALTER INDEX "IDX_d96e4d1f5352ec7fabd9af4c76" RENAME TO "IDX_81810c6eb4bfd9e5dfda586a9d"`);
        await queryRunner.query(`ALTER INDEX "IDX_3eb3489ac4ad943c3cfe68455c" RENAME TO "IDX_d6b941b16ebd42ad38eaf79621"`);
        await queryRunner.query(`ALTER INDEX "IDX_781c135bcac4ceed2b9957eec5" RENAME TO "IDX_a09c4164a49488a16c8c38bc2a"`);
        await queryRunner.query(`ALTER TABLE "stock_ledger_entries" RENAME TO "stock_ledger_entry"`);
        await queryRunner.query(`ALTER TYPE "public"."stock_ledger_entries_movement_type_enum" RENAME TO "stock_ledger_entry_movement_type_enum"`);
    }

}
