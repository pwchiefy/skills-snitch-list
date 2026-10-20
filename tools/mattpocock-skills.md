# Matt Pocock Skills

| Field | Value |
|-------|-------|
| Repository | https://github.com/mattpocock/skills |
| Type | Skills |
| Stars | 298K |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | SAFE |
| Last Verified | 2026-10-20 |

## What It Does

A collection of agent skills by Matt Pocock (TypeScript educator) for "real engineering": planning, TDD, debugging, refactoring, TypeScript architecture, git guardrails and productivity workflows. Distributed as a Claude Code plugin (also listed in `claude-plugins-official`), a Copilot/VS Code plugin, Gemini skills, or via the third-party `skills` CLI (`npx skills add`). Version audited: 1.3.1.

## Telemetry Details

No telemetry. The repository contains no analytics libraries and makes no network calls of its own.

- Mostly markdown (`SKILL.md` files and references) plus YAML metadata
- A few small local shell scripts: a git guardrail `PreToolUse` script that blocks `git push`, `reset --hard` and similar commands; a "wizard" template that walks a human through manual setup steps and can write `.env` values or set secrets via `gh`; a debugging loop template; and maintainer scripts
- `package.json` is private with only `@changesets` dev dependencies for versioning

## Security Concerns

Low:

- **Not purely markdown anymore:** Our March entry said the repo had no executable code. It now ships a handful of readable shell templates/scripts. They run locally and only when a skill or hook invokes them
- **Self-updating installs:** The README now leads with plugin installs that update themselves (VS Code plugin "updates daily"). Auto-updates mean new skill text reaches you without review; pin or copy skills if that matters to you
- **Installer telemetry (third party):** The README's alternative install path, `npx skills@latest add mattpocock/skills`, uses Vercel Labs' `skills` CLI, which sends anonymous usage telemetry and security-audit requests to `skills.sh` by default (disable with `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1`). This is a property of the installer, not of these skills
- **Transparent content:** All instructions and scripts are short and readable

## How to Opt Out

No opt-out needed for the skills themselves. If you install with `npx skills`, set `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1` first.

## Evidence

- Repository HEAD reviewed: [`5beb35b0`](https://github.com/mattpocock/skills/tree/5beb35b040e3de97e54fa9e386d7e42d15c295c2) (2026-10-19). File inventory via GitHub tree API: 133 `.md`, 44 YAML, 5 `.sh`, 1 `.mjs`, 1 `.cjs`, 5 JSON
- Guardrail script: [skills/misc/git-guardrails-claude-code/scripts/block-dangerous-git.sh](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/misc/git-guardrails-claude-code/scripts/block-dangerous-git.sh)
- Wizard template: [skills/engineering/wizard/template.sh](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/wizard/template.sh)
- Private package with dev-only deps: [package.json](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/package.json)
- Install methods: [README.md#L25-L95](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/README.md#L25-L95)
- `skills` CLI telemetry: [vercel-labs/skills README.md#L102-L106](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/README.md#L102-L106), [src/telemetry.ts#L1-L2](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/src/telemetry.ts#L1-L2)
- Star count: GitHub API, 298,239 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at 5beb35b0 (v1.3.1). Still no telemetry. Corrected "pure markdown": the repo now includes a few local shell scripts/templates. Noted self-updating plugin installs and that the optional `npx skills` installer has its own default-on telemetry. Stars 9K -> 298K.
