# Max Note — sync acceptance contract
Status: DRAFT / BLOCKED for implementation. 2026-11-16.
Source: issue #4; main 4c1e77cfd458461e537ce29afcae0165db093767.
This document records proposed behavior, not approval or QA sign-off.

## Problem and verified baseline
Phone and desktop have independent local data. Source inspected: README.md, index.html, logic.js, docs/ROADMAP.md, AGENTS.md and docs/AGENT-PLAYBOOK.md.
- No login, cloud API, datastore or sync implementation in this source.
- Task storage: max-note-mvp-v1; backup version 1. Theme uses a separate local key.
- Focus expires by Vietnam calendar day. Done/reopen sets/clears optional completedAt.
- Import currently replaces the local store after confirmation; it is not a merge.
- Current validation permits 1,000 tasks per backup; UI import caps files at 1,000,000 bytes. These are not approved server limits.
- Local write failure rolls back in-memory changes. Cloud failure must not roll back successfully persisted offline edits.
- Task updatedAt is not a safe conflict token: some focus actions/day rollover do not update it. Reflections are date-keyed strings without revisions. Deletion currently removes records without tombstones.
- No service worker is present: offline editing means an already loaded app; cold offline startup is not promised.
Production linkage is stated in issue #4; no live deployment verification was performed for this spec.

## Acceptance cases (all proposed)
Use synthetic tasks only. A = phone, B = desktop, U and V = different accounts.
Manual Sync/Reload is sufficient for initial convergence; background or real-time sync is not required.
| ID | Given | When | Then / pass criterion |
| --- | --- | --- | --- |
| S01 Identity | No session, expired session, or V knows U's task ID | Read, list, create, update or delete through API | Server denies access; no U content or mutations. Owner comes from verified identity, not trusted client input. Privileged credentials never reach browser. |
| S02 Link consent | Local and/or remote data exists | Start linking | Offer backup export and counts/preview of proposed upload/merge; cancel causes zero mutations. No automatic replacement or upload. Repeat separately on B. |
| S03 Convergence | A/B are U, online | A creates task; B Sync reads it; B edits title/priority/due/next; A Sync reads it | Exactly one stable ID on both; all acknowledged fields match. Explicit Sync completes within 10 seconds in controlled healthy-network QA or shows a pending/error state. |
| S04 Honest status | A local edit is persisted | Send, timeout or reject sync | Show local-only/pending/error; synced only after server acknowledgment. Timeout after successful server write remains safe to retry. Storage quota failure does not claim local success. |
| S05 Offline | App already loaded; network disabled | Create/edit task, reload while assets remain available, reconnect and Sync | Persisted edits survive; queue survives available reload; retry creates no duplicate. Newer remote revision enters S06 rather than being overwritten. Cold offline loading is excluded. |
| S06 Edit conflict | A/B edit the same base revision | Both Sync, including after offline use | Stale write is rejected; both versions remain inspectable/exportable. Explicit choose/merge, no silent last-write-wins. Resolution against another intervening revision raises a new conflict. |
| S07 Delete conflict | A deletes while B edits the old revision, or retries old data | Sync in either order | Show delete-versus-edit choice; no silent loss and no automatic resurrection. Repeated delete is safe. Bulk clear-Done follows the same rule per affected task. |
| S08 Done/reopen | A marks Done while B reopens/edits same base | Sync | Conflict is explicit; resolution yields consistent status/completedAt on both. Done clears focus; reopened clears completedAt. Old Done without timestamp is not counted as done today. |
| S09 Reflection | A/B edit the same Vietnam date | Sync | Preserve both texts until explicit resolution; different dates coexist. Unsaved textarea draft is not overwritten by incoming data. |
| S10 Daily focus | Devices select different focuses or straddle Vietnam midnight | Sync/day rollover | Same-day final set contains at most 3 active tasks; conflicting selections require choice, not arbitrary discard. Previous-day data cannot restore yesterday's focus. Tasks remain. |
| S11 Logout/recovery | Cached U data or pending U writes exist | Logout, sign in as V, revoke session or lose account access | Stop U requests; never display/upload U data as V. Warn and offer export before destructive cache removal. Pending edits remain recoverable under approved cache policy. Never bypass auth for recovery. |
| S12 Migration/validation | Valid legacy v1 with missing optional fields, malformed/duplicate/oversize payloads | Import/upload or retry | Versioned migration preserves IDs/text/project/due/reflections and optional-field meaning. Invalid payload causes zero committed changes. Partial batch behavior is explicit and retries are idempotent. Existing v1 backups remain readable; new export is accepted by legacy parser if advertised as v1. |
| S13 Rollback/privacy | Sync fails midway or is disabled | Export/restore/use local mode | Pre-link backup and persisted pending edits remain recoverable; no automatic remote deletion or destructive remigration. Export includes a warning for private text. No task text in telemetry/logs; rejected payloads cannot inject unknown private fields into stored records. |
| S14 Release proof | Candidate SHA and test environment fixed | Execute matrix below | No lost edits/duplicate IDs; recorded before/after evidence, independent QA and actual phone + desktop verification including real iPhone Safari. Simulation alone does not pass. |

