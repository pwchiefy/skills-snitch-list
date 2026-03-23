# XcodeBuild MCP

| Field | Value |
|-------|-------|
| Repository | https://github.com/nicklama/XcodeBuildMCP |
| Type | MCP Server |
| Stars | 4.8K |
| Telemetry | Yes |
| Default State | ON |
| Analytics Providers | Sentry |
| Disable Method | Set environment variable `XCODEBUILDMCP_SENTRY_DISABLED=true` |
| Risk Level | MEDIUM |
| Last Verified | 2026-03-23 |

## What It Does

XcodeBuild MCP is an MCP server that gives Claude Code the ability to build, run, test, and manage Xcode projects. It provides tools for compiling Swift/Objective-C code, running simulators, managing schemes, and reading build logs. Built by Sentry (the error tracking company).

## Telemetry Details

- **Sentry integration:** Full Sentry SDK integrated for error tracking and performance monitoring
- **100% trace sampling:** The Sentry `tracesSampleRate` is set to `1.0`, meaning every single operation is traced and reported. This is the maximum possible sampling rate
- **Path redaction:** The implementation includes path redaction logic to strip user-specific directory paths before sending data to Sentry. This is a positive privacy measure
- **Data collected:**
  - Error reports with stack traces
  - Performance traces for all operations (100% sampling)
  - Build events and tool invocations
  - Xcode project metadata (with path redaction applied)
- **Default state:** ON. Users must explicitly set an environment variable to disable

## Security Concerns

- **100% trace sampling is aggressive:** Most production Sentry deployments use 1-10% sampling. Sending 100% of traces means every single build, test run, and tool invocation generates a telemetry event
- **Built by Sentry:** The MCP server is built by the same company that operates the telemetry service. While this is transparent, it creates a direct pipeline from developer tools to Sentry's infrastructure
- **Build metadata exposure:** Even with path redaction, build events may include scheme names, target names, error messages, and project structure information that reveals details about proprietary projects
- **Xcode project access:** The server reads Xcode project files, build configurations, and test results. Combined with telemetry, this means project structure information flows to external servers
- **Path redaction scope:** While path redaction exists, its effectiveness depends on coverage. Any missed paths in error messages or stack traces would leak filesystem structure

## How to Opt Out

1. Set the environment variable before launching the MCP server:
   ```
   export XCODEBUILDMCP_SENTRY_DISABLED=true
   ```
2. Alternatively, add it to your MCP server configuration in `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "xcodebuild": {
         "env": {
           "XCODEBUILDMCP_SENTRY_DISABLED": "true"
         }
       }
     }
   }
   ```
3. Restart the MCP server for changes to take effect

## Evidence

- Sentry SDK integrated with `tracesSampleRate: 1.0` (100% sampling)
- Environment variable `XCODEBUILDMCP_SENTRY_DISABLED` controls telemetry
- Path redaction logic present in codebase to sanitize user paths before Sentry submission
- Telemetry is enabled by default; requires explicit env var to disable
- Project is associated with Sentry (the company)

## Changelog
- 2026-03-23: Initial entry
