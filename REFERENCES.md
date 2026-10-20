# References & Credits

This project builds on extensive prior security research. We credit all original researchers whose work informed our findings.

## CVEs

| CVE | CVSS | Reporter | Description |
|-----|------|----------|-------------|
| [CVE-2025-59536](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) | 8.7 | Check Point Research | RCE via malicious settings.json hooks |
| [CVE-2026-21852](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) | 5.3 | Check Point Research | API key exfiltration via ANTHROPIC_BASE_URL |
| [CVE-2026-33068](https://raxe.ai/labs/advisories/RAXE-2026-040) | 7.7 | RAXE Labs | Workspace trust dialog bypass |
| [CVE-2026-24052](https://github.com/advisories/GHSA-vhw5-3g5m-8ggf) | — | — | Claude Code WebFetch domain validation bypass (automatic requests to attacker-controlled domains) |
| [CVE-2026-35603](https://github.com/advisories/GHSA-5cwg-9f6j-9jvx) | 5.4 (v4) | — | Claude Code on Windows loads a `managed-settings.json` a low-privileged user can plant (fixed 2.1.75) |
| [CVE-2026-39861](https://github.com/advisories/GHSA-vp62-r36r-9xqp) | 7.7 (v4) | — | Claude Code sandbox escape via symlink following (fixed 2.1.64) |
| [CVE-2026-40068](https://github.com/advisories/GHSA-q5hj-mxqh-vv77) | 7.7 (v4) | — | Claude Code trust dialog bypass via git worktree spoofing (fixed 2.1.84) |
| [CVE-2026-46406](https://github.com/advisories/GHSA-4vp2-6q8c-pvq2) | 4.4 (v4) | — | Claude Code `/copy` insecure temporary file (fixed 2.1.128) |
| [CVE-2026-54316](https://github.com/advisories/GHSA-fg94-h982-f3mm) | 6.0 (v4) | — | Claude Code WebFetch pre-approved huggingface.co as an exfiltration channel (fixed 2.1.163) |
| [CVE-2026-55607](https://github.com/advisories/GHSA-7835-87q9-rgvv) | 7.7 (v4) | — | Claude Code sandbox escape via git worktree path confusion (fixed 2.1.163) |
| [CVE-2026-86063](https://github.com/advisories/GHSA-pq7j-f95f-qfcv) | 7.5 (v4) | — | Claude Code plugin hash-pin bypass via SHA-named branch (fixed 2.1.179) |
| [CVE-2026-104850](https://github.com/advisories/GHSA-6qxp-vccf-f47h) | 7.5 | — | MCP TypeScript SDK OAuth client could send credentials to an authorization server chosen by the MCP server (fixed `@modelcontextprotocol/sdk` 1.31.0) |
| [CVE-2026-52869](https://github.com/advisories/GHSA-jpw9-pfvf-9f58) | 7.1 | — | MCP Python SDK HTTP transports did not bind sessions to the authenticated principal (fixed 1.27.2) |
| [CVE-2026-75130](https://nvd.nist.gov/vuln/detail/CVE-2026-75130) | — | Noma Security | Context7 Custom Rules prompt injection ("ContextCrush") |
| [CVE-2026-49471](https://github.com/advisories/GHSA-37h2-6p4f-mp3q) | 8.3 | — | Serena dashboard DNS rebinding leading to memory poisoning and RCE (fixed 1.5.2) |
| [CVE-2026-44970](https://github.com/dbt-labs/dbt-mcp/security/advisories/GHSA-jj54-r8gm-2fcf) | 3.1 | — | dbt-mcp telemetry sent unredacted tool arguments, including SQL (fixed 1.17.1) |
| [CVE-2026-45582](https://github.com/advisories/GHSA-f3rg-xqjj-cj9w) | 6.5 | — | n8n-mcp telemetry sanitizer retained fragments of URL-shaped parameters (fixed 2.51.3) |
| [CVE-2026-31240](https://github.com/advisories/GHSA-jfv9-68m5-gjjr) | 7.5 | — | mem0 server memory API without authentication or authorization |
| [CVE-2026-53765](https://github.com/advisories/GHSA-3pvj-jv98-qhjq) / [CVE-2026-53766](https://github.com/advisories/GHSA-8qf9-62x2-82pp) | 6.1 | — | chrome-devtools-mcp symlink handling issues |
| [CVE-2025-61260](https://github.com/advisories/GHSA-xrxf-jgv3-qmrm) | 9.8 | Check Point Research | Codex CLI command execution through a repo's MCP configuration |
| [CVE-2026-12537](https://github.com/advisories/GHSA-wpqr-6v78-jr5g) | 10.0 | — | Gemini CLI headless workspace trust and tool allowlist bypass |
| [CVE-2026-45033](https://github.com/advisories/GHSA-9ccr-r5hg-74gf) | 8.5 (v4) | — | Copilot CLI nested bare repository `core.fsmonitor` command execution |
| [CVE-2026-44641](https://github.com/microsoft/apm/security/advisories/GHSA-xhrw-5qxx-jpwr) | 7.1 | — | Microsoft APM plugin.json paths escape plugin root during install |

CVSS is the GitHub Advisory Database score (CVSS v3.1 unless marked v4), checked 2026-10-20. "—" means no score was published.

## Supply Chain Attack Research

- **Repello AI** — [ClawHavoc: Inside the Supply Chain Attack on 300,000 AI Agent Users](https://repello.ai/blog/clawhavoc-supply-chain-attack) (Feb 2026)
- **Repello AI** — [Malicious OpenClaw Skills Exposed: Full Teardown](https://repello.ai/blog/malicious-openclaw-skills-exposed-a-full-teardown)
- **Repello AI** — [Claude Code Skill Security: How to Audit Any Skill](https://repello.ai/blog/claude-code-skill-security)
- **Snyk Labs** — [ToxicSkills: Malicious AI Agent Skills on ClawHub](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) (Feb 2026). Scanned 3,984 skills; found 534 critical, 76 confirmed malicious.
- **Snyk Labs** — [From SKILL.md to Shell Access in Three Lines of Markdown](https://snyk.io/articles/skill-md-shell-access/)
- **Trend Micro** — [Malicious OpenClaw Skills Used to Distribute Atomic macOS Stealer](https://www.trendmicro.com/en_us/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html) (Feb 2026)
- **Cato Networks/CTRL** — [Weaponizing Claude Skills with MedusaLocker Ransomware](https://www.catonetworks.com/blog/cato-ctrl-weaponizing-claude-skills-with-medusalocker/) (Dec 2025)
- **SentinelOne** — [Marketplace Skills and Dependency Hijack in Claude Code](https://www.sentinelone.com/blog/marketplace-skills-and-dependency-hijack-in-claude-code/)
- **Snyk** — [Weaponizing AI Coding Agents for Malware in the Nx Incident](https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/)
- **Oligo Security** — [NPM Supply Chain Attacks: Hidden Risks for AI Agents](https://www.oligo.security/blog/the-hidden-risks-of-the-npm-supply-chain-attacks-ai-agents)
- **Wiz** — [s1ngularity Supply Chain Attack Full Timeline](https://www.wiz.io/blog/s1ngularity-supply-chain-attack)
- **Socket** — [SANDWORM_MODE: npm worm poisons AI toolchains](https://socket.dev/blog/sandworm-mode-npm-worm-ai-toolchain-poisoning) (Feb 2026)
- **GitHub Advisory Database** — [Unauthorized npm publish of cline@2.3.0, GHSA-9ppg-jx86-fqw7](https://github.com/advisories/GHSA-9ppg-jx86-fqw7) (Feb 2026)
- **LiteLLM** — [Security update, March 2026](https://docs.litellm.ai/blog/security-update-march-2026); **Snyk** — [Poisoned security scanner backdooring LiteLLM](https://snyk.io/blog/poisoned-security-scanner-backdooring-litellm/)
- **Zscaler ThreatLabz** — [Claude Code leak used to distribute Vidar and GhostSocks](https://www.zscaler.com/blogs/security-research/anthropic-claude-code-leak) (Apr 2026)
- **SafeDep** — [Mini Shai-Hulud strikes again](https://safedep.io/mini-shai-hulud-strikes-again-314-npm-packages-compromised) (May 2026); advisory [GHSA-qgmj-c898-99rq](https://github.com/advisories/GHSA-qgmj-c898-99rq)
- **Endor Labs** — [Mastra npm org compromised](https://www.endorlabs.com/learn/mastra-npm-org-compromised-multiple-packages-trojanized-to-drop-a-remote-payload-via-easy-day-js) (Jun 2026); advisory [GHSA-wfr8-6x4q-hpr3](https://github.com/advisories/GHSA-wfr8-6x4q-hpr3)
- **OpenSSF / OSV** — [MAL-2026-5479: `mcp-server-github` name squat](https://osv.dev/vulnerability/MAL-2026-5479); [GHSA-88f3-qjxp-rpp3: `mcp-server-fetch`](https://github.com/advisories/GHSA-88f3-qjxp-rpp3)
- **Elastic Security Labs** — [Apex Accelerator malicious npm packages (REF8801)](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages) (Oct 2026)
- **GitHub Advisory Database** — agent-tool impersonation packages: [opencode2](https://github.com/advisories/GHSA-8w65-j2wh-mqv7), [claude-desktop-setup](https://github.com/advisories/GHSA-f4mf-vhm8-xxqc) (Oct 2026)

## MCP Security Research

- **Trail of Bits** — [Jumping the Line: How MCP Servers Can Attack Before You Use Them](https://blog.trailofbits.com/2025/04/21/jumping-the-line-how-mcp-servers-can-attack-you-before-you-ever-use-them/) (Apr 2025)
- **Trail of Bits** — [mcp-context-protector](https://github.com/trailofbits/mcp-context-protector)
- **AuthZed** — [A Timeline of MCP Security Breaches](https://authzed.com/blog/timeline-mcp-breaches) (Nov 2025)
- **AuthZed** — [MCP is Not Secure](https://authzed.com/blog/mcp-is-not-secure)
- **Invariant Labs** — [MCP Security Notification: Tool Poisoning Attacks](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks) (Apr 2025)
- **Invariant Labs** — [WhatsApp MCP Exploited](https://invariantlabs.ai/blog/whatsapp-mcp-exploited)
- **OWASP** — [MCP Top 10](https://owasp.org/www-project-mcp-top-10/)
- **Equixly** — [MCP Servers: The New Security Nightmare](https://equixly.com/blog/2025/03/29/mcp-server-new-security-nightmare/) — 43% unsafe shell calls
- **Docker** — [MCP Horror Stories: Supply Chain Attack](https://www.docker.com/blog/mcp-horror-stories-the-supply-chain-attack/)
- **Red Hat** — [MCP: Understanding Security Risks and Controls](https://www.redhat.com/en/blog/model-context-protocol-mcp-understanding-security-risks-and-controls)
- **AgentSeal** — [1,808 MCP Servers Scanned](https://agentseal.org/blog/mcp-server-security-findings) — 66% had findings
- **Noma Security** — [ContextCrush: the Context7 MCP server vulnerability](https://noma.security/blog/contextcrush-context7-the-mcp-server-vulnerability/) (Mar 2026)
- **Pluto Security** — [Claude extension ecosystem security: practitioner guide (Hookify finding)](https://pluto.security/blog/claude-extension-ecosystem-security-practitioner-guide/) (Apr 2026)
- **Model Context Protocol** — [Specification 2026-07-28 changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) (credential binding to the issuing authorization server, `iss` validation)

## Security Best Practices

- **Trail of Bits** — [claude-code-config](https://github.com/trailofbits/claude-code-config) — Opinionated security defaults
- **Anthropic** — [Claude Code Sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing)
- **Anthropic** — [Claude Code Security](https://www.anthropic.com/news/claude-code-security)
- **Backslash Security** — [Claude Code Security Best Practices](https://www.backslash.security/blog/claude-code-security-best-practices)
- **Snyk** — [agent-scan](https://github.com/snyk/agent-scan) — Open-source AI agent security scanner
- **Anthropic** — [Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing) — what runs outside the sandbox, `credentials`, `failIfUnavailable`
- **Anthropic** — [Configure permissions](https://code.claude.com/docs/en/permissions) and [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) — deny rule caveats, auto mode, `blockReadsOutsideWorkingDirectories`
- **Anthropic** — [What's new, Week 32 2026](https://code.claude.com/docs/en/whats-new/2026-w32) — auto mode becomes the default (2026-08-14)
- **Anthropic** — [Plugin security and trust](https://code.claude.com/docs/en/plugins/security) and [Manage plugins for your organization](https://code.claude.com/docs/en/plugins/org)
- **Anthropic** — [Skills](https://code.claude.com/docs/en/skills) — `allowed-tools`, inline shell, `disableSkillShellExecution`

## News Coverage

- [Dark Reading — Flaws in Claude Code Put Developers' Machines at Risk](https://www.darkreading.com/application-security/flaws-claude-code-developer-machines-risk) (Feb 2026)
- [The Register — Claude Code CVEs](https://www.theregister.com/2026/02/26/clade_code_cves/)
- [The Hacker News — Claude Code Flaws Allow RCE](https://thehackernews.com/2026/02/claude-code-flaws-allow-remote-code.html)
- [Axios — Claude Skills Ransomware Risk](https://www.axios.com/2025/12/02/anthropic-claude-skills-medusalocker-ransomware)

## Extension Telemetry Sources (2026-10-20 audits)

Primary evidence for each extension is pinned and line-linked in its file under [`tools/`](tools/). Two vendor docs are cited directly in the README:

- **Cline** — [Telemetry documentation](https://github.com/cline/cline/blob/0870796e9e0c640408bb87d9503514a83f57d470/docs/enterprise-solutions/monitoring/telemetry.mdx) (telemetry on by default; reason Cline was removed from Privacy Champions)
- **vercel-labs/skills** — [README](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/README.md#L102-L106), [src/telemetry.ts](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/src/telemetry.ts#L1-L2), [troubleshooting](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/docs/troubleshooting.md#L36-L40) (`npx skills` telemetry and opt-out)
- **steipete/claude-code-mcp** — [README](https://github.com/steipete/claude-code-mcp/blob/2e401f3ed81d32435ca6cfe85a3ac1404d318c84/README.md#L18-L25) (`--dangerously-skip-permissions` by default)

## Related Projects

- [agent-snitch-list](https://github.com/pwchiefy/agent-snitch-list) — Companion project auditing telemetry in 98+ AI coding tools
- [JF10R/Snitch](https://github.com/JF10R/Snitch) — Security auditing tool for AI coding assistants

---

*If we missed crediting your work, please [open an issue](https://github.com/pwchiefy/skills-snitch-list/issues) and we'll add it.*

*Last updated 2026-10-20. External article links were checked for reachability on that date.*
