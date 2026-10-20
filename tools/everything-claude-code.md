# Everything Claude Code

| Field | Value |
|-------|-------|
| Repository | https://github.com/affaan-m/ECC |
| Type | Config Bundle |
| Stars | 285K |
| Telemetry | Partial (no remote telemetry found in hooks; opt-in InsAIts security monitor; local metrics and session files) |
| Default State | OFF (InsAIts requires `ECC_ENABLE_INSAITS`) |
| Analytics Providers | None found; InsAIts SDK (opt-in third-party security monitor) |
| Disable Method | Leave `ECC_ENABLE_INSAITS` unset; use a narrower install profile or disable individual hooks |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

Everything Claude Code (now branded "ECC", repository renamed from `affaan-m/everything-claude-code` to `affaan-m/ECC`; old URL redirects) is a large configuration bundle and installer for Claude Code and other agent harnesses (Codex, Cursor, OpenCode, Kimi and more). It installs agents, skills, commands, rules, MCP server configs and roughly 50 hook commands, distributed through the `ecc-universal` npm package (`npx ecc-universal setup` / `install --guided`) with profile and dry-run options. Version audited: 2.2.3.

## Telemetry Details

- **No remote analytics in hooks:** A scan of `scripts/hooks/` and `scripts/lib/` found no analytics SDKs. The two hooks that make HTTP requests talk to a loopback plan-canvas server (`plan-canvas-pending.js`) or probe the MCP servers you configured (`mcp-health-check.js`)
- **InsAIts security monitor (opt-in):** The InsAIts hook (third-party, by YuyAI) only runs when `ECC_ENABLE_INSAITS` is set to a true value; otherwise the wrapper passes input through untouched. Its docstring describes it as a local security monitor (credential exposure, prompt injection, anomaly detection) and states "All processing is local". We did not audit the InsAIts SDK package itself, and its strict mode references an API key. Our March entry called it an analytics SDK; the current code presents it as a security monitor
- **Local metrics:** `session-activity-tracker.js` writes tool usage to `~/.claude/metrics/tool-usage.jsonl`; `ecc-metrics-bridge.js` reads `~/.claude/metrics/costs.jsonl`; a skill-run tracker records skill invocations for local "skill-health" dashboards
- **Session files:** The Stop hook (`session-end.js`) reads the Claude Code transcript and writes a session summary into the ECC sessions directory under `~/.claude`

## Security Concerns

- **Modifies every layer:** Hooks, MCP configs, agents, skills, rules and settings across multiple harnesses. The blast radius of a compromised release is the whole agent setup
- **Hooks with transcript access:** Session hooks read full transcripts and persist summaries and metrics locally; anything sensitive in a session can end up in these files
- **Third-party hook code:** InsAIts and other contributed hooks bring third-party code into the hook path
- **285K stars = high-value target:** One of the most-installed Claude Code bundles; the installer pulls from npm, so a compromised publish would reach many machines
- **Configuration complexity:** Users may not understand every change. The installer's `--dry-run` and profiles help, but the default full setup is large

## How to Opt Out

For InsAIts:
1. Leave `ECC_ENABLE_INSAITS` unset (default)
2. If you enabled it, unset it and review InsAIts' own documentation for any data it retained

For local session and metrics files:
1. Disable the session and metrics hooks in the installed hook configuration
2. Delete `~/.claude/metrics/` and the ECC sessions directory, reviewing them first for credentials that need rotation

General risk mitigation:
1. Run the installer with `--dry-run` and choose a minimal `--profile` instead of the full bundle
2. Pin the npm version (`ecc-universal@<version>`) and review release diffs before updating

## Evidence

- Audited commit: [`6f1881ae`](https://github.com/affaan-m/ECC/tree/6f1881aeafa3c48f7b603cc4be4b2e4e70daad59) (2026-10-19, package.json 2.2.3)
- InsAIts opt-in gate: [scripts/hooks/insaits-security-wrapper.js#L32-L36](https://github.com/affaan-m/ECC/blob/6f1881aeafa3c48f7b603cc4be4b2e4e70daad59/scripts/hooks/insaits-security-wrapper.js#L32-L36)
- InsAIts description ("All processing is local"): [scripts/hooks/insaits-security-monitor.py#L40-L60](https://github.com/affaan-m/ECC/blob/6f1881aeafa3c48f7b603cc4be4b2e4e70daad59/scripts/hooks/insaits-security-monitor.py#L40-L60)
- InsAIts made opt-in (#370): [CHANGELOG.md#L268](https://github.com/affaan-m/ECC/blob/6f1881aeafa3c48f7b603cc4be4b2e4e70daad59/CHANGELOG.md#L268)
- Local tool-usage metrics: [scripts/hooks/session-activity-tracker.js#L6](https://github.com/affaan-m/ECC/blob/6f1881aeafa3c48f7b603cc4be4b2e4e70daad59/scripts/hooks/session-activity-tracker.js#L6), [#L619](https://github.com/affaan-m/ECC/blob/6f1881aeafa3c48f7b603cc4be4b2e4e70daad59/scripts/hooks/session-activity-tracker.js#L619)
- Session summary from transcript: [scripts/hooks/session-end.js#L77-L78](https://github.com/affaan-m/ECC/blob/6f1881aeafa3c48f7b603cc4be4b2e4e70daad59/scripts/hooks/session-end.js#L77-L78), [#L333-L339](https://github.com/affaan-m/ECC/blob/6f1881aeafa3c48f7b603cc4be4b2e4e70daad59/scripts/hooks/session-end.js#L333-L339)
- Installer: [README.md#L176](https://github.com/affaan-m/ECC/blob/6f1881aeafa3c48f7b603cc4be4b2e4e70daad59/README.md#L176)
- Repository rename: `GET /repos/affaan-m/everything-claude-code` resolves to `affaan-m/ECC` (GitHub API, 2026-10-20)
- Star count: GitHub API, 284,547 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at 6f1881ae (v2.2.3). Repository renamed to affaan-m/ECC (redirects). No remote telemetry found in hooks. InsAIts is gated by `ECC_ENABLE_INSAITS` and self-describes as a local security monitor (SDK itself not audited). Documented local metrics (`~/.claude/metrics/`) and transcript-derived session files. Stars 101K -> 285K.
