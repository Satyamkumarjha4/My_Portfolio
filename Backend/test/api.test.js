import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { Prisma } from '@prisma/client';
import { prismaMock, PASSWORD } from './helpers.js';

vi.mock('../src/config/prisma.js', () => ({ default: prismaMock }));

const { createApp } = await import('../src/app.js');
const app = createApp();

const login = async () => {
  const res = await request(app).post('/api/auth/login').send({ id: 'admin', password: PASSWORD });
  return res.body.token;
};

const validProject = {
  title: 'Proj',
  description: 'Desc',
  techStack: ['React'],
  tags: ['web'],
  imageUrl: '/project_images/a.png',
  githubUrl: 'https://github.com/x/y',
  demoUrl: 'https://example.com',
  imageOnRight: false,
};

beforeEach(() => vi.clearAllMocks());

describe('auth', () => {
  it('rejects wrong credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ id: 'admin', password: 'nope' });
    expect(res.status).toBe(401);
  });

  it('rejects malformed login bodies', async () => {
    const res = await request(app).post('/api/auth/login').send({ id: 1 });
    expect(res.status).toBe(400);
  });

  it('issues a JWT that /me accepts', async () => {
    const token = await login();
    expect(token).toBeTruthy();
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
  });

  it('rejects expired, wrong-secret and alg:none tokens', async () => {
    const jwt = (await import('jsonwebtoken')).default;
    const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const tokens = {
      expired: jwt.sign({ role: 'admin', exp: Math.floor(Date.now() / 1000) - 10 }, process.env.JWT_SECRET),
      wrongSecret: jwt.sign({ role: 'admin' }, 'another-secret-another-secret-another-1'),
      algNone: `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ role: 'admin' })}.`,
      wrongRole: jwt.sign({ role: 'viewer' }, process.env.JWT_SECRET),
    };
    for (const [name, t] of Object.entries(tokens)) {
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${t}`);
      expect(res.status, name).toBe(401);
    }
  });

  it('rejects missing, garbage and old-style static tokens on write routes', async () => {
    const writes = [
      ['post', '/api/projects'],
      ['put', '/api/projects/1'],
      ['delete', '/api/projects/1'],
      ['post', '/api/achievements'],
      ['post', '/api/tech-stacks'],
      ['post', '/api/timeline'],
      ['get', '/api/feedback'],
      ['delete', '/api/feedback/1'],
    ];
    for (const [method, url] of writes) {
      expect((await request(app)[method](url).send({})).status, `${method} ${url}`).toBe(401);
      expect((await request(app)[method](url).set('Authorization', 'Bearer garbage').send({})).status).toBe(401);
    }
    expect(prismaMock.project.create).not.toHaveBeenCalled();
  });
});

describe('public reads', () => {
  it('lists projects with cache headers and deterministic ordering', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toMatch(/max-age=60/);
    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });
  });
});

describe('validation', () => {
  it('creates a valid project and strips unknown fields', async () => {
    const token = await login();
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validProject, id: 'hijack', evil: true });
    expect(res.status).toBe(201);
    const { data } = prismaMock.project.create.mock.calls[0][0];
    expect(data.id).toBeUndefined();
    expect(data.evil).toBeUndefined();
  });

  it('rejects javascript: URLs', async () => {
    const token = await login();
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validProject, demoUrl: 'javascript:alert(1)' });
    expect(res.status).toBe(400);
  });

  it('validates imageOnRight=false correctly and rejects non-booleans', async () => {
    const token = await login();
    const ok = await request(app).post('/api/projects').set('Authorization', `Bearer ${token}`).send(validProject);
    expect(ok.status).toBe(201);
    const bad = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validProject, imageOnRight: 'yes' });
    expect(bad.status).toBe(400);
  });

  it('accepts an optional case study and rejects oversized ones', async () => {
    const token = await login();
    const h = (b) => request(app).post('/api/projects').set('Authorization', `Bearer ${token}`).send(b);
    expect((await h({ ...validProject, caseStudy: '## Problem\n\nText' })).status).toBe(201);
    expect((await h({ ...validProject, caseStudy: null })).status).toBe(201);
    expect((await h({ ...validProject, caseStudy: 'x'.repeat(20001) })).status).toBe(400);
  });

  it('rejects empty update bodies', async () => {
    const token = await login();
    const res = await request(app).put('/api/projects/1').set('Authorization', `Bearer ${token}`).send({ nope: 1 });
    expect(res.status).toBe(400);
  });

  it('rejects invalid tech stack category and out-of-range proficiency', async () => {
    const token = await login();
    const base = { name: 'X', category: 'Languages', proficiency: 50, description: 'd', iconName: 'i' };
    const h = (b) => request(app).post('/api/tech-stacks').set('Authorization', `Bearer ${token}`).send(b);
    expect((await h(base)).status).toBe(201);
    expect((await h({ ...base, category: 'Nope' })).status).toBe(400);
    expect((await h({ ...base, proficiency: 0 })).status).toBe(400);
    expect((await h({ ...base, proficiency: 101 })).status).toBe(400);
  });

  it('rejects invalid achievement dates', async () => {
    const token = await login();
    const res = await request(app)
      .post('/api/achievements')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 't', date: 'not-a-date', overview: 'o' });
    expect(res.status).toBe(400);
  });

  it('derives a sortable startDate for timeline items', async () => {
    const token = await login();
    const res = await request(app)
      .post('/api/timeline')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Uni', date: '2022 - 2026', description: 'd', type: 'EDUCATION' });
    expect(res.status).toBe(201);
    const { data } = prismaMock.timelineItem.create.mock.calls[0][0];
    expect(data.startDate.getUTCFullYear()).toBe(2022);
  });
});

describe('feedback', () => {
  const good = { email: 'a@b.co', name: 'Ann', rating: 5, remark: 'nice' };

  it('accepts public submissions and ignores client-supplied id/createdAt', async () => {
    const res = await request(app).post('/api/feedback').send({ ...good, id: 'x', createdAt: '2000-01-01' });
    expect(res.status).toBe(201);
    const { data } = prismaMock.feedback.create.mock.calls[0][0];
    expect(data).toEqual({ email: 'a@b.co', name: 'Ann', rating: 5, remark: 'nice' });
  });

  it.each([
    [{ ...good, rating: 6 }],
    [{ ...good, rating: 2.5 }],
    [{ ...good, rating: true }],
    [{ ...good, rating: '' }],
    [{ ...good, email: 'nope' }],
    [{ ...good, remark: 'x'.repeat(2001) }],
    [{ name: 'a' }],
  ])('rejects invalid payload %#', async (body) => {
    expect((await request(app).post('/api/feedback').send(body)).status).toBe(400);
  });

  it('does not allow listing feedback anonymously', async () => {
    expect((await request(app).get('/api/feedback')).status).toBe(401);
  });
});

describe('errors', () => {
  it('maps Prisma P2025 to 404 without leaking internals', async () => {
    const token = await login();
    prismaMock.project.delete.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('secret internals', { code: 'P2025', clientVersion: 'x' })
    );
    const res = await request(app).delete('/api/projects/missing').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(JSON.stringify(res.body)).not.toMatch(/secret internals/);
  });

  it('returns a generic 500 for unexpected failures', async () => {
    prismaMock.project.findMany.mockRejectedValueOnce(new Error('connection string leak'));
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toMatch(/leak/);
  });

  it('returns 400 for malformed JSON and 404 for unknown routes', async () => {
    const bad = await request(app).post('/api/feedback').set('Content-Type', 'application/json').send('{bad');
    expect(bad.status).toBe(400);
    expect((await request(app).get('/api/nope')).status).toBe(404);
  });
});

describe('infrastructure', () => {
  it('livez answers without touching the database', async () => {
    const res = await request(app).get('/livez');
    expect(res.status).toBe(200);
    expect(prismaMock.$queryRaw).not.toHaveBeenCalled();
  });

  it('health reports db up and down', async () => {
    expect((await request(app).get('/health')).body.db).toBe('up');
    prismaMock.$queryRaw.mockRejectedValueOnce(new Error('down'));
    const res = await request(app).get('/health');
    expect(res.status).toBe(503);
  });

  it('CORS only allows configured origins (trailing slash in config tolerated)', async () => {
    const ok = await request(app).get('/api/projects').set('Origin', 'https://site.example');
    expect(ok.headers['access-control-allow-origin']).toBe('https://site.example');
    const bad = await request(app).get('/api/projects').set('Origin', 'https://evil.example');
    expect(bad.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('sets security headers and hides x-powered-by', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