## Decisions requiring approval
None selected by this document. BA draft can be reviewed now; issue #4 remains open.
| Blocker | Concrete proposed default for review | Needed before |
| --- | --- | --- |
| D1 Provider/project | Inspect connected authenticated datastore options for cost ceiling, region, ownership, auth, recovery and authorization support; Supabase is only a candidate | Provisioning, secrets or backend work |
| D2 Data scope | Whole personal workspace: tasks, Vietnam-day focus, saved reflections; theme stays device-local; no client/work secrets in pilot fixtures | Data model and consent |
| D3 Conflicts/deletion | Compare revisions; manual conflict choice; preserve delete markers until a defined retention/obsolete-device policy prevents resurrection | Any writes |
| D4 Linking/import | Explicit preview/backup per device. Same ID + different content is conflict; different IDs are not auto-deduplicated by title. Existing remote data blocks first-slice linking | Migration |
| D5 Cache/recovery | Account-scoped cache; retain unsent edits with explicit export/discard choice; choose shared-device cleanup and lost-account recovery policy | Auth UX |
| D6 Limits/retention | Approve server quotas, payload limits, deletion retention and sync timeout. No arbitrary tombstone expiry before stale-device behavior is defined | QA sign-off |

## Smallest vertical slice after D1–D6 approval
A preview-only pilot with synthetic data, one account/two devices and a second account for authorization-negative QA:
1. Explicit opt-in and backup; link only empty local/remote pilot workspaces. Detect and refuse nonempty workspace migration.
2. Authenticated create/read/edit of task title, priority, due and next step; manual Sync, stable IDs, revision checks and idempotent retry.
3. Already-loaded offline create/edit with durable pending state; manual two-version conflict resolution.
4. Account isolation, logout/pending-export handling and disable-sync recovery.
Focus, Done/reopen, reflections, delete/bulk-delete, legacy migration and JSON import must be explicitly unavailable in pilot sync mode until their cases pass. Existing local-only mode retains its behavior. If safe isolation cannot be achieved, HOLD the pilot rather than expose partially synced normal workflows.
This slice is a proof in preview, not the full daily-use release. Full release requires all S01–S14 and legacy data migration QA.
Excluded: realtime subscriptions, teams/sharing, AI, voice, Habblaud, cold-start offline support and production rollout.

## QA handoff and evidence
All sync cases: NOT RUN — no backend exists. No independent QA sign-off claimed.
| Exercise | Cases | Required evidence |
| --- | --- | --- |
| Unauthorized/expired session, forged owner and second account | S01, S11 | Request results + unchanged owner data; redact tokens |
| Fresh/occupied A and B; cancel, confirm, repeat linking | S02, S12 | Counts/IDs and recoverable v1 exports before/after |
| Online create/edit, disconnect, timeout-after-commit, repeated retry, quota failure | S03–S05 | Device status, stable IDs, final field comparison |
| Same-field edits in both orders; third edit during conflict resolution | S06 | Both candidates retained, explicit selected result |
| Delete/edit, clear-Done/edit, Done/reopen | S07–S08 | No resurrection/lost edits; consistent completion timestamp |
| Same/different date reflection; unsaved draft; >3 combined focus; 23:59/00:01 Vietnam | S09–S10 | Both texts/date/focus values and resolved final state |
| Invalid payload, partial sync, disable sync, restore old v1 | S12–S13 | Rejection leaves valid data intact; recovery retains pending edits |
| Actual iPhone Safari + desktop; second account; source SHA | S14 | Device/OS/browser, timestamp, sanitized screenshots and PASS/FAIL per ID |

Existing CI validates syntax, local logic/agent kit and Chromium smoke at 390/320px; it does not prove sync, authorization or iOS behavior.
Gate: contract DRAFT; implementation BLOCKED on D1–D6; release BLOCKED on actual QA.
Next action: review the proposed defaults, select/approve the provider/project, then hand the constrained pilot to implementation in a separate PR.
