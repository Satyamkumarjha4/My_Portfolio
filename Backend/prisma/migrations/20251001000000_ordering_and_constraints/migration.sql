-- Explicit ordering for projects
ALTER TABLE "public"."Project" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Sortable date for timeline items, backfilled from the first 4-digit year in the label
ALTER TABLE "public"."TimelineItem" ADD COLUMN "startDate" TIMESTAMP(3);
UPDATE "public"."TimelineItem"
SET "startDate" = make_timestamp(substring("date" from '(?:19|20)\d{2}')::int, 1, 1, 0, 0, 0)
WHERE "date" ~ '(?:19|20)\d{2}';

-- Range checks. NOT VALID enforces them for new/updated rows without
-- failing the migration if legacy rows are out of range.
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_rating_range" CHECK ("rating" BETWEEN 1 AND 5) NOT VALID;
ALTER TABLE "public"."TechStack" ADD CONSTRAINT "TechStack_proficiency_range" CHECK ("proficiency" BETWEEN 1 AND 100) NOT VALID;
