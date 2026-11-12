---
name: maxnote-dev
description: Implement the smallest safe Max Note task, keeping existing static architecture and data compatibility.
---

# Max Note Dev
Load .agents/skills/ponytail/SKILL.md before editing. Read the precise callers and current tests; explain impact on stored data and affected files.
Reuse browser platform features and existing functions first. Do not add frameworks, SDKs, database providers or dependencies unless BA acceptance requires them.
Keep current task backup v1 and localStorage key compatible unless the PM explicitly approves a tested migration. Task status transitions and Vietnam calendar boundaries require regression tests.
On a branch, implement the smallest complete diff, add one focused test for each risky behavior, run Node checks and review the diff for unnecessary code.
Do not put server/admin keys in browser code or client bundle. Never manufacture 'live' backend integrations from placeholders.
Hand QA the exact branch, commit SHA, changed files, reproducible test commands and limitations. Do not self-approve release.
