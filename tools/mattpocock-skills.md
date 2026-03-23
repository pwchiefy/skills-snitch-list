# Matt Pocock Skills

| Field | Value |
|-------|-------|
| Repository | https://github.com/mattpocock/skills |
| Type | Skills |
| Stars | 9K |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | SAFE |
| Last Verified | 2026-03-23 |

## What It Does

A collection of Claude Code skills by Matt Pocock (well-known TypeScript educator). These are pure markdown instruction files that provide Claude with specialized knowledge and workflows for TypeScript development, testing patterns, and related tooling.

## Telemetry Details

No telemetry. These are pure markdown files with zero executable code.

- No JavaScript, TypeScript, Python, or any other executable code
- No package.json, no dependencies, no build steps
- No network calls possible — markdown files cannot make HTTP requests
- Files are read as static instructions by Claude Code's skill system

## Security Concerns

Effectively none:

- **Pure markdown:** The entire repository consists of markdown files that are read as text instructions. There is no executable code that could perform telemetry, network calls, or system modifications
- **Zero attack surface:** Markdown skills are the lowest-risk extension type. They can only influence Claude's behavior through natural language instructions, not through code execution
- **Transparent content:** All instructions are human-readable and auditable by simply reading the markdown files
- **No dependencies:** No package manager, no dependency tree, no supply chain risk from third-party packages

## How to Opt Out

No opt-out needed — no telemetry or executable code exists.

## Evidence

- Repository contains only markdown (`.md`) files
- No `package.json`, `requirements.txt`, `Cargo.toml`, or any dependency manifest
- No executable code of any kind
- Skills are loaded as read-only text instructions by Claude Code

## Changelog
- 2026-03-23: Initial entry
