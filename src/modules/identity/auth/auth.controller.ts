import { Req, Controller, HttpCode, Post, UseGuards, Res, Delete, Get } from '@nestjs/common'
import { ApiBody, ApiTags, OmitType } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { User } from '../users/user.entity'
import { AuthService } from './auth.service'
import { JwtAuthenticationGuard } from './jwt-authentication.guard'
import { LocalAuthenticationGuard } from './local-authentication.guard'

interface RequestWithUser extends Request {
  user: User
}

@ApiTags('Identity')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({ type: OmitType(User, ['nickname']) })
  @Post()
  async login(@Req() request: RequestWithUser) {
    const { user } = request
    const cookie = this.authService.getCookieWithJwtToken(user.id)
    request.res.setHeader('Set-Cookie', cookie)
    return user
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete()
  async logout(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogout())
    return response.sendStatus(200)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user
  }
}
