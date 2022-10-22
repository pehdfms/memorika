import { Migration } from '@mikro-orm/migrations';

export class Migration20221022154948 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "review" rename column "answered_correctly" to "passed";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "review" rename column "passed" to "answered_correctly";');
  }

}
