# Graphiti MCP Server (Zep)

| Field | Value |
|-------|-------|
| Repository | https://github.com/getzep/graphiti (MCP server in `mcp_server/`) |
| Type | MCP Server / Memory library |
| Stars | 32K |
| Telemetry | Yes (minimal: one initialization event) |
| Default State | ON (opt-out; documented in README and MCP server README) |
| Analytics Providers | PostHog (`us.i.posthog.com`) |
| Disable Method | Env `GRAPHITI_TELEMETRY_ENABLED=false` |
| Risk Level | LOW |
| Last Verified | 2026-10-20 |

## What It Does

Graphiti builds temporally-aware knowledge graphs from conversations and documents for agent memory. The bundled MCP server exposes add-episode, search and graph-management tools to Claude Code, Cursor and other clients, backed by Neo4j, FalkorDB, Kuzu or Amazon Neptune, and an LLM/embedding provider you configure.

## Telemetry Details

- **Provider:** PostHog, hardcoded key, host `https://us.i.posthog.com`
- **Default:** `GRAPHITI_TELEMETRY_ENABLED` defaults to `true` (disabled automatically under pytest)
- **One event:** `graphiti_initialized` when a `Graphiti` instance is created, with LLM/embedder/reranker/database provider types, Graphiti version and CPU architecture, sent with `$process_person_profile: False`
- **Identifier:** Random UUID in `~/.cache/graphiti/telemetry_anon_id`
- **Not collected (per README):** graph content, queries, API keys, IP addresses (client-side), file paths. Our read of the code matches: the event payload contains only the fields above

## Security Concerns

- **Telemetry is small and documented**; the larger consideration is the data path: every episode you add is sent to your configured LLM and embedding providers for entity extraction, and stored in the graph database
- **Shared memory as an injection surface:** Content written into the graph is retrieved into later agent contexts. Treat graph contents from untrusted sources as untrusted input
- **Database credentials:** The MCP server needs database and LLM API credentials in its environment

## How to Opt Out

1. Set `GRAPHITI_TELEMETRY_ENABLED=false` in the MCP server environment or its `.env` file
2. Or set it in your shell profile so library use is covered too

## Evidence

- Audited commit: [`3cc723cd`](https://github.com/getzep/graphiti/tree/3cc723cd292eb5c2ac5ea2c5539270b8e1b6389f) (latest release v0.31.1, 2026-10-15; `mcp_server` 1.1.1)
- Key, host, env switch and default: [graphiti_core/telemetry/telemetry.py#L18-L36](https://github.com/getzep/graphiti/blob/3cc723cd292eb5c2ac5ea2c5539270b8e1b6389f/graphiti_core/telemetry/telemetry.py#L18-L36)
- Event properties: [telemetry.py#L92-L118](https://github.com/getzep/graphiti/blob/3cc723cd292eb5c2ac5ea2c5539270b8e1b6389f/graphiti_core/telemetry/telemetry.py#L92-L118), call site [graphiti_core/graphiti.py#L395-L407](https://github.com/getzep/graphiti/blob/3cc723cd292eb5c2ac5ea2c5539270b8e1b6389f/graphiti_core/graphiti.py#L395-L407)
- Disclosure: [README.md#L782-L850](https://github.com/getzep/graphiti/blob/3cc723cd292eb5c2ac5ea2c5539270b8e1b6389f/README.md#L782-L850), [mcp_server/README.md#L700-L712](https://github.com/getzep/graphiti/blob/3cc723cd292eb5c2ac5ea2c5539270b8e1b6389f/mcp_server/README.md#L700-L712)
- Star count: GitHub API, 32,078 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
