# Anthropic Official Skills

| Field | Value |
|-------|-------|
| Repository | https://github.com/anthropics/skills |
| Type | Skills |
| Stars | 182K |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | SAFE |
| Last Verified | 2026-10-20 |

## What It Does

Anthropic's public skills repository: example and production skills (including the document skills behind Claude's file creation: `docx`, `pdf`, `pptx`, `xlsx`), a `claude-api` reference skill, a skill-creator, and design/artifact skills. Many skills are Apache 2.0; the document skills are source-available rather than open source.

## Telemetry Details

No telemetry.

- No analytics libraries or tracking code
- No persistent identifiers
- Helper scripts (about 70 Python files plus a few JS/shell files, mostly for Office/PDF processing) run locally. URLs in scripts are XML namespace identifiers (`schemas.openxmlformats.org`, `schemas.microsoft.com`), `localhost`, Google Fonts references in HTML templates, and `api.anthropic.com` in the API reference skill
- Mentions of "telemetry" in the repo are documentation text inside the `claude-api` skill, not code

## Security Concerns

Minimal:

- **Official source:** Maintained under the `anthropics` GitHub organization, the same trust model as Claude Code itself
- **Executable helpers:** Our March entry implied the skills were non-executable. Several skills include Python and shell helpers that the agent runs locally (e.g., Office XML manipulation). They make no telemetry calls but do execute on your machine
- **Third-party installers:** If installed through a third-party installer such as `npx skills`, that installer's own telemetry applies

## How to Opt Out

No opt-out needed — no telemetry exists.

## Evidence

- Audited commit: [`dbd4588f`](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44) (2026-10-09)
- License note (open source vs source-available): [README.md#L20](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/README.md#L20)
- Source scan: no `posthog|sentry|mixpanel|amplitude` in code; outbound hosts in `.py/.js/.mjs/.sh` limited to XML namespaces, localhost, Google Fonts and `api.anthropic.com`
- File inventory via GitHub tree API: 137 `.md`, 72 `.py`, 117 `.xsd`, 54 `.ttf`, 47 `.txt`
- Star count: GitHub API, 182,409 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at dbd4588f. Still no telemetry. Corrected description: several skills ship local Python/shell helpers, and the document skills are source-available, not open source. Removed the unverifiable claim about Anthropic's internal review process. Stars 101K -> 182K.
