import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UtilsService],
})
export class UsersModule {}
