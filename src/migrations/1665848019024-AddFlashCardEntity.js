const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddFlashCardEntity1665848019024 {
    name = 'AddFlashCardEntity1665848019024'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "flash_card" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL,
                "deckId" uuid NOT NULL,
                CONSTRAINT "PK_4ed5054d4eddd35b19fa1972c0d" PRIMARY KEY ("id")
            )
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
            DROP TABLE "flash_card"
        `);
    }
}
