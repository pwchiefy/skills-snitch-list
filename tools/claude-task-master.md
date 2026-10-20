# Task Master (claude-task-master)

| Field | Value |
|-------|-------|
| Repository | https://github.com/eyaltoledano/claude-task-master |
| Type | MCP Server + CLI |
| Stars | 28K |
| Telemetry | Yes |
| Default State | ON (opt-out; not described in the README) |
| Analytics Providers | Sentry (`ingest.us.sentry.io`), with Vercel AI SDK integration recording AI inputs and outputs |
| Disable Method | Set `"anonymousTelemetry": false` in the `global` section of `.taskmaster/config.json` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

Task Master (`task-master-ai` on npm) turns a product requirements document into a task list and manages tasks through an MCP server and CLI. It is commonly added to Claude Code, Cursor and Windsurf, and it calls an LLM provider you configure (or Claude Code / Codex CLI as providers) for PRD parsing, task expansion, complexity analysis and research.

## Telemetry Details

- **Added in 0.37.0 (changelog):** "All AI operations (generateText, streamText, generateObject, streamObject) now automatically track spans, token usage, **prompts, and responses**"; the MCP server is wrapped with `Sentry.wrapMcpServerWithSentry()` "to automatically capture spans for all MCP tool interactions"; the Sentry DSN "is hardcoded internally"
- **Current code (0.43.1):**
  - `Sentry.vercelAIIntegration({ recordInputs: true, recordOutputs: true })`
  - `tracesSampleRate: 1.0` (every operation traced) and `sendDefaultPii: true`
  - Each AI SDK call passes `experimental_telemetry` with `recordInputs: true, recordOutputs: true`
  - Initialized at MCP server start (`mcp-server/src/index.js`) and in the CLI
- **Default:** `anonymousTelemetry: true` in the config defaults; `getAnonymousTelemetryEnabled()` treats anything other than an explicit `false` as enabled, and if reading the config fails the code falls through to enabled
- **What "inputs and outputs" means here:** The prompts Task Master builds contain your PRD text, task descriptions and, for codebase-aware commands, project context. The model responses contain the generated tasks and research output

## Security Concerns

- **Prompt and response content goes to a third-party error tracker by default.** The setting is named "anonymous" telemetry, but recording full LLM inputs and outputs with `sendDefaultPii: true` is hard to describe as anonymous
- **Not disclosed where users look:** The README does not describe the Sentry integration; the disclosure is in the changelog and code
- **Per-project opt-out in an MCP server:** The MCP server calls `initializeSentry()` without a project root, so whether a `.taskmaster/config.json` opt-out is found depends on the server's working directory. We did not verify this at runtime; confirm with network monitoring after opting out
- **Maintenance:** The repository's last push was 2026-04-28 and the latest npm release is 0.43.1 (2026-03-31)

## How to Opt Out

1. In each project's `.taskmaster/config.json`:
   ```json
   { "global": { "anonymousTelemetry": false } }
   ```
2. On next start the CLI prints "Anonymous telemetry disabled per user preference"
3. Because opt-out is per project config, verify the MCP server picks it up (or block `*.ingest.us.sentry.io` for the server process)

## Evidence

- Audited commit: [`c0c98d36`](https://github.com/eyaltoledano/claude-task-master/tree/c0c98d367c55296bfe69e65680625b6db437af02) (npm `task-master-ai` 0.43.1)
- Sentry init (`recordInputs`, `recordOutputs`, `tracesSampleRate: 1.0`, `sendDefaultPii: true`, hardcoded DSN): [src/telemetry/sentry.js#L37-L106](https://github.com/eyaltoledano/claude-task-master/blob/c0c98d367c55296bfe69e65680625b6db437af02/src/telemetry/sentry.js#L37-L106)
- Per-call AI SDK telemetry config: [src/telemetry/sentry.js#L125-L140](https://github.com/eyaltoledano/claude-task-master/blob/c0c98d367c55296bfe69e65680625b6db437af02/src/telemetry/sentry.js#L125-L140), used in [src/ai-providers/base-provider.js#L344](https://github.com/eyaltoledano/claude-task-master/blob/c0c98d367c55296bfe69e65680625b6db437af02/src/ai-providers/base-provider.js#L344)
- Default `anonymousTelemetry: true` and getter: [scripts/modules/config-manager.js#L61](https://github.com/eyaltoledano/claude-task-master/blob/c0c98d367c55296bfe69e65680625b6db437af02/scripts/modules/config-manager.js#L61), [#L744-L748](https://github.com/eyaltoledano/claude-task-master/blob/c0c98d367c55296bfe69e65680625b6db437af02/scripts/modules/config-manager.js#L744-L748)
- MCP server init and wrapper: [mcp-server/src/index.js#L20](https://github.com/eyaltoledano/claude-task-master/blob/c0c98d367c55296bfe69e65680625b6db437af02/mcp-server/src/index.js#L20), [#L41-L43](https://github.com/eyaltoledano/claude-task-master/blob/c0c98d367c55296bfe69e65680625b6db437af02/mcp-server/src/index.js#L41-L43)
- Changelog disclosure (0.37.0): [CHANGELOG.md#L547-L554](https://github.com/eyaltoledano/claude-task-master/blob/c0c98d367c55296bfe69e65680625b6db437af02/CHANGELOG.md#L547-L554)
- npm: `task-master-ai` latest 0.43.1, published 2026-03-31 (npm registry, 2026-10-20)
- Star count: GitHub API, 28,255 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
