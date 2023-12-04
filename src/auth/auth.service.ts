import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(authEmail: string, authPassword: string): Promise<any> {
        const user = await this.userService.findAuth(authEmail);
        const passwordIsValid = await bcrypt.compare(authPassword, user.password);
        if (!user || !passwordIsValid) {
            throw new UnauthorizedException();
        }
        const playload = { email: user.email, sub: user.id }
        return {
            access_token: await this.jwtService.signAsync(playload, { secret: process.env.JWT_SECRET }),
        };
    }
}
