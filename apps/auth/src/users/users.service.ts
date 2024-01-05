import { Injectable, UnauthorizedException } from '@nestjs/common';
import *  as bycrpt from 'bcryptjs';
import { CreateUserDto } from './dto/user.interface';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class UsersService {
     constructor(
        private readonly usersRepository:UsersRepository){}
    async createUser(createUserDto:CreateUserDto){
        return this.usersRepository.create({
         ...createUserDto,
         password:await bycrpt.hash(createUserDto.password,10),
        })
    }

    async verifyUser(email:string,passowrd:string){
        const user = await this.usersRepository.findOne({email});
        const passwordIsValid = await bycrpt.compare(passowrd,user.password);
        if(!passwordIsValid) {
            throw new UnauthorizedException('Credentials are not valid!');
        }
        return user;

    }

    async getUser(getUserDto: GetUserDto) {
        return this.usersRepository.findOne(getUserDto)
      }

}
