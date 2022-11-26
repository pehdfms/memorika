import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { PaginationQuery, PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { EntityRepository } from '@mikro-orm/core'
import { CreateReviewDto } from '@modules/spaced-repetition/reviews/dtos/create-review.dto'
import { Review } from './review.entity'
import { FlashCardService } from '../flash-cards/flash-card.service'

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name)

  constructor(
    @InjectRepository(Review) private readonly reviewRepository: EntityRepository<Review>,
    private readonly flashCardService: FlashCardService
  ) {}

  async create(review: CreateReviewDto) {
    const flashCard = await this.flashCardService.findOne(review.flashCard)
    await this.flashCardService.populateAll(flashCard)

    const addedReview = await flashCard.submitAnswer(review.answer)

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
