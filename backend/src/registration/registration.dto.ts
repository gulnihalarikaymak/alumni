// Swagger documentation shapes. Validation itself lives in RegistrationService.
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponse } from '../users/user.dto';

export class RegisterDto {
  @ApiProperty({ example: 'deniz.kaya@example.com' })
  email!: string;

  @ApiProperty({ enum: ['STUDENT', 'ALUMNI', 'STAFF'], example: 'ALUMNI' })
  role!: string;

  @ApiProperty({ example: 'a-long-password', description: '8–128 characters, stored only as a hash' })
  password!: string;

  @ApiProperty({ example: true, description: 'the privacy notice must be accepted' })
  acceptPrivacy!: boolean;

  @ApiPropertyOptional({ example: 'Deniz Kaya', description: 'required for ALUMNI only, 2–100 characters' })
  fullName?: string;

  @ApiPropertyOptional({ example: 2019, description: 'required for ALUMNI only, 1950 to this year' })
  graduationYear?: number;

  @ApiPropertyOptional({ example: 'İzmir', description: 'ALUMNI only, optional, at most 60 characters' })
  city?: string;
}

export class AlumniProfileResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Deniz Kaya' })
  fullName!: string;

  @ApiProperty({ example: 2019 })
  graduationYear!: number;

  @ApiProperty({ example: 'İzmir', nullable: true, type: String })
  city!: string | null;
}

export class RegistrationResponse {
  @ApiProperty({ type: UserResponse })
  user!: UserResponse;

  @ApiProperty({ type: AlumniProfileResponse, nullable: true })
  alumniProfile!: AlumniProfileResponse | null;
}
