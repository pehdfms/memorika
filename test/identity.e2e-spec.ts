import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { setupFixture } from './utils'
import { IdentityModule } from '@modules/identity/identity.module'

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

    it('should create an user', async () => {
      userResponse = (
        await agent
          .post('/api/users')
          .send({
            nickname: 'UniqueTestingGuy',
            email: 'pleasebeuniquetestingguy@test.com',
            password: 'test123'
          })
          .expect(HttpStatus.CREATED)
      ).body
    })

    describe('Cleanup', () => {
      it('should allow for user deletion', async () => {
        await agent.delete('/api/users/' + userResponse.id).expect(HttpStatus.NO_CONTENT)
      })

      it('should delete the user', async () => {
        await visit('users/' + userResponse.id, HttpStatus.NOT_FOUND)
      })
    })
  })
})
