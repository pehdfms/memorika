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

  const visit = async (endpoint: string, status: HttpStatus = HttpStatus.OK): Promise<any> =>
    (
      await request(server)
        .get('/api/' + endpoint)
        .expect(status)
    ).body

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

    describe('Flash Card Creation', () => {
      it('should create a flash card', async () => {
        flashCardResponse = (
          await request(server)
            .post('/api/flash-cards')
            .send({
              deck: deckResponse.id,
              question: 'Should this test pass?',
              possibleAnswers: ['yes'],
              caseSensitive: false
            })
            .expect(HttpStatus.CREATED)
        ).body
      })

      it('should be due immediately', () => expect(flashCardResponse.isDue).toBe(true))
    })

    describe('Correct Flash Card Review', () => {
      it('should create a review', async () => {
        // Since we didn't specify case sensitivity, it should accept Yes
        // with "incorrect" casing
        reviewResponse = (
          await request(server)
            .post('/api/reviews')
            .send({ flashCard: flashCardResponse.id, answer: 'Yes' })
            .expect(HttpStatus.CREATED)
        ).body
      })

      it('should count as passed', () => expect(reviewResponse.passed).toBe(true))

      describe('Flash Card Updates after Review', () => {
        it('should GET the created flash card', async () => {
          newFlashCardResponse = await visit('flash-cards/' + flashCardResponse.id)
        })

        it('should not be due anymore', () => expect(newFlashCardResponse.isDue).toBe(false))

        it('should update the due date to be after the original', () =>
          expect(new Date(newFlashCardResponse.dueDate) > new Date(flashCardResponse.dueDate)).toBe(
            true
          ))
      })
    })

    describe('Cascade Cleanup', () => {
      it('should allow deck deletion', async () => {
        await request(server)
          .delete('/api/decks/' + deckResponse.id)
          .expect(HttpStatus.NO_CONTENT)
      })

      it('should delete the deck', async () => {
        await visit('decks/' + deckResponse.id, HttpStatus.NOT_FOUND)
      })

      it('should delete the flash card automatically', async () => {
        await visit('flash-cards/' + flashCardResponse.id, HttpStatus.NOT_FOUND)
      })

      it('should delete the review automatically', async () => {
        await visit('reviews/' + reviewResponse.id, HttpStatus.NOT_FOUND)
      })
    })
  })
})
