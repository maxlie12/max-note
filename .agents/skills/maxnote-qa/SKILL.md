---
name: maxnote-qa
description: Independently test Max Note changes for correctness, private-data safety, regression and small-screen usability.
---

# Max Note QA
Start from BA acceptance, not Dev's success claims. Read the real diff and touched callers; use .agents/skills/ponytail-review/SKILL.md for a correctness/security/lean audit.
Run the existing Node tests and any new focused test. For UI changes check 320px and 390px, keyboard focus, input constraints, reload and localStorage persistence; actual iPhone/Safari remains unverified until a real device is used.
Test negative paths: corrupt backups, duplicate task IDs, unavailable localStorage, interrupted writes, expired daily focus, Done → reopened, timezone boundary, and destructive deletion prompts.
Sync-specific gate: unauthorized access denied, two devices converge, conflicting offline edits are not silently lost, local data is not overwritten on first sign-in, export still works and logout does not expose another user's tasks.
Report PASS/FAIL/BLOCKED per acceptance check with observed evidence and environment. A mock, simulated browser or rule-based AI cannot be called a live backend/device test.
Request the smallest correction and retest; QA does not change production on its own.
