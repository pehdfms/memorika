import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: EntityRepository<User>) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email })

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(user)
    await this.userRepository.persistAndFlush(newUser)

    return newUser
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id })

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await this.userRepository.removeAndFlush(user)
  }
}
