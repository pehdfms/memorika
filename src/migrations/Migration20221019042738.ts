import { Migration } from '@mikro-orm/migrations';

export class Migration20221019042738 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "deck" alter column "scheduler" type text using ("scheduler"::text);');
    this.addSql('alter table "deck" add constraint "deck_scheduler_check" check ("scheduler" in (\'LeitnerScheduler\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "deck" drop constraint if exists "deck_scheduler_check";');

    this.addSql('alter table "deck" alter column "scheduler" type jsonb using ("scheduler"::jsonb);');
  }

}
