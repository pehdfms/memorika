import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { SpacedRepetitionModule } from '@modules/spaced-repetition/spaced-repetition.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { setupFixture } from './utils'

describe('Spaced Repetition Module (e2e)', () => {
  let app: INestApplication
  let agent: SuperAgentTest
  let server: any

  const visit = async (endpoint: string, status: HttpStatus = HttpStatus.OK): Promise<any> =>
    (await agent.get('/api/' + endpoint).expect(status)).body

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SpacedRepetitionModule, MikroOrmModule.forRoot()]
    }).compile()

    app = moduleFixture.createNestApplication()
    setupFixture(app)

    await app.init()

    server = app.getHttpServer()
    agent = request.agent(server)
  })

  afterEach(async () => {
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
        await agent
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
          await agent
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
          await agent
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
        await agent.delete('/api/decks/' + deckResponse.id).expect(HttpStatus.NO_CONTENT)
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

  describe('Sad Path', () => {
    describe('Deck Creation', () => {
      describe('Bad Names', () => {
        const checkPost = async (name: string, expected: HttpStatus) =>
          await agent
            .post('/api/decks')
            .send({
              name,
              description: 'Deck used in e2e testing',
              scheduler: 'LeitnerScheduler'
            })
            .expect(expected)

        const invalidPost = async (name: string) => checkPost(name, HttpStatus.BAD_REQUEST)

        it('should not allow empty name', async () => await invalidPost(''))
        it('should not allow blank name', async () => await invalidPost('   '))

        const checkTrimPost = async (name: string) => {
          const response = (await checkPost(name, HttpStatus.CREATED)).body

          expect(response.name).toBe(name.trim())

          await agent.delete('/api/decks/' + response.id).expect(HttpStatus.NO_CONTENT)
        }

        it('should trim name with right padding', async () => await checkTrimPost('wrong  '))
        it('should trim name with both paddings', async () => await checkTrimPost(' wrong '))
        it('should trim name with left padding', async () => await checkTrimPost('   wrong'))
      })
    })
  })
})
