import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuctionNumber1758725605722 implements MigrationInterface {
    name = 'AddAuctionNumber1758725605722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_win_history" ADD "auctionNumber" bigint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "auction_win_history" ADD CONSTRAINT "UQ_d0433063fefe16ee6376ec3d256" UNIQUE ("room")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_win_history" DROP CONSTRAINT "UQ_d0433063fefe16ee6376ec3d256"`);
        await queryRunner.query(`ALTER TABLE "auction_win_history" DROP COLUMN "auctionNumber"`);
    }

}
