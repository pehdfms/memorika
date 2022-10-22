import { Migration } from '@mikro-orm/migrations';

export class Migration20221022223658 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "flash_card" add column "case_sensitive" boolean not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "flash_card" drop column "case_sensitive";');
  }

}
