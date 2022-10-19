import { Migration } from '@mikro-orm/migrations';

export class Migration20221019040120 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "deck" ("id" varchar(255) not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null, "scheduler" jsonb not null, constraint "deck_pkey" primary key ("id"));');

    this.addSql('create table "flash_card" ("id" varchar(255) not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "due_date" timestamptz(0) not null, "deck_id" varchar(255) not null, "is_due" jsonb not null, "passes" text[] not null, "lapses" text[] not null, constraint "flash_card_pkey" primary key ("id"));');

    this.addSql('alter table "flash_card" add constraint "flash_card_deck_id_foreign" foreign key ("deck_id") references "deck" ("id") on update cascade;');
  }

}
