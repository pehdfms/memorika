import { Logger } from 'nestjs-pino'
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common'
import { QueryErrorFilter } from './configs/filters/query-error.filter'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose'],
    bufferLogs: true
  })

  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useLogger(app.get(Logger))

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  app.useGlobalFilters(new QueryErrorFilter(httpAdapter))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.setGlobalPrefix('api')

  setupSwagger(app)

  await app.listen(3000)
}
bootstrap()

async function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Memorika')
    .setDescription('Language Learning with a dash of Spaced Repetition')
    .setVersion('0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, { swaggerOptions: { withCredentials: true } })
}
