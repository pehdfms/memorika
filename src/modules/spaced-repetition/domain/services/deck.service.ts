import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationQuery } from 'src/libs/types/common/pagination'
import { getPaginationOptions, getPaginationResult } from 'src/libs/utils/pagination.utils'
import { Repository } from 'typeorm'
import { CreateDeckDto } from '../../dtos/create-deck.dto'
import { UpdateDeckDto } from '../../dtos/update-deck.dto'
import { Deck } from '../entities/deck.entity'

@Injectable()
export class DeckService {
  private readonly logger = new Logger(DeckService.name)

  constructor(@InjectRepository(Deck) private readonly deckRepository: Repository<Deck>) {}

  async create(createDeckDto: CreateDeckDto) {
    return await this.deckRepository.save(createDeckDto)
  }

  async findAll(query: PaginationQuery) {
    const [result, total] = await this.deckRepository.findAndCount({
      withDeleted: false,
      ...getPaginationOptions(query)
    })

    return {
      data: result,
      ...getPaginationResult(query, total)
    }
  }

  async findOne(id: string) {
    return await this.deckRepository.findOne({ where: { id } })
  }

  async update(id: string, updateDeckDto: UpdateDeckDto) {
    return await this.deckRepository.update(id, updateDeckDto)
  }

  async remove(id: string) {
    return await this.deckRepository.delete(id)
  }
}
