import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, map, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants";
import { Logger } from "nestjs-pino";


@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor( 
        private readonly logger:Logger,
        @Inject(AUTH_SERVICE) private readonly authClient:ClientProxy){}
    canActivate(context:ExecutionContext):boolean| Promise<boolean>| Observable<boolean>{
        const jwt  = context.switchToHttp().getRequest().cookies?.Authentication ||
        context.switchToHttp().getRequest().headers?.authentication;
        this.logger.fatal('JWT_SHARED',{jwt});
        if(!jwt) return false;
         
        return this.authClient.send('authenticate',{
            authentication:'jwt'
        }).pipe(
            tap((res)=>  context.switchToHttp().getRequest().user = res),
            map(() => true)
        )

    }

}