# Windows MCP

| Field | Value |
|-------|-------|
| Repository | https://github.com/CursorTouch/Windows-MCP |
| Type | MCP Server |
| Stars | 9.7K |
| Telemetry | Yes |
| Default State | ON |
| Analytics Providers | PostHog (GeoIP enabled, person profiles, exception autocapture) |
| Disable Method | Set env `ANONYMIZED_TELEMETRY=false` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

Windows-MCP is an MCP server for computer use on Windows: it reads the UI Automation tree, takes screenshots, and drives mouse and keyboard input, and it also exposes PowerShell, app launch, process, clipboard, notification and registry tools. It can run over stdio (default) or be exposed over SSE / streamable HTTP. Version audited: 0.8.8. The repository is `CursorTouch/Windows-MCP`; the `SimonB97/Windows-MCP` URL used in our March entry returns 404.

## Telemetry Details

- **PostHog analytics:** Client created in `PostHogAnalytics` with host `https://us.i.posthog.com`
- **GeoIP enabled:** `disable_geoip=False`, so PostHog enriches events with location derived from the sender IP
- **Person profiles:** Events are sent with `process_person_profile: True`, keyed to a persistent UUIDv7 stored in `.windows-mcp-user-id` in the config directory (file mode 0600)
- **Exception autocapture:** `enable_exception_autocapture=True`; `track_error` also sends `str(error)`. SECURITY.md acknowledges OS error messages may include local file paths
- **Documented as collected:** tool name, success/failure, duration, client name/version, session ID
- **Documented as not collected:** tool arguments (typed text, coordinates, paths) and tool outputs (screenshots, command results)
- **API key:** Since PR #244 (2026-05-16) the PostHog write key can be overridden with `POSTHOG_API_KEY` (empty string skips client init) and the host with `POSTHOG_HOST`; the project key remains the built-in default
- **Opt-out exists, and existed in March:** `__main__.py` only creates the PostHog client when `ANONYMIZED_TELEMETRY` is not `false`. This check was already present at the last commit before our March audit (`8188c9da`, 2026-03-22) and SECURITY.md has documented it since at least 2025-12-19. Our March claim of "no opt-out" was wrong

## Security Concerns

- **On by default with location and profiling:** Opt-out exists but users who never read the README send PostHog events with GeoIP enrichment and person profiles
- **Error text may contain paths:** Exception autocapture and `str(error)` can carry local file paths or other details from OS error messages
- **Full computer control:** Screenshots, keystrokes, PowerShell and registry access give this server broad reach over the desktop and anything visible on screen
- **Network transports:** SSE and streamable HTTP transports make the server reachable over the network. Authentication (`WINDOWS_MCP_AUTH_KEY`, OAuth) and IP allowlists are available but optional; exposing these transports without them would allow remote desktop control
- **Tool gating:** A control policy (`relaxed` default, `balanced`, `strict`) and `WINDOWS_MCP_EXCLUDE_TOOLS` can limit which tools run without confirmation. The default `relaxed` policy allows direct input tools without a gate

## How to Opt Out

1. Add `"ANONYMIZED_TELEMETRY": "false"` to the server's `env` block in your MCP client config
2. Alternatively set `POSTHOG_API_KEY` to an empty string, which skips PostHog client initialization
3. Restart the server
4. Optionally delete `.windows-mcp-user-id` from the config directory
5. Defense in depth: block `us.i.posthog.com` at the firewall or DNS level

## Evidence

- Audited commit: [`d13c9bbb`](https://github.com/CursorTouch/Windows-MCP/tree/d13c9bbb6ea56240794ce0c3fabf836510ac9a5b) (2026-10-20, pyproject 0.8.8)
- PostHog client, GeoIP, autocapture: [src/windows_mcp/infrastructure/analytics.py#L44-L67](https://github.com/CursorTouch/Windows-MCP/blob/d13c9bbb6ea56240794ce0c3fabf836510ac9a5b/src/windows_mcp/infrastructure/analytics.py#L44-L67)
- Person profiles and error payload: [analytics.py#L104-L136](https://github.com/CursorTouch/Windows-MCP/blob/d13c9bbb6ea56240794ce0c3fabf836510ac9a5b/src/windows_mcp/infrastructure/analytics.py#L104-L136)
- Opt-out gate: [src/windows_mcp/__main__.py#L331-L332](https://github.com/CursorTouch/Windows-MCP/blob/d13c9bbb6ea56240794ce0c3fabf836510ac9a5b/src/windows_mcp/__main__.py#L331-L332)
- Opt-out gate as of March 2026: [src/windows_mcp/__main__.py@8188c9da#L37-L38](https://github.com/CursorTouch/Windows-MCP/blob/8188c9da371ec5eb7d9f87ef569011a3b90ece86/src/windows_mcp/__main__.py#L37-L38)
- Telemetry disclosure: [SECURITY.md#L269-L288](https://github.com/CursorTouch/Windows-MCP/blob/d13c9bbb6ea56240794ce0c3fabf836510ac9a5b/SECURITY.md#L269-L288), [README.md#L766-L772](https://github.com/CursorTouch/Windows-MCP/blob/d13c9bbb6ea56240794ce0c3fabf836510ac9a5b/README.md#L766-L772)
- Key moved to env var: commit [`67df6eca`](https://github.com/CursorTouch/Windows-MCP/commit/67df6eca08ab) (#244)
- Star count: GitHub API, 9,673 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at d13c9bbb (v0.8.8). Corrected repository to CursorTouch/Windows-MCP (SimonB97 URL is 404). Corrected the "no opt-out" claim: `ANONYMIZED_TELEMETRY=false` disables PostHog and was already present in March. PostHog key now overridable via env (May 2026). GeoIP, person profiles and default-ON unchanged. Risk lowered CRITICAL -> HIGH. Stars 4.8K -> 9.7K.
