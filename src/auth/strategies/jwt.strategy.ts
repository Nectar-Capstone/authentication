/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExpiredException } from '../exceptions/expired-jwt.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    const exp = new Date(payload.exp * 1000).getTime();
    const iat = new Date(payload.iat * 1000).getTime();
    const today = new Date().getTime();
    const expiration_time = exp - iat;

    if (today - iat > expiration_time) throw new ExpiredException();

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) throw new UnauthorizedException();

    const { password, ...result } = user;
    return result;
  }
}
