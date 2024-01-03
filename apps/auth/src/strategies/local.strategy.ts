import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "../users/users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

//the local strategy is always an injectable
//Without making this injectable the local strategy will not work and will throw an error where user is not verified

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService:UsersService){
        super({ usernameField: 'email' })
    } 

    async validate(email:string,password:string){
        try {
            return await this.userService.verifyUser(email,password)
        } catch (error) {
            throw new UnauthorizedException(error)
        }
    }
}