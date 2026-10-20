# gstack

| Field | Value |
|-------|-------|
| Repository | https://github.com/garrytan/gstack |
| Type | Plugin |
| Stars | 137K |
| Telemetry | Yes |
| Default State | OFF (opt-in prompt on first run; nothing is logged or sent while off) |
| Analytics Providers | Supabase |
| Disable Method | `gstack-config set telemetry off` (tiers: `off` / `anonymous` / `community`) |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

gstack is a large skills/plugin bundle by Garry Tan (Y Combinator president and CEO) for Claude Code and other agent hosts. It ships dozens of workflow skills (planning reviews, `/review`, `/ship`, `/qa`, design reviews, browser automation, deployment helpers) plus compiled helper binaries, hooks, a bundled browser ("GStack Browser") and an integration that drives the Aside AI browser. Version audited: 1.91.164.0.

## Telemetry Details

- **Supabase endpoint:** `https://frugpmstpnojnhfyimgv.supabase.co` (unchanged since March), defined in `supabase/config.sh`. Ingest goes through a Supabase edge function (`telemetry-ingest`) that accepts only an allowlist of event types and truncates fields
- **Opt-in:** On first run gstack asks once. Tiers are `off` (default), `anonymous` (no ID) and `community` (adds a stable device ID)
- **What is sent per skill run (when opted in):** skill name, event type, outcome, duration, gstack version, OS, CPU architecture, whether the browser was used, live/test flag, session ID, count of live sessions, error class, failed step, and an error message passed through secret redaction and cut to 200 characters. Prompt-injection detections add the attacking page's domain, a payload hash, confidence score, detection layer and verdict
- **What is documented as never sent:** code, file paths, repo names, branch names, prompts
- **Device ID (community tier):** Now a random UUID stored in the gstack state directory. In March 2026 it was a SHA-256 of `hostname` + `$USER` (a derived machine fingerprint); this was replaced with a random UUID in v0.13.1.0 (2026-03-28)
- **Local JSONL logging:** Fixed. In March the skill preamble wrote local analytics regardless of the telemetry setting. Since v0.13.7.0 (2026-03-29, "Telemetry off means off everywhere") nothing is written to `~/.gstack/analytics/skill-usage.jsonl` while telemetry is `off`. When opted in, the local file also records repo name and branch; `gstack-telemetry-sync` deletes those fields (and, for `anonymous`, the device ID) before upload
- **Update check (separate, on by default):** `gstack-update-check` runs `git ls-remote` against GitHub and fetches `VERSION` from `raw.githubusercontent.com`. With telemetry on, it also posts gstack version and OS to Supabase. Disable with `gstack-config set update_check false`
- **Egress receipts (new):** Every gstack-initiated network send writes a hash-chained receipt to `~/.gstack/security/egress.jsonl` before sending (`gstack-egress list` / `verify` / `grants`)

## Security Concerns

- **Outside reviews send code to a second provider by default:** Plan reviews, `/autoplan`, `/review`, `/ship`, design reviews and several other skills can send the review prompt and the relevant code, diff or plan to a second model provider (Codex under Claude Code, Claude Code under Codex) using your own login. This is on by default; the first send prints a notice. Disable with `gstack-config set codex_reviews disabled`
- **Browser session access:** `/setup-browser-cookies` copies selected cookies from Chrome, Chromium, Brave, Edge, Opera, Comet, Arc and Dia into gstack's bundled browser. The newer Aside integration drives your real, logged-in browser directly. Either way, the agent operates with your authenticated web sessions
- **Optional third-party bridges:** The Memorable recall bridge (added v1.83.0.0, 2026-09-09) hands prompts to a locally installed vendor binary after `gstack-memorable enable`; it is off by default and receipted, but what the vendor does next is outside gstack's control
- **Hooks, binaries and auto-upgrade surface:** gstack installs hooks and compiled helper binaries and checks GitHub for upgrades. A compromised upstream release would reach a very large install base
- **YC referral link:** `/office-hours` still includes `https://ycombinator.com/apply?ref=gstack` in its output. This is attribution tracking outside the telemetry system, visible in the skill text
- **Supply chain risk:** At 137K stars this is one of the most-installed agent extensions, which makes it a high-value target

## How to Opt Out

1. Answer "no" at the first-run telemetry prompt, or run `gstack-config set telemetry off`
2. Disable the update check: `gstack-config set update_check false`
3. Disable outside reviews: `gstack-config set codex_reviews disabled`
4. Audit sends with `gstack-egress list` and standing consents with `gstack-egress grants`
5. Do not run `/setup-browser-cookies` or the Aside integration unless you accept agent access to your logged-in sessions

## Evidence

- Audited commit: [`c580561e`](https://github.com/garrytan/gstack/tree/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5) (2026-10-20, VERSION 1.91.164.0)
- Privacy & Telemetry section: [README.md#L670-L752](https://github.com/garrytan/gstack/blob/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5/README.md#L670-L752)
- Supabase URL: [supabase/config.sh#L7](https://github.com/garrytan/gstack/blob/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5/supabase/config.sh#L7)
- Off-tier early exit (no local write): [bin/gstack-telemetry-log#L86-L100](https://github.com/garrytan/gstack/blob/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5/bin/gstack-telemetry-log#L86-L100)
- Random installation ID: [bin/gstack-telemetry-log#L148-L165](https://github.com/garrytan/gstack/blob/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5/bin/gstack-telemetry-log#L148-L165)
- March 2026 hostname+user hash ID (for comparison): [bin/gstack-telemetry-log@cc9e6f8#L109-L118](https://github.com/garrytan/gstack/blob/cc9e6f8f35b4fb6d6dcdc3bc776c70efc75e9aa3/bin/gstack-telemetry-log#L109-L118)
- Field stripping before upload: [bin/gstack-telemetry-sync#L87-L105](https://github.com/garrytan/gstack/blob/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5/bin/gstack-telemetry-sync#L87-L105)
- Ingest allowlist: [supabase/functions/telemetry-ingest/index.ts#L71-L84](https://github.com/garrytan/gstack/blob/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5/supabase/functions/telemetry-ingest/index.ts#L71-L84)
- "Telemetry off means off everywhere" (v0.13.7.0, 2026-03-29): [CHANGELOG.md#L12198](https://github.com/garrytan/gstack/blob/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5/CHANGELOG.md#L12198)
- Cookie import skill: [README.md#L313](https://github.com/garrytan/gstack/blob/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5/README.md#L313)
- YC referral link: [office-hours/sections/design-and-handoff.md.tmpl#L260](https://github.com/garrytan/gstack/blob/c580561e8a5ac08e6cbdd52c7a0ce521ab6310a5/office-hours/sections/design-and-handoff.md.tmpl#L260)
- Star count: GitHub API, 137,035 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at c580561e. Stars 41K -> 137K. Local JSONL logging no longer runs while telemetry is off (fixed upstream 2026-03-29). Community-tier device ID changed from hostname+user hash to random UUID (2026-03-28). Added: update check on by default, outside reviews sending code/diffs to a second provider by default, Aside real-browser integration, Memorable bridge, egress receipt ledger. Supabase endpoint and opt-in default unchanged.
