import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if(!request.headers["authorization"]){
      throw new BadRequestException ("header authorization missing")
    }  
    
    const token = request.headers["authorization"].split(" ")[1]
    if(!token){
      throw new UnauthorizedException("Bearer token not found")
    }
    try{
      const secret = process.env.JWT_SECRET
      const userPayload = this.jwtService.verify(token, {secret})

      
      if(userPayload.isAdmin){
        userPayload.roles = ["admin"];
      }else{
        userPayload.roles = ["user"]
      }
      request.user = userPayload;
      
      return true;
    } catch(err){
      throw new UnauthorizedException("Invalid token")
    }
  }
}
