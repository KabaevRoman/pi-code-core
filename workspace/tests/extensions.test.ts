import { test } from 'node:test';
import assert from 'node:assert/strict';
import { harness } from '../tasks/tests/helper.ts';

const names = ['context', 'file-tools', 'hooks', 'integrations', 'memory', 'permissions', 'planning', 'prompts-skills', 'session-ui', 'subagents', 'tasks'];
for (const name of names.filter(name => name !== 'integrations')) {
  test(`${name} installs independently`, async () => {
    const { default: install } = await import(`../${name}/index.ts`);
    const h = await harness(install);
    try { assert.ok(h.runtime); } finally { await h.close(); }
  });
}

for (const order of [['prompts-skills', 'memory'], ['memory', 'prompts-skills']]) {
  test(`one prompt injection with load order ${order.join(', ')}`, async () => {
    const installs = await Promise.all(order.map(async name => (await import(`../${name}/index.ts`)).default));
    const h = await harness(pi => { for (const install of installs) { install(pi); install(pi); } });
    try {
      const results = await h.emit('before_agent_start', {
        systemPromptOptions: { contextFiles: [], skills: [], appendSystemPrompt: '', sections: {}, promptGuidelines: [], toolGuidelines: {} },
      });
      assert.equal(results.filter(result => result?.systemPrompt).length, 1);
      assert.equal(results.filter(result => result?.message).length, 0);
      assert.equal(h.handlers.get('session_start')?.length, 1);
    } finally { await h.close(); }
  });
}

test('all extensions coexist without repeated registration', async () => {
  const installs = await Promise.all(names.map(async name => (await import(`../${name}/index.ts`)).default));
  const h = await harness(pi => { for (const install of installs) install(pi); });
  try {
    assert.equal(h.runtime.modularFeatures.size, 11);
    assert.ok(h.tools.has('Read'));
    assert.ok(h.tools.has('TaskCreate'));
    assert.ok(h.tools.has('EnterPlanMode'));
  } finally { await h.close(); }
});
