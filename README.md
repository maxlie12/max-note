# Max Note MVP (static, local-first)

Open `index.html` or deploy the directory as a static website. Requires no dependencies or server.

Features: capture tasks, edit title/priority/due/next step, manually change status, select up to three focus tasks, view three explainable suggestions, write a daily reflection, export/import JSON backup. The suggestions are **rules, not AI**; no bot/agent tasks run.

**Privacy and limitations:** task text is saved in browser `localStorage` only for the current origin and browser. This version has no login or device sync. Export the JSON backup before switching phone/browser/domain or clearing storage; backup includes private task text. `file://` and `https://...` origins have different storage. A failure to read browser storage blocks writes until the underlying data is addressed.

Tests: `node test.js` (core checks). Static JS syntax checked with `node --check`. Browser/device interaction on iOS still requires user testing.

Publishing: this directory is prepared for a dedicated GitHub repository, preferably **private** because it documents a personal workflow. GitHub Actions runs syntax checks and 10 core tests on each push or PR. Deploy the repository as a static Vercel project (framework: Other; root: repository root), or open `index.html` locally. The existing `max-note-daily.vercel.app` site was initially deployed separately, not yet linked to GitHub; linking or redeploying must be verified after the repository is created.

Roadmap (not implemented): secure authenticated cross-device sync and optional AI suggestions based on real task data. Speech recognition and Siri Shortcut are later considerations.
## Live deployment

- App: https://max-note-daily.vercel.app
- Source: https://github.com/maxlie12/max-note (branch `main`)
- Vercel project: `max-note-daily`; Git integration linked to this repository.
- The app remains **local-first**: tasks live in browser storage for the exact domain and device. This is **not** cross-device sync, and rule-based suggestions are **not** model-based AI review. Export JSON before changing browser or domain.
- This documentation-only commit is intended to verify the GitHub → Vercel automatic deployment trigger without changing the running app.
