# tweakcc

| Field | Value |
|-------|-------|
| Repository | https://github.com/Piebald-AI/tweakcc |
| Type | Binary Patcher |
| Stars | 2.6K |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | CRITICAL |
| Last Verified | 2026-10-20 |

## What It Does

tweakcc is a CLI by Piebald AI that patches Claude Code to customize system prompts, themes, toolsets and UI, and to unlock or change behaviors. For npm installs it edits Claude Code's JavaScript directly; for native installs it extracts the code graph from the Bun executable, patches it, repacks it and ad-hoc signs it on Apple Silicon (via its `node-lief` bindings). Version audited: 4.4.0 (plus unreleased changes on `main`).

## Telemetry Details

No analytics SDKs were found. Outbound URLs in `src/` are GitHub (`raw.githubusercontent.com` for prompt data and themes), `downloads.claude.ai/claude-code-releases` (Claude Code release manifests), and links to `piebald.ai`. Files under `data/prompts/` mention telemetry only because they contain copies of Claude Code's own system prompts.

## Security Concerns

- **Binary modification:** After patching you are running a modified Claude Code, not Anthropic's release
- **System prompt manipulation:** Patches can change Claude's instructions, permission flows and tool behavior
- **Weakens Claude Code's integrity repair (unreleased on `main`):** The Unreleased changelog adds `keepPatchedBinaryOnUpdate` (default `true`, native installs). It patches Claude Code's installer so that a retained binary whose SHA-256 matches tweakcc's own record in `applied.json` is treated as valid instead of being re-downloaded. The README states the trade-off: anything that can write both the binary and `applied.json` (both user-owned) can make a modified binary persist
- **Auto re-apply hook (unreleased on `main`):** `tweakcc --install-hook` adds a `SessionStart` hook to Claude Code's `settings.json` that starts `tweakcc --apply` detached whenever the active binary differs from the recorded one
- **Remote code and config:** `adhoc-patch` can run patch scripts from an HTTP URL, and `--apply --config-url` fetches config from a remote URL. Scripts run in a Node child process with `--experimental-permission` (no file system or network APIs), but the README notes a script can still patch malicious code into the Claude Code executable; review the printed diff before applying
- **Code signing invalidation:** Native binaries are re-signed ad hoc, so you can no longer verify Anthropic's signature
- **Update fragility and ToS:** Patches must be re-applied after every Claude Code update, and modifying the binary may conflict with Anthropic's terms

## How to Opt Out

Do not use tweakcc. If you have already used it:

1. Run `npx tweakcc --restore` to restore the original files
2. Remove any tweakcc `SessionStart` hook from `~/.claude/settings.json` (or `$CLAUDE_CONFIG_DIR/settings.json`)
3. Reinstall Claude Code from the official installer or `npm install -g @anthropic-ai/claude-code`, so the installer's own integrity checks apply again
4. Delete the tweakcc config directory (including `applied.json`)
5. Review sessions run with modified system prompts

## Evidence

- Audited commit: [`02b2ad98`](https://github.com/Piebald-AI/tweakcc/tree/02b2ad98f9223572f2e027f818cbd67d78e393c3) (2026-10-20, package.json 4.4.0)
- Native binary patching via node-lief: [README.md#L95](https://github.com/Piebald-AI/tweakcc/blob/02b2ad98f9223572f2e027f818cbd67d78e393c3/README.md#L95), [README.md#L169](https://github.com/Piebald-AI/tweakcc/blob/02b2ad98f9223572f2e027f818cbd67d78e393c3/README.md#L169)
- Integrity-check bypass and install hook: [README.md#L207-L240](https://github.com/Piebald-AI/tweakcc/blob/02b2ad98f9223572f2e027f818cbd67d78e393c3/README.md#L207-L240), [CHANGELOG.md#L8-L10](https://github.com/Piebald-AI/tweakcc/blob/02b2ad98f9223572f2e027f818cbd67d78e393c3/CHANGELOG.md#L8-L10)
- Remote config: [README.md#L175-L177](https://github.com/Piebald-AI/tweakcc/blob/02b2ad98f9223572f2e027f818cbd67d78e393c3/README.md#L175-L177)
- adhoc-patch sandbox and URL scripts: [README.md#L329](https://github.com/Piebald-AI/tweakcc/blob/02b2ad98f9223572f2e027f818cbd67d78e393c3/README.md#L329), [README.md#L351](https://github.com/Piebald-AI/tweakcc/blob/02b2ad98f9223572f2e027f818cbd67d78e393c3/README.md#L351)
- v4.4.0 release (2026-10-10): https://github.com/Piebald-AI/tweakcc/releases/tag/v4.4.0
- Star count: GitHub API, 2,554 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at 02b2ad98. Still no telemetry. Added: native Bun binary patching with ad-hoc re-signing, remote config and URL patch scripts (4.0.0), and on `main` (unreleased) an installer patch that keeps patched binaries through Claude Code's integrity re-verification plus a `SessionStart` auto-reapply hook. Updated restore steps. Stars 1.4K -> 2.6K.
