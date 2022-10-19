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
  create(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @Body() createFlashCardDto: CreateFlashCardDto
  ) {
    return this.flashCardService.create(createFlashCardDto, deckId)
  }

  @Get()
  findAll(@Param('deckId', ParseUUIDPipe) deckId: string, @Query() query: PaginationQuery) {
    return this.flashCardService.findAll({ ...query, deck: deckId })
  }

  @Get(':id')
  findOne(@Param('deckId', ParseUUIDPipe) deckId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.flashCardService.findOne({ deck: deckId, id })
  }

  @Patch(':id')
  update(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFlashCardDto: UpdateFlashCardDto
  ) {
    return this.flashCardService.update({ deck: deckId, id }, updateFlashCardDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('deckId', ParseUUIDPipe) deckId: string, @Param('id', ParseUUIDPipe) id: string) {
    this.flashCardService.remove({ deck: deckId, id })
  }
}
