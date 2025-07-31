-- CreateEnum
CREATE TYPE "public"."TechCategory" AS ENUM ('Languages', 'Frontend', 'Python_Frameworks', 'Databases', 'Data_Science', 'Tools');

-- CreateEnum
CREATE TYPE "public"."TimelineType" AS ENUM ('education', 'hackathon', 'work');

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "techStack" TEXT[],
    "tags" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "demoUrl" TEXT NOT NULL,
    "imageOnRight" BOOLEAN NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "overview" TEXT NOT NULL,
    "certificate" TEXT,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feedback" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TechStack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."TechCategory" NOT NULL,
    "proficiency" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,

    CONSTRAINT "TechStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimelineItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."TimelineType" NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "TimelineItem_pkey" PRIMARY KEY ("id")
);
