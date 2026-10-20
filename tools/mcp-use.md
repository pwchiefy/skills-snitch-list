# mcp-use

| Field | Value |
|-------|-------|
| Repository | https://github.com/mcp-use/mcp-use |
| Type | MCP SDK / Agent framework (Python + TypeScript), MCP Inspector |
| Stars | 10.8K |
| Telemetry | Yes |
| Default State | ON (opt-out; an info log line announces it) |
| Analytics Providers | PostHog EU (`eu.i.posthog.com`, GeoIP not disabled in Python), Scarf (`mcpuse.gateway.scarf.sh`) |
| Disable Method | Env `MCP_USE_ANONYMIZED_TELEMETRY=false` (browser builds: `localStorage` key or `window.__MCP_USE_ANONYMIZED_TELEMETRY__ = false`) |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

An open-source library for connecting any LLM to MCP servers (`MCPAgent`, `MCPClient`), plus a TypeScript server framework, a `create-mcp-use-app` scaffolder and a web MCP Inspector. It is used to build custom agents and MCP servers rather than installed into Claude Code directly, but agents and servers built on it inherit its telemetry.

## Telemetry Details

- **Python library (`mcp_use` 1.7.1 in repo):**
  - PostHog project key hardcoded; host `https://eu.i.posthog.com`; client created with `disable_geoip=False`
  - Persistent random user ID stored under the user cache directory (`mcp_use_3/telemetry_user_id`)
  - `MCPAgent.run()` sends an `MCPAgentExecutionEvent` whose fields include **`query` (the user's prompt text) and `response` (the agent's final output)**, model provider/name, server identifiers, tools used, step counts and timing. `capture()` serializes the whole dataclass with `asdict()`, so both strings are included
  - Server-side events for tool, resource and prompt calls
- **TypeScript packages (client 2.4.5 in repo):** Same PostHog project and EU host. The server-side usage module filters property names matching a content pattern (`arguments`, `query`, `response`, `path`, `url`, `token`, and others) before sending
- **Default:** ON in both languages unless `MCP_USE_ANONYMIZED_TELEMETRY=false`

## Security Concerns

- **"Anonymized" telemetry includes prompt and response text.** In the Python agent, whatever a user asks and whatever the agent answers, including code, file contents or secrets that surfaced in the answer, is sent to a third-party analytics service by default
- **Transitive exposure:** Developers who ship an agent built on `mcp_use` may not realise their own users' queries go to the library author's PostHog project
- **GeoIP on:** Combined with a persistent user ID, events can be tied to an approximate location
- **Past supply-chain hit:** The official `create-mcp-use-app` scaffolder versions 0.5.3 and 0.5.4 are listed in the GitHub malware feed as compromised by the "Sha1-Hulud: The Second Coming" npm worm. Avoid those versions and pin scaffolder versions

## How to Opt Out

1. Export `MCP_USE_ANONYMIZED_TELEMETRY=false` in every environment that imports the library (dev machines, CI, production)
2. In browser builds, set `localStorage.MCP_USE_ANONYMIZED_TELEMETRY = "false"` or `window.__MCP_USE_ANONYMIZED_TELEMETRY__ = false` before the client loads
3. If you ship a product on mcp-use, set the variable in your own process so your users are not opted in on your behalf
4. Network fallback: block `eu.i.posthog.com` and `mcpuse.gateway.scarf.sh`

## Evidence

- Audited commit: [`20f35582`](https://github.com/mcp-use/mcp-use/tree/20f35582fbd3ceb05a01025295ac9e22d626a9cf) (latest release tag `mcp-use@2.11.0`, 2026-10-19)
- Python key, host, Scarf gateway, env switch, `disable_geoip=False`: [libraries/python/mcp_use/telemetry/telemetry.py#L126-L153](https://github.com/mcp-use/mcp-use/blob/20f35582fbd3ceb05a01025295ac9e22d626a9cf/libraries/python/mcp_use/telemetry/telemetry.py#L126-L153)
- `capture()` uses `asdict(event)`: [telemetry.py#L218-L239](https://github.com/mcp-use/mcp-use/blob/20f35582fbd3ceb05a01025295ac9e22d626a9cf/libraries/python/mcp_use/telemetry/telemetry.py#L218-L239)
- Event schema with `query` and `response`: [libraries/python/mcp_use/telemetry/events.py#L31-L56](https://github.com/mcp-use/mcp-use/blob/20f35582fbd3ceb05a01025295ac9e22d626a9cf/libraries/python/mcp_use/telemetry/events.py#L31-L56)
- Call site passing the user query and agent output: [libraries/python/mcp_use/agents/mcpagent.py#L558-L570](https://github.com/mcp-use/mcp-use/blob/20f35582fbd3ceb05a01025295ac9e22d626a9cf/libraries/python/mcp_use/agents/mcpagent.py#L558-L570)
- TypeScript client key/host and opt-out checks: [libraries/typescript/packages/client/src/telemetry/telemetry.ts#L50-L51](https://github.com/mcp-use/mcp-use/blob/20f35582fbd3ceb05a01025295ac9e22d626a9cf/libraries/typescript/packages/client/src/telemetry/telemetry.ts#L50-L51), [#L145-L165](https://github.com/mcp-use/mcp-use/blob/20f35582fbd3ceb05a01025295ac9e22d626a9cf/libraries/typescript/packages/client/src/telemetry/telemetry.ts#L145-L165)
- TypeScript server usage filter: [libraries/typescript/packages/server/src/usage.ts](https://github.com/mcp-use/mcp-use/blob/20f35582fbd3ceb05a01025295ac9e22d626a9cf/libraries/typescript/packages/server/src/usage.ts)
- Compromised scaffolder version (create-mcp-use-app 0.5.3 and 0.5.4): [GHSA-5m22-mf99-fvwv](https://github.com/advisories/GHSA-5m22-mf99-fvwv)
- Star count: GitHub API, 10,790 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
