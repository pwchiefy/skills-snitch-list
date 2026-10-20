# claude-mem

| Field | Value |
|-------|-------|
| Repository | https://github.com/thedotmack/claude-mem |
| Type | Plugin |
| Stars | 102K |
| Telemetry | Yes |
| Default State | ON (opt-out; interactive installer asks once, installs with no recorded decision default ON) |
| Analytics Providers | PostHog (ingest-side GeoIP, error tracking) |
| Disable Method | `npx claude-mem telemetry disable`, `DO_NOT_TRACK=1`, `CLAUDE_MEM_TELEMETRY=0`, or `enabled: false` in `telemetry.json` |
| Risk Level | CRITICAL |
| Last Verified | 2026-10-20 |

## What It Does

claude-mem is a persistent-memory plugin for Claude Code and other agent hosts (Codex, Cursor, Gemini, OpenCode and more). Hooks capture prompts and tool activity, a background worker "observer" compresses them with an LLM into observations and session summaries, and a local SQLite database (plus optional Chroma vector search) injects relevant memory into new sessions. Version 14 adds a "My Work" view of agent requests, optional paid team sharing (TeamBrain), optional cloud sync and a hosted observer (CMEM Pro). Version audited: 14.0.1.

## Telemetry Details

- **New since March:** PostHog telemetry was added on 2026-06-10 (#2863), first as opt-in, then switched the same day to default ON for installs with no recorded decision (commit `13670b25`). Our March entry ("no traditional telemetry") was accurate at the time and is now out of date
- **Endpoint and key:** `https://us.i.posthog.com` with an embedded publishable project token (`src/services/telemetry/common.ts`)
- **Consent precedence:** `DO_NOT_TRACK` > `CLAUDE_MEM_TELEMETRY` env > `telemetry.json` > default ON. The interactive installer asks once; CI and non-interactive installs skip the prompt and therefore fall to the default
- **Identity:** Random install UUID. Low-volume lifecycle events build a PostHog person profile keyed to it; high-volume events use `$process_person_profile: false`
- **Location:** PostHog derives country/region/city from the sender IP at ingestion (GeoIP enabled 2026-06-10, `245c9b4e`); the docs state raw IPs are not stored
- **What is sent:** A documented property whitelist: versions, OS/arch, IDE and provider choice, model IDs (including the model the observed session runs, `observed_model`), billing tier (`observed_billing`: max/pro/team/api_key/etc.), token counts and cost per compression, database row counts and size, search strategy/result counts, skill IDs for bundled skills, subscription usage-limit hits, worker lifecycle and hook failures, installer and trial funnel events
- **Error tracking:** `$exception` events with redacted error messages and stack traces (home dir to `~`, absolute paths to basename, keys/tokens stripped); separately switchable with `CLAUDE_MEM_TELEMETRY_ERRORS=0`
- **Historical backfill:** On the first worker start after upgrading, claude-mem sends a one-time backfill of pre-telemetry history: one `historical_activity` event per past active day (counts only) and an `install_inferred` event with the first active date. It honors the same consent gates; opting out before that first start prevents it
- **Work-state rollups (added 2026-10-17, #4826):** 5-minute count-only rollups of captured prompts, tool calls, todo-tool usage and MCP reads/writes
- **Documented as never sent:** prompts or conversation content, file paths, source code, project/repo names, search queries, environment values, emails or usernames, third-party skill names
- **Local logging:** The local log is always written at full fidelity regardless of telemetry state and is not scrubbed

## Security Concerns

- **Captures everything by design:** Prompts, tool inputs and results are captured and stored locally in `claude-mem.db` under the claude-mem data directory. Credentials or secrets that pass through a session can end up in persistent memory. `<private>` tags exclude marked content
- **Hosted observer pre-selected:** The interactive installer pre-selects CMEM Pro, which routes the observer's compression requests (built from your captured session activity) through `https://cmem.ai/api/inference/v1`. This is functional data flow to a third party, not telemetry, but users who accept the default send session content off-machine. Non-interactive installs default to the Anthropic plan
- **Cloud sync (opt-in):** Uploads observation narratives, session summaries and full prompt text (up to 200 KB per prompt) to a per-user sync hub under a cmem.ai account; the docs warn not to enable it for content that must stay local
- **Default-ON telemetry with GeoIP and backfill:** Analytics are scrubbed and whitelisted, but default-ON plus retroactive backfill of pre-consent history is the kind of surprise this list exists to flag
- **Signup contact:** Local installs contact cmem.ai once at signup with a numbers-only usage summary to create a sign-in link
- **Supply chain risk:** About 102K stars, very frequent releases, and hooks in every session make this a high-value target

## How to Opt Out

Telemetry:
1. Run `npx claude-mem telemetry disable`, or set `DO_NOT_TRACK=1` or `CLAUDE_MEM_TELEMETRY=0` before the first worker start after installing or upgrading (this also prevents the historical backfill)
2. To keep analytics but drop error text, set `CLAUDE_MEM_TELEMETRY_ERRORS=0`

Data capture:
1. Choose a local or own-key provider (`--provider claude`, `--provider host`, OpenRouter, Gemini) instead of the pre-selected CMEM Pro if session content must stay on your machine
2. Do not enable cloud sync
3. Use `<private>` tags for sensitive content
4. To stop capture entirely, uninstall (`npx claude-mem uninstall`) and delete the data directory, reviewing it first for credentials that need rotation

## Evidence

- Audited commit: [`9e4f313a`](https://github.com/thedotmack/claude-mem/tree/9e4f313a89236f7fb593a639a77ee02e21e94469) (2026-10-19, package.json 14.0.1)
- Telemetry docs: [docs/public/telemetry.mdx](https://github.com/thedotmack/claude-mem/blob/9e4f313a89236f7fb593a639a77ee02e21e94469/docs/public/telemetry.mdx) (default ON L10-L16, whitelist L29-L132, GeoIP L132, work-state L165, error tracking L216, historical backfill L246-L262, never collected L264-L282)
- Consent precedence and default ON: [src/services/telemetry/consent.ts#L36-L63](https://github.com/thedotmack/claude-mem/blob/9e4f313a89236f7fb593a639a77ee02e21e94469/src/services/telemetry/consent.ts#L36-L63)
- PostHog key and host: [src/services/telemetry/common.ts#L15-L21](https://github.com/thedotmack/claude-mem/blob/9e4f313a89236f7fb593a639a77ee02e21e94469/src/services/telemetry/common.ts#L15-L21)
- Telemetry introduced: commits [`b0171ed6`](https://github.com/thedotmack/claude-mem/commit/b0171ed63d04) (opt-in, #2863), [`13670b25`](https://github.com/thedotmack/claude-mem/commit/13670b25f51c) (default to opt-out), [`245c9b4e`](https://github.com/thedotmack/claude-mem/commit/245c9b4e8828) (ingest-side GeoIP), [`ccd907dc`](https://github.com/thedotmack/claude-mem/commit/ccd907dc5876) (historical backfill, #2912), [`4d102060`](https://github.com/thedotmack/claude-mem/commit/4d10206001df) (work-state rollups, #4826)
- CMEM Pro pre-selected: [docs/public/installation.mdx#L34-L48](https://github.com/thedotmack/claude-mem/blob/9e4f313a89236f7fb593a639a77ee02e21e94469/docs/public/installation.mdx#L34-L48)
- Cloud sync privacy warning: [docs/public/cloud-sync.mdx#L22-L40](https://github.com/thedotmack/claude-mem/blob/9e4f313a89236f7fb593a639a77ee02e21e94469/docs/public/cloud-sync.mdx#L22-L40)
- v14.0.0 release notes: https://github.com/thedotmack/claude-mem/releases/tag/v14.0.0
- Star count: GitHub API, 101,909 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at 9e4f313a (v14.0.1). Telemetry changed from "No" to "Yes": PostHog added June 2026, default ON (opt-out) with ingest GeoIP, redacted error tracking, a one-time historical backfill and (Oct 2026) work-state rollups. Added hosted CMEM Pro observer (pre-selected in interactive installer) and opt-in cloud sync as off-machine data flows. Stars 40K -> 102K. Risk remains CRITICAL.
