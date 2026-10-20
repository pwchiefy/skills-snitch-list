# XcodeBuild MCP (now MobileBuildMCP)

| Field | Value |
|-------|-------|
| Repository | https://github.com/getsentry/MobileBuildMCP |
| Type | MCP Server |
| Stars | 6.5K |
| Telemetry | Yes |
| Default State | ON |
| Analytics Providers | Sentry |
| Disable Method | `MOBILEBUILDMCP_SENTRY_DISABLED=true`, `SENTRY_DISABLED=true`, or `sentryDisabled: true` in `.mobilebuildmcp/config.yaml` (the old `xcodebuildmcp` package uses `XCODEBUILDMCP_SENTRY_DISABLED`) |
| Risk Level | MEDIUM |
| Last Verified | 2026-10-20 |

## What It Does

An MCP server and CLI that lets agents build, run, test and debug Xcode projects: simulator and device builds, test runs, log capture, LLDB debugging and UI automation. It was created by Cameron Cooke (`cameroncooke/XcodeBuildMCP`), moved to the `getsentry` organization, and was renamed to MobileBuildMCP in v2.7.1 (2026-09-23). Old URLs redirect. The `nicklama/XcodeBuildMCP` URL used in our March entry and README returns 404.

## Telemetry Details

- **Sentry SDK:** Initialized in `src/utils/sentry.ts` with a built-in DSN on `o1.ingest.us.sentry.io` (overridable with `SENTRY_DSN`)
- **`tracesSampleRate: 1.0`:** Still 100% trace sampling. Metrics (`_experiments.enableMetrics`) and Sentry logs (`enableLogs`) are also on
- **Scope narrowed (v2.1.0, 2026-02-23):** Per the official privacy page, only internal MobileBuildMCP runtime failures are reported. User-domain errors (build/test failures, invalid config, simulator state), tool inputs and outputs (`recordInputs: false`, `recordOutputs: false`), environment variables, source code and build artifacts are documented as never sent. This narrowing predates our March entry, so our March description ("every build command, every error, every file path") overstated what was sent
- **Privacy hardening in config:** `sendDefaultPii: false`, `maxBreadcrumbs: 0`, `beforeBreadcrumb` drops all breadcrumbs, `serverName: ''`, and `beforeSend` / `beforeSendLog` redact events (home paths become `/Users/<redacted>/...`)
- **Default state:** ON; any one of the documented switches disables SDK initialization entirely

## Security Concerns

- **Rename breaks existing opt-outs:** v2.7.1 renamed every `XCODEBUILDMCP_*` environment variable to `MOBILEBUILDMCP_*`. The current source checks only `MOBILEBUILDMCP_SENTRY_DISABLED` and `SENTRY_DISABLED`. A user who opted out with `XCODEBUILDMCP_SENTRY_DISABLED=true` and switches to the `mobilebuildmcp` package is opted back in unless they update the variable. The old `xcodebuildmcp` npm package remains at 2.7.0
- **100% tracing remains aggressive** even with the narrowed scope: every traced operation of the server generates a span
- **Vendor-operated pipeline:** The project lives in Sentry's GitHub organization and reports to Sentry's own ingest. This is transparent, but it is a direct pipeline from a developer tool to the vendor
- **Redaction coverage:** Path redaction depends on pattern coverage; unusual paths in error text could still leak
- **Local log capture:** The server captures simulator and device logs. A fixed vulnerability (#407) previously let a crafted bundle ID broaden log streams to other apps

## How to Opt Out

1. Set in your MCP client config:
   ```json
   {
     "mcpServers": {
       "MobileBuildMCP": {
         "env": {
           "MOBILEBUILDMCP_SENTRY_DISABLED": "true"
         }
       }
     }
   }
   ```
2. Or add `sentryDisabled: true` to `.mobilebuildmcp/config.yaml`, or export `SENTRY_DISABLED=true`
3. If you are still on the old `xcodebuildmcp` package (2.7.0 or earlier), use `XCODEBUILDMCP_SENTRY_DISABLED=true`; change it when you migrate
4. Restart the server; `mobilebuildmcp-doctor` reports whether Sentry is enabled

## Evidence

- Audited commit: [`d13ff0c7`](https://github.com/getsentry/MobileBuildMCP/tree/d13ff0c707b0681769cf31da0eb42c4f94ceafff) (2026-09-23, v2.7.1)
- Sentry init (DSN, `tracesSampleRate: 1.0`, `sendDefaultPii: false`): [src/utils/sentry.ts#L309-L336](https://github.com/getsentry/MobileBuildMCP/blob/d13ff0c707b0681769cf31da0eb42c4f94ceafff/src/utils/sentry.ts#L309-L336)
- Disable checks (new env names only): [src/utils/sentry.ts#L155-L159](https://github.com/getsentry/MobileBuildMCP/blob/d13ff0c707b0681769cf31da0eb42c4f94ceafff/src/utils/sentry.ts#L155-L159), [src/utils/sentry-config.ts](https://github.com/getsentry/MobileBuildMCP/blob/d13ff0c707b0681769cf31da0eb42c4f94ceafff/src/utils/sentry-config.ts)
- Rename and env var change: [CHANGELOG.md#L3-L7](https://github.com/getsentry/MobileBuildMCP/blob/d13ff0c707b0681769cf31da0eb42c4f94ceafff/CHANGELOG.md#L3-L7)
- Official privacy page: [getsentry/xcodebuildmcp.com app/docs/_content/privacy.mdx](https://github.com/getsentry/xcodebuildmcp.com/blob/6b7071c2c2d6425433a655912597ce9ec84d0031/app/docs/_content/privacy.mdx)
- v2.1.0 release date (2026-02-23): https://github.com/getsentry/MobileBuildMCP/releases/tag/v2.1.0
- npm: `xcodebuildmcp` latest 2.7.0; `mobilebuildmcp` latest 2.7.1 (npm registry, 2026-10-20)
- Star count: GitHub API, 6,491 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at d13ff0c7 (v2.7.1). Corrected repository (nicklama URL is 404; canonical is getsentry/MobileBuildMCP, formerly cameroncooke/getsentry XcodeBuildMCP). Project renamed to MobileBuildMCP; opt-out env var is now `MOBILEBUILDMCP_SENTRY_DISABLED` and the old `XCODEBUILDMCP_SENTRY_DISABLED` is no longer read. Corrected scope: since v2.1.0 (Feb 2026) only internal runtime failures are reported and tool inputs/outputs are excluded. `tracesSampleRate: 1.0` and default-ON unchanged. Stars 4.8K -> 6.5K.
