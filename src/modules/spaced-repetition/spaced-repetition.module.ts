import { Module } from '@nestjs/common'
import { FlashCardModule } from './flash-cards/flash-card.module'
import { DeckModule } from './decks/deck.module'
import { ReviewModule } from './reviews/review.module'

@Module({
  imports: [DeckModule, FlashCardModule, ReviewModule]
})
export class SpacedRepetitionModule {}
