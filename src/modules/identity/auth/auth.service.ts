import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { UserService } from '../users/user.service'
import { compare, hash } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { TokenPayload } from './token-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async register(data: CreateUserDto) {
    const hashedPassword = await hash(data.password, 10)

    const createdUser = await this.userService.create({
      ...data,
      password: hashedPassword
    })
    createdUser.password = undefined
    return createdUser
  }

  public async login(email: string, password: string) {
    try {
      const user = await this.userService.getByEmail(email)
      await this.verifyPassword(password, user.password)
      user.password = undefined
      return user
    } catch (e) {
      throw new BadRequestException('Invalid credentials!')
    }
  }

  public async verifyPassword(password: string, hashedPassword: string) {
    const matches = await compare(password, hashedPassword)

    if (!matches) {
      throw new BadRequestException('Password does not match!')
    }
  }

  public getCookieWithJwtToken(id: string) {
    const payload: TokenPayload = { id }
    const token = this.jwtService.sign(payload)
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME'
    )}`
  }

  public getCookieForLogout() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0'
  }
}
