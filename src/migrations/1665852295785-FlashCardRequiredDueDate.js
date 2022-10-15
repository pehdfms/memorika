const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class FlashCardRequiredDueDate1665852295785 {
    name = 'FlashCardRequiredDueDate1665852295785'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ALTER COLUMN "dueDate"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ALTER COLUMN "dueDate"
            SET DEFAULT '"2022-10-15T16:44:57.720Z"'
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ALTER COLUMN "dueDate" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "flash_card"
            ALTER COLUMN "dueDate" DROP NOT NULL
        `);
    }
}
