import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuctionNumberFix1758726353038 implements MigrationInterface {
    name = 'AddAuctionNumberFix1758726353038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_win_history" RENAME COLUMN "auctionNumber" TO "auction_number"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_win_history" RENAME COLUMN "auction_number" TO "auctionNumber"`);
    }

}
