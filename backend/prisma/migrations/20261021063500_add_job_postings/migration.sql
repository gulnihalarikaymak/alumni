-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT');

-- CreateTable
CREATE TABLE "job_postings" (
    "id" SERIAL NOT NULL,
    "posted_by_id" INTEGER NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "work_type" "WorkType" NOT NULL,
    "employment_type" "EmploymentType" NOT NULL,
    "description" TEXT NOT NULL,
    "apply_url" TEXT,
    "deadline" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_posted_by_id_fkey" FOREIGN KEY ("posted_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
