# Browser Use

| Field | Value |
|-------|-------|
| Repository | https://github.com/browser-use/browser-use |
| Type | Agent library + CLI + MCP Server + Skill |
| Stars | 119K |
| Telemetry | Yes |
| Default State | ON (opt-out; logged at INFO level) |
| Analytics Providers | PostHog EU (`eu.i.posthog.com`, GeoIP not disabled, exception autocapture on) |
| Disable Method | Env `ANONYMIZED_TELEMETRY=false` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

A Python library that lets an LLM drive a Chromium browser through CDP to complete web tasks. It also ships a `browser-use` CLI, a registry-listed MCP server (`com.browser-use/browser-use`) that exposes browser tools to Claude Code, Cursor and other clients, and an Agent Skill (`skills/browser-use/SKILL.md`).

## Telemetry Details

- **Provider:** PostHog, hardcoded project key, host `https://eu.i.posthog.com`, `disable_geoip=False`, `enable_exception_autocapture=True`
- **Default:** `ANONYMIZED_TELEMETRY` defaults to `true`
- **Agent runs (`AgentTelemetryEvent`):** Despite the "anonymized" label, the event schema carries:
  - `task` — the full natural-language task given to the agent
  - `action_history` and `urls_visited` — every action and every URL the agent visited
  - `final_result_response` — the agent's final answer text
  - `action_errors`, `error_message`, judge verdict and reasoning, model name/provider, token counts, duration
- **MCP server (`MCPServerTelemetryEvent`):** server start/stop and tool-call events plus `parent_process_cmdline`, built by walking **every parent process** and joining their full command lines. For an MCP server, the parent chain is typically the agent client (e.g. Claude Code) and the shell that launched it
- **MCP client (`MCPClientTelemetryEvent`):** server name, launch command, tool names, errors
- **Cloud sync:** A separate `BROWSER_USE_CLOUD_SYNC` path defaults to the telemetry setting but only sends events after you authenticate to Browser Use Cloud

## Security Concerns

- **Task and browsing history leave the machine by default.** Tasks often contain names, account details or internal URLs; visited URLs can include tokens in query strings; final answers can contain scraped page content
- **Parent command lines can contain secrets.** Any API key or token passed as a command-line argument to a parent process (shell wrappers, `env KEY=... claude`, CI runners) can end up in the `parent_process_cmdline` property
- **Full browser control:** The agent can log in, submit forms and download files; prompt injection from any visited page operates with those capabilities
- **GeoIP + persistent user ID** allow events to be linked across sessions and roughly located

## How to Opt Out

1. Export `ANONYMIZED_TELEMETRY=false` before starting the library, CLI or MCP server
2. For the MCP server, put it in the client config:
   ```json
   "env": { "ANONYMIZED_TELEMETRY": "false" }
   ```
3. Network fallback: block `eu.i.posthog.com`

## Evidence

- Audited commit: [`aa093a84`](https://github.com/browser-use/browser-use/tree/aa093a843da5edbf323c0b4145c9b6a0db3ecde8) (0.13.13, released 2026-10-15)
- Default and env switch: [browser_use/config.py#L57-L63](https://github.com/browser-use/browser-use/blob/aa093a843da5edbf323c0b4145c9b6a0db3ecde8/browser_use/config.py#L57-L63)
- PostHog key, EU host, `disable_geoip=False`, exception autocapture: [browser_use/telemetry/service.py#L21-L22](https://github.com/browser-use/browser-use/blob/aa093a843da5edbf323c0b4145c9b6a0db3ecde8/browser_use/telemetry/service.py#L21-L22), [#L77-L92](https://github.com/browser-use/browser-use/blob/aa093a843da5edbf323c0b4145c9b6a0db3ecde8/browser_use/telemetry/service.py#L77-L92)
- Event schemas (`task`, `urls_visited`, `action_history`, `final_result_response`, `parent_process_cmdline`): [browser_use/telemetry/views.py#L24-L90](https://github.com/browser-use/browser-use/blob/aa093a843da5edbf323c0b4145c9b6a0db3ecde8/browser_use/telemetry/views.py#L24-L90)
- Agent event call site: [browser_use/agent/service.py#L2239](https://github.com/browser-use/browser-use/blob/aa093a843da5edbf323c0b4145c9b6a0db3ecde8/browser_use/agent/service.py#L2239)
- Parent command-line collection: [browser_use/mcp/server.py#L155-L183](https://github.com/browser-use/browser-use/blob/aa093a843da5edbf323c0b4145c9b6a0db3ecde8/browser_use/mcp/server.py#L155-L183), used at [#L1274](https://github.com/browser-use/browser-use/blob/aa093a843da5edbf323c0b4145c9b6a0db3ecde8/browser_use/mcp/server.py#L1274)
- Cloud sync gating: [browser_use/sync/service.py](https://github.com/browser-use/browser-use/blob/aa093a843da5edbf323c0b4145c9b6a0db3ecde8/browser_use/sync/service.py)
- Star count: GitHub API, 118,628 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
