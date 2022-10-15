import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationQuery, PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { Repository } from 'typeorm'
import { CreateDeckDto } from '../../dtos/create-deck.dto'
import { UpdateDeckDto } from '../../dtos/update-deck.dto'
import { Deck } from '../entities/deck.entity'

@Injectable()
export class DeckService {
  private readonly logger = new Logger(DeckService.name)

  constructor(@InjectRepository(Deck) private readonly deckRepository: Repository<Deck>) {}

  async create(createDeckDto: CreateDeckDto): Promise<Deck> {
    return await this.deckRepository.save(createDeckDto)
  }

  async findAll(query: PaginationQuery): Promise<PaginationResponse<Deck>> {
    const [result, total] = await this.deckRepository.findAndCount({
      withDeleted: false,
      ...getPaginationOptions(query)
    })

    return new PaginationResponse(query, total, result)
  }

  async findOne(id: string) {
    const result = await this.deckRepository.findOne({ where: { id } })

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async update(id: string, updateDeckDto: UpdateDeckDto) {
    const result = (
      await this.deckRepository
        .createQueryBuilder()
        .update(updateDeckDto)
        .where({ id })
        .returning('*')
        .execute()
    ).raw[0]

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async remove(id: string) {
    const result = await this.deckRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
