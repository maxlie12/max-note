# Max Note MVP (static, local-first)

Open `index.html` or deploy the directory as a static website. Requires no dependencies or server.

Features: capture tasks, edit title/priority/due/next step, manually change status, select up to three focus tasks, view three explainable suggestions, write a daily reflection, export/import JSON backup. The suggestions are **rules, not AI**; no bot/agent tasks run.

**Privacy and limitations:** task text is saved in browser `localStorage` only for the current origin and browser. This version has no login or device sync. Export the JSON backup before switching phone/browser/domain or clearing storage; backup includes private task text. `file://` and `https://...` origins have different storage. A failure to read browser storage blocks writes until the underlying data is addressed.

Tests: `node test.js` (core checks). Static JS syntax checked with `node --check`. Browser/device interaction on iOS still requires user testing.

Publishing: this directory is prepared for a dedicated GitHub repository, preferably **private** because it documents a personal workflow. GitHub Actions runs syntax checks and 10 core tests on each push or PR. Deploy the repository as a static Vercel project (framework: Other; root: repository root), or open `index.html` locally. The existing `max-note-daily.vercel.app` site was initially deployed separately, not yet linked to GitHub; linking or redeploying must be verified after the repository is created.

Roadmap (not implemented): secure authenticated cross-device sync and optional AI suggestions based on real task data. Speech recognition and Siri Shortcut are later considerations.

## Themes and end-of-day review

In **Giao diện** pick one of five visual themes (Mộc xanh, Biển xanh, Nắng ấm, Tím nhẹ, Đêm sâu) and either Thoáng or Gọn density. Preferences are kept in a **separate browser-only key** `max-note-appearance-v1` and never modify `max-note-mvp-v1` task data. Theme links like `/?theme=dem&density=compact` apply a known preset, then remove the query to avoid reverting future manual choices.

The **Review** tab now summarizes real current task counts (open, selected, overdue, blocked, done total) and shows an editable-via-reflection, **read-only prompt preview**. Only pressing **Sao chép bản review để hỏi AI** copies task information to the clipboard; no AI model is called and nothing is uploaded. Before pasting in any AI service, review the preview for private work/client details. The task storage schema is unchanged; no new dependency or server is used.

Validation: `node --check logic.js`, `node --check appearance.js`, `node --check test.js`, `node test.js` (21 assertions), browser harness for theme switching/persistence and task/review reload at 390px and 320px. Real iOS/Safari/touch still requires device QA.

## Daily Workflow P0 (2026-11-12)

- Morning: pick up to three tasks on **Hôm nay**. Focus selection expires the next calendar day in Vietnam (the tasks do not disappear). If migrating from an older backup without `focusDate`, current focus is preserved on first use and dated today.
- Evening: switch tasks to Done and open **Review**. “Xong hôm nay” counts only tasks explicitly marked Done since this update, using the optional `completedAt` timestamp in Vietnam's timezone. Older Done tasks without that timestamp are still included in the **total Done** count but not falsely attributed to today. Reopening a Done task removes its completedAt; marking Done again creates a new completion timestamp.
- Backups remain version 1 and old files are accepted, with optional `focusDate` and `completedAt`. Existing task text, projects, due dates and reflections are unchanged. Same storage key (`max-note-mvp-v1`), domain and local-first behavior.
- `node test.js` covers migration, day rollover, timezone boundary, Done/reopen transitions, summary accuracy and backup round trip.
- Still no server, login, automatic AI execution, voice, or cross-device sync. Test on actual iPhone/Safari before considering P0 entirely signed off.