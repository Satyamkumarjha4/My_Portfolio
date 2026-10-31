// Local stand-in for a Vercel Deploy Hook. Logs every request it receives so you can
// watch the API's debouncing: after a burst of admin edits there should be exactly one
// POST, about 60 s after the last write.
//
//   node scripts/fake-deploy-hook.mjs            # listens on :9999
//   PORT=9998 node scripts/fake-deploy-hook.mjs
//
// Then set VERCEL_DEPLOY_HOOK_URL=http://localhost:9999 for the backend.
import http from 'node:http';

const port = Number(process.env.PORT) || 9999;
let count = 0;
let last = null;

const stamp = () => new Date().toLocaleTimeString('en-GB');

http
  .createServer((req, res) => {
    req.resume();
    req.on('end', () => {
      if (req.method === 'POST') {
        count += 1;
        const since = last ? `${((Date.now() - last) / 1000).toFixed(1)}s after the previous one` : 'first call';
        last = Date.now();
        console.log(`${stamp()}  POST #${count} ${req.url}  (${since})`);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ job: { id: `fake-${count}`, state: 'PENDING' } }));
      }
      console.log(`${stamp()}  ${req.method} ${req.url}  (ignored, only POST counts as a deploy)`);
      res.writeHead(405).end();
    });
  })
  .listen(port, () => console.log(`${stamp()}  fake deploy hook listening on http://localhost:${port}`));
