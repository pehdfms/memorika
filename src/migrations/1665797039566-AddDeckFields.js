const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddDeckFields1665797039566 {
    name = 'AddDeckFields1665797039566'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "deck"
            ADD "name" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "deck"
            ADD "description" character varying NOT NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "deck" DROP COLUMN "description"
        `); await queryRunner.query(`
            ALTER TABLE "deck" DROP COLUMN "name"
        `);
    }
}
