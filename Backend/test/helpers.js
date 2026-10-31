import { vi } from 'vitest';
import bcrypt from 'bcryptjs';

export const PASSWORD = 'correct horse battery';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(PASSWORD, 4);

const model = () => ({
  findMany: vi.fn().mockResolvedValue([]),
  create: vi.fn(async ({ data }) => ({ id: 'new-id', ...data })),
  update: vi.fn(async ({ where, data }) => ({ id: where.id, ...data })),
  delete: vi.fn().mockResolvedValue({}),
});

export const prismaMock = {
  project: model(),
  achievement: model(),
  feedback: model(),
  techStack: model(),
  timelineItem: model(),
  $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
  $disconnect: vi.fn(),
};
