import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/user.interface';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../current-user.decorator';
import { UserDocument } from './models/users.schema';
import { Logger } from 'nestjs-pino';

@Controller('users')
export class UsersController {
  constructor(
    private logger:Logger,
    private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserDocument) {
    this.logger.fatal('user',user);
    return user;
  }
}
