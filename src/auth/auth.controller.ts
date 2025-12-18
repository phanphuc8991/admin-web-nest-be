import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Public, ResponseMessage } from '@/decorator/customzie';
import { Reflector } from '@nestjs/core';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private mailerService: MailerService, reflector: Reflector) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch Login')
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Public()
  @Post('register')
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

 @Public()
  @Post('check-code')
  checkCode(@Body() data: CodeAuthDto) {
    return this.authService.checkCode(data);
  }

  @Public()
  @Get('email')
  testMail() {
    this.mailerService
      .sendMail({
        to: 'phanhoangphuc123321@gmail.com', 
        subject: 'Testing Nest MailerModule ✔', 
        text: 'welcome', 
        template: 'register.hbs',
        context: {
          name: 'nestjs',
          activationCode: '1234324fd'
        }
      });
     return 'ok';
  }
}
