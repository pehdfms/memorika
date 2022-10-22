import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { SpacedRepetitionModule } from '@modules/spaced-repetition/spaced-repetition.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { HttpAdapterHost } from '@nestjs/core'
import { QueryErrorFilter } from '@configs/filters/query-error.filter'

describe('Spaced Repetition Module (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SpacedRepetitionModule, MikroOrmModule.forRoot()]
    }).compile()

    app = moduleFixture.createNestApplication()
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

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should pass the happy path for spaced repetition', async () => {
    // Create deck
    const deckResponse = (
      await request(app.getHttpServer())
        .post('/api/decks')
        .send({
          name: 'Test',
          description: 'Deck used in e2e testing',
          scheduler: 'LeitnerScheduler'
        })
        .expect(201)
    ).body

    // Create Flash Card
    const flashCardResponse = (
      await request(app.getHttpServer())
        .post('/api/flash-cards')
        .send({
          deck: deckResponse.id,
          question: 'Should this test pass?',
          possibleAnswers: ['yes', 'Yes', 'YES']
        })
        .expect(201)
    ).body

    // Newly created Flash Cards should immediately be due
    expect(flashCardResponse.isDue).toBe(true)

    // Correctly review the created Flash Card
    const reviewResponse = (
      await request(app.getHttpServer())
        .post('/api/reviews')
        .send({ flashCard: flashCardResponse.id, answer: 'Yes' })
        .expect(201)
    ).body

    // Review should count as passed
    expect(reviewResponse.passed).toBe(true)

    // The Flash Card we created should now have an updated due date
    const newFlashCardResponse = (
      await request(app.getHttpServer()).get(`/api/flash-cards/${flashCardResponse.id}`).expect(200)
    ).body

    // So it shouldn't be due anymore
    expect(newFlashCardResponse.isDue).toBe(false)

    // And the new due date should be after the original due date
    expect(new Date(newFlashCardResponse.dueDate) > new Date(flashCardResponse.dueDate)).toBe(true)

    // Clean database if all goes well
    request(app.getHttpServer()).delete(`/api/decks/${deckResponse.id}`).expect(204)
  })
})
