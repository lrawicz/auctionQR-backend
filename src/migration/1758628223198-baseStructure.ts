import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseStructure1758628223198 implements MigrationInterface {
    name = 'BaseStructure1758628223198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "address" text NOT NULL, "room" text NOT NULL, "amount" bigint NOT NULL, "url" text NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_messages_room" ON "messages" ("room") `);
        await queryRunner.query(`CREATE TABLE "auction_win_history" ("room" text NOT NULL, "amount" bigint NOT NULL, "url" character varying NOT NULL, CONSTRAINT "UQ_d0433063fefe16ee6376ec3d256" UNIQUE ("room"), CONSTRAINT "PK_d0433063fefe16ee6376ec3d256" PRIMARY KEY ("room"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auction_win_history"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_messages_room"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}
