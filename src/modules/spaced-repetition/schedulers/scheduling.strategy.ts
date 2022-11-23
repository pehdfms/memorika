import { FlashCard } from '../flash-cards/flash-card.entity'

export interface SchedulingStrategy {
  schedule(flashCard: FlashCard): Promise<Date>
}
