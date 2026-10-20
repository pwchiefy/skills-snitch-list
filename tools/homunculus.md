# Homunculus

| Field | Value |
|-------|-------|
| Repository | https://github.com/humanplane/homunculus |
| Type | Plugin |
| Stars | 399 |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | CRITICAL |
| Last Verified | 2026-10-20 |

## What It Does

Homunculus (v2.0-alpha) is a Claude Code plugin that observes how you work and evolves its own behavior. Hooks record every prompt and tool call; a background "observer" agent (Haiku) turns patterns into "instincts" (small behavioral rules), and when instincts cluster the `/homunculus:evolve` command proposes new commands, skills or agents. The repository has had no commits since 2026-01-23.

## Telemetry Details

No telemetry or external analytics. The plugin's `.mcp.json` declares no MCP servers, and its hook scripts make no network calls. All data stays in the project directory. The background observer agent runs on your configured Claude model, so observation analysis goes to your LLM provider like any other agent work.

## Security Concerns

- **Plaintext capture of prompts and tool I/O in the project:** `UserPromptSubmit` and `PostToolUse` (matcher `.*`) hooks append every prompt, every tool input, and the first 1,000 characters of every tool response to `.claude/homunculus/observations.jsonl` inside the current project. The plugin does not add this path to `.gitignore`, so secrets that appear in prompts or tool output can be committed and pushed with the repository
- **Auto-approved behavior changes:** The observer agent writes instincts directly to `.claude/homunculus/instincts/personal/` marked as auto-approved, and those instincts shape future sessions without per-change review
- **Evolution asks first:** Generating new commands, skills or agents via `/homunculus:evolve` asks for confirmation before writing. Our March entry said all self-modification was unapproved; that applies to instincts, not to evolved capabilities
- **Prompt injection persistence:** Content processed during a session can be learned as an instinct and carried into later sessions
- **Drift and auditability:** The running behavior depends on accumulated instincts and evolved files, not just the published source
- **Limited scrutiny:** About 399 stars and no maintenance since January 2026

## How to Opt Out

Do not use Homunculus. If you have already used it:

1. Remove the plugin (`/plugin uninstall homunculus`)
2. Check `git status` and history for `.claude/homunculus/` in every project where it ran; remove it and purge it from history if it was committed
3. Review `observations.jsonl` for credentials before deleting it, and rotate anything exposed
4. Delete `.claude/homunculus/` (identity, instincts, evolved commands/skills/agents)

## Evidence

- Audited commit: [`59b6520f`](https://github.com/humanplane/homunculus/tree/59b6520f3b31fc5c31e57f7ffa3e7fee28a365c4) (2026-01-23, latest)
- Hooks on every prompt and tool call: [plugins/homunculus/hooks/hooks.json](https://github.com/humanplane/homunculus/blob/59b6520f3b31fc5c31e57f7ffa3e7fee28a365c4/plugins/homunculus/hooks/hooks.json)
- Prompt and tool input/response logging to project JSONL: [plugins/homunculus/scripts/observe.sh#L8](https://github.com/humanplane/homunculus/blob/59b6520f3b31fc5c31e57f7ffa3e7fee28a365c4/plugins/homunculus/scripts/observe.sh#L8), [#L31-L45](https://github.com/humanplane/homunculus/blob/59b6520f3b31fc5c31e57f7ffa3e7fee28a365c4/plugins/homunculus/scripts/observe.sh#L31-L45)
- Auto-approved instincts: [plugins/homunculus/agents/observer.md#L14-L17](https://github.com/humanplane/homunculus/blob/59b6520f3b31fc5c31e57f7ffa3e7fee28a365c4/plugins/homunculus/agents/observer.md#L14-L17)
- Evolution asks before writing: [plugins/homunculus/commands/evolve.md#L35-L45](https://github.com/humanplane/homunculus/blob/59b6520f3b31fc5c31e57f7ffa3e7fee28a365c4/plugins/homunculus/commands/evolve.md#L35-L45)
- Empty MCP config: [.mcp.json](https://github.com/humanplane/homunculus/blob/59b6520f3b31fc5c31e57f7ffa3e7fee28a365c4/.mcp.json)
- Star count: GitHub API, 399 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at 59b6520f (no upstream changes since January). Still no telemetry. Added concrete finding: prompts and tool I/O are logged in plaintext to `.claude/homunculus/observations.jsonl` inside the project with no `.gitignore` entry. Clarified that instincts are auto-approved while evolved capabilities require confirmation. Stars 319 -> 399.
