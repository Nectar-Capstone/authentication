import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  async create(user: Prisma.UserUncheckedCreateInput) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    user.email_code = await this.utils.createCode(10);
    return await this.prisma.user.create({
      data: user,
    });
  }
  async createLink(user: User) {
    return `user/verify/${user.id}?key=${user.email_code}`;
  }
  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    return await this.prisma.user.findMany({
      ...params,
    });
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findUniqueOrThrow({ where });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password.toString(), 10);
      data.password = hashedPassword;
    }
    return await this.prisma.user.update({
      where,
      data,
    });
  }
  async remove(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.delete({ where });
  }
}
