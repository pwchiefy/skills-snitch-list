# Vibe Kanban

| Field | Value |
|-------|-------|
| Repository | https://github.com/BloopAI/vibe-kanban |
| Type | Agent orchestrator (local web app + MCP server) |
| Stars | 28K |
| Telemetry | Yes |
| Default State | ON in released builds (`analytics_enabled: true`); re-enabled automatically on sign-in |
| Analytics Providers | PostHog (key and endpoint injected at build time for official releases) |
| Disable Method | Toggle analytics off in settings (`analytics_enabled: false` in the config file), but signing in turns it back on; or run a self-built binary without `POSTHOG_API_KEY` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

A kanban board that runs coding agents (Claude Code, Codex, Gemini CLI, Amp, Qwen Code and others) on tasks in parallel git worktrees, with review, PR creation and an MCP server so agents can manage the board. Installed with `npx vibe-kanban`. The README now states "Vibe Kanban is sunsetting" and links a shutdown announcement.

## Telemetry Details

- **Build-time key:** Official release workflows inject `POSTHOG_API_KEY`; self-built binaries without it have analytics disabled
- **Default:** The current config version sets `analytics_enabled: true`; configs migrated from older versions default to `true` when unset
- **Machine-derived user ID:** `generate_user_id()` hashes the macOS `IOPlatformUUID` (via `ioreg`), Linux `/etc/machine-id`, or Windows `MachineGuid` (via PowerShell), plus `$USER` and `$HOME`, into a stable `npm_user_…` ID
- **Events (examples):** `task_attempt_finished` (workspace ID, session ID, success, exit code), `pr_merged`, `analytics_session_start`, plus OS type/version in event properties
- **Sign-in links identity:** After OAuth login the server sends a PostHog `$identify` event with the account **email**, then `$merge_dangerously` aliasing the machine-derived ID to the account ID, so pre-login activity is joined to the named account
- **Opt-out is overridden on login:** If `analytics_enabled` is false when you sign in, the OAuth handler sets it to `true`, saves the config and logs "enabling analytics on login"

## Security Concerns

- **Agents run with permission checks disabled by default.** The default executor profiles set `dangerously_skip_permissions: true` for Claude Code, `dangerously_allow_all: true` for Amp and `yolo: true` for Gemini CLI and Qwen Code. Worktrees separate the code changes, not the process: agents run as your user with your credentials and network access
- **User choice not respected on sign-in:** A user who turned analytics off and later signs in is silently opted back in, and their email is attached to the analytics profile
- **Hardware fingerprint:** The analytics ID is derived from hardware/OS identifiers and username, so it survives reinstalling the tool
- **Sunsetting project:** The README says the project is sunsetting and will continue as community-maintained open source. Check how actively security fixes land before relying on it, and pin a version

## How to Opt Out

1. Turn analytics off in Settings (writes `analytics_enabled: false` to the config file)
2. Do not sign in to a Vibe Kanban account, or turn analytics off again after every sign-in and confirm with network monitoring
3. Edit agent profiles to remove `dangerously_skip_permissions` / `yolo` / `dangerously_allow_all`, or run Vibe Kanban inside a container or VM
4. Network fallback: block the PostHog host for the process (`*.posthog.com`)

## Evidence

- Audited commit: [`d5cbb538`](https://github.com/BloopAI/vibe-kanban/tree/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a) (npx-cli 0.1.45; latest GitHub release v0.1.44-20260424091429)
- Default `analytics_enabled: true` and migration default: [crates/services/src/services/config/versions/v8.rs#L76](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/crates/services/src/services/config/versions/v8.rs#L76), [#L144](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/crates/services/src/services/config/versions/v8.rs#L144)
- Analytics forced on at login; `$identify` with email; `$merge_dangerously`: [crates/server/src/routes/oauth.rs#L349-L362](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/crates/server/src/routes/oauth.rs#L349-L362), [#L400-L414](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/crates/server/src/routes/oauth.rs#L400-L414)
- Hardware-derived user ID: [crates/services/src/services/analytics.rs#L117-L170](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/crates/services/src/services/analytics.rs#L117-L170)
- Build-time key: [README.md#L118-L119](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/README.md#L118-L119), [crates/server/build.rs#L18-L19](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/crates/server/build.rs#L18-L19), [.github/workflows/pre-release.yml#L348](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/.github/workflows/pre-release.yml#L348)
- Default permission-bypass profiles: [crates/executors/default_profiles.json#L1-L44](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/crates/executors/default_profiles.json#L1-L44)
- Example event: [crates/local-deployment/src/container.rs#L742-L753](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/crates/local-deployment/src/container.rs#L742-L753)
- Sunsetting notice: [README.md](https://github.com/BloopAI/vibe-kanban/blob/d5cbb5380fa0b32e98ef9b8d987f63decce4be3a/README.md), https://www.vibekanban.com/blog/shutdown
- Star count: GitHub API, 28,412 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
