import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { CreateFlashCardDto } from '../../dtos/create-flash-card.dto'
import { FlashCardQueryDto } from '../../dtos/flash-card-query.dto'
import { PaginatedFlashCardQuery } from '../../dtos/paginated-flash-card-query.dto'
import { UpdateFlashCardDto } from '../../dtos/update-flash-card.dto'
import { FlashCard } from '../entities/flash-card.entity'
import { DeckService } from './deck.service'
import { EntityRepository, wrap } from '@mikro-orm/core'

@Injectable()
export class FlashCardService {
  private readonly logger = new Logger(FlashCardService.name)

  constructor(
    @InjectRepository(FlashCard) private readonly flashCardRepository: EntityRepository<FlashCard>,
    private readonly deckService: DeckService
  ) {}

  async create(createFlashCardDto: CreateFlashCardDto, deckId: string): Promise<FlashCard> {
    const deck = await this.deckService.findOne(deckId)
    const newFlashCard = this.flashCardRepository.create({ ...createFlashCardDto, deck })

    await this.flashCardRepository.persistAndFlush(newFlashCard)

    return newFlashCard
  }

  async findAll(query: PaginatedFlashCardQuery): Promise<PaginationResponse<FlashCard>> {
    const { deck } = query

    const [result, total] = await this.flashCardRepository.findAndCount(
      {
        deck: {
          id: deck
        }
      },
      getPaginationOptions(query)
    )

    return new PaginationResponse(query, total, result)
  }

  async findOne({ deck, id }: FlashCardQueryDto): Promise<FlashCard> {
    const result = await this.flashCardRepository.findOne({
      id,
      deck: {
        id: deck
      }
    })

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async update(
    query: FlashCardQueryDto,
    updateFlashCardDto: UpdateFlashCardDto
  ): Promise<FlashCard> {
    const existingFlashCard = await this.findOne(query)
    wrap(existingFlashCard).assign(updateFlashCardDto)

    await this.flashCardRepository.persistAndFlush(existingFlashCard)
    return existingFlashCard
  }

  async remove(query: FlashCardQueryDto): Promise<void> {
    const flashCard = await this.findOne(query)
    await this.flashCardRepository.removeAndFlush(flashCard)
  }
}
