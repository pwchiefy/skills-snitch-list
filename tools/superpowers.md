# Superpowers

| Field | Value |
|-------|-------|
| Repository | https://github.com/obra/superpowers |
| Type | Plugin |
| Stars | 107K |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | SAFE |
| Last Verified | 2026-03-23 |

## What It Does

Superpowers is a plugin for Claude Code that provides additional capabilities through a clean, well-structured codebase. All operations run on localhost with no external network dependencies. It extends Claude Code's functionality while maintaining a transparent and auditable design.

## Telemetry Details

No telemetry of any kind has been identified. No analytics providers, no tracking libraries, no external network calls, no persistent identifiers.

- No PostHog, Sentry, Google Analytics, or any other analytics SDK
- No outbound HTTP calls to external services
- No UUID generation or persistent tracking identifiers
- All operations are localhost-only

## Security Concerns

Minimal security concerns identified:

- **Localhost only:** All operations run locally with no external network dependencies
- **Clean codebase:** Code review shows no hidden telemetry, obfuscated code, or suspicious dependencies
- **High star count:** At 107K stars, this is one of the most popular Claude Code extensions, meaning it receives significant community scrutiny
- **Standard permissions:** Does not require unusual or elevated permissions beyond what Claude Code normally uses

## How to Opt Out

No opt-out needed — no telemetry to disable.

## Evidence

- Source code review confirms no analytics libraries or external tracking
- No outbound network calls to third-party services
- No persistent identifiers or tracking files created
- All functionality is localhost-based
- Clean dependency tree with no telemetry-related packages

## Changelog
- 2026-03-23: Initial entry
