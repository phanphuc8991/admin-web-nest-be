import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper, parseQueryParams } from '@/helpers/util';
import { CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
const dayjs = require('dayjs');
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private mailerService: MailerService,
  ) {}

  async isEmailExist(email: string): Promise<boolean> {
    const checkEmail = await this.userModel.exists({ email });
    if (checkEmail) return true;
    return false;
  }
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;
    // hash password
    const hashPassword: string = await hashPasswordHelper(password);

    // check email exist
    if (await this.isEmailExist(email)) {
      throw new BadRequestException(
        `Email exist: ${email} Please use different email`,
      );
    }
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });
    return {
      _id: user._id,
    };
  }

  async findAll(query: any) {
    const { limit, skip, sort, filter } = parseQueryParams(query);
    const results = await this.userModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort);

    return results;
  }

  async findByUser(email: string) {
    return this.userModel.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { email, password, name } = registerDto;

    // check email exist
    if (await this.isEmailExist(email)) {
      throw new BadRequestException(
        `Email exist: ${email} Please use different email`,
      );
    }

    // hash password
    const hashPassword: string = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId,
      codeExpired: dayjs().add(5, 'minutes'),
    });

    // send email
    await this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Welcome to nest js', // Subject line
      template: 'register.hbs',
      context: {
        name: user.name || user.email,
        activationCode: codeId,
      },
    });
    return {
      _id: user['_id'],
    };
  }

  async handelActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code,
    });
    if (!user) {
      throw new BadRequestException(`Error`);
    }

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      await this.userModel.updateOne({ _id: user.id }, { isActive: true });
      return {
        isBeforeCheck,
      };
    } else {
      throw new BadRequestException(`Error code expired `);
    }
  }
  // send email
}
