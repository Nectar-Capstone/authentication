import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PrismaFindManyDto {
  @ApiProperty({ name: 'offset', required: false })
  @IsOptional()
  @IsInt()
  @Expose({ name: 'offset' })
  skip?: number;

  @ApiProperty({ name: 'limit', required: false })
  @IsOptional()
  @IsInt()
  @Expose({ name: 'limit' })
  take?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Expose({ name: 'page' })
  page?: number;

  @ApiProperty({
    name: 'sort_by',
    required: false,
    description: 'Format is keyname.asc or desc (ASC = ascending, DESC = descending',
  })
  @IsOptional()
  @Expose({ name: 'sort_by' })
  sort_by?: string;
}
