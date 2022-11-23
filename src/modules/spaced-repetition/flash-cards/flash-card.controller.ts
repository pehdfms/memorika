import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Logger,
  Query,
  HttpStatus,
  HttpCode
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FlashCardService } from '../flash-cards/flash-card.service'
import { CreateFlashCardDto } from './dtos/create-flash-card.dto'
import { PaginatedFlashCardQuery } from './dtos/paginated-flash-card-query.dto'
import { UpdateFlashCardDto } from './dtos/update-flash-card.dto'

@ApiTags('Spaced Repetition')
@Controller('flash-cards')
export class FlashCardController {
  private readonly logger = new Logger(FlashCardController.name)

  constructor(private readonly flashCardService: FlashCardService) {}

  @Post()
  async create(@Body() createFlashCardDto: CreateFlashCardDto) {
    return await this.flashCardService.create(createFlashCardDto)
  }

  @Get()
  async findAll(@Query() query: PaginatedFlashCardQuery) {
    return await this.flashCardService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.flashCardService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFlashCardDto: UpdateFlashCardDto
  ) {
    return await this.flashCardService.update(id, updateFlashCardDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.flashCardService.remove(id)
  }
}
