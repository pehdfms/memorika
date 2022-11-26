import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { setupFixture } from './utils'
import { IdentityModule } from '@modules/identity/identity.module'
import { randomUUID } from 'crypto'

describe('Identity Module (e2e)', () => {
  let app: INestApplication
  let agent: SuperAgentTest
  let server: any

  const visit = async (endpoint: string, status: HttpStatus = HttpStatus.OK): Promise<any> =>
    (await agent.get('/api/' + endpoint).expect(status)).body

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IdentityModule, MikroOrmModule.forRoot()]
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
    let userResponse: any
    const password = 'test123'

    it('should create an user', async () => {
      userResponse = (
        await agent
          .post('/api/users')
          .send({
            nickname: 'UniqueTestingGuy',
            email: `${randomUUID()}@testemail.com`,
            password
          })
          .expect(HttpStatus.CREATED)
      ).body
    })

    let authToken: string
    describe('Login', () => {
      let loginResponse: any

      it('should be able to authenticate', async () => {
        const { email } = userResponse

        loginResponse = await agent
          .post('/api/auth')
          .send({ email, password })
          .expect(HttpStatus.OK)

        authToken = loginResponse.headers['set-cookie'][0]
        loginResponse = loginResponse.body
      })

      it('should not show password on login', () => {
        expect(loginResponse).not.toHaveProperty('password')
      })

      it('should be possible to login as the created user', () => {
        // Date truncation means it won't be an exact match, so we have to ignore the date fields
        expect({ ...loginResponse, created: undefined, updated: undefined }).toEqual({
          ...userResponse,
          created: undefined,
          updated: undefined
        })
      })

      it('should show the created user as being logged in', async () => {
        const whoAmIResponse = (
          await agent.get('/api/auth').set('Cookie', authToken).expect(HttpStatus.OK)
        ).body

        expect(whoAmIResponse).not.toHaveProperty('password')

        expect({ ...whoAmIResponse, created: undefined, updated: undefined }).toEqual({
          ...userResponse,
          created: undefined,
          updated: undefined
        })
      })

      // We don't test much more than this because logout relies on Set-Cookie,
      // and supertest does not seem to support it.
      it('should be able to logout', async () => {
        await agent.delete('/api/auth').set('Cookie', authToken).expect(HttpStatus.OK)
      })

      it('should not be able to logout without being logged in', async () => {
        await agent.delete('/api/auth').expect(HttpStatus.UNAUTHORIZED)
      })

      it('should only show current logged in user when logged in', async () => {
        await agent.get('/api/auth').expect(HttpStatus.UNAUTHORIZED)
      })
    })

    describe('Cleanup', () => {
      it('should allow for user deletion', async () => {
        await agent
          .delete('/api/users/' + userResponse.id)
          .set('Cookie', authToken)
          .expect(HttpStatus.NO_CONTENT)
      })

      it('should delete the user', async () => {
        await visit('users/' + userResponse.id, HttpStatus.NOT_FOUND)
      })
    })
  })

  describe('Sad Path', () => {
    let userResponse: any

    const email = `${randomUUID()}@testemail.com`
    const password = 'test123'

    const createUser = () => {
      return agent.post('/api/users').send({
        nickname: 'UniqueTestingGuy',
        email,
        password
      })
    }

    it('should create an user', async () => {
      userResponse = (await createUser().expect(HttpStatus.CREATED)).body
    })

    let authToken: string
    let loginResponse: any
    it('should be able to authenticate', async () => {
      loginResponse = await agent.post('/api/auth').send({ email, password }).expect(HttpStatus.OK)
      authToken = loginResponse.headers['set-cookie'][0]
      loginResponse = loginResponse.body
    })

    it('should not allow creating an user with a duplicate email', async () => {
      await createUser().expect(HttpStatus.CONFLICT)
    })

    it('should reject invalid credentials', async () => {
      await agent
        .post('/api/auth')
        .send({ email, password: 'wrongPassword' })
        .expect(HttpStatus.BAD_REQUEST)
    })

    describe('Cleanup', () => {
      it('should allow for user deletion', async () => {
        await agent
          .delete('/api/users/' + userResponse.id)
          .set('Cookie', authToken)
          .expect(HttpStatus.NO_CONTENT)
      })
    })
  })
})
