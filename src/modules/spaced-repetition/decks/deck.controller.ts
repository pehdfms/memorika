import { PaginationQuery } from '@libs/types/pagination'
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
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { DeckService } from '../decks/deck.service'
import { CreateDeckDto } from './dtos/create-deck.dto'
import { UpdateDeckDto } from './dtos/update-deck.dto'

@ApiTags('Spaced Repetition')
@Controller('decks')
export class DeckController {
  private readonly logger = new Logger(DeckController.name)

  constructor(private readonly deckService: DeckService) {}

  @Post()
  async create(@Body() createDeckDto: CreateDeckDto) {
    return await this.deckService.create(createDeckDto)
  }

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    return await this.deckService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deckService.findOne(id)
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return await this.deckService.update(id, updateDeckDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deckService.remove(id)
  }
}
