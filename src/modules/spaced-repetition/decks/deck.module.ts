import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { DeckController } from './deck.controller'
import { Deck } from './deck.entity'
import { DeckService } from './deck.service'

@Module({
  imports: [MikroOrmModule.forFeature([Deck])],
  controllers: [DeckController],
  providers: [DeckService],
  exports: [DeckService]
})
export class DeckModule {}
