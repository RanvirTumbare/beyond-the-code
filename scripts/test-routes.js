import http from 'http';
import { spawn } from 'child_process';

const routesToTest = [
  '/',
  '/about',
  '/journey',
  '/projects',
  '/projects/sentinelaudit-access-analyzer',
  '/certificates',
  '/diary',
  '/diary/why-engineers-need-security-early',
  '/gallery',
  '/contact',
  '/login',
  '/reset-password',
  '/admin',
];

async function probeUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log('🚀 Starting Vite preview server...');
  const proc = spawn('npx', ['vite', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
    shell: true,
    stdio: 'ignore',
  });

  // Give server 3.5 seconds to bind
  await new Promise((r) => setTimeout(r, 3500));

  console.log('🧪 Probing application routes on http://localhost:4173 ...\n');

  let passed = 0;
  let failed = 0;

  for (const route of routesToTest) {
    try {
      const res = await probeUrl(`http://127.0.0.1:4173${route}`);
      if (res.statusCode === 200) {
        console.log(`✅ [200 OK] ${route} (${res.length} bytes)`);
        passed++;
      } else {
        console.error(`❌ [${res.statusCode}] ${route}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] ${route} -> ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Summary: ${passed}/${routesToTest.length} routes responded with 200 OK.`);
  proc.kill('SIGINT');
  process.exit(failed > 0 ? 1 : 0);
}

run();
