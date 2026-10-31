// Prints which database DATABASE_URL points at (host and database name only, never the
// credentials), so you can confirm it is the dev branch before running migrations.
// Usage: npm run db:host:local
const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error('DATABASE_URL is not set (is Backend/.env.local filled in?)');
  process.exit(1);
}
try {
  const u = new URL(raw);
  console.log(`host:     ${u.hostname}${u.port ? `:${u.port}` : ''}`);
  console.log(`database: ${u.pathname.replace(/^\//, '')}`);
  console.log(`user:     ${u.username || '(none)'}`);
} catch {
  console.error('DATABASE_URL is set but is not a valid URL (still a placeholder?)');
  process.exit(1);
}
