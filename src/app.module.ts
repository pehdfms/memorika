import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { LoggerModule } from 'nestjs-pino'
import { SpacedRepetitionModule } from './modules/spaced-repetition/spaced-repetition.module'

@Module({
  controllers: [],
  providers: [],
  imports: [
    MikroOrmModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true
          }
        }
      }
    }),
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    SpacedRepetitionModule
  ]
})
export class AppModule {}
