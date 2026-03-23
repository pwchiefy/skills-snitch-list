# gstack

| Field | Value |
|-------|-------|
| Repository | https://github.com/garrytan/gstack |
| Type | Plugin |
| Stars | 41K |
| Telemetry | Yes |
| Default State | OFF (but local logging always on) |
| Analytics Providers | Supabase |
| Disable Method | Config toggle in settings |
| Risk Level | HIGH |
| Last Verified | 2026-03-23 |

## What It Does

gstack is a plugin by Garry Tan (Y Combinator president) that provides a curated development stack for Claude Code. It bundles tooling configurations, workflow presets, and community features aimed at startups and YC-affiliated developers.

## Telemetry Details

- **Supabase endpoint:** `frugpmstpnojnhfyimgv.supabase.co`
- **Telemetry added:** March 20, 2026 via PR #210
- **Local JSONL logging:** Always active regardless of consent status. Event data is written to a local JSONL file before any remote telemetry consent is given
- **Device fingerprinting:** Active at the community tier. Generates a device fingerprint used for analytics and potentially cross-session tracking
- **Remote telemetry:** Off by default but can be toggled on via config. When enabled, events are shipped to Supabase
- **YC referral link:** Includes a Y Combinator referral/tracking link in certain outputs, enabling attribution tracking outside the telemetry system

## Security Concerns

- **Cookie import from browsers:** gstack has the ability to import cookies from local browsers. This is an extremely sensitive capability that could expose authentication tokens, session cookies, and other browser-stored credentials to the plugin
- **Pre-consent local logging:** Data is logged locally in JSONL format before the user has opted in, creating a data collection window that exists regardless of user preference
- **Device fingerprinting:** The community tier generates persistent device fingerprints, which can be used to track users across sessions and potentially correlate activity
- **Supabase as analytics backend:** Supabase is a general-purpose database, not a purpose-built analytics platform. Data retention and access controls depend entirely on the project configuration
- **Supply chain risk:** High star count (41K) and YC branding make this a high-value target for supply chain attacks

## How to Opt Out

1. Disable remote telemetry via the plugin's config toggle (check `gstack.config` or equivalent settings file)
2. Note: Local JSONL logging cannot be disabled through the standard config — it runs unconditionally
3. To stop local logging, you would need to modify the source code or remove write permissions to the log file
4. To prevent cookie import, deny or sandbox filesystem access to browser profile directories

## Evidence

- PR #210 (merged March 20, 2026) introduced the Supabase telemetry pipeline
- Supabase project identifier: `frugpmstpnojnhfyimgv`
- Full endpoint: `https://frugpmstpnojnhfyimgv.supabase.co`
- Local event log: JSONL file written before remote consent check
- Device fingerprint generation present in community tier code path
- YC referral tracking link embedded in plugin output

## Changelog
- 2026-03-23: Initial entry
