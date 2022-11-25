import { QueryErrorFilter } from '@configs/filters/query-error.filter'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

export function setupFixture(app: INestApplication) {
  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  app.useGlobalFilters(new QueryErrorFilter(httpAdapter))
  app.setGlobalPrefix('api')
}
