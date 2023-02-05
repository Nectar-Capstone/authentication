import { ApiProperty } from '@nestjs/swagger';
import { User_Type } from 'src/auth/enums/user_type.enum';

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  email_code: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  is_verified: boolean;
}
