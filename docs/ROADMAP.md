# Max Note — evidence-based work tree

Status verified from source and CI on 2026-11-12. This is not a live agent tracker.

| Node | Status | Definition of done / next proof |
| --- | --- | --- |
| Core task and project lists | SHIPPED | Create/edit/status, three focuses, export/import |
| Appearance and rule-based review | SHIPPED | Five themes, compact/relaxed, manual AI prompt preview |
| Daily workflow | SHIPPED / DEVICE QA OPEN | Day-scoped focus, completion timestamp, Vietnam time; real iOS Safari smoke test pending |
| Reusable agent team | THIS PR | Repo-local PM/BA/Dev/QA/Release skills, licensed Ponytail, CI check |
| Secure cross-device sync | BLOCKED — provider/auth not configured for Max Note | BA privacy/conflict specification; select/authenticate backend; migration, offline, two-device and rollback tests |
| Real AI review | NOT STARTED | Only after user data policy/consent, reliable task history and model cost decision |
| Voice / Siri Shortcut | DEFERRED | Verify daily workflow value first; explicit permission for speech services |
| Habblaud / Atlas Gate integration | DEFERRED | Read-only first, traceable and confirmed suggestions, no automatic mass task creation |

**Next smallest task:** BA writes and reviews a two-device sync contract for the single-user case without changing app code or silently migrating localStorage. Implement backend only after provider and auth are properly configured and approved.
