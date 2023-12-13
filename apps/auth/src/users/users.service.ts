import { Injectable, UnauthorizedException } from '@nestjs/common';
import *  as bycrpt from 'bcryptjs';
import { CreateUserDto } from './dto/user.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
     constructor(private readonly usersRepository:UsersRepository){}
    async createUser(createUserDto:CreateUserDto){
        return this.usersRepository.create({
         ...createUserDto,
         password:await bycrpt.hash(createUserDto.password,10),
        })
    }

    async verifyUser(email:string,passowrd:string){
        const user = await this.usersRepository.findOne({email});
        const passwordIsValid = await bycrpt.compare(passowrd,user.password);
        if(!passwordIsValid) throw new UnauthorizedException('Credentials do not Match!');
        return user;

    }

    async getUsers(){
        return this.usersRepository.find({});
    }

}
