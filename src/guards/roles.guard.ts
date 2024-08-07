import { CanActivate, ConflictException, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Rolesenum } from "../auth/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector: Reflector){}
    canActivate(context: ExecutionContext,  
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Rolesenum[]>("roles", [
            context.getHandler(),
            context.getClass(),
        ])
        if(!requiredRoles){
            throw new ConflictException("Error trying to access requiredRoles")
        }
        
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const hasRole = () => 
            requiredRoles.some((role) => user?.roles?.includes(role));
        
        const valid = user && user.roles && hasRole();
        if(!valid){
            throw new ForbiddenException("Need Permission to access this route")
        }
        return valid; 
    }
    
}