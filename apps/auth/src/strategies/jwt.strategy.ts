import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { UsersService } from '../users/users.service';
import { Logger } from 'nestjs-pino';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly logger: Logger,
    private readonly usersService: UsersService,
  ) {
    ///ensusre that the expiration time for the token is set tomore that 3600 Token expirs fast for 3600
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          this.logger.fatal('JWT_TOKEN',{billy:request?.cookies?.Authentication });
          return  request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers?.Authentication
        }
          
        
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    const user = await  this.usersService.getUser({ _id: userId });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
    
  }
}