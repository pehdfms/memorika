import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { PaginationQuery, PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { CreateDeckDto } from '../../dtos/create-deck.dto'
import { UpdateDeckDto } from '../../dtos/update-deck.dto'
import { Deck } from '../entities/deck.entity'
import { EntityRepository, wrap } from '@mikro-orm/core'

@Injectable()
export class DeckService {
  private readonly logger = new Logger(DeckService.name)

  constructor(@InjectRepository(Deck) private readonly deckRepository: EntityRepository<Deck>) {}

  async create(createDeckDto: CreateDeckDto): Promise<Deck> {
    const newDeck = this.deckRepository.create(createDeckDto)
    await this.deckRepository.persistAndFlush(newDeck)

    return newDeck
  }

  async findAll(query: PaginationQuery): Promise<PaginationResponse<Deck>> {
    const [result, total] = await this.deckRepository.findAndCount({}, getPaginationOptions(query))

    return new PaginationResponse(query, total, result)
  }

  async findOne(id: string): Promise<Deck> {
    const result = await this.deckRepository.findOne({ id }, { populate: ['flashCards'] })

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async update(id: string, updateDeckDto: UpdateDeckDto): Promise<Deck> {
    const existingDeck = await this.findOne(id)
    wrap(existingDeck).assign(updateDeckDto)

    await this.deckRepository.persistAndFlush(existingDeck)
    return existingDeck
  }

  async remove(id: string): Promise<void> {
    const deck = await this.findOne(id)
    await this.deckRepository.populate(deck, ['flashCards.reviews'])

    await this.deckRepository.removeAndFlush(deck)
  }
}
