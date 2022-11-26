import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { DeckModule } from '../decks/deck.module'
import { FlashCardController } from './flash-card.controller'
import { FlashCard } from './flash-card.entity'
import { FlashCardService } from './flash-card.service'

@Module({
  imports: [MikroOrmModule.forFeature([FlashCard]), DeckModule],
  controllers: [FlashCardController],
  providers: [FlashCardService],
  exports: [FlashCardService]
})
export class FlashCardModule {}
