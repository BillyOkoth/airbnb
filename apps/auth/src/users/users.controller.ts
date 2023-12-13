import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService:UsersService){}
@Post()
async createUser(@Body() createUserDto:CreateUserDto){
    return this.usersService.createUser(createUserDto);
}

@Get()
async getUsers(){
    return this.usersService.getUsers();
}

}
