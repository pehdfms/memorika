import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { DeckController } from './controllers/deck.controller'
import { FlashCardController } from './controllers/flash-card.controller'
import { ReviewController } from './controllers/review.controller'
import { Deck } from './domain/entities/deck.entity'
import { FlashCard } from './domain/entities/flash-card.entity'
import { Review } from './domain/entities/review.entity'
import { DeckService } from './domain/services/deck.service'
import { FlashCardService } from './domain/services/flash-card.service'
import { ReviewService } from './domain/services/review.service'

const entities = [Deck, FlashCard, Review]

@Module({
  imports: [MikroOrmModule.forFeature(entities)],
  controllers: [DeckController, FlashCardController, ReviewController],
  providers: [DeckService, FlashCardService, ReviewService]
})
export class SpacedRepetitionModule {}
