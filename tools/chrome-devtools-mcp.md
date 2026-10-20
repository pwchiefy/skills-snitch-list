# Chrome DevTools MCP

| Field | Value |
|-------|-------|
| Repository | https://github.com/ChromeDevTools/chrome-devtools-mcp |
| Type | MCP Server |
| Stars | 54K |
| Telemetry | Yes |
| Default State | ON (opt-out; a one-line notice is printed at startup) |
| Analytics Providers | Google Clearcut (`play.googleapis.com/log`); separately, trace URLs to the Chrome UX Report (CrUX) API |
| Disable Method | `--no-usage-statistics` flag, or env `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS` (also off when `CI` is set). CrUX lookups: `--no-performance-crux` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

Google's official MCP server that lets a coding agent drive a real Chrome instance through the DevTools Protocol: navigate, click, type, take screenshots, read console and network logs, evaluate JavaScript in the page, and record performance traces. It is installed with `npx -y chrome-devtools-mcp@latest` in most client configs.

## Telemetry Details

- **Provider:** Google Clearcut logging, endpoint `https://play.googleapis.com/log?format=json_proto`, sent from a separate watchdog process
- **Default:** `usageStatistics` defaults to `true`. The README states "Data collection is **enabled by default**" and the server prints an opt-out notice on start
- **Data collected (per the protobuf interfaces in `src/telemetry/types.ts`):**
  - OS type, MCP client name (sanitized to `[a-zA-Z0-9_-]`, max 32 chars, otherwise `<redacted>`), app version, session ID
  - Each tool invocation: tool name, success, bucketed latency, and `tool_params` (string values are reduced to bucketed lengths; IDs such as `uid`/`reqid`/`msgid` are blocklisted)
  - Context flags: whether DevTools is open, whether the page is `localhost`, whether a DOM element or network request is selected
  - Server start (which flags were used), daily-active and tool-active pings, shutdown, error codes
- **Second data flow (CrUX):** `performanceCrux` also defaults to `true`. When you record a performance trace, URLs from the trace are sent to `chromeuxreport.googleapis.com` to fetch field data. This is functional, but it sends the URLs you are profiling to Google
- **Privacy policy:** Handled under the Google Privacy Policy; independent of Chrome browser metrics (opting out of one does not opt out of the other)

## Security Concerns

- **Browser with your sessions:** The default launch uses a temporary isolated profile (`isolated` defaults to true), but the documented `--autoConnect`, `--browserUrl`, `--wsEndpoint` and `--user-data-dir` options attach the agent to a real profile. Anything the agent can reach in that browser (logged-in webmail, banking, admin consoles) is then reachable through prompt injection from any page it visits
- **Arbitrary JavaScript:** `evaluate_script` and `navigate_page` `initScript` run caller-supplied JavaScript. `--no-javascript-evaluation` turns these entry points off, but the option text itself says it "is not a JavaScript sandbox"
- **Known vulnerabilities:** CVE-2026-53765 (daemon PID file written through a symlink in the `/tmp` fallback runtime directory) and CVE-2026-53766 (`validatePath()` did not canonicalize symlinks before enforcing roots). Both fixed; update to a current release
- **Floating version:** The documented `@latest` install means every client restart can pull new code

## How to Opt Out

1. Add `--no-usage-statistics` to the server args:
   ```json
   "args": ["-y", "chrome-devtools-mcp@latest", "--no-usage-statistics"]
   ```
2. Or set `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS=1` in the server's environment
3. To stop trace URLs going to CrUX, add `--no-performance-crux`
4. Keep the default isolated profile; avoid `--autoConnect` / `--browserUrl` against your everyday browser

## Evidence

- Audited commit: [`6cfb34c0`](https://github.com/ChromeDevTools/chrome-devtools-mcp/tree/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3) (v1.11.0, released 2026-10-15)
- README "Usage statistics" section: [README.md#L41-L55](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3/README.md#L41-L55)
- Default `usageStatistics: true`: [src/config/mcp-options.ts#L146-L151](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3/src/config/mcp-options.ts#L146-L151)
- Env/CI opt-out: [src/config/ServerConfig.ts#L233-L240](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3/src/config/ServerConfig.ts#L233-L240)
- Clearcut endpoint: [src/telemetry/watchdog/ClearcutSender.ts#L27](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3/src/telemetry/watchdog/ClearcutSender.ts#L27)
- Event schema (`tool_params`, `is_localhost`, client name): [src/telemetry/types.ts#L10-L60](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3/src/telemetry/types.ts#L10-L60)
- Parameter sanitization and client-name redaction: [src/telemetry/transformation.ts](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3/src/telemetry/transformation.ts)
- `isolated` default: [src/config/mcp-options.ts#L268-L274](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3/src/config/mcp-options.ts#L268-L274)
- CrUX option and API call: [src/config/mcp-options.ts#L139](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3/src/config/mcp-options.ts#L139), [src/tools/performance.ts#L275](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/6cfb34c0e246abf6916c050cf43cd0f5d0f65bf3/src/tools/performance.ts#L275)
- Advisories: [GHSA-3pvj-jv98-qhjq / CVE-2026-53765](https://github.com/advisories/GHSA-3pvj-jv98-qhjq), [GHSA-8qf9-62x2-82pp / CVE-2026-53766](https://github.com/advisories/GHSA-8qf9-62x2-82pp)
- Star count: GitHub API, 53,908 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
