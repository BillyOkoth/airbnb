import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import {MessagePattern,Payload} from '@nestjs/microservices'
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { UserDocument } from './users/models/users.schema';
import { Logger } from 'nestjs-pino';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger:Logger,
    private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.login(user, response);
    this.logger.fatal('jwt',{jwt});
    response.send(jwt);
  }
  
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data:any) {   
    this.logger.fatal('authenticating.....',{data});
    return data.user
  }
     
  
}
