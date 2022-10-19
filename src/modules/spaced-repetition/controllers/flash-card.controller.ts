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
import { PaginationQuery } from 'src/libs/types/pagination'
import { FlashCardService } from '../domain/services/flash-card.service'
import { CreateFlashCardDto } from '../dtos/create-flash-card.dto'
import { UpdateFlashCardDto } from '../dtos/update-flash-card.dto'

@ApiTags('Spaced Repetition')
@Controller('decks/:deckId/flash-cards')
export class FlashCardController {
  private readonly logger = new Logger(FlashCardService.name)

  constructor(private readonly flashCardService: FlashCardService) {}

  @Post()
  async create(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @Body() createFlashCardDto: CreateFlashCardDto
  ) {
    return await this.flashCardService.create(createFlashCardDto, deckId)
  }

  @Get()
  async findAll(@Param('deckId', ParseUUIDPipe) deckId: string, @Query() query: PaginationQuery) {
    return await this.flashCardService.findAll({ ...query, deck: deckId })
  }

  @Get(':id')
  async findOne(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.flashCardService.findOne({ deck: deckId, id })
  }

  @Patch(':id')
  async update(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFlashCardDto: UpdateFlashCardDto
  ) {
    return await this.flashCardService.update({ deck: deckId, id }, updateFlashCardDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    await this.flashCardService.remove({ deck: deckId, id })
  }
}
