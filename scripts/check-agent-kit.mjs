import {readFileSync, existsSync} from 'node:fs';
import assert from 'node:assert/strict';

const roles = ['maxnote-pm','maxnote-ba','maxnote-dev','maxnote-qa','maxnote-release','ponytail','ponytail-review'];
const required = ['AGENTS.md','docs/AGENT-PLAYBOOK.md','docs/ROADMAP.md','.agents/skills/ponytail/LICENSE'];
for (const path of required) assert.ok(existsSync(path), 'Missing: ' + path);
const names = new Set();
for (const name of roles) {
  const path = '.agents/skills/' + name + '/SKILL.md';
  assert.ok(existsSync(path), 'Missing skill: ' + path);
  const source = readFileSync(path,'utf8');
  assert.match(source, /^---\r?\nname: [a-z0-9-]+\r?\ndescription: /, 'Invalid frontmatter: ' + path);
  assert.ok(source.includes('name: ' + name + '\n'), 'Wrong skill name: ' + path);
  assert.ok(source.length > 120, 'Empty skill: ' + path);
  assert.ok(!names.has(name), 'Duplicate skill: ' + name);
  names.add(name);
}
const license=readFileSync('.agents/skills/ponytail/LICENSE','utf8');
assert.match(license,/MIT License/);
assert.match(license,/Copyright \(c\) 2026 DietrichGebert/);
const docs=readFileSync('AGENTS.md','utf8');
for(const name of roles) assert.ok(docs.includes('.agents/skills/' + name + '/SKILL.md'), 'Undiscoverable skill: ' + name);
assert.match(docs,/not implemented/i);
assert.match(readFileSync('docs/ROADMAP.md','utf8'),/BLOCKED/);
console.log('Agent kit validation passed (' + names.size + ' skill manifests, policy, roadmap and MIT notice)');
