# Obsidian Skills (kepano)

| Field | Value |
|-------|-------|
| Repository | https://github.com/kepano/obsidian-skills |
| Type | Skills |
| Stars | 50K |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | SAFE |
| Last Verified | 2026-10-20 |

## What It Does

Agent skills by kepano (Steph Ango, CEO of Obsidian) for working with Obsidian: Obsidian-flavored Markdown, Bases, JSON Canvas, the Obsidian CLI, plus `defuddle` (clean Markdown extraction from web pages) and `knap` (Markdown templating). Installable as a Claude Code plugin marketplace or via `npx skills add`.

## Telemetry Details

No telemetry. The repository contains 15 files: `SKILL.md` files, reference markdown, a LICENSE, a README and two plugin manifest JSON files. No executable code or dependency manifest.

## Security Concerns

Effectively none in the repository itself:

- **Pure markdown and manifests:** No scripts, no dependencies
- **Skills install CLIs on demand:** The `defuddle` and `knap` skills tell the agent to run `npm install -g defuddle` / `npm install -g knap` if missing, and `defuddle parse <url>` fetches web pages. Those are separate npm packages with their own code and network behavior, outside this audit
- **Installer telemetry (third party):** The README's `npx skills add` install path uses Vercel Labs' `skills` CLI, which sends anonymous telemetry to `skills.sh` by default (disable with `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1`). The `/plugin marketplace add` path does not involve that CLI
- **Trusted author, transparent content:** Short, readable instructions

## How to Opt Out

No opt-out needed for the skills. If you install with `npx skills`, set `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1` first.

## Evidence

- Repository HEAD reviewed: [`3ccff533`](https://github.com/kepano/obsidian-skills/tree/3ccff5338ea700537839b21900aa5358a0402c98) (2026-09-15). File inventory via GitHub tree API: 12 `.md`, 2 `.json`, LICENSE
- npm install instructions: [skills/defuddle/SKILL.md](https://github.com/kepano/obsidian-skills/blob/3ccff5338ea700537839b21900aa5358a0402c98/skills/defuddle/SKILL.md), [skills/knap/SKILL.md](https://github.com/kepano/obsidian-skills/blob/3ccff5338ea700537839b21900aa5358a0402c98/skills/knap/SKILL.md)
- Install methods: [README.md#L5-L23](https://github.com/kepano/obsidian-skills/blob/3ccff5338ea700537839b21900aa5358a0402c98/README.md#L5-L23)
- `skills` CLI telemetry: [vercel-labs/skills README.md#L102-L106](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/README.md#L102-L106)
- Star count: GitHub API, 49,807 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at 3ccff533. Still no telemetry or executable code. Noted new `defuddle` and `knap` skills that install global npm CLIs on demand, and the third-party `npx skills` installer telemetry. Stars 16K -> 50K.
