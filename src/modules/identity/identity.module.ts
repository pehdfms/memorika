import { Module } from '@nestjs/common'
import { UserService } from './users/user.service'
import { AuthService } from './auth/auth.service'
import { User } from './users/user.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { LocalStrategy } from './auth/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { UserController } from './users/user.controller'
import { AuthController } from './auth/auth.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './auth/jwt.strategy'

const entities = [User]

@Module({
  imports: [
    MikroOrmModule.forFeature(entities),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`
        }
      })
    })
  ],
  providers: [UserService, AuthService, LocalStrategy, JwtStrategy],
  controllers: [UserController, AuthController]
})
export class IdentityModule {}
