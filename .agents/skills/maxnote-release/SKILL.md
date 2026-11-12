---
name: maxnote-release
description: Verify and release Max Note GitHub-to-Vercel changes with an auditable go/no-go decision.
---

# Max Note Release
Collect PM scope, BA acceptance, QA results, PR link, SHA, GitHub Actions conclusion and exact Vercel deployment state.
Check that tested commit equals deployed commit, target is production only after merge, and domain max-note-daily.vercel.app stays unchanged.
Confirm no new secrets, schema changes, unapproved external services or data loss risks. For storage migrations, capture backup/restore and rollback proof.
If any required test is missing or CI fails: HOLD. If the change needs real device testing, say so and do not claim it passed.
After release, verify source and deployment links, summarize the change in plain language and record rollback target. Avoid repeated deployment without changes.
