import { z } from 'zod';

const text = (max) => z.string().trim().min(1).max(max);

const httpUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Must be an http(s) URL');

// Images may be hosted in /public (relative path) or external (http/https).
const imageRef = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => (v.startsWith('/') && !v.startsWith('//')) || httpUrl.safeParse(v).success, 'Must be an http(s) URL or a /path');

const stringList = z.array(text(60)).max(50);

export const projectSchema = z.object({
  title: text(200),
  description: text(5000),
  techStack: stringList,
  tags: stringList,
  imageUrl: imageRef,
  githubUrl: httpUrl,
  demoUrl: httpUrl,
  imageOnRight: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  caseStudy: z.string().trim().max(20000).nullish(),
});

export const achievementSchema = z.object({
  title: text(200),
  date: z.coerce.date(),
  overview: text(5000),
  certificate: imageRef.nullish(),
});

export const feedbackSchema = z.object({
  email: z.string().trim().email().max(254),
  name: text(100),
  rating: z.coerce.number().int().min(1).max(5),
  remark: z.string().trim().max(2000).nullish(),
});

export const TECH_CATEGORIES = ['Languages', 'Frontend', 'Python_Frameworks', 'Databases', 'Data_Science', 'Tools'];
export const techStackSchema = z.object({
  name: text(100),
  category: z.enum(TECH_CATEGORIES),
  proficiency: z.coerce.number().int().min(1).max(100),
  description: text(1000),
  iconName: text(100),
});

export const TIMELINE_TYPES = ['EDUCATION', 'HACKATHON', 'WORK'];
export const timelineSchema = z.object({
  title: text(200),
  date: text(100),
  description: text(5000),
  type: z.enum(TIMELINE_TYPES),
  remarks: z.string().trim().max(2000).nullish(),
  startDate: z.coerce.date().nullish(),
});

// Free-text timeline dates ("2023 - Present", "Aug 2024") -> sortable Date.
export const deriveStartDate = (label) => {
  const year = /\b(19|20)\d{2}\b/.exec(label)?.[0];
  return year ? new Date(`${year}-01-01T00:00:00.000Z`) : null;
};
