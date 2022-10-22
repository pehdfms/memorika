import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { PaginationQuery, PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { EntityRepository, wrap } from '@mikro-orm/core'
import { CreateReviewDto } from '@modules/spaced-repetition/dtos/create-review.dto'
import { Review } from '../entities/review.entity'
import { FlashCardService } from './flash-card.service'
import { SchedulerFactory } from '../value-objects/schedulers/scheduler.factory'
import { FlashCard } from '../entities/flash-card.entity'

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name)

  constructor(
    @InjectRepository(Review) private readonly reviewRepository: EntityRepository<Review>,
    @InjectRepository(FlashCard) private readonly flashCardRepository: EntityRepository<FlashCard>,
    private readonly flashCardService: FlashCardService
  ) {}

  async create(review: CreateReviewDto) {
    const flashCard = await this.flashCardService.findOne(review.flashCard)
    await wrap(flashCard.deck).init()

    const scheduler = new SchedulerFactory().fromEnum(flashCard.deck.scheduler)
    const addedReview = await flashCard.submitAnswer(review.answer, scheduler)

    await this.flashCardRepository.persistAndFlush(flashCard)
    await this.reviewRepository.persistAndFlush(addedReview)

    return addedReview
  }

  async findAll(query: PaginationQuery): Promise<PaginationResponse<Review>> {
    const [result, total] = await this.reviewRepository.findAndCount(
      {},
      getPaginationOptions(query)
    )

    return new PaginationResponse(query, total, result)
  }

  async findOne(id: string): Promise<Review> {
    const result = await this.reviewRepository.findOne({
      id
    })

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }
}
