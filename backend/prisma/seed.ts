// Adds synthetic demo data to the database: `npx prisma db seed` (db container running).
// It only adds rows and never deletes: running it twice gives twice as much data.
import { fakerTR as faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { databaseUrl } from '../prisma.config';
import { PrismaClient, Role } from '../src/generated/prisma/client';
import { alumniFactory, announcementFactory, eventFactory, userFactory } from './factories';

// How many records one run adds
const COUNT = { admins: 1, staff: 2, students: 5, alumni: 12, announcements: 5, events: 3 };

// Prisma 7 talks to PostgreSQL through a driver adapter (here: node-postgres, "pg").
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

async function main() {
  const createUsers = (n: number, make: () => Parameters<typeof prisma.user.create>[0]['data']) =>
    Promise.all(Array.from({ length: n }, () => prisma.user.create({ data: make() })));

  await createUsers(COUNT.admins, () => userFactory(Role.ADMIN));
  await createUsers(COUNT.staff, () => userFactory(Role.STAFF));
  const students = await createUsers(COUNT.students, () => userFactory(Role.STUDENT));
  const alumni = await createUsers(COUNT.alumni, () => alumniFactory());

  await prisma.announcement.createMany({ data: Array.from({ length: COUNT.announcements }, announcementFactory) });

  // Each event gets 3–8 different attendees from the students and alumni made above
  // (arrayElements never picks the same user twice, so the UNIQUE(event, user) rule holds).
  for (let i = 0; i < COUNT.events; i++) {
    const attendees = faker.helpers.arrayElements([...students, ...alumni], { min: 3, max: 8 });
    await prisma.event.create({
      data: {
        ...eventFactory(),
        registrations: { create: attendees.map((user) => ({ user: { connect: { id: user.id } } })) },
      },
    });
  }

  // Totals in the database after this run
  console.table({
    users: await prisma.user.count(),
    alumni_profiles: await prisma.alumniProfile.count(),
    career_entries: await prisma.careerEntry.count(),
    education_entries: await prisma.educationEntry.count(),
    announcements: await prisma.announcement.count(),
    events: await prisma.event.count(),
    event_registrations: await prisma.eventRegistration.count(),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
