# OpenClaw

| Field | Value |
|-------|-------|
| Repository | https://github.com/openclaw/openclaw |
| Type | Agent daemon (Gateway) + skills/plugin marketplace (ClawHub) |
| Stars | 393K |
| Telemetry | Yes (daily update check with server-derived approximate location; feature statistics opt-in) |
| Default State | Update check ON; anonymous feature statistics OFF (opt-in); both off when `CI` is set |
| Analytics Providers | Project service `telemetry.openclaw.ai` (Cloudflare; approximate location from Cloudflare); ClawHub install telemetry when signed in to ClawHub |
| Disable Method | `update.checkOnStart: false` or `OPENCLAW_NO_AUTO_UPDATE=1` (stops all automatic requests); `openclaw telemetry off` / `telemetry.enabled: false` / `DO_NOT_TRACK=1` (feature statistics only) |
| Risk Level | CRITICAL |
| Last Verified | 2026-10-20 |

## What It Does

OpenClaw is an always-on personal agent: a Gateway daemon connected to messaging channels (WhatsApp, Telegram, Slack, Discord, Feishu and more), model providers, tools and devices, extended with skills and plugins installed from the ClawHub registry. It is the most-starred project in the agent-extension space and the target of the largest skill-marketplace campaigns documented so far.

## Telemetry Details

- **Daily update check (default ON):** `GET https://telemetry.openclaw.ai/api/latest-version` with a `User-Agent` carrying OpenClaw version, OS, Node version, CPU architecture and surface (gateway/CLI). No body or client identifier
- **Approximate location:** The project's docs state Cloudflare provides country, region code, city and timezone for recorded update checks, "even when anonymous feature statistics are off or `DO_NOT_TRACK` is set". Records are retained three months
- **Anonymous feature statistics (opt-in):** configured channel IDs, provider families, enabled plugin IDs and counts, and a 24-hour session-creation count, attached to the same daily request
- **`DO_NOT_TRACK` does not stop the update check;** only `update.checkOnStart: false` or `OPENCLAW_NO_AUTO_UPDATE=1` does
- **ClawHub:** Installing from ClawHub while authenticated reports install events to ClawHub (`/api/cli/telemetry/install`) unless ClawHub telemetry is disabled
- `openclaw telemetry show` prints exactly what would be sent

## Security Concerns

- **Volume of security fixes:** The repository published 434 security advisories between 2026-03-23 and 2026-10-20 (9 critical, 162 high), covering gateway scope escalation, sandbox escapes, `.env` injection, skill/plugin policy bypasses and more. This reflects active disclosure and fixing, but also the size of the attack surface. Running anything but the latest release is risky
- **Marketplace integrity issues fixed in 2026:** ClawHub package downloads were not integrity-verified (GHSA-3vvq-q2qc-7rmp, April); marketplace extension metadata could point at unscanned payloads (GHSA-v6r2-jh58-xx6w, May); plugin install wrappers could skip install policy and allow non-owner persistence (GHSA-wgq8-x5wm-g4rw, GHSA-7vrr-rp4x-4g76, June); Skill Workshop could apply changes before approval (CVE-2026-53808)
- **Campaign target:** ClawHavoc, ToxicSkills and AMOS-via-skills (see README incidents) targeted ClawHub. The npm malware feed also lists hijacked or lookalike OpenClaw packages in 2026 (e.g. the `openclaw-cn` family, May; `@memtensor/memos-cloud-openclaw-plugin@0.1.21`, September), and the February 2026 Cline CLI compromise silently installed OpenClaw globally
- **Messaging accounts + shell:** A compromised skill or prompt injection through any connected channel acts with access to your chats, accounts and machine

## How to Opt Out

1. Disable all automatic requests:
   ```json5
   { update: { checkOnStart: false } }
   ```
   or export `OPENCLAW_NO_AUTO_UPDATE=1`
2. Leave feature statistics off (`openclaw telemetry off`) and check with `openclaw telemetry show`
3. Install skills only from publishers you trust, read every `SKILL.md` and script, and keep the Gateway on the latest release
4. Run the Gateway on a separate machine or VM without your primary credentials

## Evidence

- Audited commit: [`1190dc98`](https://github.com/openclaw/openclaw/tree/1190dc98753d83f6fe65fdc3ceb7c5dbf25fbc1f)
- Telemetry documentation (update check, location, opt-in stats, `DO_NOT_TRACK`, full disable): [docs/gateway/telemetry.md](https://github.com/openclaw/openclaw/blob/1190dc98753d83f6fe65fdc3ceb7c5dbf25fbc1f/docs/gateway/telemetry.md) (lines 11-21, 83-93, 208-212, 227-241)
- Default endpoint and override: [src/infra/telemetry.ts#L25](https://github.com/openclaw/openclaw/blob/1190dc98753d83f6fe65fdc3ceb7c5dbf25fbc1f/src/infra/telemetry.ts#L25), [#L91](https://github.com/openclaw/openclaw/blob/1190dc98753d83f6fe65fdc3ceb7c5dbf25fbc1f/src/infra/telemetry.ts#L91)
- ClawHub install telemetry: [src/infra/clawhub-telemetry.ts](https://github.com/openclaw/openclaw/blob/1190dc98753d83f6fe65fdc3ceb7c5dbf25fbc1f/src/infra/clawhub-telemetry.ts)
- Advisory count: GitHub API `repos/openclaw/openclaw/security-advisories` (published), 434 with `published_at` from 2026-03-23 to 2026-10-20, of 722 total; list at https://github.com/openclaw/openclaw/security/advisories
- Selected advisories: [GHSA-3vvq-q2qc-7rmp](https://github.com/openclaw/openclaw/security/advisories/GHSA-3vvq-q2qc-7rmp), [GHSA-v6r2-jh58-xx6w](https://github.com/openclaw/openclaw/security/advisories/GHSA-v6r2-jh58-xx6w), [GHSA-7vrr-rp4x-4g76](https://github.com/openclaw/openclaw/security/advisories/GHSA-7vrr-rp4x-4g76), [GHSA-cqwv-9qjx-vxw2 / CVE-2026-53808](https://github.com/openclaw/openclaw/security/advisories/GHSA-cqwv-9qjx-vxw2)
- npm malware feed: [GHSA-w2fv-p53h-wcph (openclaw-cn)](https://github.com/advisories/GHSA-w2fv-p53h-wcph), [GHSA-mhjf-v53x-7p87 (@memtensor/memos-cloud-openclaw-plugin)](https://github.com/advisories/GHSA-mhjf-v53x-7p87); Cline CLI incident [GHSA-9ppg-jx86-fqw7](https://github.com/advisories/GHSA-9ppg-jx86-fqw7)
- Star count: GitHub API, 392,968 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry (OpenClaw was previously listed only in the README Top 20)
