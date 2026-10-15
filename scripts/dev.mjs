import { createHash } from 'node:crypto';
import { existsSync, realpathSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createConnection, createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = realpathSync(fileURLToPath(new URL('../', import.meta.url)));
const identity = createHash('sha256')
  .update(process.platform === 'win32' ? projectRoot.toLowerCase() : projectRoot)
  .digest('hex').slice(0, 24);
const endpoint = process.platform === 'win32'
  ? `\\\\.\\pipe\\portfolio-next-dev-${identity}`
  : join(tmpdir(), `portfolio-next-dev-${identity}.sock`);

// Windows releases a named pipe when its owning process exits. On Unix, remove
// only a stale socket belonging to this checkout, never one with a live listener.
if (process.platform !== 'win32' && existsSync(endpoint)) {
  const active = await new Promise((resolve, reject) => {
    const probe = createConnection(endpoint);
    probe.once('connect', () => { probe.destroy(); resolve(true); });
    probe.once('error', (error) => {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOENT') resolve(false);
      else reject(error);
    });
  });
  if (!active && existsSync(endpoint)) unlinkSync(endpoint);
}

const guard = createServer((connection) => connection.end());
guard.once('error', (error) => {
  console.error(error.code === 'EADDRINUSE'
    ? 'Este projeto já tem um servidor de desenvolvimento ativo. Use a janela existente; pare-o antes de iniciar outro, mesmo em outra porta.'
    : `Não foi possível adquirir a trava de desenvolvimento: ${error.message}`);
  process.exitCode = 1;
});

guard.listen(endpoint, () => {
  const require = createRequire(import.meta.url);
  const cli = require.resolve('next/dist/bin/next');
  process.chdir(projectRoot);
  process.env.PORTFOLIO_DEV_LOCK = '1';
  // An explicit port disables Next's automatic retry on 3001, 3002, etc.
  process.argv = [process.execPath, cli, 'dev', '--port', process.env.PORT || '3000', ...process.argv.slice(2)];
  // Run the standard Next CLI in this process so its lifetime owns the lock,
  // including Next's worker restarts and normal Ctrl+C cleanup.
  try {
    require(cli);
  } catch (error) {
    console.error(error);
    guard.close();
    process.exitCode = 1;
  }
});
