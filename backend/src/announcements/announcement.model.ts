// The Announcement model and the "announcements" table (prisma/schema.prisma).
import { Injectable } from '@nestjs/common';
import { Announcement as AnnouncementRow } from '../generated/prisma/client';
import { MAX_ID, isRecordNotFound } from '../prisma/prisma.helpers';
import { PrismaService } from '../prisma/prisma.service';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Fields the caller provides; id and the dates are set by the database / Prisma.
export type NewAnnouncement = Pick<Announcement, 'title' | 'content'>;
export type AnnouncementChanges = Partial<NewAnnouncement>;

/**
 * Owns the announcement data and the CRUD operations on it.
 * Records live in the PostgreSQL table "announcements", reached through Prisma.
 * No validation and no HTTP here: a missing record is reported as
 * undefined or false, and the service decides what that means (404).
 */
@Injectable()
export class AnnouncementModel {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(data: NewAnnouncement): Promise<Announcement> {
    return toAnnouncement(await this.prisma.announcement.create({ data }));
  }

  // READ: all records, newest first
  async findAll(): Promise<Announcement[]> {
    const rows = await this.prisma.announcement.findMany({ orderBy: { id: 'desc' } });
    return rows.map(toAnnouncement);
  }

  // READ: one record by id
  async findById(id: number): Promise<Announcement | undefined> {
    if (id > MAX_ID) return undefined;
    const row = await this.prisma.announcement.findUnique({ where: { id } });
    return row ? toAnnouncement(row) : undefined;
  }

  // UPDATE: changes only the fields given; used by both PUT and PATCH.
  // updatedAt is set by Prisma (@updatedAt in the schema).
  async update(id: number, changes: AnnouncementChanges): Promise<Announcement | undefined> {
    if (id > MAX_ID) return undefined;
    try {
      return toAnnouncement(await this.prisma.announcement.update({ where: { id }, data: changes }));
    } catch (err) {
      if (isRecordNotFound(err)) return undefined;
      throw err;
    }
  }

  // DELETE: true if a record was removed
  async delete(id: number): Promise<boolean> {
    if (id > MAX_ID) return false;
    try {
      await this.prisma.announcement.delete({ where: { id } });
      return true;
    } catch (err) {
      if (isRecordNotFound(err)) return false;
      throw err;
    }
  }
}

// Dates leave the model as ISO strings, as before.
function toAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
