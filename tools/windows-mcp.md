# Windows MCP

| Field | Value |
|-------|-------|
| Repository | https://github.com/SimonB97/Windows-MCP |
| Type | MCP Server |
| Stars | 4.8K |
| Telemetry | Yes |
| Default State | ON |
| Analytics Providers | PostHog (with GeoIP enrichment and user profiling) |
| Disable Method | None — no opt-out mechanism provided |
| Risk Level | CRITICAL |
| Last Verified | 2026-03-23 |

## What It Does

Windows MCP is an MCP server that provides Claude Code with Windows-specific system management capabilities including file operations, registry editing, process management, and system configuration. It targets Windows developers and system administrators.

## Telemetry Details

- **PostHog analytics:** Fully integrated PostHog client with a hardcoded API key embedded in the source code
- **GeoIP enrichment:** PostHog's GeoIP feature is active, meaning every telemetry event is enriched with the user's approximate geographic location derived from their IP address
- **User profiling:** PostHog's user profiling capabilities are in use, building persistent profiles of individual users across sessions
- **Data collected:**
  - Tool executions (which MCP tools are called, how often, with what parameters)
  - Error events and stack traces
  - Session data (start, end, duration, activity patterns)
  - Geographic location (via GeoIP on IP address)
- **No opt-out:** There is no configuration flag, environment variable, or documented method to disable telemetry. The PostHog API key is hardcoded
- **Default state:** Always ON with no way to turn it OFF

## Security Concerns

- **No opt-out is the critical issue.** Users cannot disable telemetry without modifying source code. This violates basic privacy expectations and potentially regulations like GDPR
- **Hardcoded PostHog key:** The API key is embedded directly in source code rather than loaded from configuration, making it impossible to disable without code changes
- **GeoIP tracking:** Every event carries location data, creating a geographic profile of the user
- **Windows system access + telemetry:** The MCP server has access to sensitive Windows operations (registry, processes, files) and reports usage back to external servers. This combination means the telemetry reveals detailed information about the user's system configuration and activities
- **User profiling:** PostHog builds persistent user profiles, enabling long-term behavioral analysis across sessions
- **Parameter logging risk:** If tool parameters are included in telemetry events, sensitive data like file paths, registry keys, and system configuration details could be transmitted

## How to Opt Out

There is no supported opt-out mechanism. Possible workarounds:

1. **Modify source code:** Fork the repository and remove the PostHog integration
2. **Network blocking:** Block outbound connections to PostHog endpoints (`app.posthog.com`, `us.posthog.com`, `eu.posthog.com`) via firewall rules or hosts file
3. **DNS sinkhole:** Add PostHog domains to a Pi-hole or similar DNS-level blocker
4. **Do not use:** Given the lack of opt-out, the safest option is to use an alternative MCP server

## Evidence

- PostHog API key hardcoded in source code (not configurable)
- GeoIP enrichment active on PostHog project configuration
- User profiling enabled in PostHog integration
- No telemetry configuration flag, environment variable, or CLI option exists in the codebase
- Events tracked: tool executions, errors, sessions, location data

## Changelog
- 2026-03-23: Initial entry
