import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from 'src/globalDtos/paginated.dto';
import { User } from './entities/user.entity';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { ParsePrismaFindManyParamsPipe } from 'src/pipes/parse-prisma-find-many-params.pipe';
import { PrismaFindManyDto } from 'src/globalDtos/prisma-find-many.dto';
import { plainToInstance } from 'class-transformer';
import { RequiresAuth } from 'src/auth/decorator/requires-auth.decorator';

@Controller('users')
@ApiTags('Users')
@ApiExtraModels(PaginatedDto)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/verify/:id')
  async verify(@Param('id') id: string, @Query('key') key: string) {
    const user = await this.usersService
      .findOne({ id })
      .then((result) => plainToInstance(User, result));
    if (user.email_code !== key) return { code: user.email_code, key: key };
    return await this.usersService
      .update({ id }, { is_verified: true })
      .then((result) => plainToInstance(User, result));
  }
  @Post('/verify/:id')
  @ApiCreatedResponse({ type: User, description: 'OK' })
  async generateLink(@Param('id') id: string) {
    const user = await this.usersService
      .findOne({ id })
      .then((result) => plainToInstance(User, result));
    return this.usersService.createLink(user);
  }

  @Post()
  @ApiCreatedResponse({ type: User, description: 'OK' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService
      .create(createUserDto)
      .then((result) => plainToInstance(User, result));
  }

  @Get()
  @ApiPaginatedResponse(User, { description: 'OK' })
  async findAll(
    @Query(ParsePrismaFindManyParamsPipe) params: PrismaFindManyDto,
  ) {
    return await this.usersService
      .findAll({ ...params })
      .then((results) =>
        results.map((entity) => plainToInstance(User, entity)),
      );
  }

  @Get(':id')
  @ApiOkResponse({ type: User, description: 'OK' })
  async findOne(@Param('id') id: string) {
    return await this.usersService
      .findOne({ id })
      .then((result) => plainToInstance(User, result));
  }

  @Patch(':id')
  @ApiOkResponse({ type: User, description: 'OK' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService
      .update({ id }, updateUserDto)
      .then((result) => plainToInstance(User, result));
  }

  @Delete(':id')
  @ApiOkResponse({ type: User, description: 'OK' })
  async remove(@Param('id') id: string) {
    return await this.usersService
      .remove({ id })
      .then((result) => plainToInstance(User, result));
  }
}
