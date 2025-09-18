import { MigrationInterface, QueryRunner } from "typeorm";

export class Message1758214391788 implements MigrationInterface {
    name = 'Message1758214391788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "address" text NOT NULL, "room" text NOT NULL, "amount" text NOT NULL, "url" text NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_messages_room" ON "messages" ("room") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_messages_room"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}
