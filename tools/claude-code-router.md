# Claude Code Router

| Field | Value |
|-------|-------|
| Repository | https://github.com/musistudio/claude-code-router |
| Type | Proxy |
| Stars | 38K |
| Telemetry | No (traditional) |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | CRITICAL |
| Last Verified | 2026-10-20 |

## What It Does

Claude Code Router (CCR) is a local model gateway and control plane for coding agents. Claude Code (and Codex, Grok CLI, Kimi CLI, OpenCode and other clients) point at one local endpoint, by default `http://127.0.0.1:3456`, and CCR routes each request to a configured upstream provider and model. Since v3 it ships as an Electron desktop app (recommended), an npm CLI with a browser management UI on `127.0.0.1:3458`, and a Docker image. Version audited: 3.1.3.

## Telemetry Details

No analytics SDKs (PostHog, Sentry, Mixpanel, Amplitude, Google Analytics, Segment) were found in the source tree. Occurrences of "telemetry" are UI components and tests for CCR's own local request logs, token rate and cost displays (added v3.1.1, "live token rate tracking and stream metrics"), which are shown locally.

The proxy architecture is still the concern: CCR sees every request and response between the agent and the model provider.

## Security Concerns

- **Full visibility of agent traffic:** Every prompt, system prompt, tool call and result, file content Claude reads, and model response passes through CCR. Route plugins receive complete request headers, which the docs note can include authentication, cookies and API keys
- **Imports local agent sign-ins:** The Providers page can import credentials from other tools on the machine, including Claude Code's local OAuth credentials (imported as a "Claude Code API" provider), Kimi CLI OAuth/API keys, and Grok OAuth. CCR then holds and uses those tokens
- **Chrome login-state import:** CCR Desktop can create a Chrome login-state import job that reads cookies and localStorage for listed domains via a Chrome extension and writes them into CCR's in-app browser partition (used for provider usage pages and ToolHub browser automation)
- **Non-Anthropic routing:** Requests routed to alternative providers are governed by those providers' privacy policies, retention and security
- **Local plain-HTTP hop:** The agent talks to CCR over plain HTTP on loopback; CCR makes the outbound TLS connection to the upstream provider. There is no end-to-end encryption between the agent and the final provider. (Our March wording described CCR as terminating TLS; in the default setup it is a local base-URL gateway, not a TLS interceptor.)
- **Remote exposure:** The Docker deployment exposes the management UI and gateway routes; the README advises reading the deployment guide before exposing CCR remotely
- **Supply chain risk:** About 38K stars, an Electron auto-update channel and third-party gateway plugins make this a high-value target

## How to Opt Out

The only way to opt out is to not use the proxy:

1. Remove CCR from your agent configuration and point the agent back at its provider (for Claude Code, unset `ANTHROPIC_BASE_URL` or set it to `https://api.anthropic.com`)
2. Rotate any API keys or OAuth sessions that CCR imported or held, including Claude Code credentials if you used the import feature
3. Delete CCR's local request logs and in-app browser data

If you must use a routing proxy:

1. Pin the version and review changes before updating
2. Do not import Claude Code or other agent sign-ins; use dedicated API keys you can rotate independently
3. Do not use Chrome login-state import
4. Keep the gateway bound to loopback, and monitor outbound connections for unexpected destinations

## Evidence

- Audited commit: [`057abaa1`](https://github.com/musistudio/claude-code-router/tree/057abaa1f95519ab8faf999e1ccef2b80ccdeb9e) (2026-10-10, v3.1.3)
- Product description and local endpoints: [README.md#L30](https://github.com/musistudio/claude-code-router/blob/057abaa1f95519ab8faf999e1ccef2b80ccdeb9e/README.md#L30), [README.md#L175-L198](https://github.com/musistudio/claude-code-router/blob/057abaa1f95519ab8faf999e1ccef2b80ccdeb9e/README.md#L175-L198)
- Local agent login import (Claude Code OAuth): [docs/src/content/docs/en/configuration/providers.md#L8-L14](https://github.com/musistudio/claude-code-router/blob/057abaa1f95519ab8faf999e1ccef2b80ccdeb9e/docs/src/content/docs/en/configuration/providers.md#L8-L14)
- Chrome login-state import: [providers.md#L179-L189](https://github.com/musistudio/claude-code-router/blob/057abaa1f95519ab8faf999e1ccef2b80ccdeb9e/docs/src/content/docs/en/configuration/providers.md#L179-L189)
- Route plugins receive full headers: [docs/src/content/docs/en/configuration/routing.md#L122](https://github.com/musistudio/claude-code-router/blob/057abaa1f95519ab8faf999e1ccef2b80ccdeb9e/docs/src/content/docs/en/configuration/routing.md#L122)
- Source scan for analytics SDKs: no matches outside local UI/test files (grep of `posthog|sentry|mixpanel|amplitude|google-analytics|gtag|telemetry` at the audited commit)
- Star count: GitHub API, 37,770 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at 057abaa1 (v3.1.3). Still no analytics SDKs. Product is now a desktop/CLI gateway for many agents. Added: import of local Claude Code/Kimi/Grok OAuth credentials, Chrome cookie/localStorage import, full-header access for route plugins. Corrected the TLS wording (loopback HTTP gateway, not TLS interception). Stars 30K -> 38K.
