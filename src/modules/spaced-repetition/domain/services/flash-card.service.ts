import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { ObjectLiteral, Repository } from 'typeorm'
import { DeepCreateFlashCardDto } from '../../dtos/deep-create-flash-card.dto'
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

  async create(createFlashCardDto: DeepCreateFlashCardDto): Promise<ObjectLiteral> {
    const deck = await this.deckService.findOne(createFlashCardDto.deck)
    return (await this.flashCardRepository.insert({ ...createFlashCardDto, deck })).generatedMaps[0]
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
    return await this.flashCardRepository.findOne({
      where: {
        id,
        deck: {
          id: deck
        }
      }
    })
  }

  async update(
    { deck, id }: FlashCardQueryDto,
    updateFlashCardDto: UpdateFlashCardDto
  ): Promise<ObjectLiteral> {
    if (!this.findOne({ deck, id })) {
      throw new NotFoundException()
    }

    return (await this.flashCardRepository.update(id, updateFlashCardDto)).generatedMaps[0]
  }

  async remove({ deck, id }: FlashCardQueryDto): Promise<void> {
    if (!this.findOne({ deck, id })) {
      throw new NotFoundException()
    }

    await this.flashCardRepository.delete(id)
  }
}
