import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { FlashCardModule } from '../flash-cards/flash-card.module'
import { ReviewController } from './review.controller'
import { Review } from './review.entity'
import { ReviewService } from './review.service'

@Module({
  imports: [MikroOrmModule.forFeature([Review]), FlashCardModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService]
})
export class ReviewModule {}
