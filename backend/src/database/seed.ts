// Shared seed routine: adds synthetic demo data. It only ADDS rows, never deletes,
// so running it twice gives twice as much data. Two callers use it:
//   - SeedService, which runs it automatically when the database is empty (app start)
//   - prisma/seed.ts, the manual `npx prisma db seed` command on a dev host
import { fakerTR as faker } from '@faker-js/faker';
import { PrismaClient, Role } from '../generated/prisma/client';
import { alumniFactory, announcementFactory, eventFactory, jobPostingFactory, userFactory } from './factories';

// How many records one run adds.
export const SEED_COUNT = { admins: 1, staff: 2, students: 5, alumni: 12, announcements: 5, events: 3, jobPostings: 8 };

// Accepts the app's PrismaService or any standalone PrismaClient.
export async function seedDatabase(prisma: PrismaClient) {
  const createUsers = (n: number, make: () => Parameters<typeof prisma.user.create>[0]['data']) =>
    Promise.all(Array.from({ length: n }, () => prisma.user.create({ data: make() })));

  await createUsers(SEED_COUNT.admins, () => userFactory(Role.ADMIN));
  await createUsers(SEED_COUNT.staff, () => userFactory(Role.STAFF));
  const students = await createUsers(SEED_COUNT.students, () => userFactory(Role.STUDENT));
  const alumni = await createUsers(SEED_COUNT.alumni, () => alumniFactory());

  await prisma.announcement.createMany({ data: Array.from({ length: SEED_COUNT.announcements }, announcementFactory) });

  // Each event gets 3-8 different attendees (arrayElements never repeats, so the
  // UNIQUE(event, user) rule holds).
  for (let i = 0; i < SEED_COUNT.events; i++) {
    const attendees = faker.helpers.arrayElements([...students, ...alumni], { min: 3, max: 8 });
    await prisma.event.create({
      data: {
        ...eventFactory(),
        registrations: { create: attendees.map((user) => ({ user: { connect: { id: user.id } } })) },
      },
    });
  }

  await prisma.jobPosting.createMany({ data: Array.from({ length: SEED_COUNT.jobPostings }, jobPostingFactory) });

  // Totals in the database after this run.
  return {
    users: await prisma.user.count(),
    alumni_profiles: await prisma.alumniProfile.count(),
    career_entries: await prisma.careerEntry.count(),
    education_entries: await prisma.educationEntry.count(),
    announcements: await prisma.announcement.count(),
    events: await prisma.event.count(),
    event_registrations: await prisma.eventRegistration.count(),
    job_postings: await prisma.jobPosting.count(),
  };
}
