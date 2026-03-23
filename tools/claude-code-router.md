# Claude Code Router

| Field | Value |
|-------|-------|
| Repository | https://github.com/musistudio/claude-code-router |
| Type | Proxy |
| Stars | 30K |
| Telemetry | No (traditional) |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | CRITICAL |
| Last Verified | 2026-03-23 |

## What It Does

Claude Code Router is an API proxy that sits between Claude Code and the Anthropic API. It intercepts all API traffic and routes requests to non-Anthropic providers (such as OpenAI-compatible endpoints, local models, or other LLM services). The stated goal is to allow users to use Claude Code's interface with alternative model providers.

## Telemetry Details

No traditional telemetry or analytics providers have been identified. However, the proxy architecture itself is the concern — it is a man-in-the-middle (MITM) on all communication between Claude Code and the API backend.

## Security Concerns

- **MITM on all API traffic:** By design, claude-code-router intercepts every request and response between Claude Code and the model API. This gives the proxy full visibility into:
  - All prompts (including system prompts, user messages, and tool results)
  - All code being written, reviewed, or modified
  - All file contents that Claude reads or generates
  - All tool call parameters and results
  - Anthropic API keys (passed through the proxy for authentication)
- **API key exposure:** Users must configure their API key to pass through the proxy. The proxy has access to the raw API key and could log, store, or forward it
- **Prompt/code exfiltration surface:** Even without intentional telemetry, the proxy is the ideal position for exfiltrating code and prompts. A compromised version of this tool could silently copy all traffic to a third-party server
- **Non-Anthropic routing:** Requests routed to alternative providers mean your code and prompts are sent to services with different privacy policies, data retention practices, and security postures than Anthropic
- **No end-to-end encryption:** The proxy terminates TLS, decrypts traffic, and re-encrypts it for the destination. There is no end-to-end encryption between Claude Code and the final API endpoint
- **Supply chain risk:** At 30K stars, this is a high-value target. A single malicious dependency update could add silent data exfiltration
- **Trust model inversion:** Claude Code users trust Anthropic's API security. This proxy replaces that trust relationship with trust in the proxy operator and whatever alternative providers are configured

## How to Opt Out

The only way to opt out is to not use the proxy:

1. Remove claude-code-router from your configuration
2. Point Claude Code directly at the Anthropic API (`https://api.anthropic.com`)
3. Rotate any API keys that were previously configured to pass through the proxy
4. Review proxy logs (if any exist locally) for captured data that should be cleaned up

If you must use a routing proxy:

1. Audit the source code of the specific version you are running
2. Pin the version and do not auto-update
3. Monitor outbound network connections for unexpected destinations
4. Use separate API keys that can be rotated independently
5. Never route traffic containing sensitive credentials or proprietary code through untrusted intermediaries

## Evidence

- Architecture: HTTP(S) proxy sitting between Claude Code and API endpoints
- Intercepts and decrypts all API traffic by design
- Routes requests to non-Anthropic providers
- API keys pass through the proxy in plaintext (within the TLS session)
- All prompts, code, and tool results are visible to the proxy
- No analytics providers detected, but the proxy position itself is the risk

## Changelog
- 2026-03-23: Initial entry
