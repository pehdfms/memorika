const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class FlashCardOptionalDueDate1665850575066 {
    name = 'FlashCardOptionalDueDate1665850575066'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "flash_card" DROP CONSTRAINT "FK_9f7d924d66910f3f7099741e7bd"
        `);
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ALTER COLUMN "dueDate" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ALTER COLUMN "deckId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ADD CONSTRAINT "FK_9f7d924d66910f3f7099741e7bd" FOREIGN KEY ("deckId") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "flash_card" DROP CONSTRAINT "FK_9f7d924d66910f3f7099741e7bd"
        `);
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ALTER COLUMN "deckId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ALTER COLUMN "dueDate"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ADD CONSTRAINT "FK_9f7d924d66910f3f7099741e7bd" FOREIGN KEY ("deckId") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
}
