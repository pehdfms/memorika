import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { EntityRepository, wrap } from '@mikro-orm/core'
import { FlashCard } from './flash-card.entity'
import { DeckService } from '../decks/deck.service'
import { PaginatedFlashCardQuery } from './dtos/paginated-flash-card-query.dto'
import { CreateFlashCardDto } from './dtos/create-flash-card.dto'
import { UpdateFlashCardDto } from './dtos/update-flash-card.dto'

@Injectable()
export class FlashCardService {
  private readonly logger = new Logger(FlashCardService.name)

  constructor(
    @InjectRepository(FlashCard) private readonly flashCardRepository: EntityRepository<FlashCard>,
    private readonly deckService: DeckService
  ) {}

  async create(flashCard: CreateFlashCardDto): Promise<FlashCard> {
    const deck = await this.deckService.findOne(flashCard.deck)
    const newFlashCard = this.flashCardRepository.create({ ...flashCard, deck })

    await this.flashCardRepository.persistAndFlush(newFlashCard)

    return newFlashCard
  }

  async findAll(query: PaginatedFlashCardQuery): Promise<PaginationResponse<FlashCard>> {
    const [result, total] = await this.flashCardRepository.findAndCount(
      {},
      getPaginationOptions(query)
    )

    return new PaginationResponse(query, total, result)
  }

  async findOne(id: string): Promise<FlashCard> {
    const result = await this.flashCardRepository.findOne({
      id
    })

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async update(id: string, updatedFlashCard: UpdateFlashCardDto): Promise<FlashCard> {
    const existingFlashCard = await this.findOne(id)
    wrap(existingFlashCard).assign(updatedFlashCard)

    await this.flashCardRepository.persistAndFlush(existingFlashCard)
    return existingFlashCard
  }

  async remove(id: string): Promise<void> {
    const flashCard = await this.findOne(id)
    await this.flashCardRepository.populate(flashCard, ['reviews'])

    await this.flashCardRepository.removeAndFlush(flashCard)
  }

  async populateAll(flashCard: FlashCard) {
    await this.flashCardRepository.populate(flashCard, ['deck', 'reviews'])
  }
}
