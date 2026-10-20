# opcode (formerly Claudia)

| Field | Value |
|-------|-------|
| Repository | https://github.com/winfunc/opcode |
| Type | Desktop GUI for Claude Code (Tauri app) |
| Stars | 22K |
| Telemetry | Yes |
| Default State | ON (consent is pre-set to granted on first run; no consent dialog is wired into the app) |
| Analytics Providers | PostHog (`us.i.posthog.com`) |
| Disable Method | Turn analytics off in Settings |
| Risk Level | MEDIUM |
| Last Verified | 2026-10-20 |

## What It Does

A desktop application that wraps Claude Code: project and session browser, custom agents, usage dashboard, MCP server management, checkpoints and a CLAUDE.md editor. It launches and drives the `claude` CLI on your machine.

## Telemetry Details

- **Provider:** PostHog, hardcoded project key, host `https://us.i.posthog.com`; the Tauri CSP explicitly allows `*.posthog.com`
- **Initialized at startup:** `analytics.initialize()` runs in `src/main.tsx`
- **Consent defaults to granted:** When no stored setting exists, `ConsentManager.initialize()` sets `{ enabled: true, hasConsented: true }` (the same values are used on error). PostHog is configured with `opt_out_capturing_by_default: false`. An `AnalyticsConsent` dialog component exists in the codebase but is not rendered anywhere outside its own file
- **Data collected:** Anonymous user ID and session ID; events such as `prompt_submitted` (prompt length, word count, model, attachments flag, source), session stop metrics (duration, message count), model selection, agent and MCP server/tool usage (names sanitized), error messages (sanitized). Autocapture and session recording are disabled. We found no prompt text in the event schema

## Security Concerns

- **README says the opposite of the code.** The Security section states "No Telemetry: No data collection or tracking", while the shipped code initializes PostHog on start with consent pre-granted
- **Stale project:** The latest GitHub release is v0.2.0 (2025-08-31) and the last push was 2026-09-18. A GUI that launches Claude Code with your credentials benefits from timely updates
- **Agent permissions:** Custom agents can be configured with file and network permissions; review agent definitions imported from others

## How to Opt Out

1. Open Settings and turn analytics off (stored in the app's local storage)
2. Do this immediately after first launch; events are sent from startup until you change it
3. Network fallback: block `us.i.posthog.com` / `*.posthog.com` for the app

## Evidence

- Audited commit: [`d1ca30a3`](https://github.com/winfunc/opcode/tree/d1ca30a3c0c39fff01fde2f86c2d5af6a1db658b) (package.json 0.2.1)
- PostHog key, host, `opt_out_capturing_by_default: false`: [src/lib/analytics/index.ts#L28-L37](https://github.com/winfunc/opcode/blob/d1ca30a3c0c39fff01fde2f86c2d5af6a1db658b/src/lib/analytics/index.ts#L28-L37)
- Consent pre-granted defaults: [src/lib/analytics/consent.ts#L18-L55](https://github.com/winfunc/opcode/blob/d1ca30a3c0c39fff01fde2f86c2d5af6a1db658b/src/lib/analytics/consent.ts#L18-L55)
- Startup initialization: [src/main.tsx#L13](https://github.com/winfunc/opcode/blob/d1ca30a3c0c39fff01fde2f86c2d5af6a1db658b/src/main.tsx#L13)
- Event properties (`prompt_submitted`): [src/lib/analytics/types.ts#L156-L162](https://github.com/winfunc/opcode/blob/d1ca30a3c0c39fff01fde2f86c2d5af6a1db658b/src/lib/analytics/types.ts#L156-L162), [src/lib/analytics/events.ts](https://github.com/winfunc/opcode/blob/d1ca30a3c0c39fff01fde2f86c2d5af6a1db658b/src/lib/analytics/events.ts)
- CSP allowing PostHog: [src-tauri/tauri.conf.json#L27](https://github.com/winfunc/opcode/blob/d1ca30a3c0c39fff01fde2f86c2d5af6a1db658b/src-tauri/tauri.conf.json#L27)
- README "No Telemetry" claim: [README.md#L379-L384](https://github.com/winfunc/opcode/blob/d1ca30a3c0c39fff01fde2f86c2d5af6a1db658b/README.md#L379-L384)
- Unused consent dialog: [src/components/AnalyticsConsent.tsx](https://github.com/winfunc/opcode/blob/d1ca30a3c0c39fff01fde2f86c2d5af6a1db658b/src/components/AnalyticsConsent.tsx) (no imports elsewhere in `src/` at this commit)
- Analytics added 2025-07-30 ([`464d318f`](https://github.com/winfunc/opcode/commit/464d318f34)) and present at the `v0.2.0` release tag
- Star count: GitHub API, 22,417 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
