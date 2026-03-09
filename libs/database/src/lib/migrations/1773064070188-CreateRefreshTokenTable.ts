import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRefreshTokenTable1773064070188 implements MigrationInterface {
    name = 'CreateRefreshTokenTable1773064070188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL, "token" character varying(255) NOT NULL, "user_id" uuid NOT NULL, "is_revoked" boolean NOT NULL DEFAULT false, "revoked_at" TIMESTAMP, "expires_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4542dd2f38a61354a040ba9fd5" ON "refresh_tokens" ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_3ddc983c5f7bcf132fd8732c3f" ON "refresh_tokens" ("user_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3ddc983c5f7bcf132fd8732c3f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4542dd2f38a61354a040ba9fd5"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
