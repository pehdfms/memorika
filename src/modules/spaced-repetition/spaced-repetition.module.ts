import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { DeckController } from './controllers/deck.controller'
import { FlashCardController } from './controllers/flash-card.controller'
import { Deck } from './domain/entities/deck.entity'
import { FlashCard } from './domain/entities/flash-card.entity'
import { DeckService } from './domain/services/deck.service'
import { FlashCardService } from './domain/services/flash-card.service'

const entities = [Deck, FlashCard]

@Module({
  imports: [MikroOrmModule.forFeature(entities)],
  controllers: [DeckController, FlashCardController],
  providers: [DeckService, FlashCardService]
})
export class SpacedRepetitionModule {}
