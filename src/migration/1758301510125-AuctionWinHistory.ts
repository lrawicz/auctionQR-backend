import { MigrationInterface, QueryRunner } from "typeorm";

export class AuctionWinHistory1758301510125 implements MigrationInterface {
    name = 'AuctionWinHistory1758301510125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auction_win_history" ("id" SERIAL NOT NULL, "date" date NOT NULL, "amount" numeric(10,2) NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_f53b072b659b5e2bc9d9e1e1720" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auction_win_history"`);
    }

}
