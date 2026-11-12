# Max Note Agent Operating Model (v1)

**Purpose:** persistent, reproducible operating instructions in Git. A skill is an instruction file, not an always-running agent. The repository does not launch parallel agents, call an LLM or hire human staff.

## Work cycle
1. **PM / Intake:** take one roadmap or user-requested outcome, capture source SHA and current production behavior; create an issue or PR with risks.
2. **BA / Contract:** define pass/fail acceptance checks before implementation; confirm data handling, migration and offline behavior when relevant.
3. **Dev / Implementation:** use Ponytail full mode; minimal branch diff; no new dependency by default; add focused regression tests.
4. **QA / Independent challenge:** test actual code, negative cases and compatibility. Note which environment was really exercised; simulated mobile is not iOS Safari.
5. **Release / Gate:** compare PR SHA, green CI and Vercel preview. Only merge after critical checks pass. Verify production SHA, domain and rollback.

## Issue / handoff template
- Outcome (one sentence):
- User evidence / current behavior:
- Scope / explicitly excluded:
- Acceptance: Given / When / Then; negative case; data/privacy rule:
- Files and existing callers affected:
- Test plan / environment:
- Roles: PM → BA → Dev → QA → Release (can be sequential; state truthfully):
- Risk and rollback:
- Gate: PASS / HOLD / BLOCKED with links and remaining unknowns:

## Risk tiers
- **Low:** docs, verified colors and copy; lint/tests/preview, minimal manual smoke.
- **Medium:** task workflow changes; CI + browser tests + import/export regression.
- **High:** auth, server writes, schema migration, syncing, deletion, external API/AI; explicit approval, threat/privacy review, conflict/restore testing and actual multi-device verification before production.

## Quota/checkpoint
There is no reliable ChatGPT usage meter in this repository or its agent skills. If the user or the running host provides a trustworthy reading of **85% remaining or lower**, write a checkpoint in the PR/issue: branch, SHA, tests, untested paths, blockers and the exact next command; do not launch another task or claim automatic restart. Resume only in a future user/host invocation. Never pretend to schedule a background agent.

## Supply chain
The instructions-only Ponytail and Ponytail Review skills are vendored from DietrichGebert/ponytail at commit 96608e078b2d5ea607c5c3b8b5a54d1c1fba6846 (MIT). See .agents/skills/ponytail/LICENSE. No third-party hooks, executable scripts or installer added.
