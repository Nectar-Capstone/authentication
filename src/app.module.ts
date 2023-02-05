import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { UtilsService } from './utils/utils.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [PrismaService, UtilsService, AppService],
})
export class AppModule {}
