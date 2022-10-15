import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeckController } from './controllers/deck.controller'
import { Deck } from './domain/entities/deck.entity'
import { DeckService } from './domain/services/deck.service'

@Module({
  imports: [TypeOrmModule.forFeature([Deck])],
  controllers: [DeckController],
  providers: [DeckService]
})
export class SpacedRepetitionModule {}
