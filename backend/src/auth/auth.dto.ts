// Swagger documentation shapes. Validation itself lives in AuthService.
import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../users/user.dto';

export class LoginDto {
  @ApiProperty({ example: 'deniz.kaya@example.com' })
  email!: string;

  @ApiProperty({ example: 'a-long-password' })
  password!: string;
}

export class LoginResponse {
  @ApiProperty({ type: UserResponse })
  user!: UserResponse;
}

export class MeResponse {
  @ApiProperty({ type: UserResponse, nullable: true, description: 'null when nobody is logged in' })
  user!: UserResponse | null;
}
