# Loki Mode

| Field | Value |
|-------|-------|
| Repository | https://github.com/asklokesh/loki-mode |
| Type | Skill + CLI |
| Stars | 1.1K |
| Telemetry | Yes |
| Default State | ON for individual interactive installs; auto-OFF in CI, enterprise/air-gapped markers and non-interactive sessions |
| Analytics Providers | PostHog (OpenTelemetry is optional, self-hosted, no default endpoint) |
| Disable Method | `loki telemetry off`, `LOKI_TELEMETRY=off`, `LOKI_TELEMETRY_DISABLED=true`, `DO_NOT_TRACK=1`, or `TELEMETRY_DISABLED=true` in `~/.loki/config` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

Loki Mode describes itself as an "autonomous software factory": given a GitHub issue, spec or one-line task it runs coding agents (Claude Code, Codex, OpenCode) in a loop and returns a pull request with a signed receipt. It ships as a Claude Code skill (`SKILL.md`) plus a `loki` CLI, dashboard, MCP server, Docker and Helm deployments. The author is Lokesh Mure (`asklokesh`). The repository was renamed from `asklokesh/claudeskill-loki-mode` to `asklokesh/loki-mode` (old URL redirects). Our March entry wrongly attributed it to Palisade Research and linked `PalisadeResearch/claudeskill-loki-mode`; the README linked `loki-code-ai/claudeskill-loki-mode`. Both of those URLs return 404. Version audited: 11.18.0.

## Telemetry Details

- **PostHog:** Events go to `https://us.i.posthog.com/capture/` (override with `LOKI_TELEMETRY_ENDPOINT`) with a built-in public project key
- **Default:** ON for an ordinary individual install. Auto-disabled when CI variables (`CI`, `GITHUB_ACTIONS`, `GITLAB_CI`, `BUILDKITE`, `JENKINS_URL`, `TEAMCITY_VERSION`, `CONTINUOUS_INTEGRATION`), `LOKI_ENTERPRISE=true` / `LOKI_AIRGAP=true`, or a non-interactive session (no TTY) are detected. The first-run welcome screen discloses that diagnostics are on
- **Persistent ID:** Random UUIDv4 stored at `~/.loki-telemetry-id` (unchanged since March)
- **Events (per docs/PRIVACY.md):** `install`, `session_start`, `session_end`, `cli_command`, `dashboard_start`. Every event carries OS, CPU architecture, Loki version, install channel and the distinct ID; `install` adds Node version and which provider CLIs were detected; some events add the command name
- **Welcome page form:** Optional, explicit submit only: role, company size and tools used
- **Strict second opt-in (default OFF):** `build_verified` (build outcome scalars from `proof.json`) and `first_run_blocked` (one enum value) require `LOKI_ANALYTICS=on` in addition to telemetry
- **Crash reporting:** Local-only (`.loki/crash/<id>.json`), no network egress; manual submit via a prefilled GitHub issue
- **OpenTelemetry correction:** Our March entry listed OpenTelemetry as a second default-on stack. Per PRIVACY.md, OTel tracing is configured only with `loki telemetry enable [endpoint]` or `LOKI_OTEL_ENDPOINT`, has no default endpoint, and never sends to the vendor. This was already true in March: `src/observability/otel.js` at that time loaded only when `LOKI_OTEL_ENDPOINT` was set
- **Documented as never sent:** code, prompts, PRDs, file paths, env values, API keys, repo names, emails, IP addresses
- **Docs inconsistency:** `docs/v11/C9-opt-in-telemetry.md` (added 2026-10-04) is a design one-pager that says "Loki Mode emits no telemetry" and proposes opt-in-only collection. It contradicts the shipped default-ON PostHog telemetry and PRIVACY.md

## Security Concerns

- **Runs agents with permission checks disabled:** `autonomy/run.sh` launches Claude Code with `--dangerously-skip-permissions`, and `SKILL.md` instructs users to start `claude --dangerously-skip-permissions`. Combined with autonomous multi-iteration runs, a prompt injection in an issue or spec can execute arbitrary commands with no approval prompt. Run it only inside a disposable container or VM
- **Default-ON telemetry from a developer tool:** Opt-out is well documented and broad, but the default for individuals is still ON
- **Persistent UUID at a known path** correlates all usage from one machine
- **Large surface:** CLI, dashboard, MCP server, API, Docker/Helm deployments and postinstall script (`bin/loki-postinstall.js`, repoints skill links and installs shell completions)

