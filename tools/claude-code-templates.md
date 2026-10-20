# Claude Code Templates (aitmpl.com)

| Field | Value |
|-------|-------|
| Repository | https://github.com/davila7/claude-code-templates |
| Type | Installer CLI + component catalog (agents, commands, hooks, MCPs, settings, skills) |
| Stars | 33K |
| Telemetry | Yes |
| Default State | ON for download/command/install-outcome tracking; Sentry error reporting is opt-in |
| Analytics Providers | Project endpoints on `www.aitmpl.com` (`/api/track-download-supabase`, `/api/track-command-usage`, `/api/track-installation-outcome`); Sentry only with `CCT_ERROR_REPORTING=true` |
| Disable Method | Env `CCT_NO_TRACKING=true` or `CCT_NO_ANALYTICS=true` (also off when `CI=true`) |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

`npx claude-code-templates` installs components from the aitmpl.com catalog into `.claude/`: agents, slash commands, hooks, MCP server configs, settings files and skills. The repository holds roughly 420 agent files, 350 command files, 60+ hook files, 100+ MCP configs, 77 settings files and over 3,000 skill files. The CLI also offers local dashboards (usage analytics, chats, health check) that read your Claude Code conversation files.

## Telemetry Details

- **Default:** `shouldEnableTracking()` returns `true` unless `CCT_NO_TRACKING`, `CCT_NO_ANALYTICS` or `CI` is `'true'`
- **Component downloads:** event `component_download` with component type and name, a session ID, Node version, platform, arch, CLI version and caller-supplied metadata, POSTed to `https://www.aitmpl.com/api/track-download-supabase`
- **Command usage:** command name (e.g. `analytics`, `hook-stats`, `sandbox`), versions, platform, session ID and metadata, POSTed to `/api/track-command-usage`
- **Installation outcomes:** component, outcome, error type and **error message**, duration, platform, batch ID, POSTed to `/api/track-installation-outcome`
- **Sentry:** A DSN is bundled, but `shouldReportErrors()` requires `CCT_ERROR_REPORTING=true` and still honours the opt-out variables

## Security Concerns

- **One command can change your whole security posture.** Hooks run shell commands on every matching tool event, settings files can change permission rules, and MCP configs start new processes. A component from a large community catalog should be read before it is installed, just like any third-party code
- **Tunnel option publishes your conversation dashboard.** With `--tunnel`, the analytics/chats dashboard asks whether to start a Cloudflare Tunnel, with the confirm prompt defaulting to "yes". It runs `cloudflared tunnel --url http://localhost:<port>`, which creates a public `*.trycloudflare.com` URL. The prompt says "Only you will have access to the generated URL (not public)"; we found no authentication in `analytics.js`, so access depends on nobody else learning the URL. The dashboard reads your Claude Code conversation history
- **Error messages in telemetry:** Install-outcome events include error messages, which can contain local file paths

## How to Opt Out

1. Export `CCT_NO_TRACKING=true` (or `CCT_NO_ANALYTICS=true`) before running `npx claude-code-templates`
2. Leave `CCT_ERROR_REPORTING` unset
3. Do not use `--tunnel` (or answer "no" to the Cloudflare Tunnel prompt); view the dashboard on `localhost` only
4. Review each hook, settings file and MCP config in the repository before installing it

## Evidence

- Audited commit: [`ffcb267c`](https://github.com/davila7/claude-code-templates/tree/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d) (cli-tool 1.30.0)
- Default-on and opt-out variables: [cli-tool/src/tracking-service.js#L15-L25](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/tracking-service.js#L15-L25)
- Download payload and endpoint: [tracking-service.js#L63-L80](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/tracking-service.js#L63-L80), [#L132](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/tracking-service.js#L132)
- Command and install-outcome tracking: [tracking-service.js#L228-L240](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/tracking-service.js#L228-L240), [#L262](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/tracking-service.js#L262), [#L300-L314](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/tracking-service.js#L300-L314), [#L338](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/tracking-service.js#L338)
- Sentry opt-in gate: [cli-tool/src/error-reporting.js#L20-L45](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/error-reporting.js#L20-L45)
- Tunnel only with `--tunnel`: [cli-tool/src/analytics.js#L2319-L2324](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/analytics.js#L2319-L2324)
- Tunnel prompt and command: [cli-tool/src/analytics.js#L1313-L1335](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/analytics.js#L1313-L1335), [#L1383-L1386](https://github.com/davila7/claude-code-templates/blob/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/src/analytics.js#L1383-L1386)
- Component catalog: [cli-tool/components/](https://github.com/davila7/claude-code-templates/tree/ffcb267ccdd1660ecf5e250eae0f1f6a458cd05d/cli-tool/components)
- Star count: GitHub API, 32,781 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
