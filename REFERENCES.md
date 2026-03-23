# References & Credits

This project builds on extensive prior security research. We credit all original researchers whose work informed our findings.

## CVEs

| CVE | CVSS | Reporter | Description |
|-----|------|----------|-------------|
| [CVE-2025-59536](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) | 8.7 | Check Point Research | RCE via malicious settings.json hooks |
| [CVE-2026-21852](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) | 5.3 | Check Point Research | API key exfiltration via ANTHROPIC_BASE_URL |
| [CVE-2026-33068](https://raxe.ai/labs/advisories/RAXE-2026-040) | 7.7 | RAXE Labs | Workspace trust dialog bypass |
| [CVE-2026-24052](https://github.com/advisories/GHSA-vhw5-3g5m-8ggf) | — | — | WebFetch SSRF via domain validation bypass |

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

## Security Best Practices

- **Trail of Bits** — [claude-code-config](https://github.com/trailofbits/claude-code-config) — Opinionated security defaults
- **Anthropic** — [Claude Code Sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing)
- **Anthropic** — [Claude Code Security](https://www.anthropic.com/news/claude-code-security)
- **Backslash Security** — [Claude Code Security Best Practices](https://www.backslash.security/blog/claude-code-security-best-practices)
- **Snyk** — [agent-scan](https://github.com/snyk/agent-scan) — Open-source AI agent security scanner

## News Coverage

- [Dark Reading — Flaws in Claude Code Put Developers' Machines at Risk](https://www.darkreading.com/application-security/flaws-claude-code-developer-machines-risk) (Feb 2026)
- [The Register — Claude Code CVEs](https://www.theregister.com/2026/02/26/clade_code_cves/)
- [The Hacker News — Claude Code Flaws Allow RCE](https://thehackernews.com/2026/02/claude-code-flaws-allow-remote-code.html)
- [Axios — Claude Skills Ransomware Risk](https://www.axios.com/2025/12/02/anthropic-claude-skills-medusalocker-ransomware)

## Related Projects

- [agent-snitch-list](https://github.com/pwchiefy/agent-snitch-list) — Companion project auditing telemetry in 98+ AI coding tools
- [JF10R/Snitch](https://github.com/JF10R/Snitch) — Security auditing tool for AI coding assistants

---

*If we missed crediting your work, please [open an issue](https://github.com/pwchiefy/skills-snitch-list/issues) and we'll add it.*
