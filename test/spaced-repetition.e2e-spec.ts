import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { SpacedRepetitionModule } from '@modules/spaced-repetition/spaced-repetition.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { HttpAdapterHost } from '@nestjs/core'
import { QueryErrorFilter } from '@configs/filters/query-error.filter'

describe('Spaced Repetition Module (e2e)', () => {
  let app: INestApplication
  let server: any

  beforeAll(async () => {
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

    server = app.getHttpServer()
  })

  afterAll(async () => {
    await app.close()
    server.close()
  })

  describe('Happy Path', () => {
    // FIXME: Supertest seems to be leaving open handles...
    let deckResponse: any
    let flashCardResponse: any
    let reviewResponse: any
    let newFlashCardResponse: any

    it('should create a deck', async () => {
      deckResponse = (
        await request(server)
          .post('/api/decks')
          .send({
            name: 'Test',
            description: 'Deck used in e2e testing',
            scheduler: 'LeitnerScheduler'
          })
          .expect(HttpStatus.CREATED)
      ).body
    })

    it('should create a flash card that is immediately due', async () => {
      flashCardResponse = (
        await request(server)
          .post('/api/flash-cards')
          .send({
            deck: deckResponse.id,
            question: 'Should this test pass?',
            possibleAnswers: ['yes']
          })
          .expect(HttpStatus.CREATED)
      ).body

      // Newly created Flash Cards should immediately be due
      expect(flashCardResponse.isDue).toBe(true)
    })

    it('should correctly review a flash card, updating its due date', async () => {
      // Since we didn't specify case sensitivity, it should accept Yes
      // with "incorrect" casing
      reviewResponse = (
        await request(server)
          .post('/api/reviews')
          .send({ flashCard: flashCardResponse.id, answer: 'Yes' })
          .expect(HttpStatus.CREATED)
      ).body

      // Review should count as passed
      expect(reviewResponse.passed).toBe(true)

      // The Flash Card we created should now have an updated due date
      newFlashCardResponse = (
        await request(server)
          .get('/api/flash-cards/' + flashCardResponse.id)
          .expect(HttpStatus.OK)
      ).body

      // So it shouldn't be due anymore
      expect(newFlashCardResponse.isDue).toBe(false)

      // And the new due date should be after the original due date
      expect(new Date(newFlashCardResponse.dueDate) > new Date(flashCardResponse.dueDate)).toBe(
        true
      )
    })

    it('should correctly delete all relations when deleting a deck', async () => {
      // Clean database if all goes well
      await request(server)
        .delete('/api/decks/' + deckResponse.id)
        .expect(HttpStatus.NO_CONTENT)

      // Expect Deck to be deleted
      await request(server)
        .get('/api/decks/' + deckResponse.id)
        .expect(HttpStatus.NOT_FOUND)

      // Expect Flash Card to be deleted
      await request(server)
        .get('/api/flash-cards/' + flashCardResponse.id)
        .expect(HttpStatus.NOT_FOUND)

      // Expect Review to be deleted
      await request(server)
        .get('/api/reviews/' + reviewResponse.id)
        .expect(HttpStatus.NOT_FOUND)
    })
  })
})
