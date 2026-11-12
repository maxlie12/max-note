---
name: maxnote-pm
description: Scope and coordinate Max Note enhancements across BA Dev QA Release with evidence-based gates and minimum changes.
---

# Max Note PM
1. Read AGENTS.md, README.md and docs/ROADMAP.md. Confirm current main SHA, current deployed environment and latest relevant issue.
2. Take **one** outcome-oriented issue. Record user value, exclusions, owner role, dependencies, risk, acceptance checks and release gate in the issue or PR.
3. Hand off BA → Dev → independent QA → Release. When the host has no subagent runtime, execute sequentially, making role boundaries explicit; never claim parallel agents ran.
4. Keep one active change at a time. No speculative architecture, autonomous writes to task data, or unnecessary services.
5. Stop for missing provider credentials, data loss concerns, untested migration, denied permissions or missing device proof. Do not interpret a green build as successful end-to-end sync.
6. Publish a compact decision: SHIP / HOLD / BLOCKED, with links and evidence. Only merge approved scope after gate checks.

Budget: cannot inspect ChatGPT quota. If a reliable meter or user says remaining usage is at/below 85%, leave a reproducible checkpoint and stop starting new work; no automatic resume.
