const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class FlashCardIsDueColumn1665851405948 {
    name = 'FlashCardIsDueColumn1665851405948'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ADD "isDue" boolean NOT NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "flash_card" DROP COLUMN "isDue"
        `);
    }
}
