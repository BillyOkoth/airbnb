import { Controller, Get, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Response} from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { UserDocument } from './users/models/users.schema';
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({passthrough:true}) response:Response
  ){
  
    this.logger.log(`User ${user.email} logged in`);
    const jwt = await this.authService.login(user,response);
    response.send(jwt);

  }

  @Get('users')

  async getUsers(){
    return await this.authService.getUsers();
  }
}
