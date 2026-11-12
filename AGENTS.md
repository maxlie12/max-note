# Max Note — reusable AI delivery team

Max Note is a small static, local-first daily task app. Its source of truth is the repository code, tests, and docs/ROADMAP.md—not memories of earlier chats. Read README.md, docs/AGENT-PLAYBOOK.md, and the relevant changed code before acting.

## Roles and handoffs
- PM: .agents/skills/maxnote-pm/SKILL.md — choose one small milestone, scope it, check evidence and decide release.
- BA: .agents/skills/maxnote-ba/SKILL.md — state what should happen and measurable acceptance checks.
- Dev: .agents/skills/maxnote-dev/SKILL.md — implement the smallest complete safe diff.
- QA: .agents/skills/maxnote-qa/SKILL.md — independently challenge the change and verify behavior.
- Release: .agents/skills/maxnote-release/SKILL.md — match CI, commit, deployment and rollback.
- Simplicity/review rules: .agents/skills/ponytail/SKILL.md and .agents/skills/ponytail-review/SKILL.md (vendored MIT instructions).

These are reusable **role instructions**, not independently running paid employees or persistent background agents. Use actual subagents only when the current execution host supports them; otherwise run roles sequentially and label evidence honestly. Never invent sign-offs.

## Non-negotiable engineering policy
- Preserve existing localStorage key max-note-mvp-v1, task data, optional focusDate and completedAt, backup version 1 and the working production domain unless an explicitly reviewed migration proves safe.
- Never commit secrets, client task contents, tokens, credentials or personal data. No external telemetry or AI calls without explicit approval and a privacy review.
- Authenticated cross-device sync is **not implemented**. Do not report it ready until a configured provider, authorization tests, conflict tests and actual two-device verification pass.
- Before code: look for an existing helper or browser API. Follow Ponytail's smallest *complete* change, not shortest code at the expense of data safety, accessibility or tests.
- Work on a branch, write an acceptance checklist, run the checks in .github/workflows/ci.yml, inspect diff and preview. Production only after QA evidence passes; no bypass on failures.
- For destructive migrations, external access, billing, plugin installs or permissions, ask for explicit user authorization. Export a JSON backup before changing storage semantics.
- Never pretend to read ChatGPT/Codex quota or to resume unattended after reset. If user or a reliable host meter reports remaining usage at/below the user's 85% stop threshold, checkpoint work and stop initiating more work until the user resumes.
- Close each delivery with: changed paths, tests actually run, live/preview state, risks and next smallest action.

## Quick commands
node --check logic.js
node --check appearance.js
node --check test.js
node test.js
node scripts/check-agent-kit.mjs
