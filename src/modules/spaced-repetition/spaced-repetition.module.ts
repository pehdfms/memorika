import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { DeckController } from './decks/deck.controller'
import { FlashCardController } from './flash-cards/flash-card.controller'
import { ReviewController } from './reviews/review.controller'
import { Deck } from './decks/deck.entity'
import { FlashCard } from './flash-cards/flash-card.entity'
import { Review } from './reviews/review.entity'
import { DeckService } from './decks/deck.service'
import { FlashCardService } from './flash-cards/flash-card.service'
import { ReviewService } from './reviews/review.service'

const entities = [Deck, FlashCard, Review]

@Module({
  imports: [MikroOrmModule.forFeature(entities)],
  controllers: [DeckController, FlashCardController, ReviewController],
  providers: [DeckService, FlashCardService, ReviewService]
})
export class SpacedRepetitionModule {}
