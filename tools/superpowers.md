# Superpowers

| Field | Value |
|-------|-------|
| Repository | https://github.com/obra/superpowers |
| Type | Plugin |
| Stars | 302K |
| Telemetry | Yes (minimal: version-tagged logo request in the optional visual companion) |
| Default State | ON when the visual companion page is opened |
| Analytics Providers | First-party (logo image served from `primeradiant.com`) |
| Disable Method | Set `SUPERPOWERS_DISABLE_TELEMETRY`, `DISABLE_TELEMETRY` or `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` to a true value |
| Risk Level | LOW |
| Last Verified | 2026-10-20 |

## What It Does

Superpowers is a skills library and plugin by Jesse Vincent and Prime Radiant that teaches coding agents structured workflows: brainstorming, writing and executing plans, test-driven development, systematic debugging, subagent-driven development and code review. It supports Claude Code, Codex, Cursor, Gemini CLI, OpenCode, Antigravity, Pi and other hosts. A `SessionStart` hook injects the bootstrap skill. The brainstorming skill can start an optional local "visual companion" web server. Version audited: 7.0.0.

## Telemetry Details

- **New since March (v6.0.0, June 2026):** When the optional brainstorming visual companion page is opened in a browser, it loads the Prime Radiant logo from `https://primeradiant.com/brand/superpowers-visual-brainstorming-logo.png?v=<version>`. The request carries the Superpowers version, uses `referrerpolicy="no-referrer"`, and is documented in the README as telemetry to estimate usage and version adoption
- **Documented as not included:** project details, prompts, coding agent, clicks
- **Scope:** Only the visual companion triggers it; ordinary skill use makes no network request. The image request does reveal the viewer's IP address to the Prime Radiant web server, as any web request does
- **Opt-out:** Any of `SUPERPOWERS_DISABLE_TELEMETRY`, `DISABLE_TELEMETRY` or `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` set to a true value removes the remote image
- **No analytics SDKs:** No PostHog, Sentry, Google Analytics or similar libraries; no persistent identifiers

## Security Concerns

Low:

- **SessionStart hook:** A bash hook runs at session start, clear and compact to inject the bootstrap skill. It is short and readable but executes on every session
- **Local web server:** The visual companion binds to `127.0.0.1` by default with a per-session key in the URL and WebSocket origin checks. Setting `BRAINSTORM_HOST` to a non-loopback address would expose it
- **Executable helpers:** The repo includes small scripts (brainstorm server, graph renderer, debugging helpers), so it is not pure markdown
- **Scanner false positives:** Recent scanner hits on `eval(` and `execSync` in v6.4.1 to v7.0.0 match plan documents and commit-message text, not runtime code
- **Popularity:** About 302K stars makes it a high-value supply chain target, though it also gets heavy community scrutiny

## How to Opt Out

1. Export `SUPERPOWERS_DISABLE_TELEMETRY=1` (or set `DISABLE_TELEMETRY=1` / `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`, which also turn off Claude Code's own nonessential traffic)
2. Or simply decline the optional visual companion when the brainstorming skill offers it

## Evidence

- Audited commit: [`bb92a777`](https://github.com/obra/superpowers/tree/bb92a77741419a4ab5f06e711a283343f1ada0c3) (2026-10-09, v7.0.0)
- Disclosure: [README.md#L398-L400](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/README.md#L398-L400)
- Logo URL, opt-out env vars: [skills/brainstorming/scripts/server.cjs#L100-L112](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/scripts/server.cjs#L100-L112)
- Version-tagged image markup: [server.cjs#L242-L252](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/scripts/server.cjs#L242-L252)
- Introduced: commit [`b3ee712d`](https://github.com/obra/superpowers/commit/b3ee712d3a68) ("Add visual companion Prime Radiant branding", 2026-06-15); v6.0.0 released 2026-06-16
- SessionStart hook: [hooks/hooks.json](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/hooks/hooks.json)
- Star count: GitHub API, 302,442 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at bb92a777 (v7.0.0). Telemetry changed from "No" to "Yes (minimal)": since v6.0.0 (June 2026) the optional visual companion loads a version-tagged logo from primeradiant.com to count usage, disclosed in the README with an env-var opt-out. Risk SAFE -> LOW. Noted the SessionStart hook and local helper scripts (not pure markdown). Stars 107K -> 302K.
