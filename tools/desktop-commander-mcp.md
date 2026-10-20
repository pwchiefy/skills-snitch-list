# Desktop Commander MCP

| Field | Value |
|-------|-------|
| Repository | https://github.com/wonderwhy-er/DesktopCommanderMCP |
| Type | MCP Server |
| Stars | 10.1K |
| Telemetry | Yes |
| Default State | ON |
| Analytics Providers | First-party telemetry proxy (`telemetry.desktopcommander.app`, Cloud Run fallback) feeding BigQuery; PRIVACY.md still names Google Analytics 4 |
| Disable Method | `"telemetryEnabled": false` in `~/.claude-server-commander/config.json`, ask the agent to disable telemetry, or env `DESKTOP_COMMANDER_DISABLE_TELEMETRY=1` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

Desktop Commander MCP is an MCP server that gives AI clients terminal command execution, persistent processes, file reading/writing with diff edits, code search, and Excel/PDF/DOCX handling on the local machine. Newer versions add "Remote MCP": a remote-device mode that lets ChatGPT, Claude web and other hosted AI services call tools on your machine through Desktop Commander's cloud service. Version audited: 0.3.0.

## Telemetry Details

- **Default state:** ON (opt-out). `config-manager.ts` sets `telemetryEnabled: true` by default; PRIVACY.md states "Data collection is opt-out"
- **Transport changed since March:** In March the source sent events directly to four Google Analytics 4 measurement IDs (`G-8L163XZ1CE`, `G-ZDF1M5403Z`, `G-F3GK01G39Y`, `G-MPFSWEGQ0T`) plus a Cloud Run proxy. Since PR #478 (2026-06-02, "route events through proxy") no GA4 measurement IDs remain in `src/`; events go to `https://telemetry.desktopcommander.app/mp/collect` with fallback `https://dc-telemetry-proxy-83847352264.europe-west1.run.app/mp/collect`. A code comment describes this as "direct BigQuery ingestion"
- **Docs/code mismatch:** PRIVACY.md still says telemetry is processed by Google Analytics 4 with 14-month GA retention. Whether the proxy still forwards to GA4 cannot be verified from the client source
- **Persistent client ID:** A random UUID stored in `~/.claude-server-commander/config.json`, used for MAU and retention metrics
- **Data collected (per PRIVACY.md):** event names, timestamps, OS, app version, MCP client name/version, Node/npm versions, install method, shell type, container detection, file extensions and sizes, base command names (no arguments), error types/codes and sanitized error messages
- **Redaction improvements since March:** PR #669 (2026-09-07) stopped sending `character_codes`, a character-frequency map of fuzzy-search diffs that the maintainers acknowledged was "close to recoverable content". September 2026 fixes (#760 and follow-ups) redact known tool-call paths and all user-text properties before send
- **Remote install funnel telemetry:** PR #736 (2026-09-21) added funnel events for Remote MCP installation

## Security Concerns

- **Full desktop control:** Arbitrary command execution and file read/write. `allowedDirectories` restricts file tools only; the README notes terminal commands can still reach files outside those directories
- **Remote MCP routes tool calls through a hosted service:** With `npx @wonderwhy-er/desktop-commander remote`, hosted AI services can invoke tools on your machine. The README states the service temporarily stores tool arguments and results in an `mcp_remote_calls` table (terminal rows eligible for deletion after one minute, one-hour backstop). This is functional data flow, not telemetry, but it means command arguments and outputs transit and briefly rest on a third-party server
- **Unauthenticated telemetry endpoint:** A source comment notes the bearer token was removed from the proxy, so the ingestion endpoint accepts unauthenticated POSTs. This is a data-integrity issue for the vendor, not a user-privacy leak
- **Docs drift:** Users relying on PRIVACY.md get an inaccurate description of where telemetry goes
- **Persistent tracking ID** enables long-term per-install usage analysis

## How to Opt Out

1. Ask the agent to "disable Desktop Commander telemetry", or edit `~/.claude-server-commander/config.json` and set `"telemetryEnabled": false`
2. For CI or one-off runs, set `DESKTOP_COMMANDER_DISABLE_TELEMETRY=1` (hard kill switch independent of config)
3. Restart the MCP server
4. Optionally delete the client ID from the config file
5. Verify no outbound connections to `telemetry.desktopcommander.app` or `dc-telemetry-proxy-83847352264.europe-west1.run.app`
6. Do not run `remote` mode unless you accept a hosted relay for tool calls

## Evidence

- Audited commit: [`b0d37f33`](https://github.com/wonderwhy-er/DesktopCommanderMCP/tree/b0d37f33fe5638fcb96edfcdd24d81945e348691) (2026-10-19, package.json 0.3.0)
- Proxy endpoints and env kill switch: [src/utils/capture.ts#L56-L74](https://github.com/wonderwhy-er/DesktopCommanderMCP/blob/b0d37f33fe5638fcb96edfcdd24d81945e348691/src/utils/capture.ts#L56-L74)
- Default ON: [src/config-manager.ts#L280](https://github.com/wonderwhy-er/DesktopCommanderMCP/blob/b0d37f33fe5638fcb96edfcdd24d81945e348691/src/config-manager.ts#L280)
- Privacy policy (opt-out, GA4 named as processor): [PRIVACY.md#L13](https://github.com/wonderwhy-er/DesktopCommanderMCP/blob/b0d37f33fe5638fcb96edfcdd24d81945e348691/PRIVACY.md#L13), [PRIVACY.md#L99](https://github.com/wonderwhy-er/DesktopCommanderMCP/blob/b0d37f33fe5638fcb96edfcdd24d81945e348691/PRIVACY.md#L99)
- March 2026 GA4 IDs (for comparison): [src/utils/capture.ts@d8548705#L405-L446](https://github.com/wonderwhy-er/DesktopCommanderMCP/blob/d854870577c2fd45c5a52670cfcc39b1918d035b/src/utils/capture.ts#L405-L446)
- Route events through proxy: commit [`ce4669cc`](https://github.com/wonderwhy-er/DesktopCommanderMCP/commit/ce4669cca7a0) (#478)
- `character_codes` removal: commit [`1316c6c6`](https://github.com/wonderwhy-er/DesktopCommanderMCP/commit/1316c6c6a6d0) (#669)
- Remote call retention: [README.md#L814-L816](https://github.com/wonderwhy-er/DesktopCommanderMCP/blob/b0d37f33fe5638fcb96edfcdd24d81945e348691/README.md#L814-L816)
- v0.3.0 release notes: https://github.com/wonderwhy-er/DesktopCommanderMCP/releases/tag/v0.3.0
- Star count: GitHub API, 10,105 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at b0d37f33 (v0.3.0). Stars 5.7K -> 10.1K. Direct GA4 sends (4 measurement IDs) replaced by a first-party proxy at telemetry.desktopcommander.app (June 2026); PRIVACY.md still names GA4. Added `DESKTOP_COMMANDER_DISABLE_TELEMETRY` env kill switch, `character_codes` removal and path/user-text redaction fixes, and the Remote MCP hosted relay. Still ON by default.
