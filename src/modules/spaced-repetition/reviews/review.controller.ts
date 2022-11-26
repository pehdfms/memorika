import { PaginationQuery } from '@libs/types/pagination'
import { JwtAuthenticationGuard } from '@modules/identity/auth/jwt-authentication.guard'
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Logger,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ReviewService } from '../reviews/review.service'
import { CreateReviewDto } from './dtos/create-review.dto'

@ApiTags('Spaced Repetition')
@UseGuards(JwtAuthenticationGuard)
@Controller('reviews')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name)

  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    return await this.reviewService.create(createReviewDto)
  }

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    return await this.reviewService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.reviewService.findOne(id)
  }
}
