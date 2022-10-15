const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Init1665796446642 {
    name = 'Init1665796446642'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "deck" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_99f8010303acab0edf8e1df24f9" PRIMARY KEY ("id")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "deck"
        `);
    }
}
