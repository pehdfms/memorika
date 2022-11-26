import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserService } from './user.service'

@ApiTags('Identity')
@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post()
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id)
  }
}
