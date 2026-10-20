# Antigravity Awesome Skills (now Agentic Awesome Skills)

| Field | Value |
|-------|-------|
| Repository | https://github.com/sickn33/agentic-awesome-skills |
| Type | Skills + CLI |
| Stars | 48K |
| Telemetry | Partial (Vercel Web Analytics and Supabase in the hosted catalog web app only; none in skills or CLI) |
| Default State | ON for hosted catalog visitors; N/A for CLI and skills |
| Analytics Providers | Vercel Web Analytics, Supabase (hosted catalog at aaskills.tech) |
| Disable Method | Avoid the hosted catalog; the CLI installer and skills have no telemetry |
| Risk Level | MEDIUM |
| Last Verified | 2026-10-20 |

## What It Does

A very large catalog of agent skills (about 2,700 `SKILL.md` files at the audited commit) with an npm CLI installer (`agentic-awesome-skills`), an `aas` CLI, an `aas-mcp` MCP server, plugin bundles for several agent hosts, and a hosted catalog web app at `aaskills.tech`. The repository was renamed from `sickn33/antigravity-awesome-skills` to `sickn33/agentic-awesome-skills` (old URL redirects). Version audited: 19.11.0.

## Telemetry Details

- **Hosted catalog:** Uses Vercel Web Analytics for aggregate visit statistics (the project strips query strings and URL fragments before analytics events) and Supabase for public, aggregate skill-save counts. Saved skills, shortlists and collections stay in browser local storage. This is new information versus March (Vercel Analytics was not listed then)
- **CLI and installer:** Network calls go to GitHub (`git clone`, release `catalog.tgz` downloads) and `registry.npmjs.org` (version checks). No analytics libraries
- **Skills and plugins:** PRIVACY.md (updated 2026-10-11) states skills-only plugins do not collect telemetry or transmit conversation content. Individual skills may describe third-party tools that have their own data practices
- **Scanner hits:** Recent Supabase-related commits (e.g., the `@supabase/supabase-js` bump on 2026-10-18) touch the web app only

## Security Concerns

- **Large surface:** About 2,700 skills from many contributors; full review of every skill is impractical. A malicious or careless skill can still instruct the agent to run harmful commands
- **Installer trust:** The CLI clones the repo and writes skill files into agent config directories. Install only the skills you need
- **New MCP server:** `aas-mcp` adds a persistent MCP process to the trust surface; we did not audit it in depth for this update
- **Hosted catalog:** Visitors are measured by Vercel Web Analytics; search text is part of the navigation URL and browser history
- **Supply chain at scale:** One compromised skill in a bulk update would be hard to spot manually

## How to Opt Out

For hosted-catalog analytics:
1. Browse and install with the CLI or directly from GitHub instead of `aaskills.tech`

General risk mitigation:
1. Read each skill before installing; install individual skills, not the whole catalog
2. Pin the CLI version and review release diffs
3. Periodically audit installed skill files for unexpected content

## Evidence

- Audited commit: [`c808e6e4`](https://github.com/sickn33/agentic-awesome-skills/tree/c808e6e480696d243e0668ebbc3499bb8e7e10a4) (2026-10-19, package.json 19.11.0)
- Privacy policy (plugins collect no telemetry; catalog uses Vercel Web Analytics, Supabase): [PRIVACY.md](https://github.com/sickn33/agentic-awesome-skills/blob/c808e6e480696d243e0668ebbc3499bb8e7e10a4/PRIVACY.md)
- CLI binaries: [package.json#L117-L121](https://github.com/sickn33/agentic-awesome-skills/blob/c808e6e480696d243e0668ebbc3499bb8e7e10a4/package.json#L117-L121)
- CLI network destinations: [tools/bin/install.js#L12-L13](https://github.com/sickn33/agentic-awesome-skills/blob/c808e6e480696d243e0668ebbc3499bb8e7e10a4/tools/bin/install.js#L12-L13), [tools/lib/aas-v1/cache/catalog-release.js#L53](https://github.com/sickn33/agentic-awesome-skills/blob/c808e6e480696d243e0668ebbc3499bb8e7e10a4/tools/lib/aas-v1/cache/catalog-release.js#L53), [tools/lib/aas-v1/cache/update.js#L14](https://github.com/sickn33/agentic-awesome-skills/blob/c808e6e480696d243e0668ebbc3499bb8e7e10a4/tools/lib/aas-v1/cache/update.js#L14)
- Supabase in web app: [apps/web-app/src/context/SkillContext.tsx#L3](https://github.com/sickn33/agentic-awesome-skills/blob/c808e6e480696d243e0668ebbc3499bb8e7e10a4/apps/web-app/src/context/SkillContext.tsx#L3)
- Skill count: `find skills -name SKILL.md | wc -l` = 2,717 at the audited commit
- Repository rename: `GET /repos/sickn33/antigravity-awesome-skills` resolves to `sickn33/agentic-awesome-skills` (GitHub API, 2026-10-20)
- Star count: GitHub API, 48,042 on 2026-10-20

## Changelog
- 2026-03-23: Initial entry
- 2026-10-20: Re-verified at c808e6e4 (v19.11.0). Repository renamed to sickn33/agentic-awesome-skills (redirects). Skill count 1,304 -> about 2,700. Hosted catalog now documents Vercel Web Analytics in addition to Supabase; CLI and skills still have no telemetry. Noted new `aas` CLI and `aas-mcp` server. Stars 27K -> 48K.
