import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { prismaMock, PASSWORD } from './helpers.js';

vi.mock('../src/config/prisma.js', () => ({ default: prismaMock }));
vi.mock('../src/utils/deployHook.js', () => ({ scheduleDeploy: vi.fn(), flushDeploy: vi.fn() }));

const { scheduleDeploy } = await import('../src/utils/deployHook.js');
const { createApp } = await import('../src/app.js');
const app = createApp();

const login = async () => (await request(app).post('/api/auth/login').send({ id: 'admin', password: PASSWORD })).body.token;

const bodies = {
  projects: { title: 'P', description: 'D', techStack: ['a'], tags: ['b'], imageUrl: '/x.png', githubUrl: 'https://g.com/x', demoUrl: 'https://d.com', imageOnRight: false },
  achievements: { title: 'A', date: '2025-01-01', overview: 'O', certificate: null },
  'tech-stacks': { name: 'N', category: 'Tools', proficiency: 50, description: 'D', iconName: 'FaGitAlt' },
  timeline: { title: 'T', date: '2023', description: 'D', type: 'WORK' },
};

beforeEach(() => vi.clearAllMocks());

// `finish` fires after the response is flushed; give the event loop a turn.
const settle = () => new Promise((r) => setImmediate(r));

describe.each(Object.entries(bodies))('%s: schedules a frontend rebuild after content writes', (resource, body) => {
  it('on POST, PUT and DELETE success', async () => {
    const token = await login();
    const auth = { Authorization: `Bearer ${token}` };

    await request(app).post(`/api/${resource}`).set(auth).send(body).expect(201);
    await settle();
    expect(scheduleDeploy).toHaveBeenCalledTimes(1);

    await request(app).put(`/api/${resource}/abc`).set(auth).send(body).expect(200);
    await settle();
    expect(scheduleDeploy).toHaveBeenCalledTimes(2);

    await request(app).delete(`/api/${resource}/abc`).set(auth).expect(204);
    await settle();
    expect(scheduleDeploy).toHaveBeenCalledTimes(3);
  });

  it('not on failed or unauthenticated writes, nor on reads', async () => {
    const token = await login();
    await request(app).post(`/api/${resource}`).set('Authorization', `Bearer ${token}`).send({}).expect(400);
    await request(app).post(`/api/${resource}`).send(body).expect(401);
    await request(app).delete(`/api/${resource}/abc`).expect(401);
    await request(app).get(`/api/${resource}`).expect(200);
    await settle();
    expect(scheduleDeploy).not.toHaveBeenCalled();
  });
});

describe('other writes do not rebuild the site', () => {
  it('feedback submissions and logins do not trigger a deploy', async () => {
    await request(app).post('/api/feedback').send({ email: 'a@b.co', name: 'n', rating: 5 }).expect(201);
    await login();
    await settle();
    expect(scheduleDeploy).not.toHaveBeenCalled();
  });
});
