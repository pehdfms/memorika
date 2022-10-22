import { Migration } from '@mikro-orm/migrations';

export class Migration20221019124234 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "flash_card" drop column "is_due";');
    this.addSql('alter table "flash_card" drop column "passes";');
    this.addSql('alter table "flash_card" drop column "lapses";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "flash_card" add column "is_due" jsonb not null, add column "passes" text[] not null, add column "lapses" text[] not null;');
  }

}
