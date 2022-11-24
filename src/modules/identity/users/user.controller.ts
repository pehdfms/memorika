import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { CreateUserDto } from './dtos/create-user.dto'

@ApiTags('Identity')
@Controller('users')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data)
  }
}
