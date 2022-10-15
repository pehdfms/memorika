const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class FixFlashCardIsDue1665851862861 {
    name = 'FixFlashCardIsDue1665851862861'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "flash_card" DROP COLUMN "isDue"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ADD "isDue" boolean NOT NULL
        `);
    }
}
