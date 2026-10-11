// The Announcement model. Held in memory: no database yet (homework 1).
import { Injectable } from '@nestjs/common';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Fields the caller provides; id and the dates are set by the model.
export type NewAnnouncement = Pick<Announcement, 'title' | 'content'>;
export type AnnouncementChanges = Partial<NewAnnouncement>;

/**
 * Owns the announcement data and the CRUD operations on it.
 * Records live in an array and are lost on restart.
 * No validation and no HTTP here: a missing record is reported as
 * undefined or false, and the service decides what that means (404).
 */
@Injectable()
export class AnnouncementModel {
  private readonly announcements: Announcement[] = [];
  private nextId = 1;

  // CREATE
  create(data: NewAnnouncement): Announcement {
    const now = new Date().toISOString();
    const announcement: Announcement = {
      id: this.nextId++,
      title: data.title,
      content: data.content,
      createdAt: now,
      updatedAt: now,
    };
    this.announcements.push(announcement);
    return { ...announcement };
  }

  // READ: all records, newest first
  findAll(): Announcement[] {
    return this.announcements.map((a) => ({ ...a })).reverse();
  }

  // READ: one record by id
  findById(id: number): Announcement | undefined {
    const announcement = this.announcements.find((a) => a.id === id);
    return announcement ? { ...announcement } : undefined;
  }

  // UPDATE: changes only the fields given; used by both PUT and PATCH
  update(id: number, changes: AnnouncementChanges): Announcement | undefined {
    const announcement = this.announcements.find((a) => a.id === id);
    if (!announcement) return undefined;
    if (changes.title !== undefined) announcement.title = changes.title;
    if (changes.content !== undefined) announcement.content = changes.content;
    announcement.updatedAt = new Date().toISOString();
    return { ...announcement };
  }

  // DELETE: true if a record was removed
  delete(id: number): boolean {
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.announcements.splice(index, 1);
    return true;
  }
}
