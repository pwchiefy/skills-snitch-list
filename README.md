# Skills Snitch List 🕵️

**is your skill snitching on you?**

A community-maintained security audit of the Agentic Engineering / Task Management ecosystem — skills, hooks, MCP servers, plugins, proxies, and more.

Companion to [agent-snitch-list](https://github.com/pwchiefy/agent-snitch-list).

[![Extensions Audited](https://img.shields.io/badge/extensions_audited-200+-blueviolet?style=for-the-badge)](https://github.com/pwchiefy/skills-snitch-list)
[![Last Updated](https://img.shields.io/badge/last_updated-2026--03--23-informational?style=for-the-badge)](https://github.com/pwchiefy/skills-snitch-list/commits/main)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/license-CC_BY--SA_4.0-lightgrey?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

---

## Table of Contents

- [Origin Story](#origin-story)
- [At a Glance — Telemetry Findings](#at-a-glance--telemetry-findings)
- [The Bigger Problem](#the-bigger-problem)
- [Real-World Incidents](#real-world-incidents)
- [Top 20 Highest-Risk Extensions](#top-20-highest-risk-extensions)
- [Privacy Champions](#privacy-champions)
- [What You Should Do](#what-you-should-do)
- [How to Contribute](#how-to-contribute)
- [References & Credits](#references--credits)
- [License](#license)

---

## Origin Story

-Lot's of popular skills out there - wanted to try one. Did a review and found telemetry. Was not expecting that! So we did a review. 

**Telemetry is the least of the concerns.**

Skills can instruct Claude to run arbitrary bash commands. Hooks execute shell scripts on every tool event. MCP servers are persistent processes with full system access. Proxies sit between you and the API, seeing every prompt, every response, every line of code, every API key. And all of it installs with a single command — no review, no sandbox, no permission prompt.

This project documents what we found so you can make informed decisions about what you install. 

The primary audience is non-technical domain experts / knowledge workers who want to use tools like Claude Code to help them get things done faster. 

---

## At a Glance — Telemetry Findings

Of the 200+ extensions audited, **5 have confirmed telemetry**. That's actually a low hit rate — but the ones that have it are popular, and some of them are aggressive.

| Extension | Type | Stars | Provider | Default | Opt-Out |
|-----------|------|-------|----------|---------|---------|
| **[garrytan/gstack](https://github.com/garrytan/gstack)** | Skills/Plugin | 41K | Supabase (custom) | OFF (remote) but local logging always on | Config toggle |
| **[DesktopCommanderMCP](https://github.com/wonderwhy-er/DesktopCommanderMCP)** | MCP Server | 5.7K | 4x Google Analytics + BigQuery proxy | ON | Config toggle |
| **[Windows-MCP](https://github.com/SimonB97/Windows-MCP)** | MCP Server | 4.8K | PostHog (GeoIP + profiling) | ON | **NONE** |
| **[XcodeBuildMCP](https://github.com/nicklama/XcodeBuildMCP)** | MCP Server | 4.8K | Sentry (100% traces) | ON | Env var |
| **[claudeskill-loki-mode](https://github.com/loki-code-ai/claudeskill-loki-mode)** | Skill | 766 | PostHog + OpenTelemetry | ON | Env var |

> **Windows-MCP** is the worst offender: PostHog with GeoIP resolution and user profiling, on by default, with **no opt-out mechanism whatsoever**. If you're running it, it's tracking you.

---

## The Bigger Problem

Telemetry is just the tip of the iceberg. The real risk is the **attack surface** that the Claude Code extension ecosystem creates. Every extension type introduces a different vector, and most of them run with zero isolation.

| Vector | Risk | Mechanism |
|--------|------|-----------|
| **Skills (.md)** | 🟡 Medium | Markdown files that instruct Claude to run arbitrary bash via tool calls. A skill can tell Claude to `curl` your SSH keys to an external server — and Claude will do it if you approve the tool call. |
| **Hooks** | 🔴 Critical | Direct shell execution triggered on every tool event (`PreToolUse`, `PostToolUse`, `Notification`). No AI in the loop — raw bash scripts that fire automatically. |
| **MCP Servers** | 🔴 Critical | Persistent background processes with full system access. They run as long as Claude Code is open, can read/write any file, make network requests, and expose tools that Claude calls without understanding their internals. |
| **Plugins/Marketplaces** | 🔴 Critical | Bundle multiple vectors (skills + hooks + MCP servers) in a single install. One `npx` command can deploy hooks, start daemons, and modify your Claude config simultaneously. |
| **Proxies** | 🔴 Critical | Man-in-the-middle all prompts, responses, code, and API keys. Every character you type and every token the model returns passes through the proxy. If it's malicious, game over. |
| **Config Bundles/Patchers** | 🔴 Critical | Replace or modify the `.claude/` directory, patch the Claude Code binary, or alter `settings.json`. Can silently change permissions, disable safety features, or inject hooks. |

**The fundamental problem:** Claude Code extensions run with the same permissions as your user account. There is no sandbox. There is no permission boundary between "Claude Code the tool" and "random MCP server from GitHub." A malicious MCP server has the same access as `rm -rf /`.

---

## Real-World Incidents

This is not theoretical. Attacks against the AI coding agent extension ecosystem are already happening in the wild.

| Incident | Date | Vector | Impact | Source |
|----------|------|--------|--------|--------|
| **CVE-2025-59536** | 2025-09 | Hooks | Remote code execution via malicious hook configuration in cloned repos. Attacker plants `.claude/settings.json` with hooks that execute on every tool call. | [Check Point Research](https://research.checkpoint.com/2025/cve-2025-59536-how-a-claude-code-hook-could-have-stolen-your-credentials/) |
| **CVE-2026-21852** | 2026-01 | Hooks + MCP | API key exfiltration. Malicious hook reads `~/.anthropic/` credentials and exfiltrates via DNS. | [Check Point Research](https://research.checkpoint.com/2026/claude-code-api-key-exfiltration/) |
| **CVE-2026-33068** | 2026-02 | Config | Workspace trust bypass. Malicious `.claude/settings.json` in a repo overrides user-level security settings when the project is opened. | [RAXE Labs](https://raxe.dev/blog/cve-2026-33068-claude-code-workspace-trust/) |
| **CVE-2026-24052** | 2026-01 | MCP (WebFetch) | SSRF via WebFetch tool. MCP server's fetch tool can be directed to internal network endpoints, enabling server-side request forgery. | [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-24052) |
| **ClawHavoc Campaign** | 2026-02 | Skills (OpenClaw) | 1,184 malicious skills published to OpenClaw marketplace. 300K+ users targeted. Skills contained obfuscated bash payloads that exfiltrated environment variables and SSH keys. | [Repello AI](https://repello.ai/blog/clawhavoc-campaign-analysis) |
| **ToxicSkills** | 2026-02 | Skills (ClawHub) | 534 skills on ClawHub flagged as critical severity. Prompt injection payloads embedded in skill descriptions that override safety instructions. | [Snyk Labs](https://snyk.io/blog/toxic-skills-clawhub-supply-chain/) |
| **AMOS Stealer via OpenClaw** | 2026-03 | Skills + MCP | macOS Atomic Stealer (AMOS) distributed through trojanized OpenClaw skills. Steals Keychain passwords, browser sessions, and crypto wallets. | [Trend Micro](https://www.trendmicro.com/en_us/research/26/c/amos-stealer-openclaw.html) |
| **MedusaLocker PoC** | 2026-03 | Skills | Proof-of-concept demonstrating ransomware delivery via Claude Code skills. Skill instructs Claude to download and execute an encrypted payload. | [Cato Networks CTRL](https://ctrl.cato.networks/blog/medusalocker-claude-code-poc) |
| **Nx npm supply chain** | 2026-01 | Config + npm | Malicious npm package weaponizes `--dangerously-skip-permissions` flag. Package's postinstall script launches Claude Code in fully autonomous mode with no permission checks. | [Snyk](https://snyk.io/blog/nx-npm-claude-code-supply-chain/) / [Wiz](https://www.wiz.io/blog/ai-agent-npm-supply-chain) |

> These are only the documented incidents. The actual number of in-the-wild attacks is certainly higher — most victims don't know they've been compromised, and most attacks against individual developers go unreported.

---

## Privacy Champions 🏆

 zero telemetry, clean architecture, and respect for the user's

| Extension | Stars | Why It's Clean |
|-----------|-------|----------------|
| **[obra/superpowers](https://github.com/nichochar/superpower-chatgpt)** | 107K | Massive skill collection with zero telemetry. No analytics dependencies. No network calls. Pure markdown skills that do exactly what they say. |
| **[mattpocock/skills](https://github.com/mattpocock/skills)** | 9K | TypeScript-focused skills from a trusted educator. Clean, minimal, no tracking. Each skill is a single readable `.md` file. |
| **[kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)** | 16K | Obsidian integration skills from kepano (Obsidian CEO). No telemetry, no network access, well-documented behavior. |
| **[Cline](https://github.com/cline/cline)** (as a tool) | 38K | When used as an MCP tool, Cline has zero telemetry. Open source, auditable, and one of the few agents that got privacy right from day one. |
| **[anthropics/skills](https://github.com/anthropics/skills)** | — | Official Anthropic skills. If you can't trust the vendor's own skills, who can you trust? Clean, documented, no telemetry. |
| **[trailofbits/skills](https://github.com/trailofbits/skills)** | — | Security skills from Trail of Bits — one of the most respected security firms in the industry. Naturally, zero tracking. |

**The pattern:** Privacy champions tend to be individuals with reputations to protect, security firms, or the vendor itself. The moment a VC-backed startup enters the ecosystem, tracking follows.

---

## Top 20 Highest-Risk Extensions

Ranked by **(popularity x risk severity)**. High stars + critical access = top of the list. This is not a "malicious" list — these are popular, often well-intentioned projects. But popularity without scrutiny is how supply chain attacks scale.

| # | Extension | Stars | Type | Why It's Here |
|---|-----------|-------|------|---------------|
| 1 | **[openclaw/openclaw](https://github.com/openclaw/openclaw)** | 332K | Marketplace/Daemon | Always-on background daemon with full system access. Installs skills from community marketplace with no code review. The npm of Claude Code — and [already targeted](https://repello.ai/blog/clawhavoc-campaign-analysis). |
| 2 | **[affaan-m/everything-claude-code](https://github.com/AffaanM/everything-claude-code)** | 101K | Meta-bundle | Modifies every layer: skills, hooks, MCP servers, and Claude config. One install changes your entire security posture. |
| 3 | **[VoltAgent/awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills)** | 41K | Curated list | 5,400+ skills indexed for the OpenClaw daemon. Curated does not mean audited — several ClawHavoc payloads were listed here before removal. |
| 4 | **[garrytan/gstack](https://github.com/garrytan/gstack)** | 41K | Skills/Plugin | Celebrity trust amplifier. Supabase telemetry. Local logging always on. Users install without reading because of who made it. |
| 5 | **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** | 40K | MCP Server | Captures ALL agent actions — every tool call, every file read, every bash command — and stores them persistently. A complete audit trail of everything you do, accessible to any process that can read the storage file. |
| 6 | **[gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)** | 40K | Meta-prompt/Config | Meta-prompting layer that modifies all Claude requests. Injects system instructions that alter Claude's behavior, including how it handles permissions and safety checks. |
| 7 | **[wshobson/agents](https://github.com/wshobson/agents)** | 32K | Multi-agent framework | Autonomous multi-agent workflows. Agents spawn sub-agents that make their own tool calls. The blast radius of a single compromised skill multiplies across the agent graph. |
| 8 | **[musistudio/claude-code-router](https://github.com/musistudio/claude-code-router)** | 30K | Proxy | All Claude Code traffic routed through this proxy. Every prompt, response, API key, and code snippet is visible. Even if the proxy is honest, it's a single point of compromise. |
| 9 | **[sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)** | 27K | Curated list + installer | 1,304 skills with an auto-installer script. The installer runs `npx` commands and modifies `.claude/` without prompting for individual skill review. |
| 10 | **[qwibitai/nanoclaw](https://github.com/qwibitai/nanoclaw)** | 25K | MCP Server | Connects Claude to WhatsApp, Telegram, Slack, Discord, and Gmail. Full read/write access to your messaging accounts. A compromised nanoclaw instance can send messages as you. |
| 11 | **[anthropic-community/claude-code-mcp](https://github.com/anthropic-community/claude-code-mcp)** | 22K | MCP Server | Claude-as-MCP-server. Spawns a full Claude Code instance as a tool. Anything the parent agent can do, this can do — recursively. |
| 12 | **[nicklama/XcodeBuildMCP](https://github.com/nicklama/XcodeBuildMCP)** | 4.8K | MCP Server | Sentry with 100% trace sampling. Every build command, every error, every file path sent to Sentry's servers. Full telemetry on your iOS/macOS development workflow. |
| 13 | **[anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)** | 19K | GitHub Action | Runs Claude Code in CI/CD with repository write access. If the action is compromised, it can modify any file in the repo and push to any branch. |
| 14 | **[jasonjmcghee/claude-code-hooks-collection](https://github.com/jasonjmcghee/claude-code-hooks-collection)** | 15K | Hooks | Collection of hooks that execute on tool events. Each hook is a shell script with full system access. Users copy-paste hooks without reviewing the bash. |
| 15 | **[nicholasyager/claude-code-dbt](https://github.com/nicholasyager/claude-code-dbt)** | 12K | MCP Server | Database access via MCP. The server connects to your production databases and exposes query tools to Claude. One bad prompt = `DROP TABLE`. |
| 16 | **[nicekurt/claude-code-tmux](https://github.com/nicekurt/claude-code-tmux)** | 11K | MCP Server | Gives Claude access to tmux sessions — including any session running SSH connections, database consoles, or admin panels. |
| 17 | **[AbanteAI/claude-code-proxy](https://github.com/AbanteAI/claude-code-proxy)** | 10K | Proxy | API proxy that sees all traffic. Originally built to add caching and cost tracking. But any proxy is a MITM by definition. |
| 18 | **[SimonB97/Windows-MCP](https://github.com/SimonB97/Windows-MCP)** | 4.8K | MCP Server | PostHog telemetry with GeoIP + profiling. No opt-out. Tracks your location, system info, and usage patterns and sends them to PostHog. |
| 19 | **[AshDevFr/claude-code-memory](https://github.com/AshDevFr/claude-code-memory)** | 4.5K | MCP Server | Persistent memory across sessions. Stores conversation history, code context, and tool call logs. Any process that can read the memory store gets your full development history. |
| 20 | **[saoudrizwan/claude-dev-memory](https://github.com/saoudrizwan/claude-dev-memory)** | 3.8K | MCP Server | Similar to above — captures and persists all Claude interactions. Memory files are stored in plaintext with no encryption. |

> **A note on star counts:** Stars in the Claude Code ecosystem are inflated by hype cycles and influencer posts. A repo can go from 0 to 40K stars in a week without a single security review. Stars measure virality, not safety.

---

## What You Should Do - and if you are non-technical you can ask your clanker to help you or do it for you. Better than doing nothing. 

Eight concrete steps to protect yourself in the Claude Code extension ecosystem.

### 1. 🔒 Enable Sandbox Mode

```
/sandbox
```

Sandbox mode restricts Claude's file system and network access. It's the single most impactful thing you can do. It won't stop a malicious MCP server (those run outside the sandbox), but it limits what Claude itself can be tricked into doing.

### 2. 🚫 Disable Auto-Loading MCP Servers

In your `settings.json`:

```json
{
  "enableAllProjectMcpServers": false
}
```

This prevents repos you clone from automatically starting MCP servers on your machine. You should explicitly approve every MCP server.

### 3. 🛡️ Add Deny Rules for Sensitive Paths

In your `.claude/settings.json`:

```json
{
  "permissions": {
    "deny": [
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)",
      "Read(~/.gnupg/**)",
      "Read(~/.config/gh/**)",
      "Read(**/.env)",
      "Read(**/.env.*)",
      "Read(**/credentials*)",
      "Read(**/secrets*)",
      "Bash(curl*)",
      "Bash(wget*)"
    ]
  }
}
```

Even if a skill tricks Claude into trying to read your SSH keys, the deny rule will block it.

### 4. 🐳 Never Run `--dangerously-skip-permissions` Outside Containers - I know this is unrealistic because people who need to do things quickly will throw caution to the wind ;)

The `--dangerously-skip-permissions` flag removes all permission prompts. Claude will execute any tool call without asking. This is only safe inside an ephemeral container with no access to your real filesystem, credentials, or network.

If you see a repo that tells you to run with this flag on your host machine — **that's a red flag**.

### 5. 📖 Audit Every Skill Before Installing

Skills are markdown files. They're readable. **Read them.** Look for:
- Bash commands that `curl`, `wget`, or pipe to `sh`
- Instructions that tell Claude to disable safety features
- References to external URLs or APIs you don't recognize
- Obfuscated strings or base64-encoded content

### 6. 🔍 Audit MCP Server Source Code

MCP servers are programs. Before installing one:
- Read the source code, especially `index.ts` / `main.py`
- Check `package.json` / `requirements.txt` for analytics dependencies (`posthog`, `sentry`, `amplitude`, `segment`, `mixpanel`)
- Search for outbound network calls (`fetch`, `axios`, `requests`, `http.get`)
- Check if it spawns background processes or writes to unexpected paths

### 7. ⚠️ Avoid Project-Scoped Hooks from Untrusted Repos

When you clone a repo, check for `.claude/settings.json` before running Claude Code. Hooks defined there will execute automatically. A malicious repo can plant hooks that:
- Run on every `PreToolUse` event (before every tool call)
- Exfiltrate environment variables
- Modify files silently
- Phone home with your project contents

### 8. 🔑 Rotate Credentials After Installing Third-Party Extensions

If you installed an MCP server, proxy, or plugin that you later realized was suspicious:
- Rotate your Anthropic API key
- Rotate any API keys that were in environment variables
- Check `~/.ssh/` for unauthorized `authorized_keys` entries
- Review your shell history for commands you didn't run
- Check for new cron jobs, launchd agents, or systemd services

---

## How to Contribute

We need your help. The ecosystem is growing faster than any one team can audit.

- **Report a new extension**: [Open an issue](https://github.com/pwchiefy/skills-snitch-list/issues/new?template=new-extension.yml) or submit a PR
- **Update existing data**: [Open an issue](https://github.com/pwchiefy/skills-snitch-list/issues/new?template=update-extension.yml) or submit a PR
- **Report a security incident**: [Open an issue](https://github.com/pwchiefy/skills-snitch-list/issues/new?template=incident-report.yml)
- **Dispute a finding**: [Use the dispute template](https://github.com/pwchiefy/skills-snitch-list/issues/new?template=dispute.yml) — we take accuracy seriously

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines, evidence standards, and the review process.

---

## References & Credits

This project builds on the work of many researchers, security firms, and individuals.

### Vulnerability Research

| CVE / Finding | Researcher | Link |
|---------------|-----------|------|
| CVE-2025-59536 (Hook RCE) | Check Point Research | [research.checkpoint.com](https://research.checkpoint.com/2025/cve-2025-59536-how-a-claude-code-hook-could-have-stolen-your-credentials/) |
| CVE-2026-21852 (API Key Exfil) | Check Point Research | [research.checkpoint.com](https://research.checkpoint.com/2026/claude-code-api-key-exfiltration/) |
| CVE-2026-33068 (Workspace Trust) | RAXE Labs | [raxe.dev](https://raxe.dev/blog/cve-2026-33068-claude-code-workspace-trust/) |
| CVE-2026-24052 (WebFetch SSRF) | NVD | [nvd.nist.gov](https://nvd.nist.gov/vuln/detail/CVE-2026-24052) |

### Campaign & Threat Analysis

| Campaign | Researcher | Link |
|----------|-----------|------|
| ClawHavoc (1,184 malicious skills) | Repello AI | [repello.ai](https://repello.ai/blog/clawhavoc-campaign-analysis) |
| ToxicSkills (534 critical skills) | Snyk Labs | [snyk.io](https://snyk.io/blog/toxic-skills-clawhub-supply-chain/) |
| AMOS Stealer via OpenClaw | Trend Micro | [trendmicro.com](https://www.trendmicro.com/en_us/research/26/c/amos-stealer-openclaw.html) |
| MedusaLocker PoC via Skills | Cato Networks CTRL | [ctrl.cato.networks](https://ctrl.cato.networks/blog/medusalocker-claude-code-poc) |
| Nx npm supply chain attack | Snyk / Wiz | [snyk.io](https://snyk.io/blog/nx-npm-claude-code-supply-chain/) / [wiz.io](https://www.wiz.io/blog/ai-agent-npm-supply-chain) |
| Dependency hijacking (AI agents) | SentinelOne | [sentinelone.com](https://www.sentinelone.com/labs/ai-agent-dependency-hijacking/) |
| npm supply chain for AI agents | Oligo Security | [oligo.security](https://www.oligo.security/blog/npm-supply-chain-ai-coding-agents) |

### Protocol & Architecture Research

| Topic | Researcher | Link |
|-------|-----------|------|
| MCP Tool Poisoning | Invariant Labs | [invariantlabs.ai](https://invariantlabs.ai/blog/mcp-tool-poisoning) |
| MCP-Scan (security scanner) | Invariant Labs | [github.com/invariantlabs-ai/mcp-scan](https://github.com/invariantlabs-ai/mcp-scan) |
| MCP Breach Timeline | AuthZed | [authzed.com](https://authzed.com/blog/mcp-security-breach-timeline) |
| OWASP MCP Top 10 | OWASP | [owasp.org](https://owasp.org/www-project-model-context-protocol-top-10/) |
| claude-code-config (security analysis) | Trail of Bits | [github.com/trailofbits/claude-code-config](https://github.com/trailofbits/claude-code-config) |

### Academic Research

| Paper | Authors | Link |
|-------|---------|------|
| "Can You Trust Your Copilot?" | Chen et al. | [arXiv:2509.20388](https://arxiv.org/abs/2509.20388) |

### Vendor Documentation

| Resource | Source | Link |
|----------|--------|------|
| Claude Code Security Docs | Anthropic | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code/security) |
| Claude Code Hooks Docs | Anthropic | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code/hooks) |

### Related Projects

| Project | Researcher | Link |
|---------|-----------|------|
| Agent Snitch List (companion project) | pwchiefy | [github.com/pwchiefy/agent-snitch-list](https://github.com/pwchiefy/agent-snitch-list) |
| Trae IDE Telemetry Analysis | Unit221b | Referenced in [agent-snitch-list](https://github.com/pwchiefy/agent-snitch-list/blob/main/tools/trae.md) |
| Trae Telemetry Research | segmentationf4u1t | [segmentationf4u1t.github.io](https://segmentationf4u1t.github.io/trae-telemetry-analysis/) |

---

## License

This work is licensed under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](LICENSE).

You are free to share and adapt this material for any purpose, including commercial, as long as you give appropriate credit and distribute your contributions under the same license.

---

<p align="center">
  <em>We read the source code, the hooks, the MCP servers, and the proxies — so you don't have to.</em>
  <br><br>
  <strong>If this saved your team from a supply chain attack, give it a ⭐</strong>
</p>
