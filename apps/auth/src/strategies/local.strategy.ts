import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "../users/users.service";
import { UnauthorizedException } from "@nestjs/common";

export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService:UsersService){
        super({userNameField:'email'})
    }

    async validate(email:string,passowrd:string){
        try {
            return await this.userService.verifyUser(email,passowrd)
        } catch (error) {
            throw new UnauthorizedException(error)
        }
    }
}