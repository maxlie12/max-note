# Max Note — Single-user cross-device sync acceptance contract (BA-004)

Status: **PROPOSED / IMPLEMENTATION BLOCKED** · 2026-11-12
Source: [Issue #4](https://github.com/maxlie12/max-note/issues/4), `AGENTS.md`, `README.md`, `logic.js`, `docs/ROADMAP.md`.
This document is a testable contract, **not** a selected provider, working sync service, or approval to change production.

## 1. Objective and boundaries
Allow one authenticated person to create or edit tasks on a phone and later see the same resulting tasks on a desktop without silently losing existing local-first records.

**Current verified code facts**
- Data is browser-origin-local in `max-note-mvp-v1`; `parseBackup` accepts backup `version: 1`.
- Current projects: `main`, `freelance`, `atlas`, `personal`; statuses: `todo`, `doing`, `blocked`, `done`.
- Every task has an ID, timestamps, priority, due date, next step, status, focus; `completedAt` and store-level `focusDate` are optional for older backups.
- Daily focus and completion use Vietnam-local calendar dates; reflections are keyed by date.
- No authentication, remote persistence, server, conflict engine or cross-device sync exists today.

**Out of scope for the first technical vertical slice:** AI suggestions, public task APIs, multi-user collaboration, voice, Atlas/Habblaud integration, automated migrations of existing devices and silent bidirectional background overwrites.

## 2. Decisions that block implementation
| ID | Decision required from Product Owner / BA | Safety default before decision |
| --- | --- | --- |
| D1 | Authenticated provider and location/residency; monthly spending cap | No provider provisioned; no task data uploaded |
| D2 | Login and recovery method, including lost account access | No remote sign-in flow implemented |
| D3 | First-link policy: choose local-only, upload as new, or review a merge preview | Export backup first; default to no write |
| D4 | Merge/conflict UI: keep both versions or user-reviewed resolution; retention of deletions | Preserve both conflicted versions, do not silently choose a winner |
| D5 | Scope of data: tasks, reflections, focus state, appearance settings | Do not sync appearance; explicitly review private reflections and task text |
| D6 | Offline durability, deletion retention and server-side encryption/security model | No remote writes until tested |
These decisions are not filled in by an agent. Implementing them requires explicit approval.

## 3. Candidate data model (not a migration)
Treat the current v1 local backup as a compatibility boundary. A future server model may use per-record stable IDs, owner ID, revision or entity version, modification timestamp, tombstone for deletions, and idempotency keys. **A timestamp alone is insufficient to resolve concurrent edits.** No new fields are authorized here.

A safe first slice should preserve the ability to load every valid legacy v1 backup. It must never silently clear, replace or re-key `max-note-mvp-v1`. Before linking, provide an export and a visible summary of local and remote records; keep the original export recoverable. Reject corrupt/oversized/duplicate-ID payloads before any sync mutation.

## 4. Given / When / Then acceptance matrix
The QA evidence column must link to a repeatable test, run, screenshot or device record—not an agent assertion.

| ID | Given | When | Then | Required evidence |
| --- | --- | --- | --- | --- |
| AC01 auth ownership | User A and User B have distinct sessions | B requests A's task by ID | B receives no task data; authorization is enforced server-side | Negative integration test against configured backend |
| AC02 sign-out | A has cached data on device | A signs out, then B signs in | No A records appear in B's session or remote API results | Real browser session and API test |
| AC03 first link | Local v1 contains tasks and reflections | User begins linking to an account | App offers explicit export and shows merge/upload choices; no automatic overwrite | Browser test with isolated sample v1 fixture |
| AC04 refusal | Local state exists | User cancels linking/merge | Byte-equivalent local data remains and no remote write occurs | Before/after fixture plus server event trace |
| AC05 basic convergence | A creates a task on phone | B syncs on desktop, edits it; A refreshes/syncs | Both converge to a single authorized task with edits and clear sync status | Real two-device trace, task ID/revisions |
| AC06 simultaneous edits | A and B edit the same task from same revision | Both sync | Conflict is visible and neither edit is silently discarded | Two-client conflict integration test |
| AC07 offline edit | A loses network before editing | A edits; B edits online; A reconnects | Local write survives offline; conflict resolution is explicit | Offline simulation plus reload/reconnect evidence |
| AC08 delete vs edit | A deletes while B edits the task offline | B reconnects | Neither a silent resurrection nor silent loss occurs; deletion conflict can be reviewed | Tombstone/conflict test |
| AC09 Done vs reopen | A marks Done; B reopens while disconnected | Both sync | Status and `completedAt` are reconciled together; no false Done-today count | Regression test at Vietnam date boundary |
| AC10 reflection edits | Same date has two different reflections | Both devices sync | Conflict is preserved/reviewed; no personal note silently overwritten | Reflection collision test |
| AC11 retries | A network response fails after remote commit | Client retries same write | Idempotent outcome: no duplicated task, lost edit or double deletion | Fault-injection integration test |
| AC12 invalid data | Remote/local payload is malformed, duplicate-ID or unexpected version | Sync/import executes | Writes are rejected safely and valid local v1 backup remains usable | Malformed-payload and restore test |
| AC13 outage | Backend is unavailable | User creates task and opens Review | Local entry works, status explicitly says pending/not synced; no false cloud-saved claim | Offline UI + persistence test |
| AC14 rollback | New client release fails during sync | User exports or reverts | Last valid local backup restores in compatible v1 reader; no destructive downgrade | Restore using existing `parseBackup` tests |
| AC15 focus/date | A and B cross midnight in Vietnam timezone | Both sync daily focus/Done timestamps | No stale focus reselected; `doneToday` remains correct | Deterministic timezone test |
| AC16 quota/limits | Account has > expected payload or too many tasks | Client syncs | Validated limits produce actionable error; no partial corruption | Boundary and rejection tests |

## 5. QA and release gates
- **G0 BA:** All D1–D6 answered and approved, one smallest vertical slice selected, acceptance cases frozen. Until then, `BLOCKED`.
- **G1 DEV:** A PR links code paths and deterministic tests to each acceptance case it claims to satisfy; no secrets or personal data in fixtures/logs.
- **G2 QA:** CI green on exact PR SHA; security, import/export, conflict, offline and timezone negatives tested. A simulated browser is not an iOS device.
- **G3 DEVICE:** Demonstrate A phone → B desktop → A convergence, offline edit and conflict resolution on actual devices. Record sanitized outcomes without private task content.
- **G4 RELEASE:** Production deployment matches reviewed SHA, rollback/export demonstrated, privacy review approved and no high-severity blocker remains. Only then mark `RELEASED`.

## 6. Role handoff and audit trail
```
PM  Issue #4 and scope guard  -> BA  AC01–AC16 + D1–D6
BA  BLOCKED pending decisions -> DEV  no backend/code work yet
QA  review testability of ACs -> Release  HOLD until G0–G4
Auditor  independently compare issue, PR SHA, CI runs, deployed SHA,
         device test records and cost logs; missing proof means UNKNOWN
```

**Next smallest authorized action:** PM and BA review D1–D6 with the owner and select a privacy-safe first vertical slice. No code or cloud deployment is implied by this document.
