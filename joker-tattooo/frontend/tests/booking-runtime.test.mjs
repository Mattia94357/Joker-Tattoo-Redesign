import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

test('booking function starts in native Node ESM without the tsx JSON loader', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const outputRoot = path.join(root, 'test-results');
  await mkdir(outputRoot, { recursive: true });
  const fixture = await mkdtemp(path.join(outputRoot, 'booking-runtime-'));
  try {
    await mkdir(path.join(fixture, 'api'), { recursive: true });
    await mkdir(path.join(fixture, 'src/config'), { recursive: true });
    await copyFile(path.join(root, 'src/config/seo.json'), path.join(fixture, 'src/config/seo.json'));
    const source = await readFile(path.join(root, 'api/bookings.ts'), 'utf8');
    const compiled = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    const entry = path.join(fixture, 'api/bookings.mjs');
    await writeFile(entry, compiled);
    const result = spawnSync(process.execPath, [entry], { encoding: 'utf8', timeout: 10000 });
    assert.equal(result.status, 0, result.stderr || result.error?.message);
  } finally {
    if (path.dirname(fixture) !== outputRoot) throw new Error('Unexpected runtime fixture path');
    await rm(fixture, { recursive: true, force: true });
  }
});
