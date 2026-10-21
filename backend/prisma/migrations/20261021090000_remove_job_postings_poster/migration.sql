-- DropForeignKey
ALTER TABLE "job_postings" DROP CONSTRAINT "job_postings_posted_by_id_fkey";

-- AlterTable
ALTER TABLE "job_postings" DROP COLUMN "posted_by_id";

