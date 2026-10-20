# Ruflo (formerly Claude Flow)

| Field | Value |
|-------|-------|
| Repository | https://github.com/ruvnet/ruflo (redirects from `ruvnet/claude-flow`) |
| Type | Plugin marketplace + Meta-harness (hooks, MCP server, agents, skills) |
| Stars | 78K |
| Telemetry | No third-party analytics found; local command history recording on by default |
| Default State | N/A (remote); local command recording ON (opt-out) |
| Analytics Providers | None found |
| Disable Method | Local recording: `CLAUDE_FLOW_HOOKS_RECORD_COMMANDS=false` (or `CLAUDE_FLOW_HOOKS_ENABLED=false`) |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

Ruflo describes itself as "an agent meta-harness for Claude Code and Codex". It is installed with `/plugin marketplace add ruvnet/ruflo` and `/plugin install ruflo-core@ruflo`, or via `npx ruflo`. The marketplace lists 47 plugins (swarms, federation, browser, market data, trading, IoT, memory, cost tracking and more), and the CLI provides an MCP server, "hive-mind" multi-agent runs and project initialization.

## Telemetry Details

- A search of the CLI and plugin package manifests and source for PostHog, Sentry, Mixpanel, Amplitude, Google Analytics and Segment found no third-party analytics SDK or endpoint
- **Local recording:** Hook scripts forward every Bash command (`post-command`) and file edit (`post-edit`) to the local `ruflo` CLI, which keeps command history. The hook script itself calls this "best-effort telemetry". Command history is opt-out (`CLAUDE_FLOW_HOOKS_RECORD_COMMANDS`)

## Security Concerns

- **Hooks fetch code at run time:** When no local `ruflo`/`claude-flow` binary is found, every hook falls back to `npx --prefer-offline --yes ruflo@latest hooks …`. Whatever version is tagged `latest` on npm at that moment runs on each tool event, with your user privileges and outside the sandbox
- **Auto-allow output on every edit and command (ruflo-core):** The `PreToolUse` hook for `Bash` and `Write|Edit|MultiEdit` prints `{"permission":"allow"}` after calling the CLI ("for Cursor/Claude compatibility"). In Cursor this format approves the call. Claude Code documents a different output schema (`hookSpecificOutput.permissionDecision`), and we did not test whether Claude Code honours this object
- **Intended auto-approval in the legacy `claude-flow` plugin package:** Its `PermissionRequest` hook (described as "Auto-allow claude-flow MCP tools") echoes `{"decision": "allow"}` for every `mcp__claude-flow__*` tool. The current Claude Code docs specify a nested `hookSpecificOutput.decision.behavior` shape for this event, so the effect depends on the Claude Code version; the intent is to skip prompts for the plugin's own MCP tools. The same file flags itself `"_legacy_unaudited_shim": true`
- **Large blast radius:** One marketplace, 47 plugins, a hooks set covering `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `Stop`, `SubagentStop`, `Notification` and `PermissionRequest` (legacy package), plus multi-agent "hive-mind" runs that pass `--dangerously-skip-permissions` to Claude Code when that flag is given
- **Supply chain:** Fast release cadence (v3.59.0 on 2026-10-20) and `@latest` resolution mean reviewed code and running code can differ

## How to Opt Out

1. Install only the plugins you need, and install the `ruflo` CLI locally at a pinned version so hooks never fall back to `npx ruflo@latest`
2. Set `CLAUDE_FLOW_HOOKS_RECORD_COMMANDS=false` to stop command history recording
3. Do not install the legacy `claude-flow` plugin package; if you have it, remove its `PermissionRequest` auto-allow hook
4. Never run hive-mind with `--dangerously-skip-permissions` outside a container or VM

## Evidence

- Audited commit: [`3d5742bc`](https://github.com/ruvnet/ruflo/tree/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433) (v3.59.0, 2026-10-20)
- Marketplace (47 plugins): [.claude-plugin/marketplace.json](https://github.com/ruvnet/ruflo/blob/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433/.claude-plugin/marketplace.json)
- ruflo-core hooks: [plugins/ruflo-core/hooks/hooks.json](https://github.com/ruvnet/ruflo/blob/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433/plugins/ruflo-core/hooks/hooks.json)
- `{"permission":"allow"}` and npx fallback: [plugins/ruflo-core/scripts/ruflo-hook.cjs#L8-L32](https://github.com/ruvnet/ruflo/blob/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433/plugins/ruflo-core/scripts/ruflo-hook.cjs#L8-L32), [#L630-L638](https://github.com/ruvnet/ruflo/blob/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433/plugins/ruflo-core/scripts/ruflo-hook.cjs#L630-L638)
- Command recording opt-out: [ruflo-hook.cjs#L557-L566](https://github.com/ruvnet/ruflo/blob/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433/plugins/ruflo-core/scripts/ruflo-hook.cjs#L557-L566)
- Legacy package auto-allow and unaudited flag: [plugin/hooks/hooks.json#L8](https://github.com/ruvnet/ruflo/blob/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433/plugin/hooks/hooks.json#L8), [#L195-L206](https://github.com/ruvnet/ruflo/blob/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433/plugin/hooks/hooks.json#L195-L206)
- Legacy shell fallback: [plugin/scripts/ruflo-hook.sh#L34](https://github.com/ruvnet/ruflo/blob/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433/plugin/scripts/ruflo-hook.sh#L34)
- Hive-mind flag pass-through: [v3/@claude-flow/cli/src/commands/hive-mind.ts#L286-L301](https://github.com/ruvnet/ruflo/blob/3d5742bcc5b4b1c3519447a6f4fcc52bb231e433/v3/%40claude-flow/cli/src/commands/hive-mind.ts#L286-L301)
- Claude Code hook output schema (`PreToolUse` `permissionDecision`; `PermissionRequest` `decision.behavior`): https://code.claude.com/docs/en/hooks
- Star count: GitHub API, 77,581 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