## How to Opt Out

1. Run `loki telemetry off`, or set one of: `LOKI_TELEMETRY=off`, `LOKI_TELEMETRY_DISABLED=true`, `DO_NOT_TRACK=1`
2. Or add `TELEMETRY_DISABLED=true` to `~/.loki/config`
3. Persist the env var in your shell profile, e.g. `echo 'export DO_NOT_TRACK=1' >> ~/.zshrc`
4. Optionally delete `~/.loki-telemetry-id`
5. Do not set `LOKI_ANALYTICS=on` unless you want build-outcome analytics
6. Verify by monitoring outbound connections to `us.i.posthog.com`

## Evidence

- Audited commit: [`37f4d4f3`](https://github.com/asklokesh/loki-mode/tree/37f4d4f3796ccaff171a593b229da1119fcb163f) (2026-10-20, VERSION 11.18.0)
- Privacy disclosure: [docs/PRIVACY.md#L7-L35](https://github.com/asklokesh/loki-mode/blob/37f4d4f3796ccaff171a593b229da1119fcb163f/docs/PRIVACY.md#L7-L35), usage telemetry [#L60-L76](https://github.com/asklokesh/loki-mode/blob/37f4d4f3796ccaff171a593b229da1119fcb163f/docs/PRIVACY.md#L60-L76), OpenTelemetry [#L227-L232](https://github.com/asklokesh/loki-mode/blob/37f4d4f3796ccaff171a593b229da1119fcb163f/docs/PRIVACY.md#L227-L232)
- Auto-off logic, endpoint and key: [autonomy/telemetry.sh#L1-L56](https://github.com/asklokesh/loki-mode/blob/37f4d4f3796ccaff171a593b229da1119fcb163f/autonomy/telemetry.sh#L1-L56)
- Persistent ID path: [autonomy/telemetry.sh#L125](https://github.com/asklokesh/loki-mode/blob/37f4d4f3796ccaff171a593b229da1119fcb163f/autonomy/telemetry.sh#L125)
- Permission bypass: [autonomy/run.sh#L1900](https://github.com/asklokesh/loki-mode/blob/37f4d4f3796ccaff171a593b229da1119fcb163f/autonomy/run.sh#L1900), [SKILL.md#L213-L214](https://github.com/asklokesh/loki-mode/blob/37f4d4f3796ccaff171a593b229da1119fcb163f/SKILL.md#L213-L214)
- Stale opt-in design doc: [docs/v11/C9-opt-in-telemetry.md](https://github.com/asklokesh/loki-mode/blob/37f4d4f3796ccaff171a593b229da1119fcb163f/docs/v11/C9-opt-in-telemetry.md)
- March 2026 OTel gating (for comparison): [src/observability/otel.js@0f5e1973#L6](https://github.com/asklokesh/loki-mode/blob/0f5e19736197e8fcbe6efdee7cfbc495ac257587/src/observability/otel.js#L6)
- Author: GitHub profile `asklokesh` (name: Lokesh Mure)
- Repository rename: `GET /repos/asklokesh/claudeskill-loki-mode` resolves to `asklokesh/loki-mode` (GitHub API, 2026-10-20)
- Star count: GitHub API, 1,100 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at 37f4d4f3 (v11.18.0). Corrected repository and author (asklokesh/loki-mode by Lokesh Mure, not Palisade Research; PalisadeResearch and loki-code-ai URLs are 404). Corrected OpenTelemetry: optional, self-hosted, no default endpoint. Telemetry now auto-disables in CI, enterprise and non-interactive contexts and has more opt-out switches (`loki telemetry off`, `LOKI_TELEMETRY=off`). Added `--dangerously-skip-permissions` finding and stale C9 doc note. PostHog default-ON for individuals unchanged. Stars 766 -> 1.1K.
