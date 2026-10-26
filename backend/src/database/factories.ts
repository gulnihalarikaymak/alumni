// Factories: each function returns the data for ONE fake record and saves nothing.
// seed.ts decides how many records to make and writes them to the database.
// All data is synthetic: fakerTR gives Turkish names, companies and cities, and
// every e-mail uses example.com, a domain reserved for examples (no real inbox).
import { fakerTR as faker } from '@faker-js/faker';
import { EmploymentType, Prisma, Role, Status, WorkType } from '../generated/prisma/client';

const UNIVERSITIES = ['Boğaziçi Üniversitesi', 'Marmara Üniversitesi', 'Yıldız Teknik Üniversitesi', 'Orta Doğu Teknik Üniversitesi'];
const DEGREES = ['Yönetim Bilişim Sistemleri', 'İşletme', 'İktisat', 'Bilgisayar Mühendisliği', 'Endüstri Mühendisliği'];
const POSITIONS = ['Yazılım Geliştirici', 'İş Analisti', 'Veri Analisti', 'Proje Yöneticisi', 'Ürün Yöneticisi', 'BT Danışmanı', 'Sistem Uzmanı'];
const EVENT_TOPICS = ['Mezunlar Buluşması', 'Kariyer Günü', 'Mentorluk Tanışma Toplantısı', 'Panel: Yapay Zekâ ve İş Hayatı', 'Sektörden Konuşmacı'];
const ANNOUNCEMENT_TOPICS = ['Mentorluk programı başvuruları açıldı', 'Staj ve iş ilanları güncellendi', 'Mezun profilinizi güncel tutun', 'Etkinlik takvimi yayımlandı', 'Kariyer merkezi çalışma saatleri'];

// A fake person, used for the e-mail and (for alumni) the profile name.
export function personFactory() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  // The random suffix keeps e-mails unique, so the seed can run again without a duplicate.
  const suffix = faker.string.alphanumeric({ length: 5, casing: 'lower' });
  return {
    fullName: `${firstName} ${lastName}`,
    email: `${ascii(firstName)}.${ascii(lastName)}.${suffix}@example.com`,
  };
}

// users row: e-mail lower-case (as UsersService stores it), mostly ACTIVE
export function userFactory(role: Role, email = personFactory().email): Prisma.UserCreateInput {
  return {
    email,
    role,
    status: faker.helpers.weightedArrayElement([
      { weight: 4, value: Status.ACTIVE },
      { weight: 1, value: Status.PENDING },
    ]),
  };
}

// An ALUMNI user together with their profile, career and education: one nested
// create, so Prisma fills four tables and sets the foreign keys itself.
export function alumniFactory(): Prisma.UserCreateInput {
  const person = personFactory();
  const graduationYear = faker.number.int({ min: 1998, max: 2025 });
  return {
    ...userFactory(Role.ALUMNI, person.email),
    alumniProfile: {
      create: {
        fullName: person.fullName,
        graduationYear,
        city: faker.location.city(), // city level only (README, privacy)
        educationEntries: { create: educationEntriesFactory(graduationYear) },
        careerEntries: { create: careerEntriesFactory(graduationYear) },
      },
    },
  };
}

// The bachelor's degree from Istanbul University, sometimes a master's after it.
export function educationEntriesFactory(graduationYear: number): Prisma.EducationEntryCreateWithoutAlumniProfileInput[] {
  const entries = [
    { institution: 'İstanbul Üniversitesi', degree: `Lisans, ${faker.helpers.arrayElement(DEGREES)}`, graduationYear },
  ];
  if (graduationYear <= 2023 && faker.datatype.boolean(0.3)) {
    entries.push({
      institution: faker.helpers.arrayElement(UNIVERSITIES),
      degree: `Yüksek Lisans, ${faker.helpers.arrayElement(DEGREES)}`,
      graduationYear: graduationYear + 2,
    });
  }
  return entries;
}

// 1–3 jobs after graduation, one after another, never in the future.
// The last job has no end date: it is the current one.
export function careerEntriesFactory(graduationYear: number): Prisma.CareerEntryCreateWithoutAlumniProfileInput[] {
  const today = new Date();
  const entries: Prisma.CareerEntryCreateWithoutAlumniProfileInput[] = [];
  let start = faker.date.between({ from: new Date(graduationYear, 6, 1), to: earliest(new Date(graduationYear + 1, 11, 31), today) });
  const jobs = faker.number.int({ min: 1, max: 3 });

  for (let i = 0; i < jobs; i++) {
    let end: Date | null = i === jobs - 1 ? null : faker.date.between({ from: addMonths(start, 6), to: addMonths(start, 48) });
    if (end && end >= today) end = null; // would end in the future, so it is still going on
    entries.push({ company: faker.company.name(), position: faker.helpers.arrayElement(POSITIONS), startDate: start, endDate: end });
    if (!end) break;
    start = faker.date.between({ from: end, to: earliest(addMonths(end, 3), today) });
  }
  return entries;
}

export function announcementFactory(): Prisma.AnnouncementCreateInput {
  return {
    title: faker.helpers.arrayElement(ANNOUNCEMENT_TOPICS), // well under the 120-character limit
    content: faker.lorem.paragraphs(2).slice(0, 2000),
  };
}

// An upcoming event; capacity is empty (no limit) for about a third of them.
export function eventFactory(): Prisma.EventCreateInput {
  return {
    title: faker.helpers.arrayElement(EVENT_TOPICS),
    description: faker.lorem.sentences(2),
    startsAt: faker.date.soon({ days: 90 }),
    location: faker.location.city(),
    capacity: faker.helpers.maybe(() => faker.number.int({ min: 20, max: 200 }), { probability: 0.66 }) ?? null,
  };
}

// A job posting; it belongs to no user. Optional fields are sometimes empty,
// so the data shows both cases. Links and e-mails use example.com only.
export function jobPostingFactory(): Prisma.JobPostingCreateInput {
  const employmentType = faker.helpers.enumValue(EmploymentType);
  const position = faker.helpers.arrayElement(POSITIONS);
  return {
    title: employmentType === EmploymentType.INTERNSHIP ? `Stajyer ${position}` : position, // under 120 characters
    company: faker.company.name(),
    location: faker.helpers.maybe(() => faker.location.city(), { probability: 0.8 }) ?? null, // city level only
    workType: faker.helpers.enumValue(WorkType),
    employmentType,
    description: faker.lorem.paragraphs(2),
    applyUrl:
      faker.helpers.maybe(
        () => faker.helpers.arrayElement([`https://example.com/kariyer/${faker.string.alphanumeric({ length: 6, casing: 'lower' })}`, 'mailto:ik@example.com']),
        { probability: 0.7 },
      ) ?? null,
    // A date column: Prisma keeps only the day. Empty = open until removed.
    deadline: faker.helpers.maybe(() => faker.date.soon({ days: 60 }), { probability: 0.7 }) ?? null,
  };
}

// "Şükrü" -> "sukru": e-mail addresses stay plain lower-case ASCII.
function ascii(text: string): string {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };
  return text
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (c) => map[c])
    .normalize('NFD')
    .replace(/[^a-z]/g, '');
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function earliest(a: Date, b: Date): Date {
  return a < b ? a : b;
}
