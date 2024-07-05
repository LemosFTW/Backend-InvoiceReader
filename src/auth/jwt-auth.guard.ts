import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);


        if (!token)
            throw new UnauthorizedException('Token não encontrado');

        async () => {            
            let result = await this.authService.validateToken(token)
            console.log(result)
        };
        
        
        return this.authService.validateToken(token).then((isValid) => {
            console.log(isValid)
            if (!isValid)
                throw new UnauthorizedException('Token inválido');

            return true;
        });
    }

    private extractTokenFromHeader(request: Request): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader)
            return null;


        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }
}