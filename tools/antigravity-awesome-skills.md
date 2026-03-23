# Antigravity Awesome Skills

| Field | Value |
|-------|-------|
| Repository | https://github.com/sickn33/antigravity-awesome-skills |
| Type | Skills + CLI |
| Stars | 27K |
| Telemetry | Partial (Supabase in web app only, not in CLI installer) |
| Default State | OFF (web app only) |
| Analytics Providers | Supabase (web app component) |
| Disable Method | Avoid the web app; CLI installer has no telemetry |
| Risk Level | MEDIUM |
| Last Verified | 2026-03-23 |

## What It Does

Antigravity Awesome Skills is a collection of 1,304 skills for Claude Code, distributed with a CLI installer tool. It provides a large catalog of community-contributed skills spanning many development domains. The project includes both the skill files and a CLI tool for browsing and installing them. A companion web application exists for browsing the catalog online.

## Telemetry Details

- **Supabase in web app:** The web application component (for browsing skills online) uses Supabase for backend services and analytics. This tracks web visitors, skill popularity, and usage patterns
- **CLI installer:** The CLI installer tool does NOT contain Supabase or any other telemetry. It operates locally and does not phone home
- **Skill files:** The skill markdown files themselves contain no executable code or telemetry
- **Separation of concerns:** The telemetry exists only in the web-facing component, not in the tools that developers actually install and run locally

## Security Concerns

- **1,304 skills is a large surface area:** With over a thousand skills, thorough review of every skill file is impractical. While skills are markdown (non-executable), a malicious skill could include instructions that manipulate Claude's behavior in harmful ways (prompt injection via skill content)
- **CLI installer trust:** While the CLI has no telemetry, it installs files to your system. The installer must be trusted to only write the expected skill files to the expected locations
- **Community-contributed content:** With 1,304 skills, many are likely contributed by different authors. The quality and safety review process for contributed skills is unclear
- **Supabase in web app:** The web app component tracks usage via Supabase. Users browsing skills online should be aware their browsing patterns are recorded
- **Supply chain at scale:** The sheer number of skills means that a single compromised skill file in an update could be difficult to detect through manual review

## How to Opt Out

For Supabase telemetry:
1. Use the CLI installer instead of the web app to browse and install skills
2. The CLI has no telemetry — no additional configuration needed

General risk mitigation:
1. Review skills before installing — they are readable markdown files
2. Install only the specific skills you need rather than the entire collection
3. Pin to a specific version of the CLI installer
4. Periodically audit installed skill files for unexpected content

## Evidence

- Supabase integration present in web application code only
- CLI installer source code contains no analytics libraries or outbound network calls (beyond fetching skill files)
- Skill files are markdown with no executable code
- 1,304 skills in the collection as of last review
- Clear separation between web app (has Supabase) and CLI tool (no telemetry)

## Changelog
- 2026-03-23: Initial entry
