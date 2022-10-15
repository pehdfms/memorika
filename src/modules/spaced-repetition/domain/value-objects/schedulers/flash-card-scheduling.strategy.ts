import { FlashCard } from '../../entities/flash-card.entity'

export interface FlashCardSchedulingStrategy {
  schedule(flashCard: FlashCard): Date
}
