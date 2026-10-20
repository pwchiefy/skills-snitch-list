# Mem0 (SDK, server and Claude Code plugin)

| Field | Value |
|-------|-------|
| Repository | https://github.com/mem0ai/mem0 |
| Type | Plugin (hooks + MCP server + skills) / Memory SDK |
| Stars | 68K |
| Telemetry | Yes |
| Default State | ON (opt-out) |
| Analytics Providers | PostHog (`us.i.posthog.com`); memory content goes to the Mem0 Platform (`api.mem0.ai`) by design when the plugin is used |
| Disable Method | Env `MEM0_TELEMETRY=false` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

Mem0 is a memory layer for AI agents: a Python and TypeScript SDK, a self-hostable REST server, and agent plugins for Claude Code, Codex, Cursor, OpenCode, OpenClaw and others. The Claude Code plugin (`/plugin marketplace add mem0ai/mem0`, plugin `mem0` 0.3.3) registers nine hook events, an MCP server and memory skills, and gives Claude memories from earlier sessions.

## Telemetry Details

- **SDK (Python `mem0ai` 2.2.1 in repo, TypeScript):** PostHog project key hardcoded; `MEM0_TELEMETRY` defaults to `True`; sampled events with a persistent user ID
- **Claude Code plugin:** Its telemetry module states events "are linked to your Mem0 account email when an API key is configured, and to a random per-machine id otherwise. Not anonymous". It says it never sends prompts, memory text, queries, file paths, repository names or API keys, only event names, durations, counts, outcomes and salted hashes of repo/session identifiers. Events are spooled locally and flushed to `us.i.posthog.com` by a detached process
- **Functional data flow (not telemetry):** The plugin's hooks capture session details locally and a background worker turns them into memories on the Mem0 Platform (`https://api.mem0.ai`). That is the product's purpose, but it means summaries of your coding sessions are stored by a third party

## Security Concerns

- **Hooks on every prompt and tool call:** `SessionStart`, `UserPromptSubmit`, `PostToolUse`, `PostToolUseFailure`, `SubagentStart`, `SubagentStop`, `Stop`, `PreCompact` and `SessionEnd` all run `python3` scripts from the plugin directory with your user privileges, outside Claude Code's sandbox
- **Session content leaves the machine:** Memories derived from prompts, tool output and code discussions are sent to Mem0's cloud. Anything sensitive that appears in a session can become a stored memory
- **Memory poisoning surface:** Memories are injected back into future sessions. Anything that can write to your memory store can steer later sessions
- **Self-hosted server advisories:** The mem0 1.0.0 REST server lacked authentication and authorization on memory create, update and delete endpoints (CVE-2026-31240, CVE-2026-31241, CVE-2026-31245). If you self-host, do not expose it beyond localhost without an authenticating proxy
- **Telemetry tied to identity:** With an API key configured, plugin usage events are attributed to your account email

## How to Opt Out

1. Export `MEM0_TELEMETRY=false` in the environment Claude Code starts from (hooks and the MCP server inherit it)
2. For SDK use, set the same variable in every process that imports `mem0`
3. To keep memories local, use the open-source SDK with a local vector store instead of the hosted platform plugin
4. Review stored memories periodically and remove anything sensitive (`/mem0:forget`)

## Evidence

- Audited commit: [`0724291b`](https://github.com/mem0ai/mem0/tree/0724291bd864cf807e88ee8981c8226644e8fb42)
- SDK telemetry default and key: [mem0/memory/telemetry.py#L14-L23](https://github.com/mem0ai/mem0/blob/0724291bd864cf807e88ee8981c8226644e8fb42/mem0/memory/telemetry.py#L14-L23), [mem0-ts/src/oss/src/utils/telemetry.ts#L14-L20](https://github.com/mem0ai/mem0/blob/0724291bd864cf807e88ee8981c8226644e8fb42/mem0-ts/src/oss/src/utils/telemetry.ts#L14-L20)
- Plugin telemetry docstring (identity, what is and is not sent): [integrations/claude-code-plugin/core/telemetry.py#L1-L18](https://github.com/mem0ai/mem0/blob/0724291bd864cf807e88ee8981c8226644e8fb42/integrations/claude-code-plugin/core/telemetry.py#L1-L18), endpoint [#L94-L96](https://github.com/mem0ai/mem0/blob/0724291bd864cf807e88ee8981c8226644e8fb42/integrations/claude-code-plugin/core/telemetry.py#L94-L96), opt-out [#L115-L118](https://github.com/mem0ai/mem0/blob/0724291bd864cf807e88ee8981c8226644e8fb42/integrations/claude-code-plugin/core/telemetry.py#L115-L118)
- Plugin hooks: [integrations/claude-code-plugin/hooks/hooks.json](https://github.com/mem0ai/mem0/blob/0724291bd864cf807e88ee8981c8226644e8fb42/integrations/claude-code-plugin/hooks/hooks.json)
- Plugin MCP server: [integrations/claude-code-plugin/.mcp.json](https://github.com/mem0ai/mem0/blob/0724291bd864cf807e88ee8981c8226644e8fb42/integrations/claude-code-plugin/.mcp.json)
- Platform API default: [integrations/claude-code-plugin/core/memory_core.py#L31](https://github.com/mem0ai/mem0/blob/0724291bd864cf807e88ee8981c8226644e8fb42/integrations/claude-code-plugin/core/memory_core.py#L31)
- Plugin README (capture flow, telemetry section): [integrations/claude-code-plugin/README.md](https://github.com/mem0ai/mem0/blob/0724291bd864cf807e88ee8981c8226644e8fb42/integrations/claude-code-plugin/README.md)
- Advisories: [GHSA-jfv9-68m5-gjjr (CVE-2026-31240)](https://github.com/advisories/GHSA-jfv9-68m5-gjjr), [GHSA-gq6f-qwv9-rf4j (CVE-2026-31241)](https://github.com/advisories/GHSA-gq6f-qwv9-rf4j), [GHSA-cgx8-qgvr-f7vf (CVE-2026-31245)](https://github.com/advisories/GHSA-cgx8-qgvr-f7vf)
- Star count: GitHub API, 67,518 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
