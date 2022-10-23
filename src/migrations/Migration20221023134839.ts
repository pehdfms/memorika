import { Migration } from '@mikro-orm/migrations';

export class Migration20221023134839 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "review" rename column "created" to "review_date";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "review" rename column "review_date" to "created";');
  }

}
