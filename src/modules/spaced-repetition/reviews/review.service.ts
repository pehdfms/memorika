import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { PaginationQuery, PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { EntityRepository } from '@mikro-orm/core'
import { CreateReviewDto } from '@modules/spaced-repetition/reviews/dtos/create-review.dto'
import { Review } from './review.entity'
import { FlashCard } from '../flash-cards/flash-card.entity'
import { FlashCardService } from '../flash-cards/flash-card.service'

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
    await this.flashCardRepository.populate(flashCard, ['deck', 'reviews'])

    const addedReview = await flashCard.submitAnswer(review.answer)

    await this.flashCardRepository.persistAndFlush(flashCard)

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
