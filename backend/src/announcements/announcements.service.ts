import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Announcement, AnnouncementChanges, AnnouncementModel } from './announcement.model';

const TITLE_MAX = 120;
const CONTENT_MAX = 2000;

type Mode = 'create' | 'replace' | 'update';

// Business rules for announcements. Storage is the AnnouncementModel's job.
// Both controllers (web pages and JSON API) call this one service.
@Injectable()
export class AnnouncementsService {
  constructor(private readonly announcementModel: AnnouncementModel) {}

  findAll(): Announcement[] {
    return this.announcementModel.findAll();
  }

  findOne(id: number): Announcement {
    const announcement = this.announcementModel.findById(id);
    if (!announcement) throw new NotFoundException(`Announcement ${id} not found`);
    return announcement;
  }

  // POST: title and content required
  create(body: unknown): Announcement {
    const f = this.validate(body, 'create');
    return this.announcementModel.create({ title: f.title!, content: f.content! });
  }

  // PUT: full replacement, title and content required
  replace(id: number, body: unknown): Announcement {
    this.findOne(id);
    const f = this.validate(body, 'replace');
    return this.announcementModel.update(id, f)!;
  }

  // PATCH: partial update, at least one of title / content
  update(id: number, body: unknown): Announcement {
    this.findOne(id);
    const f = this.validate(body, 'update');
    return this.announcementModel.update(id, f)!;
  }

  // DELETE
  remove(id: number): void {
    if (!this.announcementModel.delete(id)) {
      throw new NotFoundException(`Announcement ${id} not found`);
    }
  }

  private validate(body: unknown, mode: Mode): AnnouncementChanges {
    const errors: string[] = [];
    const b = (body && typeof body === 'object' && !Array.isArray(body)
      ? body
      : {}) as Record<string, unknown>;

    const unknownFields = Object.keys(b).filter((k) => !['title', 'content'].includes(k));
    if (unknownFields.length) {
      errors.push(`Unknown or read-only field(s): ${unknownFields.join(', ')}`);
    }

    const required = mode !== 'update';
    const out: AnnouncementChanges = {};

    const checkText = (field: 'title' | 'content', max: number) => {
      if (b[field] === undefined) {
        if (required) errors.push(`${field} is required`);
        return;
      }
      const value = typeof b[field] === 'string' ? (b[field] as string).trim() : '';
      if (!value) errors.push(`${field} must not be empty`);
      else if (value.length > max) errors.push(`${field} must be at most ${max} characters`);
      else out[field] = value;
    };
    checkText('title', TITLE_MAX);
    checkText('content', CONTENT_MAX);

    if (mode === 'update' && !errors.length && Object.keys(out).length === 0) {
      errors.push('Send at least one of: title, content');
    }

    if (errors.length) throw new BadRequestException(errors);
    return out;
  }
}
