import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerModule } from 'nestjs-pino'
import { SpacedRepetitionModule } from './modules/spaced-repetition/spaced-repetition.module'

const ConfiguredTypeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    synchronize: false,
    entities: [__dirname + '/**/*.entity.{ts,js}'],
    migrations: [__dirname + '/migrations/**/*.{ts,js}'],
    migrationsRun: true,
    cli: {
      migrationsDir: '**/src/migrations'
    }
  }),
  inject: [ConfigService]
})

@Module({
  controllers: [],
  providers: [],
  imports: [
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
    ConfiguredTypeOrmModule,
    SpacedRepetitionModule
  ]
})
export class AppModule {}
