import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { shared, acquire } from '../dist/features/shared.js';

test('separately installed core copies share one runtime and register each feature once', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'pi-code-core-copy-'));
  try {
    const root = fileURLToPath(new URL('../', import.meta.url));
    for (const name of ['dist', 'lib/prompts', 'lib/profiles', 'package.json']) {
      await cp(join(root, name), join(temp, name), { recursive: true });
    }
    await mkdir(join(temp, 'node_modules'));
    const typebox = fileURLToPath(new URL('../../node_modules/typebox', import.meta.url));
    await symlink(typebox, join(temp, 'node_modules/typebox'), 'dir');
    const other = await import(pathToFileURL(join(temp, 'dist/features/shared.js')).href);
    const listeners = new Map();
    const handlers = [];
    const events = {
      emit(name, request) { for (const fn of listeners.get(name) ?? []) fn(request); },
      on(name, fn) { listeners.set(name, [...(listeners.get(name) ?? []), fn]); return () => {}; },
    };
    const api = () => ({ events, on(name) { handlers.push(name); } });
    const first = shared(api());
    assert.equal(other.shared(api()), first);
    assert.ok(acquire(api(), 'prompts'));
    assert.equal(other.acquire(api(), 'prompts'), undefined);
    assert.equal(handlers.filter(name => name === 'session_start').length, 1);
    assert.ok(first.runtime.prompts.fragment('system-prompt-system-section.md').length);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
