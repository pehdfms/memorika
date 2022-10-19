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
import { PaginationQuery } from 'src/libs/types/pagination'
import { DeckService } from '../domain/services/deck.service'
import { CreateDeckDto } from '../dtos/create-deck.dto'
import { UpdateDeckDto } from '../dtos/update-deck.dto'

@ApiTags('Spaced Repetition')
@Controller('decks')
export class DeckController {
  private readonly logger = new Logger(DeckService.name)

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
