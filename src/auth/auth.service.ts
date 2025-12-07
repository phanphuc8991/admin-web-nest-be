import { checkUser } from '@/helpers/util';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByUser(email);
    const match = await checkUser(password, user.password);
    if (!match) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user['_id'], email: user.email };
    console.log('payload',payload);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
