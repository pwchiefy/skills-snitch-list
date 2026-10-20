# Serena

| Field | Value |
|-------|-------|
| Repository | https://github.com/oraios/serena |
| Type | MCP Server (coding toolkit with local web dashboard) |
| Stars | 30K |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None found (tool-usage statistics are kept locally for the dashboard) |
| Disable Method | N/A |
| Risk Level | MEDIUM |
| Last Verified | 2026-10-20 |

## What It Does

Serena is an MCP server that gives agents IDE-like, language-server-backed tools: symbol search, references, symbol-level edits, project memories and (in some contexts) shell execution. It ships context profiles for Claude Code, Codex, Copilot CLI, Claude Desktop, JetBrains and others, and starts a local web dashboard by default.

## Telemetry Details

- A search of `src/` for PostHog, Sentry, analytics SDKs and telemetry endpoints found none. `serena.analytics` holds local token-count and tool-usage statistics displayed in the dashboard. No outbound analytics calls were found

## Security Concerns

- **Dashboard RCE chain (CVE-2026-49471, fixed in 1.5.2):** The dashboard ran an unauthenticated Flask API on a fixed port (24282, `0x5EDA`) with no Host-header validation. A malicious web page could use DNS rebinding to write a "memory" that the agent later read and acted on, and with `execute_shell_command` available this became remote code execution from a web page visit. Current code sets Flask `TRUSTED_HOSTS` to `localhost`/`127.0.0.1` (configurable via `web_dashboard_trusted_hosts`)
- **Shell tool depends on context:** In the current source the Claude Code, Codex, Copilot CLI, IDE and VS Code contexts exclude `execute_shell_command`, but the `agent`, `chatgpt`, `desktop-app` (Claude Desktop) and `oaicompat-agent` contexts leave it available
- **Memories are an injection surface:** Serena's project memories are files the agent reads and trusts. Anything that can write them, including a cloned repository that ships a `.serena/` directory, can steer the agent
- **System-prompt overrides:** The Claude Code context instructs the model that built-in `Edit` is "FORBIDDEN" and lists "disallowed reasoning". This is a functional choice, but it is a strong instruction override that users should know is installed

## How to Opt Out

1. Update to a release after 1.5.2 (current release v2.1.0, 2026-10-19)
2. If you do not use the dashboard, set `web_dashboard: false` in the Serena config
3. Use the context that matches your client (`--context claude-code` etc.) so the shell tool stays excluded, and review `.serena/` directories in repositories you clone

## Evidence

- Audited commit: [`abb0a0f0`](https://github.com/oraios/serena/tree/abb0a0f01b94bc8050086f0fb860077d17730324)
- Fixed dashboard port: [src/serena/constants.py#L45](https://github.com/oraios/serena/blob/abb0a0f01b94bc8050086f0fb860077d17730324/src/serena/constants.py#L45)
- Trusted-host validation: [src/serena/dashboard.py#L222-L231](https://github.com/oraios/serena/blob/abb0a0f01b94bc8050086f0fb860077d17730324/src/serena/dashboard.py#L222-L231), [#L1009-L1012](https://github.com/oraios/serena/blob/abb0a0f01b94bc8050086f0fb860077d17730324/src/serena/dashboard.py#L1009-L1012), wired at [src/serena/agent.py#L723](https://github.com/oraios/serena/blob/abb0a0f01b94bc8050086f0fb860077d17730324/src/serena/agent.py#L723)
- Dashboard on by default: [src/serena/resources/serena_config.template.yml#L52](https://github.com/oraios/serena/blob/abb0a0f01b94bc8050086f0fb860077d17730324/src/serena/resources/serena_config.template.yml#L52)
- Context profiles (`excluded_tools`): [src/serena/resources/config/contexts/](https://github.com/oraios/serena/tree/abb0a0f01b94bc8050086f0fb860077d17730324/src/serena/resources/config/contexts), e.g. [claude-code.yml#L28-L42](https://github.com/oraios/serena/blob/abb0a0f01b94bc8050086f0fb860077d17730324/src/serena/resources/config/contexts/claude-code.yml#L28-L42)
- Advisory: [GHSA-37h2-6p4f-mp3q / CVE-2026-49471](https://github.com/advisories/GHSA-37h2-6p4f-mp3q)
- Star count: GitHub API, 30,460 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
