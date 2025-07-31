/*
  Warnings:

  - The values [education,hackathon,work] on the enum `TimelineType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TimelineType_new" AS ENUM ('EDUCATION', 'HACKATHON', 'WORK');
ALTER TABLE "public"."TimelineItem" ALTER COLUMN "type" TYPE "public"."TimelineType_new" USING ("type"::text::"public"."TimelineType_new");
ALTER TYPE "public"."TimelineType" RENAME TO "TimelineType_old";
ALTER TYPE "public"."TimelineType_new" RENAME TO "TimelineType";
DROP TYPE "public"."TimelineType_old";
COMMIT;
