import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { setupFixture } from './utils'
import { IdentityModule } from '@modules/identity/identity.module'
import { randomUUID } from 'crypto'
import { SpacedRepetitionModule } from '@modules/spaced-repetition/spaced-repetition.module'

describe('Identity Module (e2e)', () => {
  let app: INestApplication
  let agent: SuperAgentTest
  let server: any

  const visit = async (
    authToken: string,
    endpoint: string,
    status: HttpStatus = HttpStatus.OK
  ): Promise<any> =>
    (
      await agent
        .get('/api/' + endpoint)
        .set('Cookie', authToken)
        .expect(status)
    ).body

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IdentityModule, MikroOrmModule.forRoot(), SpacedRepetitionModule]
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
    let userId: string
    let authToken: string

    describe('Login', () => {
      const email = `${randomUUID()}@testemail.com`
      const password = 'test123'

      it('should create an user', async () => {
        userId = (
          await agent
            .post('/api/users')
            .send({
              nickname: 'UniqueTestingGuy',
              email,
              password
            })
            .expect(HttpStatus.CREATED)
        ).body.id
      })

      it('should be able to authenticate', async () => {
        const loginResponse = await agent
          .post('/api/auth')
          .send({ email, password })
          .expect(HttpStatus.OK)

        authToken = loginResponse.headers['set-cookie'][0]
      })
    })

    let deckResponse: any
    it('should create a deck', async () => {
      deckResponse = (
        await agent
          .post('/api/decks')
          .send({
            name: 'Test',
            description: 'Deck used in e2e testing',
            scheduler: 'LeitnerScheduler'
          })
          .set('Cookie', authToken)
          .expect(HttpStatus.CREATED)
      ).body
    })

    let flashCardResponse: any
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
            .set('Cookie', authToken)
            .expect(HttpStatus.CREATED)
        ).body
      })

      it('should be due immediately', () => expect(flashCardResponse.isDue).toBe(true))
    })

    let reviewResponse: any
    describe('Correct Flash Card Review', () => {
      it('should create a review', async () => {
        // Since we didn't specify case sensitivity, it should accept Yes
        // with "incorrect" casing
        reviewResponse = (
          await agent
            .post('/api/reviews')
            .send({ flashCard: flashCardResponse.id, answer: 'Yes' })
            .set('Cookie', authToken)
            .expect(HttpStatus.CREATED)
        ).body
      })

      it('should count as passed', () => expect(reviewResponse.passed).toBe(true))

      describe('Flash Card Updates after Review', () => {
        let newFlashCardResponse: any
        it('should GET the created flash card', async () => {
          newFlashCardResponse = await visit(authToken, 'flash-cards/' + flashCardResponse.id)
        })

        it('should not be due anymore', () => expect(newFlashCardResponse.isDue).toBe(false))

        it('should update the due date to be after the original', () =>
          expect(new Date(newFlashCardResponse.dueDate) > new Date(flashCardResponse.dueDate)).toBe(
            true
          ))
      })
    })

    describe('Cleanup', () => {
      it('should allow deck deletion', async () => {
        await agent
          .delete('/api/decks/' + deckResponse.id)
          .set('Cookie', authToken)
          .expect(HttpStatus.NO_CONTENT)
      })

      it('should delete the deck', async () => {
        await visit(authToken, 'decks/' + deckResponse.id, HttpStatus.NOT_FOUND)
      })

      it('should delete the flash card automatically', async () => {
        await visit(authToken, 'flash-cards/' + flashCardResponse.id, HttpStatus.NOT_FOUND)
      })

      it('should delete the review automatically', async () => {
        await visit(authToken, 'reviews/' + reviewResponse.id, HttpStatus.NOT_FOUND)
      })

      it('should allow for user deletion', async () => {
        await agent
          .delete('/api/users/' + userId)
          .set('Cookie', authToken)
          .expect(HttpStatus.NO_CONTENT)
      })
    })
  })
})
