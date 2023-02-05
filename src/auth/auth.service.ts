/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import ms = require('ms');
import { ExpiredTooLongException } from './exceptions/expired-too-long.exception';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    const validated = await bcrypt.compare(password, user.password);
    if (validated) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      user_type: user.user_type,
    };
    return this.jwtService.sign(payload);
  }

  // async loginViaLine(line_uid: string) {
  //   const profile = await this.prismaService.profile.findUnique({
  //     where: { line_uid: line_uid },
  //     include: {
  //       user: true,
  //     },
  //   });
  //   if (!profile) {
  //     throw new UnauthorizedException({
  //       status: 'Unauthorized',
  //       message: 'User not found',
  //     });
  //   }
  //   const { user } = profile;
  //   const payload = {
  //     email: user.email,
  //     sub: user.id,
  //     user_type: user.user_type,
  //   };
  //   return this.jwtService.sign(payload);
  // }

  async refreshToken(token: string) {
    return this.jwtService
      .verifyAsync(token, { ignoreExpiration: true })
      .then((response) => {
        const exp = new Date(response.exp).getTime();
        const today = new Date().getTime();
        const time_passed = today - exp;
        const week = today + ms('1 week');
        const payload = {
          email: response.email,
          sub: response.sub,
          user_type: response.user_type,
        };
        if (time_passed < week) {
          return this.jwtService.sign(payload);
        } else {
          throw new ExpiredTooLongException();
        }
      });
  }
}
