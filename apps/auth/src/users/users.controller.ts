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
    private readonly logger:Logger,
    private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  
  @Get('verify')
  @UseGuards(JwtAuthGuard)
    async verify(){
        this.logger.log('verifiy has been called!')
        return this.usersService.getUser({_id:'65672483ecf6431e18b79759'});
    }

  @Get()
  async getUser(@CurrentUser() user: UserDocument) {
    this.logger.log('get user has been called!',{user})
    return user;
  }
}
