# Context7 MCP

| Field | Value |
|-------|-------|
| Repository | https://github.com/upstash/context7 |
| Type | MCP Server + Plugins/Skills (Claude Code, Cursor, Codex, Copilot, Antigravity) |
| Stars | 63K |
| Telemetry | No (traditional); every lookup is a functional request to Upstash's API |
| Default State | N/A (OpenTelemetry instrumentation exports only where you configure it) |
| Analytics Providers | None found; requests go to `context7.com` with client IDE/version headers |
| Disable Method | N/A; `OTEL_SDK_DISABLED=true` turns off the local OpenTelemetry instrumentation |
| Risk Level | MEDIUM |
| Last Verified | 2026-10-20 |

## What It Does

Context7 fetches up-to-date library documentation and code examples into the agent's context. The MCP server (`@upstash/context7-mcp`) exposes library search and docs tools; the repository also ships plugins and skills for several agent hosts and a CLI. Documentation is served from Upstash's hosted index at `context7.com`, which anyone can add libraries to.

## Telemetry Details

- No third-party analytics SDK was found in the MCP package. OpenTelemetry instrumentation exists for operators (Prometheus/OTLP exporters you configure); `OTEL_SDK_DISABLED=true` disables it
- **Functional data flow:** Library search sends the agent-written `query` (usually a paraphrase of what you are working on) and `libraryName` to `https://context7.com/api/v2/libs/search`, with headers identifying the source (`mcp-server`), server version, client IDE and version, plugin, session ID, and your API key if configured. This is necessary for the product, but your task descriptions reach Upstash

## Security Concerns

- **Third-party text injected into your agent's context by design.** Documentation and per-library "Custom Rules" are written by whoever registered the library
- **ContextCrush (CVE-2026-75130):** Noma Security showed that Custom AI Instructions for a library were delivered unfiltered through the MCP server to every agent that queried it. Their proof of concept made an agent read `.env` files, send them to an attacker-controlled GitHub repository and delete local files. Noma reported it on 2026-02-18; Upstash shipped rule sanitization and guardrails on 2026-02-23; disclosure was 2026-03-05. NVD lists Context7 through 2.1.2 as affected. Upstash reported no evidence of exploitation
- **Trust signals can be bought or faked:** Noma notes that an attacker with a purchased, high-reputation account could register a malicious library, and that GitHub stars and activity can be inflated, so popularity in the index is not a safety signal
- **Remote server option:** Using the hosted endpoint (`mcp.context7.com`) instead of the local package moves tool execution to Upstash's infrastructure

## How to Opt Out

1. Keep the local MCP package updated (current release line is 4.x; the fix for CVE-2026-75130 shipped server-side and in 2.1.3+)
2. Prefer libraries from official publishers; treat retrieved docs as untrusted input
3. Avoid Context7 lookups in sessions with access to secrets, or run them with a deny rule on `.env` reads and the sandbox network allowlist enabled
4. Set `OTEL_SDK_DISABLED=true` if you do not want the local OpenTelemetry instrumentation

## Evidence

- Audited commit: [`4ac51399`](https://github.com/upstash/context7/tree/4ac51399a2a752bfcb3caa9d8efc09dcbd8453dd) (`packages/mcp` 4.4.4)
- Search request with `query` and `libraryName`: [packages/mcp/src/lib/api.ts#L140-L160](https://github.com/upstash/context7/blob/4ac51399a2a752bfcb3caa9d8efc09dcbd8453dd/packages/mcp/src/lib/api.ts#L140-L160)
- Request headers (IDE, version, plugin, session ID, API key): [packages/mcp/src/lib/encryption.ts#L55-L82](https://github.com/upstash/context7/blob/4ac51399a2a752bfcb3caa9d8efc09dcbd8453dd/packages/mcp/src/lib/encryption.ts#L55-L82)
- Endpoints: [packages/mcp/src/lib/constants.ts#L10-L12](https://github.com/upstash/context7/blob/4ac51399a2a752bfcb3caa9d8efc09dcbd8453dd/packages/mcp/src/lib/constants.ts#L10-L12)
- OpenTelemetry switch: [packages/mcp/src/lib/telemetry-config.ts#L1-L3](https://github.com/upstash/context7/blob/4ac51399a2a752bfcb3caa9d8efc09dcbd8453dd/packages/mcp/src/lib/telemetry-config.ts#L1-L3)
- ContextCrush disclosure and timeline: https://noma.security/blog/contextcrush-context7-the-mcp-server-vulnerability/
- CVE record: https://nvd.nist.gov/vuln/detail/CVE-2026-75130 (published 2026-08-18); VulnCheck advisory: https://www.vulncheck.com/advisories/context7-prompt-injection-via-custom-ai-instructions
- Star count: GitHub API, 63,354 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
