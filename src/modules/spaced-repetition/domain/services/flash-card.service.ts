import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { ObjectLiteral, Repository } from 'typeorm'
import { CreateFlashCardDto } from '../../dtos/create-flash-card.dto'
import { FlashCardQueryDto } from '../../dtos/flash-card-query.dto'
import { PaginatedFlashCardQuery } from '../../dtos/paginated-flash-card-query.dto'
import { UpdateFlashCardDto } from '../../dtos/update-flash-card.dto'
import { FlashCard } from '../entities/flash-card.entity'
import { DeckService } from './deck.service'

@Injectable()
export class FlashCardService {
  private readonly logger = new Logger(FlashCardService.name)

  constructor(
    @InjectRepository(FlashCard) private readonly flashCardRepository: Repository<FlashCard>,
    private readonly deckService: DeckService
  ) {}

  async create(createFlashCardDto: CreateFlashCardDto, deckId: string): Promise<FlashCard> {
    const deck = await this.deckService.findOne(deckId)
    return (await this.flashCardRepository.insert({ ...createFlashCardDto, deck }))
      .generatedMaps[0] as FlashCard
  }

  async findAll(query: PaginatedFlashCardQuery): Promise<PaginationResponse<FlashCard>> {
    const { deck } = query

    const [result, total] = await this.flashCardRepository.findAndCount({
      where: {
        deck: {
          id: deck
        }
      },
      withDeleted: false,
      ...getPaginationOptions(query)
    })

    return new PaginationResponse(query, total, result)
  }

  async findOne({ deck, id }: FlashCardQueryDto): Promise<FlashCard> {
    const result = await this.flashCardRepository.findOne({
      where: {
        id,
        deck: {
          id: deck
        }
      }
    })

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async update(
    { deck, id }: FlashCardQueryDto,
    updateFlashCardDto: UpdateFlashCardDto
  ): Promise<ObjectLiteral> {
    const result = (
      await this.flashCardRepository
        .createQueryBuilder()
        .update(updateFlashCardDto)
        .where({ id, deck: { id: deck } })
        .returning('*')
        .execute()
    ).raw[0]

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async remove({ deck, id }: FlashCardQueryDto): Promise<void> {
    const result = await this.flashCardRepository.delete({ id, deck: { id: deck } })

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
