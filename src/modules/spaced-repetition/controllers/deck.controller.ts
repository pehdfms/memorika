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
  Query
} from '@nestjs/common'
import { PaginationQuery } from 'src/libs/types/common/pagination'
import { DeckService } from '../domain/services/deck.service'
import { CreateDeckDto } from '../dtos/create-deck.dto'
import { UpdateDeckDto } from '../dtos/update-deck.dto'

@Controller('decks')
export class DeckController {
  private readonly logger = new Logger(DeckService.name)
  constructor(private readonly deckService: DeckService) {}

  @Post()
  create(@Body() createDeckDto: CreateDeckDto) {
    this.logger.log(createDeckDto)
    return this.deckService.create(createDeckDto)
  }

  @Get()
  findAll(@Query() query: PaginationQuery) {
    return this.deckService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deckService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return this.deckService.update(id, updateDeckDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deckService.remove(id)
  }
}
