import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cdpr-devtool-test-'));
  for (const dir of ['scripts', 'bin', 'pack/PCL'])
    fs.mkdirSync(path.join(root, dir), { recursive: true });
  fs.copyFileSync(
    new URL('./devtool.mjs', import.meta.url),
    path.join(root, 'scripts/devtool.mjs')
  );
  fs.writeFileSync(
    path.join(root, 'scripts/pack-integrity.mjs'),
    `import fs from 'node:fs';
export function generateIntegrityManifest() {
  fs.appendFileSync(process.env.MOCK_LOG, JSON.stringify(['manifest']) + '\\n');
}`
  );
  const mock = path.join(root, 'bin/mock.cjs');
  fs.writeFileSync(
    mock,
    `const fs = require('node:fs');
const args = process.argv.slice(2);
if (args[0] === '--version') console.log('bkmpw 0.1.1');
else if (args[0] === '--help') {
  (process.env.HELP_STREAM === 'stderr' ? console.error : console.log)(process.env.HELP_TEXT);
} else fs.appendFileSync(process.env.MOCK_LOG, JSON.stringify(args) + '\\n');
`
  );
  if (process.platform === 'win32') {
    fs.writeFileSync(path.join(root, 'bin/bkmpw.cmd'), `@"${process.execPath}" "${mock}" %*\r\n`);
  } else {
    fs.writeFileSync(
      path.join(root, 'bin/bkmpw'),
      `#!/bin/sh\nexec "${process.execPath}" "${mock}" "$@"\n`,
      { mode: 0o755 }
    );
  }
  fs.writeFileSync(
    path.join(root, 'pack/pack.toml'),
    '[versions]\nminecraft = "1.21.1"\nneoforge = "21.1.242"\n'
  );
  fs.writeFileSync(
    path.join(root, 'pack/variables.txt'),
    'MC_VERSION=1.21.1\nNEOFORGE_VERSION=21.1.242\nNEOFORGE_INSTALLER_URL=https://maven.neoforged.net/releases/net/neoforged/neoforge/21.1.242/neoforge-21.1.242-installer.jar\n'
  );
  fs.writeFileSync(
    path.join(root, 'pack/PCL/Setup.ini'),
    'VersionVanillaName:1.21.1\nVersionNeoForge:21.1.242\n'
  );
  const log = path.join(root, 'calls.jsonl');
  return {
    root,
    run(args, env = {}) {
      fs.writeFileSync(log, '');
      return spawnSync(process.execPath, ['scripts/devtool.mjs', ...args], {
        cwd: root,
        encoding: 'utf8',
        env: {
          ...process.env,
          PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH}`,
          MOCK_LOG: log,
          HELP_TEXT: 'bkmpw prepare-pack <pack-root>',
          ...env,
        },
      });
    },
    calls: () => fs.readFileSync(log, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse),
    close: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

test('release capability accepts either help stream and rejects old commands', () => {
  const f = fixture();
  try {
    for (const [help, stream, accepted] of [
      ['bkmpw prepare-pack <root>', 'stdout', true],
      ['prepare-pack <root>', 'stderr', true],
      ['prepare-server <root>', 'stdout', false],
      ['prepare-pack-old <root>', 'stdout', false],
    ]) {
      const result = f.run(['prepare-pack'], { HELP_TEXT: help, HELP_STREAM: stream });
      assert.equal(result.status === 0, accepted, result.stderr);
      assert.deepEqual(f.calls(), accepted ? [['prepare-pack', f.root]] : []);
    }
  } finally {
    f.close();
  }
});

test('four release commands forward arguments and generate only required manifests', () => {
  const f = fixture();
  try {
    for (const [command, extra] of [
      ['export-client', ['archive with spaces.zip', 'instance']],
      ['export-curseforge', ['archive.zip', 'client']],
      ['export-server', ['server.zip']],
      ['export-server-installer', ['installer.zip']],
    ]) {
      const result = f.run([command, ...extra]);
      assert.equal(result.status, 0, result.stderr);
      const expected = command === 'export-server-installer' ? [] : [['manifest']];
      assert.deepEqual(f.calls(), [...expected, [command, f.root, ...extra]]);
    }
    fs.writeFileSync(
      path.join(f.root, 'pack/PCL/Setup.ini'),
      'VersionVanillaName:wrong\nVersionNeoForge:21.1.242\n'
    );
    const result = f.run(['export-client']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /drifted/);
    assert.deepEqual(f.calls(), []);
  } finally {
    f.close();
  }
});
