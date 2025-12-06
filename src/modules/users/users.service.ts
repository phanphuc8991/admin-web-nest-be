import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper, parseQueryParams } from '@/helpers/util';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  isEmailExist = async (email: string): Promise<boolean> => {
    const checkEmail = await this.userModel.exists({ email });
    if (checkEmail) return true;
    return false;
  };
  async create(createUserDto) {
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
    const results = await this.userModel.find(filter).limit(limit).skip(skip).sort(sort);
    console.log('results', results);
    return results;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
