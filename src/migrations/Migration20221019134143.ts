import { Migration } from '@mikro-orm/migrations';

export class Migration20221019134143 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "review" ("id" varchar(255) not null, "created" timestamptz(0) not null, "reviewed_card_id" varchar(255) not null, "answer" varchar(255) not null, "answered_correctly" boolean not null, constraint "review_pkey" primary key ("id"));');

    this.addSql('alter table "review" add constraint "review_reviewed_card_id_foreign" foreign key ("reviewed_card_id") references "flash_card" ("id") on update cascade;');

    this.addSql('alter table "flash_card" add column "question" varchar(255) not null, add column "possible_answers" text[] not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "review" cascade;');

    this.addSql('alter table "flash_card" drop column "question";');
    this.addSql('alter table "flash_card" drop column "possible_answers";');
  }

}
