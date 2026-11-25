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

export class MenuItemResponse {
  @ApiProperty({ example: 'Applications', description: 'English text, translated by the browser' })
  label!: string;

  @ApiProperty({ example: '/job-applications' })
  href!: string;
}

export class MeResponse {
  @ApiProperty({ type: UserResponse, nullable: true, description: 'null when nobody is logged in' })
  user!: UserResponse | null;

  @ApiProperty({ type: [MenuItemResponse], description: 'the header menu for the role (a visitor gets the public pages)' })
  menu!: MenuItemResponse[];
}
