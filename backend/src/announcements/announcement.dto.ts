// Swagger documentation shapes. Validation itself lives in AnnouncementsService.
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Alumni meetup on 20 November', maxLength: 120 })
  title!: string;

  @ApiProperty({ example: 'All graduates are invited to the campus meetup at 18:00.', maxLength: 2000 })
  content!: string;
}

// PUT needs the same fields as create.
export class ReplaceAnnouncementDto extends CreateAnnouncementDto {}

export class UpdateAnnouncementDto {
  @ApiPropertyOptional({ example: 'Alumni meetup moved to 27 November' })
  title?: string;

  @ApiPropertyOptional()
  content?: string;
}

export class AnnouncementResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Alumni meetup on 20 November' })
  title!: string;

  @ApiProperty({ example: 'All graduates are invited to the campus meetup at 18:00.' })
  content!: string;

  @ApiProperty({ example: '2026-10-11T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-10-11T12:00:00.000Z' })
  updatedAt!: string;
}
