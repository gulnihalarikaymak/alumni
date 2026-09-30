// Swagger documentation shapes. Validation itself lives in UsersService
// (no class-validator yet; DTO validation is a week 04 topic).
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ROLES, Role, STATUSES, Status } from './user.model';

export class CreateUserDto {
  @ApiProperty({ example: 'ayse@istanbul.edu.tr' })
  email!: string;

  @ApiProperty({ enum: ROLES, example: 'ALUMNI' })
  role!: Role;
}

export class ReplaceUserDto {
  @ApiProperty({ example: 'ayse.yilmaz@istanbul.edu.tr' })
  email!: string;

  @ApiProperty({ enum: ROLES, example: 'STAFF' })
  role!: Role;

  @ApiProperty({ enum: STATUSES, example: 'ACTIVE' })
  status!: Status;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'ayse.yilmaz@istanbul.edu.tr' })
  email?: string;

  @ApiPropertyOptional({ enum: ROLES })
  role?: Role;

  @ApiPropertyOptional({ enum: STATUSES, example: 'ACTIVE' })
  status?: Status;
}

export class UserResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'ayse@istanbul.edu.tr' })
  email!: string;

  @ApiProperty({ enum: ROLES, example: 'ALUMNI' })
  role!: Role;

  @ApiProperty({ enum: STATUSES, example: 'PENDING' })
  status!: Status;

  @ApiProperty({ example: '2026-09-30T07:33:12.687Z' })
  createdAt!: string;
}

export class ErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['email is required'],
  })
  message!: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error!: string;
}
