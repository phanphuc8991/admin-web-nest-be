import { Injectable, UnauthorizedException } from '@nestjs/common';
import { checkUser } from '@/helpers/util';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByUser(email);
    const match = await checkUser(password, user.password);
    if (!match) {
      throw new UnauthorizedException();
    }
    return user;
  }
  async login(user: any) {
    console.log('user',user);
    const payload = { email: user.email, _id: user['_id']};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
      return this.usersService.handleRegister(registerDto);
  }
}
