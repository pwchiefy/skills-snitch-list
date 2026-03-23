# Desktop Commander MCP

| Field | Value |
|-------|-------|
| Repository | https://github.com/wonderwhy-er/DesktopCommanderMCP |
| Type | MCP Server |
| Stars | 5.7K |
| Telemetry | Yes |
| Default State | ON |
| Analytics Providers | Google Analytics (4 properties), BigQuery (via custom proxy) |
| Disable Method | Set `telemetryEnabled: false` in `~/.claude-server-commander/config.json` |
| Risk Level | HIGH |
| Last Verified | 2026-03-23 |

## What It Does

Desktop Commander MCP is an MCP server that gives Claude Code the ability to execute terminal commands, manage files, search codebases, and control desktop applications. It provides persistent terminal sessions, diff-based file editing, and process management.

## Telemetry Details

- **Google Analytics:** 4 separate GA4 measurement IDs are configured, suggesting data flows to multiple analytics properties or accounts
- **BigQuery proxy:** A custom telemetry proxy is deployed at `dc-telemetry-proxy-83847352264.europe-west1.run.app` (Google Cloud Run, Europe West 1 region). This proxy was built specifically to bypass the GA4 free tier limit of 1 million events per day
- **Persistent UUID:** A unique user identifier is generated and stored at `~/.claude-server-commander/config.json`. This UUID persists across sessions and is included with all telemetry events
- **Default state:** Telemetry is ON by default. Users must actively opt out
- **Data collected:** Tool invocations, command executions, session metadata, and usage patterns are tracked

## Security Concerns

- **Full desktop control:** This MCP server has the ability to execute arbitrary commands, read/write files, and manage processes. Combined with telemetry, this means a detailed profile of developer activity is transmitted to external servers
- **Custom BigQuery proxy:** The existence of a purpose-built proxy to circumvent GA4 rate limits indicates high-volume data collection that exceeds what Google Analytics considers normal for a single application
- **4 GA4 properties:** Multiple analytics properties suggest data is being sent to different destinations or being segmented in ways that are not transparent to users
- **Persistent tracking:** The UUID in `~/.claude-server-commander/config.json` enables long-term user tracking across all sessions
- **Cloud Run proxy location:** The proxy runs in `europe-west1`, but the operator and data access policies are determined by the deployer, not by geography
- **No transparency on proxy data handling:** The BigQuery proxy is a black box — users have no visibility into what the proxy logs, stores, or forwards beyond GA4

## How to Opt Out

1. Open or create `~/.claude-server-commander/config.json`
2. Set `"telemetryEnabled": false`
3. Restart the MCP server for changes to take effect
4. Optionally, delete the persistent UUID from the config file to break historical tracking association
5. Verify no outbound connections to `dc-telemetry-proxy-83847352264.europe-west1.run.app` or Google Analytics endpoints

## Evidence

- Config file location: `~/.claude-server-commander/config.json`
- BigQuery proxy endpoint: `https://dc-telemetry-proxy-83847352264.europe-west1.run.app`
- 4 Google Analytics GA4 measurement IDs configured in source code
- Proxy purpose: bypass GA4 1M events/day free tier limit
- Telemetry is enabled by default; opt-out requires manual config edit

## Changelog
- 2026-03-23: Initial entry
