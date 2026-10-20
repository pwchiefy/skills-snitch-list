# Skills Snitch List 🕵️

**is your skill snitching on you?**

A community-maintained security audit of the Agentic Engineering / Task Management ecosystem — skills, hooks, MCP servers, plugins, proxies, and more.

Companion to [agent-snitch-list](https://github.com/pwchiefy/agent-snitch-list).

[![Full Audits](https://img.shields.io/badge/full_audits-31-blueviolet?style=for-the-badge)](tools/)
[![Last Updated](https://img.shields.io/badge/last_updated-2026--10--20-informational?style=for-the-badge)](https://github.com/pwchiefy/skills-snitch-list/commits/main)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/license-CC_BY--SA_4.0-lightgrey?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

> **What changed (2026-10-20 refresh)**
>
> - All 15 existing entries were re-checked against source at pinned commits, and **16 new extensions** were audited, for **31 full audits** in [`tools/`](tools/). Each file has a dated changelog line.
> - **claude-mem** added PostHog telemetry in June 2026, **on by default**. **superpowers** added a small, disclosed usage ping (with an opt-out), so it is no longer listed as a Privacy Champion.
> - **Corrections to our March edition:** Windows-MCP *did* have an opt-out (`ANONYMIZED_TELEMETRY=false`). loki-mode's OpenTelemetry export is opt-in and self-hosted. Several repo links were wrong, and seven Top 20 repositories now return 404 and were removed. Cline is no longer listed as a Privacy Champion because its own docs say telemetry is on by default.
> - **XcodeBuildMCP is now MobileBuildMCP.** If you opted out with `XCODEBUILDMCP_SENTRY_DISABLED`, set `MOBILEBUILDMCP_SENTRY_DISABLED=true` instead. The old variable is no longer read.
> - **New pattern:** some "anonymous" telemetry now carries content: task text, URLs, user queries, LLM prompts and responses, or SQL. See [the callout](#at-a-glance--telemetry-findings).
> - Real-World Incidents gained 26 entries (and 9 March entries had dates, descriptions or links corrected): new Claude Code CVEs, MCP SDK bugs, and npm worms that **write hooks and MCP servers into your Claude config**. "What You Should Do" now reflects auto mode, the plugin security controls, and what the sandbox does *not* cover.
> - The weekly scanner reports for 2026-03-29 through 2026-10-18 are in [`reports/`](reports/).

---

## Table of Contents

- [Origin Story](#origin-story)
- [At a Glance — Telemetry Findings](#at-a-glance--telemetry-findings)
- [The Bigger Problem](#the-bigger-problem)
- [Real-World Incidents](#real-world-incidents)
- [Privacy Champions](#privacy-champions-)
- [Top 20 Highest-Risk Extensions](#top-20-highest-risk-extensions)
- [Full Audit Index](#full-audit-index)
- [What You Should Do](#what-you-should-do---and-if-you-are-non-technical-you-can-ask-your-clanker-to-help-you-or-do-it-for-you-better-than-doing-nothing)
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

We are not anti-telemetry. We are anti-surprise.

---

## At a Glance — Telemetry Findings

Of the 31 extensions with full audits in [`tools/`](tools/), **20 have confirmed telemetry** as of 2026-10-20. Two of them (claude-mem and superpowers) added it after our March review. Most now disclose it and offer an opt-out. What still varies is the default and how much gets sent. Sorted by stars (GitHub API, 2026-10-20).

| Extension | Type | Stars | Provider | Default | Opt-Out |
|-----------|------|-------|----------|---------|---------|
| **[openclaw/openclaw](https://github.com/openclaw/openclaw)** | Daemon/Marketplace | 393K | telemetry.openclaw.ai (daily update check; server records approximate location). Feature stats are opt-in | Update check ON | Config (`update.checkOnStart: false`) or `OPENCLAW_NO_AUTO_UPDATE=1`. `DO_NOT_TRACK` does not stop the update check |
| **[obra/superpowers](https://github.com/obra/superpowers)** | Plugin | 302K | Version-tagged logo request to primeradiant.com (optional visual companion only) | ON (when companion is opened) | Env var (`SUPERPOWERS_DISABLE_TELEMETRY`, `DISABLE_TELEMETRY` or `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`) |
| **[garrytan/gstack](https://github.com/garrytan/gstack)** | Skills/Plugin | 137K | Supabase (custom) | OFF (opt-in prompt; nothing logged while off) | `gstack-config set telemetry off` |
| **[browser-use/browser-use](https://github.com/browser-use/browser-use)** | Library/MCP Server | 119K | PostHog EU (GeoIP on; task text, URLs, results, parent process command lines) | ON | Env var (`ANONYMIZED_TELEMETRY=false`) |
| **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** | Plugin | 102K | PostHog (GeoIP, error tracking, one-time historical backfill) | ON | CLI command or env var (`DO_NOT_TRACK=1`, `CLAUDE_MEM_TELEMETRY=0`) |
| **[mem0ai/mem0](https://github.com/mem0ai/mem0)** | Plugin/SDK | 68K | PostHog (plugin events tied to account email when an API key is set) | ON | Env var (`MEM0_TELEMETRY=false`) |
| **[ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)** | MCP Server | 54K | Google Clearcut (+ CrUX URL lookups) | ON | Flag/env var (`--no-usage-statistics`, `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS`) |
| **[davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)** | Installer CLI | 33K | aitmpl.com tracking endpoints | ON | Env var (`CCT_NO_TRACKING=true`) |
| **[getzep/graphiti](https://github.com/getzep/graphiti)** (MCP server) | MCP Server | 32K | PostHog (one init event) | ON | Env var (`GRAPHITI_TELEMETRY_ENABLED=false`) |
| **[BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban)** | Orchestrator | 28K | PostHog (email attached on sign-in) | ON | Settings toggle, but **signing in turns it back on** |
| **[eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master)** | MCP Server/CLI | 28K | Sentry (LLM inputs/outputs recorded, 100% traces) | ON | Config (`"anonymousTelemetry": false` in `.taskmaster/config.json`) |
| **[slopus/happy](https://github.com/slopus/happy)** | Relay app | 24K | PostHog (mobile/desktop app) | ON | In-app toggle |
| **[czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp)** | MCP Server | 23K | Own ingest (sanitized workflows + intent text, used for ML datasets) | ON | CLI or env var (`npx n8n-mcp telemetry disable`, `N8N_MCP_TELEMETRY_DISABLED=true`) |
| **[winfunc/opcode](https://github.com/winfunc/opcode)** | Desktop GUI | 22K | PostHog | ON (README says "No Telemetry") | Settings toggle |
| **[mcp-use/mcp-use](https://github.com/mcp-use/mcp-use)** | MCP SDK | 10.8K | PostHog EU + Scarf (Python agent sends query and response text) | ON | Env var (`MCP_USE_ANONYMIZED_TELEMETRY=false`) |
| **[DesktopCommanderMCP](https://github.com/wonderwhy-er/DesktopCommanderMCP)** | MCP Server | 10.1K | First-party proxy, which a code comment says feeds BigQuery (privacy policy still names GA4) | ON | Config toggle or env var (`DESKTOP_COMMANDER_DISABLE_TELEMETRY=1`) |
| **[Windows-MCP](https://github.com/CursorTouch/Windows-MCP)** | MCP Server | 9.7K | PostHog (GeoIP + person profiles) | ON | Env var (`ANONYMIZED_TELEMETRY=false`) |
| **[MobileBuildMCP (formerly XcodeBuildMCP)](https://github.com/getsentry/MobileBuildMCP)** | MCP Server | 6.5K | Sentry (100% traces, internal errors only) | ON | Env var or config (`MOBILEBUILDMCP_SENTRY_DISABLED=true`) |
| **[asklokesh/loki-mode](https://github.com/asklokesh/loki-mode)** | Skill + CLI | 1.1K | PostHog | ON (auto-off in CI and non-interactive runs) | CLI command or env var (`loki telemetry off`, `DO_NOT_TRACK=1`) |
| **[dbt-labs/dbt-mcp](https://github.com/dbt-labs/dbt-mcp)** | MCP Server | 610 | dbt Labs telemetry (tool arguments, dbt Cloud account/user IDs) | ON | Env var (`DO_NOT_TRACK=1` or `DBT_SEND_ANONYMOUS_USAGE_STATS=false`) |

> **Correction (2026-10-20):** Our March edition called Windows-MCP "the worst offender" with "no opt-out mechanism whatsoever." That was wrong. Setting `ANONYMIZED_TELEMETRY=false` has turned off its PostHog client since at least December 2025, and its SECURITY.md documents it. Telemetry is still on by default, with GeoIP and person profiles.
>
> **New pattern in 2026: "anonymous" telemetry that carries content.** By default, browser-use sends task text, visited URLs and results. mcp-use sends the user's query and the agent's response. Task Master sends LLM prompts and responses to Sentry. Until a May 2026 fix, dbt-mcp sent tool arguments including SQL ([CVE-2026-44970](https://github.com/dbt-labs/dbt-mcp/security/advisories/GHSA-jj54-r8gm-2fcf)). vibe-kanban turns analytics back on when you sign in, and opcode's README says "No Telemetry" while the app starts PostHog on launch.
>
> **The biggest change since March is claude-mem.** In June 2026 it added PostHog telemetry, on by default, including a one-time upload of activity counts from before telemetry existed. If you use XcodeBuildMCP and opted out with `XCODEBUILDMCP_SENTRY_DISABLED`, the renamed MobileBuildMCP no longer reads that variable.

---

## The Bigger Problem

Telemetry is just the tip of the iceberg. The real risk is the **attack surface** that the Claude Code extension ecosystem creates. Every extension type introduces a different vector, and most of them run with zero isolation.

| Vector | Risk | Mechanism |
|--------|------|-----------|
| **Skills (.md)** | 🟡 Medium | Markdown files that instruct Claude to run arbitrary bash via tool calls. A skill can tell Claude to `curl` your SSH keys to an external server, and Claude will do it if the call is approved. Skills can also embed shell commands (`` !`cmd` ``) that run when the skill loads, and an `allowed-tools` line in a skill **pre-approves** tools for that turn. |
| **Hooks** | 🔴 Critical | Direct shell execution triggered on tool and session events (`PreToolUse`, `PostToolUse`, `SessionStart`, `Notification`, …). No AI in the loop — raw bash scripts that fire automatically. In 2026, npm worms started **writing hooks into `.claude/settings.json`** for persistence. |
| **MCP Servers** | 🔴 Critical | Persistent background processes with full system access. They run as long as Claude Code is open, can read/write any file, make network requests, and expose tools that Claude calls without understanding their internals. Local MCP servers run **outside** Claude Code's sandbox. |
| **Plugins/Marketplaces** | 🔴 Critical | Bundle multiple vectors in a single install: skills, hooks, MCP and LSP servers, background **monitors**, **mods** (JavaScript running inside Claude Code), and a `bin/` directory added to Claude's PATH. Plugins auto-update per marketplace, so the code you reviewed can change. |
| **Proxies** | 🔴 Critical | See all prompts, responses, code, and API keys in transit. Every character you type and every token the model returns passes through the proxy. If it's malicious, game over. (The LiteLLM PyPI compromise in March 2026 showed this is not hypothetical.) |
| **Config Bundles/Patchers** | 🔴 Critical | Replace or modify the `.claude/` directory, patch the Claude Code binary, or alter `settings.json`. Can silently change permissions, disable safety features, or inject hooks. |
| **Remote relays and orchestrators** | 🔴 Critical | New in this edition. Tools like Happy and vibe-kanban let phones, browsers or a web UI drive an agent on your machine, often with `--dangerously-skip-permissions` preset. The relay becomes part of your trust boundary. |

**The fundamental problem:** extensions run with the same permissions as your user account. Claude Code now has a Bash sandbox and an auto-mode classifier, but by its own docs, **hooks, local MCP servers, plugin monitors and LSP servers run outside the sandbox** ([Anthropic docs](https://code.claude.com/docs/en/sandboxing)). A malicious MCP server still has the same access as `rm -rf ~`.

**Protocol note:** the [2026-07-28 MCP specification](https://modelcontextprotocol.io/specification/2026-07-28/changelog) requires clients to bind stored credentials to the authorization server that issued them, and to validate the `iss` parameter. That closes the class of bug behind [CVE-2026-104850](https://github.com/advisories/GHSA-6qxp-vccf-f47h), but only in clients and SDKs that implement the new revision.

---

## Real-World Incidents

This is not theoretical. Attacks against the AI coding agent extension ecosystem are already happening in the wild. Dates are disclosure or advisory dates. Corrected 2026-10-20: several March entries had wrong dates or links.

| Incident | Date | Vector | Impact | Source |
|----------|------|--------|--------|--------|
| **Nx npm supply chain (s1ngularity)** | 2025-08 | Config + npm | Malicious Nx releases (live about 5 hours) used installed AI CLIs, including Claude Code with `--dangerously-skip-permissions`, to hunt for secrets and wallets on the victim's machine. | [Snyk](https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/) / [Wiz](https://www.wiz.io/blog/s1ngularity-supply-chain-attack) |
| **CVE-2025-59536** | 2025-10 | Hooks + Config | Claude Code could execute commands from a cloned repo's project configuration before the startup trust dialog. | [Check Point Research](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) / [GHSA-4fgq-fpq9-mr3g](https://github.com/advisories/GHSA-4fgq-fpq9-mr3g) |
| **MedusaLocker PoC** | 2025-12 | Skills | Proof of concept showing ransomware delivery through a Claude skill: the skill instructs Claude to download and run an encrypted payload. | [Cato Networks CTRL](https://www.catonetworks.com/blog/cato-ctrl-weaponizing-claude-skills-with-medusalocker/) |
| **CVE-2025-61260 (Codex CLI)** | 2025-12 | MCP config | Codex CLI auto-loaded a project's `.env` and `.codex/config.toml`, so a malicious repo's MCP entry ran commands when `codex` started. | [Check Point](https://research.checkpoint.com/2025/openai-codex-cli-command-injection-vulnerability/) / [GHSA-xrxf-jgv3-qmrm](https://github.com/advisories/GHSA-xrxf-jgv3-qmrm) |
| **CVE-2026-21852** | 2026-01 | Config | API key exfiltration. Repo-controlled environment configuration (e.g. `ANTHROPIC_BASE_URL`) sent API requests, including the key, to an attacker's server before the trust prompt. | [Check Point Research](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) / [GHSA-jh7p-qr78-84p7](https://github.com/advisories/GHSA-jh7p-qr78-84p7) |
| **CVE-2026-24052** | 2026-02 | WebFetch | Claude Code's WebFetch domain validation could be bypassed, so Claude made automatic requests to attacker-controlled domains. | [GHSA-vhw5-3g5m-8ggf](https://github.com/advisories/GHSA-vhw5-3g5m-8ggf) |
| **ClawHavoc Campaign** | 2026-02 | Skills (OpenClaw) | Repello traced 335 malicious ClawHub skills to one coordinated campaign (341 malicious packages found overall), aimed at OpenClaw's roughly 300,000 users. Skills told the agent to leak API keys and environment variables, or ran setup commands that fetched payloads stealing SSH keys, `.env` files and cloud credentials. | [Repello AI](https://repello.ai/blog/clawhavoc-supply-chain-attack) / [teardown](https://repello.ai/blog/malicious-openclaw-skills-exposed-a-full-teardown) |
| **ToxicSkills** | 2026-02 | Skills (ClawHub, skills.sh) | Snyk scanned 3,984 skills from ClawHub and skills.sh: 534 had critical security issues and 76 were confirmed malicious, including prompt injection that overrides safety instructions. | [Snyk Labs](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) |
| **AMOS Stealer via OpenClaw** | 2026-02 | Skills + MCP | macOS Atomic Stealer (AMOS) distributed through trojanized OpenClaw skills. Steals Keychain passwords, browser sessions, and crypto wallets. | [Trend Micro](https://www.trendmicro.com/en_us/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html) |
| **Cline CLI 2.3.0 compromise** | 2026-02 | npm (agent CLI) | A stolen npm token was used to publish `cline@2.3.0` with a postinstall script that globally installed OpenClaw. | [GHSA-9ppg-jx86-fqw7](https://github.com/advisories/GHSA-9ppg-jx86-fqw7) |
| **SANDWORM_MODE worm** | 2026-02 | npm + MCP config injection | Malicious npm packages, several typosquatting AI tools, wrote a fake MCP server into Claude Code, Claude Desktop, Cursor, Continue and Windsurf configs. Its tool descriptions told the assistant to collect SSH/AWS/npm secrets. | [Socket](https://socket.dev/blog/sandworm-mode-npm-worm-ai-toolchain-poisoning) |
| **ContextCrush (CVE-2026-75130)** | 2026-03 | MCP (docs server) | Context7 "Custom Rules" written by any library registrant were served unfiltered to agents. The PoC exfiltrated `.env` files and deleted files. Fixed server-side. | [Noma Security](https://noma.security/blog/contextcrush-context7-the-mcp-server-vulnerability/) / [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-75130) |
| **CVE-2026-33068** | 2026-03 | Config | Workspace trust bypass. A repo-controlled `.claude/settings.json` could bypass the workspace trust dialog. | [RAXE Labs](https://raxe.ai/labs/advisories/RAXE-2026-040) / [GHSA-mmgp-wc2j-qcv7](https://github.com/advisories/GHSA-mmgp-wc2j-qcv7) |
| **LiteLLM PyPI compromise** | 2026-03 | Proxy (PyPI) | `litellm` 1.82.7 and 1.82.8 carried a credential stealer (env vars, SSH keys, cloud credentials). 1.82.8 used a `.pth` file that runs on every Python start. LiteLLM is a common gateway in front of Claude Code. | [LiteLLM](https://docs.litellm.ai/blog/security-update-march-2026) / [Snyk](https://snyk.io/blog/poisoned-security-scanner-backdooring-litellm/) |
| **Fake "leaked Claude Code" repos** | 2026-04 | GitHub lure | After the March 2026 source-map leak, repos offering "unlocked" leaked Claude Code delivered the Vidar infostealer and GhostSocks. | [Zscaler ThreatLabz](https://www.zscaler.com/blogs/security-research/anthropic-claude-code-leak) |
| **CVE-2026-35603** | 2026-04 | Config (Windows) | A low-privileged user could plant `C:\ProgramData\ClaudeCode\managed-settings.json`, which loaded for every user. Fixed in 2.1.75. | [GHSA-5cwg-9f6j-9jvx](https://github.com/advisories/GHSA-5cwg-9f6j-9jvx) |
| **CVE-2026-39861** | 2026-04 | Sandbox | Claude Code sandbox escape: a sandboxed process created a symlink that a later unsandboxed write followed outside the workspace. Fixed in 2.1.64. | [GHSA-vp62-r36r-9xqp](https://github.com/advisories/GHSA-vp62-r36r-9xqp) |
| **CVE-2026-40068** | 2026-04 | Config + Hooks | Trust-dialog bypass: a crafted git worktree pointing at a previously trusted path made Claude Code run the repo's hooks immediately. Fixed in 2.1.84. | [GHSA-q5hj-mxqh-vv77](https://github.com/advisories/GHSA-q5hj-mxqh-vv77) |
| **CVE-2026-12537 (Gemini CLI)** | 2026-04 | Config (CI) | Headless Gemini CLI auto-trusted workspace folders, loading repo config in CI, plus a tool-allowlist bypass. | [GHSA-wpqr-6v78-jr5g](https://github.com/advisories/GHSA-wpqr-6v78-jr5g) |
| **Hookify plugin finding** | 2026-04 | Plugin + Hooks | Pluto Security showed the Hookify plugin read rule files from the project into the trusted hook channel. Payloads posing as project conventions leaked environment variables. Anthropic treated the trust dialog as the boundary. No CVE. | [Pluto Security](https://pluto.security/blog/claude-extension-ecosystem-security-practitioner-guide/) |
| **CVE-2026-44641 (Microsoft APM)** | 2026-05 | Plugin marketplace | An agent package manager copied paths from `plugin.json` without checking them, so a malicious plugin could copy arbitrary host files during install. | [GHSA-xhrw-5qxx-jpwr](https://github.com/microsoft/apm/security/advisories/GHSA-xhrw-5qxx-jpwr) |
| **CVE-2026-45033 (Copilot CLI)** | 2026-05 | Repo content | A nested bare git repo in a project could set `core.fsmonitor` and run commands when the agent ran git. | [GHSA-9ccr-r5hg-74gf](https://github.com/advisories/GHSA-9ccr-r5hg-74gf) |
| **CVE-2026-44970 (dbt-mcp)** | 2026-05 | MCP telemetry | Default-on usage tracking sent every tool call's full arguments, including SQL, to dbt Labs. Fixed in 1.17.1. | [GHSA-jj54-r8gm-2fcf](https://github.com/dbt-labs/dbt-mcp/security/advisories/GHSA-jj54-r8gm-2fcf) |
| **CVE-2026-45582 (n8n-mcp)** | 2026-05 | MCP telemetry | The telemetry sanitizer could keep fragments of URL-shaped workflow parameters. Fixed in 2.51.3. | [GHSA-f3rg-xqjj-cj9w](https://github.com/advisories/GHSA-f3rg-xqjj-cj9w) |
| **Mini Shai-Hulud (`atool` account)** | 2026-05 | npm + Hooks | A hijacked maintainer account published hundreds of malicious versions, including `@antv/mcp-server-chart`. The payload **injects a `SessionStart` hook into `.claude/settings.json`**, adds Codex hooks, and spreads to other local projects. | [SafeDep](https://safedep.io/mini-shai-hulud-strikes-again-314-npm-packages-compromised) / [GHSA-qgmj-c898-99rq](https://github.com/advisories/GHSA-qgmj-c898-99rq) |
| **Mastra npm org compromise** | 2026-06 | npm (MCP framework) | A stolen token was used to publish trojanized `@mastra/*` packages, including `@mastra/mcp` 1.10.1 and `@mastra/claude` 1.0.3. | [Endor Labs](https://www.endorlabs.com/learn/mastra-npm-org-compromised-multiple-packages-trojanized-to-drop-a-remote-payload-via-easy-day-js) / [GHSA-wfr8-6x4q-hpr3](https://github.com/advisories/GHSA-wfr8-6x4q-hpr3) |
| **CVE-2026-54316** | 2026-06 | WebFetch | Claude Code pre-approved all of `huggingface.co`, so injected content could encode data into requests as a covert exfiltration channel. Fixed in 2.1.163. | [GHSA-fg94-h982-f3mm](https://github.com/advisories/GHSA-fg94-h982-f3mm) |
| **CVE-2026-49471 (Serena)** | 2026-07 | MCP dashboard | Through DNS rebinding, a web page could reach Serena's unauthenticated dashboard, write agent memories and reach the shell tool (RCE). Fixed in 1.5.2. | [GHSA-37h2-6p4f-mp3q](https://github.com/advisories/GHSA-37h2-6p4f-mp3q) |
| **CVE-2026-52869 (MCP Python SDK)** | 2026-07 | MCP transport | HTTP transports served session requests without checking the authenticated principal. Fixed in 1.27.2. | [GHSA-jpw9-pfvf-9f58](https://github.com/advisories/GHSA-jpw9-pfvf-9f58) |
| **CVE-2026-55607** | 2026-07 | Sandbox | Worktree path confusion in Claude Code could overwrite `~/.zshenv` and escape the sandbox through a malicious repo. Fixed in 2.1.163. | [GHSA-7835-87q9-rgvv](https://github.com/advisories/GHSA-7835-87q9-rgvv) |
| **MCP server name squats** | 2026-07 | npm (MCP) | Unscoped `mcp-server-github`, `mcp-server-fetch` and similar names squat MCP servers that agents run via `npx`. On install they POST the host name, working directory and platform to the author's endpoint (one README calls itself a "security research canary"). | [OSV MAL-2026-5479](https://osv.dev/vulnerability/MAL-2026-5479) / [GHSA-88f3-qjxp-rpp3](https://github.com/advisories/GHSA-88f3-qjxp-rpp3) |
| **CVE-2026-104850 (MCP TypeScript SDK)** | 2026-10 | MCP auth | The SDK's OAuth client let a malicious MCP server choose the authorization server, which then received stored refresh tokens and client secrets. Fixed in `@modelcontextprotocol/sdk` 1.31.0. | [GHSA-6qxp-vccf-f47h](https://github.com/advisories/GHSA-6qxp-vccf-f47h) |
| **Apex Accelerator (REF8801)** | 2026-10 | npm + malicious MCP server | Fake Web3 accelerator packages registered an attacker MCP server, rerouted `OPENROUTER_BASE_URL` through the attacker, and dropped stealers. | [Elastic Security Labs](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages) |
| **CVE-2026-86063** | 2026-10 | Plugin marketplace | Plugin install checked out a pinned SHA without verifying it, so a branch named like the SHA could substitute other code. Fixed in 2.1.179. | [GHSA-pq7j-f95f-qfcv](https://github.com/advisories/GHSA-pq7j-f95f-qfcv) |
| **Agent-tool impersonation on npm** | 2026-10 | npm | The GitHub malware feed flagged `opencode2` (Oct 13) and `claude-desktop-setup` (Oct 19), among other packages impersonating agent tools. | [GHSA-8w65-j2wh-mqv7](https://github.com/advisories/GHSA-8w65-j2wh-mqv7) / [GHSA-f4mf-vhm8-xxqc](https://github.com/advisories/GHSA-f4mf-vhm8-xxqc) |

> These are only the documented incidents. The actual number of in-the-wild attacks is certainly higher — most victims don't know they've been compromised, and most attacks against individual developers go unreported. Malicious versions of established, official-looking scoped MCP packages (`@antv/*`, `@mastra/mcp`) show that a familiar scope is not proof of safety.

---

## Privacy Champions 🏆

Extensions with zero telemetry, a small and readable footprint, and no surprises.

| Extension | Stars | Why It's Clean |
|-----------|-------|----------------|
| **[mattpocock/skills](https://github.com/mattpocock/skills)** | 298K | TypeScript and engineering skills from a trusted educator. Mostly markdown plus a few short local shell scripts. No tracking and no network calls of its own. ([audit](tools/mattpocock-skills.md)) |
| **[anthropics/skills](https://github.com/anthropics/skills)** | 182K | Official Anthropic skills. No telemetry. The helper scripts for document skills run locally. ([audit](tools/opencode-skills.md)) |
| **[kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)** | 50K | Obsidian integration skills from kepano (Obsidian CEO). Markdown only, no telemetry. ([audit](tools/obsidian-skills.md)) |
| **[trailofbits/skills](https://github.com/trailofbits/skills)** | 7.7K | Security skills from Trail of Bits — one of the most respected security firms in the industry. No analytics SDKs found (dependency and source grep; no full audit file yet). |

**Removed this edition:** **obra/superpowers** (since v6.0.0 its optional visual companion makes a disclosed usage request, with an opt-out; see [audit](tools/superpowers.md). Its link also pointed to the wrong repo). **Cline** (its own [telemetry docs](https://github.com/cline/cline/blob/0870796e9e0c640408bb87d9503514a83f57d470/docs/enterprise-solutions/monitoring/telemetry.mdx) say telemetry is on by default).

**The pattern:** Privacy champions tend to be individuals with reputations to protect, security firms, or the vendor itself. Products with a growth or monetization funnel are where tracking usually shows up.

---

## Top 20 Highest-Risk Extensions

Ranked by **(popularity x risk severity)**. High stars + critical access = top of the list. This is not a "malicious" list — these are popular, often well-intentioned projects. But popularity without scrutiny is how supply chain attacks scale.

Refreshed 2026-10-20. Seven March rows were removed because their repositories return 404, and three links were corrected. Rows marked † have no full audit file yet. For those, we checked only existence, stars and archive status.

| # | Extension | Stars | Type | Why It's Here |
|---|-----------|-------|------|---------------|
| 1 | **[openclaw/openclaw](https://github.com/openclaw/openclaw)** | 393K | Marketplace/Daemon | Always-on background daemon with full system access. Installs skills from a community marketplace (ClawHub) without human code review; its automated scanning has been bypassed before ([GHSA-v6r2-jh58-xx6w](https://github.com/openclaw/openclaw/security/advisories/GHSA-v6r2-jh58-xx6w)). The npm of agent skills — and [already targeted](https://repello.ai/blog/clawhavoc-supply-chain-attack). 434 security advisories published since March 2026. ([audit](tools/openclaw.md)) |
| 2 | **[affaan-m/ECC](https://github.com/affaan-m/ECC)** (formerly everything-claude-code) | 285K | Meta-bundle | Installs agents, skills, rules, MCP configs and dozens of hook commands across several agent harnesses. One install changes your entire security posture. ([audit](tools/everything-claude-code.md)) |
| 3 | **[garrytan/gstack](https://github.com/garrytan/gstack)** | 137K | Skills/Plugin | Celebrity trust amplifier. Opt-in Supabase telemetry. By default, outside reviews send code and diffs to a second AI provider. Can drive your logged-in browser. ([audit](tools/gstack.md)) |
| 4 | **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** | 102K | Plugin | Captures every prompt and tool call into a persistent local database. Added default-on PostHog telemetry in June 2026. The interactive installer pre-selects a hosted observer that processes session activity off your machine. ([audit](tools/claude-mem.md)) |
| 5 | **[browser-use/browser-use](https://github.com/browser-use/browser-use)** | 119K | Library/MCP Server/Skill | Full browser control for agents. Default-on telemetry includes the task text, every visited URL, the action history and the final result. For the MCP server it also includes parent process command lines. ([audit](tools/browser-use.md)) |
| 6 | **[ruvnet/ruflo](https://github.com/ruvnet/ruflo)** (formerly claude-flow) | 78K | Plugin marketplace/Meta-harness | 47-plugin marketplace. Its hooks fall back to `npx --yes ruflo@latest` on every tool event, and the legacy package tries to auto-allow its own MCP tools. ([audit](tools/ruflo.md)) |
| 7 | **[mem0ai/mem0](https://github.com/mem0ai/mem0)** | 68K | Plugin/MCP Server | Hooks on nine events capture sessions and upload them as cloud memories. Plugin telemetry is tied to your account email when an API key is set. The self-hosted server had unauthenticated memory CRUD (CVE-2026-31240). ([audit](tools/mem0.md)) |
| 8 | **[gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)** † | 64K | Meta-prompt/Config | Meta-prompting layer that injects instructions into every request. Archived on GitHub (no further fixes) but still installable. |
| 9 | **[ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)** | 54K | MCP Server | Drives Chrome and runs arbitrary JavaScript in pages. Google usage statistics on by default. Two 2026 symlink CVEs. ([audit](tools/chrome-devtools-mcp.md)) |
| 10 | **[VoltAgent/awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills)** † | 53K | Curated list | 5,400+ skills indexed for the OpenClaw daemon. Curated does not mean audited. |
| 11 | **[musistudio/claude-code-router](https://github.com/musistudio/claude-code-router)** | 38K | Proxy | Every prompt, response and tool result passes through it. Can import your local Claude Code OAuth credentials and Chrome cookies. Even if the proxy is honest, it is a single point of compromise. ([audit](tools/claude-code-router.md)) |
| 12 | **[upstash/context7](https://github.com/upstash/context7)** | 63K | MCP Server | Injects third-party documentation and per-library rules into your agent. ContextCrush (CVE-2026-75130) showed library owners could plant instructions that exfiltrated `.env` files. ([audit](tools/context7.md)) |
| 13 | **[wshobson/agents](https://github.com/wshobson/agents)** † | 41K | Multi-agent framework | Autonomous multi-agent workflows. Agents spawn sub-agents that make their own tool calls. The blast radius of a single compromised skill multiplies across the agent graph. |
| 14 | **[vercel-labs/skills](https://github.com/vercel-labs/skills)** † | 36K | Installer CLI | The `npx skills` installer that many skill READMEs recommend. Writes skills into agent config directories. Sends anonymous usage telemetry and security-audit requests to skills.sh by default (`DISABLE_TELEMETRY=1` to turn off). |
| 15 | **[davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)** | 33K | Installer CLI | One command installs hooks, settings, MCP configs and agents from a large community catalog. Tracking is on by default. An optional `--tunnel` serves a dashboard of your conversations on a public URL, and we found no authentication on it. ([audit](tools/claude-code-templates.md)) |
| 16 | **[sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills)** (formerly antigravity-awesome-skills) | 48K | Curated list + installer | About 2,700 skills with a CLI installer and an MCP server. Bulk installs put thousands of unreviewed instructions in front of your agent. ([audit](tools/antigravity-awesome-skills.md)) |
| 17 | **[nanocoai/nanoclaw](https://github.com/nanocoai/nanoclaw)** † | 31K | Agent/Messaging | Connects an agent to WhatsApp, Telegram, Slack, Discord, and Gmail. A compromised instance can send messages as you. |
| 18 | **[BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban)** | 28K | Orchestrator | Default agent profiles run Claude Code with `--dangerously-skip-permissions` (and other agents in yolo mode). Turns analytics back on at sign-in and attaches your email. Sunsetting. ([audit](tools/vibe-kanban.md)) |
| 19 | **[eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master)** | 28K | MCP Server | Sends LLM prompts and responses (your PRD and task context) to Sentry by default, with 100% tracing. ([audit](tools/claude-task-master.md)) |
| 20 | **[slopus/happy](https://github.com/slopus/happy)** | 24K | Remote-control relay | Lets phones, browsers and invited collaborators steer an agent on your machine through a hosted relay. Modifies Claude's system prompt and commit messages by default. ([audit](tools/happy.md)) |

**Just outside the Top 20** (fewer stars, but still high severity):

| Extension | Stars | Type | Why It's Notable |
|-----------|-------|------|------------------|
| **[czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp)** | 23K | MCP Server | Write access to production automations. Default-on telemetry ships workflow structures for ML datasets. ([audit](tools/n8n-mcp.md)) |
| **[wonderwhy-er/DesktopCommanderMCP](https://github.com/wonderwhy-er/DesktopCommanderMCP)** | 10.1K | MCP Server | Arbitrary terminal commands and file writes, with default-on telemetry. An optional hosted relay lets web AI services run tools on your machine. ([audit](tools/desktop-commander-mcp.md)) |
| **[CursorTouch/Windows-MCP](https://github.com/CursorTouch/Windows-MCP)** | 9.7K | MCP Server | Full computer control on Windows. PostHog with GeoIP and person profiles is on by default (`ANONYMIZED_TELEMETRY=false` to opt out). ([audit](tools/windows-mcp.md)) |
| **[anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)** † | 9.6K | GitHub Action | Runs Claude Code in CI/CD with repository write access. Prompt injection through issues or PRs is the main risk. |
| **[getsentry/MobileBuildMCP](https://github.com/getsentry/MobileBuildMCP)** (formerly XcodeBuildMCP) | 6.5K | MCP Server | Sentry with 100% trace sampling, on by default. The rename changed the opt-out variable, so old opt-outs stopped working. ([audit](tools/xcodebuild-mcp.md)) |
| **[Piebald-AI/tweakcc](https://github.com/Piebald-AI/tweakcc)** | 2.6K | Binary Patcher | Patches the Claude Code binary and system prompts. An unreleased change keeps patched binaries through Claude Code's own integrity re-check. ([audit](tools/tweakcc.md)) |
| **[steipete/claude-code-mcp](https://github.com/steipete/claude-code-mcp)** † | 1.3K | MCP Server | Claude Code as an MCP server. Starts Claude Code with `--dangerously-skip-permissions` by default. Archived. |
| **[asklokesh/loki-mode](https://github.com/asklokesh/loki-mode)** | 1.1K | Skill + CLI | Autonomous multi-iteration runs with `--dangerously-skip-permissions`, plus default-on PostHog telemetry. ([audit](tools/loki-mode.md)) |
| **[humanplane/homunculus](https://github.com/humanplane/homunculus)** | 399 | Plugin | Logs every prompt and tool input/output in plaintext inside your project (not gitignored) and auto-approves learned behavior changes. No upstream commits since January 2026. ([audit](tools/homunculus.md)) |

> **A note on star counts:** Stars in the Claude Code ecosystem are inflated by hype cycles and influencer posts. A repo can go from 0 to 40K stars in a week without a single security review. Stars measure virality, not safety.

---

## Full Audit Index

Every extension with a full audit file, by risk level. Each file has the repository, a pinned commit, line-level evidence, opt-out steps and a changelog. All 31 were last verified 2026-10-20.

| Risk | Extensions |
|------|------------|
| **CRITICAL** | [OpenClaw](tools/openclaw.md) · [claude-mem](tools/claude-mem.md) · [Claude Code Router](tools/claude-code-router.md) · [tweakcc](tools/tweakcc.md) · [Homunculus](tools/homunculus.md) |
| **HIGH** | [Everything Claude Code / ECC](tools/everything-claude-code.md) · [gstack](tools/gstack.md) · [Browser Use](tools/browser-use.md) · [Ruflo](tools/ruflo.md) · [Mem0](tools/mem0.md) · [Chrome DevTools MCP](tools/chrome-devtools-mcp.md) · [Claude Code Templates](tools/claude-code-templates.md) · [Vibe Kanban](tools/vibe-kanban.md) · [Task Master](tools/claude-task-master.md) · [Happy](tools/happy.md) · [n8n-MCP](tools/n8n-mcp.md) · [mcp-use](tools/mcp-use.md) · [Desktop Commander MCP](tools/desktop-commander-mcp.md) · [Windows-MCP](tools/windows-mcp.md) · [Loki Mode](tools/loki-mode.md) |
| **MEDIUM** | [Context7](tools/context7.md) · [Agentic (Antigravity) Awesome Skills](tools/antigravity-awesome-skills.md) · [Serena](tools/serena.md) · [opcode](tools/opcode.md) · [MobileBuildMCP (XcodeBuildMCP)](tools/xcodebuild-mcp.md) · [dbt MCP](tools/dbt-mcp.md) |
| **LOW** | [Superpowers](tools/superpowers.md) · [Graphiti MCP](tools/graphiti-mcp.md) |
| **SAFE** | [Matt Pocock Skills](tools/mattpocock-skills.md) · [Anthropic Official Skills](tools/opencode-skills.md) · [Obsidian Skills](tools/obsidian-skills.md) |

Weekly automated scan reports (commit keyword triage, new releases, npm and aggregator checks) are in [`reports/`](reports/). They are leads, not findings. Everything above was confirmed by reading source.

---

## What You Should Do - and if you are non-technical you can ask your clanker to help you or do it for you. Better than doing nothing. 

Ten concrete steps to protect yourself in the Claude Code extension ecosystem. Settings below are from Anthropic's current docs ([sandboxing](https://code.claude.com/docs/en/sandboxing), [permissions](https://code.claude.com/docs/en/permissions), [permission modes](https://code.claude.com/docs/en/permission-modes), [plugin security](https://code.claude.com/docs/en/plugins/security)) as of 2026-10-20.

### 0. ⬆️ Keep Claude Code Updated

Every Claude Code CVE in the incidents table is fixed in a released version. The most recent, a plugin hash-pin bypass, is fixed in 2.1.179. Auto-update covers most people. If you pin versions or installed manually, run `claude --version` and update.

### 1. 🔒 Enable Sandbox Mode

```
/sandbox
```

Sandbox mode restricts the file system and network access of the shell commands Claude runs. It's the single most impactful thing you can do. But know its limits:

- It covers **shell commands only**. Claude's file tools, WebFetch, **hooks, local MCP servers, plugin monitors and LSP servers run outside it**. It won't stop a malicious MCP server or hook.
- By default sandboxed commands can still **read** most of the machine, including `~/.ssh` and `~/.aws/credentials`. Add a `credentials` block.
- If a dependency is missing, Claude Code runs commands **without** a sandbox unless you set `failIfUnavailable`. On native Windows, commands run unsandboxed (use WSL2).

```json
{
  "sandbox": {
    "enabled": true,
    "failIfUnavailable": true,
    "allowUnsandboxedCommands": false,
    "credentials": {
      "files": [
        { "path": "~/.ssh", "mode": "deny" },
        { "path": "~/.aws/credentials", "mode": "deny" }
      ],
      "envVars": [
        { "name": "GITHUB_TOKEN", "mode": "deny" },
        { "name": "NPM_TOKEN", "mode": "deny" }
      ]
    }
  }
}
```

### 2. 🚫 Disable Auto-Loading MCP Servers

In your `settings.json`:

```json
{
  "enableAllProjectMcpServers": false
}
```

This prevents repos you clone from automatically starting MCP servers on your machine. You should explicitly approve every MCP server. (When unset, Claude Code already asks, and a cloned repo can't approve its own servers. The real risk is clicking "approve all" once.) Org admins can also use `allowedMcpServers`, `deniedMcpServers` and `allowManagedMcpServersOnly`.

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
      "Bash(curl *)",
      "Bash(wget *)"
    ],
    "blockReadsOutsideWorkingDirectories": true
  }
}
```

Even if a skill tricks Claude into trying to read your SSH keys, the deny rule will block it. Two caveats from the docs. First, `Bash(curl *)` does **not** match `/usr/bin/curl …` or `sh -c 'curl …'`, so pair it with the sandbox network allowlist. Second, `Read(...)` rules cover Claude's file tools and recognized commands like `cat`, not a script that opens files itself. The sandbox `credentials` block in step 1 enforces at the OS level.

### 4. 🐳 Never Run `--dangerously-skip-permissions` Outside Containers - I know this is unrealistic because people who need to do things quickly will throw caution to the wind ;)

The `--dangerously-skip-permissions` flag removes all permission prompts. Claude will execute any tool call without asking. This is only safe inside an ephemeral container with no access to your real filesystem, credentials, or network.

If you see a repo that tells you to run with this flag on your host machine — **that's a red flag**. Several tools in this list do it for you by default: [vibe-kanban](tools/vibe-kanban.md), [loki-mode](tools/loki-mode.md) and steipete/claude-code-mcp.

**Know about auto mode.** Since 2026-08-14, auto mode is the default for new sessions on Pro, Max and Team plans, and from v2.1.283 it is the built-in starting mode for interactive terminal and VS Code sessions. In auto mode a classifier model approves shell commands, network calls and MCP tool calls instead of you. That is much safer than skipping permissions, but it means a malicious skill or MCP tool may no longer meet a human prompt. Check which mode you are in (status bar). Admins can turn modes off in managed settings with `permissions.disableAutoMode: "disable"` and `permissions.disableBypassPermissionsMode: "disable"`.

### 5. 📖 Audit Every Skill Before Installing

Skills are markdown files. They're readable. **Read them.** Look for:
- Bash commands that `curl`, `wget`, or pipe to `sh`
- Instructions that tell Claude to disable safety features
- References to external URLs or APIs you don't recognize
- Obfuscated strings or base64-encoded content
- An `allowed-tools` line in the frontmatter. It **pre-approves** those tools; it does not restrict them
- Inline shell (`` !`cmd` `` lines or ` ```! ` blocks) that runs when the skill loads. Admins can set `disableSkillShellExecution: true`
- A `.claude/skills/` folder in a repo you cloned. Those skills load with the project

### 6. 🔍 Audit MCP Server Source Code

MCP servers are programs. Before installing one:
- Read the source code, especially `index.ts` / `main.py`
- Check `package.json` / `requirements.txt` for analytics dependencies (`posthog`, `sentry`, `amplitude`, `segment`, `mixpanel`, `scarf`)
- Search for outbound network calls (`fetch`, `axios`, `requests`, `http.get`) and telemetry tells: `phc_` (PostHog keys), `play.googleapis.com/log` (Google Clearcut), `ingest.*sentry.io`, `recordInputs`, `sendDefaultPii`, `disable_geoip`
- Check if it spawns background processes or writes to unexpected paths
- **Pin exact versions** instead of `npx …@latest`. Mini Shai-Hulud, Mastra and CVE-2026-86063 all exploited the gap between the code someone reviewed and the code that got installed
- Prefer the scoped official package name (`@modelcontextprotocol/server-github`, not `mcp-server-github`)

### 7. ⚠️ Avoid Project-Scoped Hooks from Untrusted Repos

When you clone a repo, check for `.claude/settings.json` before running Claude Code. Hooks defined there will execute automatically. A malicious repo can plant hooks that:
- Run on every `PreToolUse` event (before every tool call)
- Exfiltrate environment variables
- Modify files silently
- Phone home with your project contents

**Plugins are the same risk, packaged.** Before installing, open `/plugin` → the plugin → **Will install**, then read its `hooks/hooks.json`, `.mcp.json` and `bin/`. After installing, `claude plugin details <name>` prints what it added. Turn off auto-update for third-party marketplaces, or pin sources to a commit `sha`. Only marketplaces hosted under `github.com/anthropics/` can use the official names. Every other marketplace is third-party, whatever it calls itself. Org admins: `strictKnownMarketplaces`, `allowManagedHooksOnly`, and `pluginTrustMessage` ([docs](https://code.claude.com/docs/en/plugins/org)).

**Malware now writes hooks for you.** Mini Shai-Hulud injects a `SessionStart` hook into `.claude/settings.json`, and SANDWORM_MODE injects an MCP server into your agent configs. Check `/hooks` and `/mcp` now and then, and diff your settings files.

### 8. 🔑 Rotate Credentials After Installing Third-Party Extensions

If you installed an MCP server, proxy, or plugin that you later realized was suspicious:
- Rotate your Anthropic API key
- Rotate any API keys that were in environment variables
- Rotate OAuth tokens for remote MCP servers if you used `@modelcontextprotocol/sdk` older than 1.31.0 with a server you don't trust (CVE-2026-104850)
- Check `~/.ssh/` for unauthorized `authorized_keys` entries
- Review your shell history for commands you didn't run
- Check for new cron jobs, launchd agents, or systemd services
- Check `~/.claude/settings.json`, `.claude/settings.json`, `~/.cursor/mcp.json` and `~/.codex/` for hooks or MCP servers you didn't add, and Python `site-packages` for unexpected `.pth` files (LiteLLM)

### 9. 📵 Turn Off Telemetry You Didn't Choose

Opt-outs for the tools in this list. MCP servers only see variables from the environment Claude Code was started in, or from the server's `env` block.

```bash
export ANONYMIZED_TELEMETRY=false              # browser-use, Windows-MCP
export MCP_USE_ANONYMIZED_TELEMETRY=false      # mcp-use
export MEM0_TELEMETRY=false                    # mem0
export GRAPHITI_TELEMETRY_ENABLED=false        # graphiti
export N8N_MCP_TELEMETRY_DISABLED=true         # n8n-mcp
export CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS=1
export CCT_NO_TRACKING=true                    # claude-code-templates
export MOBILEBUILDMCP_SENTRY_DISABLED=true      # MobileBuildMCP (formerly XcodeBuildMCP)
export DESKTOP_COMMANDER_DISABLE_TELEMETRY=1   # Desktop Commander
export SUPERPOWERS_DISABLE_TELEMETRY=1         # superpowers
export DO_NOT_TRACK=1                          # claude-mem, loki-mode, dbt-mcp, vercel-labs/skills, others
```

Some need more than an env var. Task Master needs `"anonymousTelemetry": false` in `.taskmaster/config.json`. For vibe-kanban, re-check the setting after every sign-in. OpenClaw needs `update.checkOnStart: false`. opcode and Happy have an in-app toggle. Details for each are in its [audit file](#full-audit-index).

---

## How to Contribute

We need your help. The ecosystem is growing faster than any one team can audit.

- **Report a new extension**: [Open an issue](https://github.com/pwchiefy/skills-snitch-list/issues/new?template=new-extension.yml) or submit a PR
- **Update existing data**: [Open an issue](https://github.com/pwchiefy/skills-snitch-list/issues/new/choose) or submit a PR
- **Report a security incident**: [Open an issue](https://github.com/pwchiefy/skills-snitch-list/issues/new?template=security-concern.yml)
- **Dispute a finding**: [Use the dispute template](https://github.com/pwchiefy/skills-snitch-list/issues/new?template=dispute.yml) — we take accuracy seriously

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines, evidence standards, and the review process.

---

## References & Credits

This project builds on the work of many researchers, security firms, and individuals. The full list, including every advisory cited above, is in [REFERENCES.md](REFERENCES.md).

### Vulnerability Research

| CVE / Finding | Researcher | Link |
|---------------|-----------|------|
| CVE-2025-59536 (pre-trust command execution) | Check Point Research | [research.checkpoint.com](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) |
| CVE-2026-21852 (API Key Exfil) | Check Point Research | [research.checkpoint.com](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) |
| CVE-2026-33068 (Workspace Trust) | RAXE Labs | [raxe.ai](https://raxe.ai/labs/advisories/RAXE-2026-040) |
| CVE-2026-24052 (WebFetch domain bypass) | GitHub Advisory Database | [GHSA-vhw5-3g5m-8ggf](https://github.com/advisories/GHSA-vhw5-3g5m-8ggf) |
| CVE-2026-75130 (ContextCrush) | Noma Security | [noma.security](https://noma.security/blog/contextcrush-context7-the-mcp-server-vulnerability/) |
| Hookify plugin finding | Pluto Security | [pluto.security](https://pluto.security/blog/claude-extension-ecosystem-security-practitioner-guide/) |
| CVE-2025-61260 (Codex CLI MCP config) | Check Point Research | [research.checkpoint.com](https://research.checkpoint.com/2025/openai-codex-cli-command-injection-vulnerability/) |

### Campaign & Threat Analysis

| Campaign | Researcher | Link |
|----------|-----------|------|
| ClawHavoc (335 malicious skills, one campaign) | Repello AI | [repello.ai](https://repello.ai/blog/clawhavoc-supply-chain-attack) |
| ToxicSkills (534 critical skills) | Snyk Labs | [snyk.io](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) |
| AMOS Stealer via OpenClaw | Trend Micro | [trendmicro.com](https://www.trendmicro.com/en_us/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html) |
| MedusaLocker PoC via Skills | Cato Networks CTRL | [catonetworks.com](https://www.catonetworks.com/blog/cato-ctrl-weaponizing-claude-skills-with-medusalocker/) |
| Nx npm supply chain attack | Snyk / Wiz | [snyk.io](https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/) / [wiz.io](https://www.wiz.io/blog/s1ngularity-supply-chain-attack) |
| Dependency hijacking (AI agents) | SentinelOne | [sentinelone.com](https://www.sentinelone.com/blog/marketplace-skills-and-dependency-hijack-in-claude-code/) |
| npm supply chain for AI agents | Oligo Security | [oligo.security](https://www.oligo.security/blog/the-hidden-risks-of-the-npm-supply-chain-attacks-ai-agents) |
| SANDWORM_MODE npm worm | Socket | [socket.dev](https://socket.dev/blog/sandworm-mode-npm-worm-ai-toolchain-poisoning) |
| LiteLLM PyPI compromise | LiteLLM / Snyk | [docs.litellm.ai](https://docs.litellm.ai/blog/security-update-march-2026) / [snyk.io](https://snyk.io/blog/poisoned-security-scanner-backdooring-litellm/) |
| Fake leaked Claude Code repos | Zscaler ThreatLabz | [zscaler.com](https://www.zscaler.com/blogs/security-research/anthropic-claude-code-leak) |
| Mini Shai-Hulud | SafeDep | [safedep.io](https://safedep.io/mini-shai-hulud-strikes-again-314-npm-packages-compromised) |
| Mastra npm org compromise | Endor Labs | [endorlabs.com](https://www.endorlabs.com/learn/mastra-npm-org-compromised-multiple-packages-trojanized-to-drop-a-remote-payload-via-easy-day-js) |
| Apex Accelerator (REF8801) | Elastic Security Labs | [elastic.co](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages) |

### Protocol & Architecture Research

| Topic | Researcher | Link |
|-------|-----------|------|
| MCP Tool Poisoning | Invariant Labs | [invariantlabs.ai](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks) |
| MCP-Scan (security scanner) | Invariant Labs | [github.com/invariantlabs-ai/mcp-scan](https://github.com/invariantlabs-ai/mcp-scan) |
| MCP Breach Timeline | AuthZed | [authzed.com](https://authzed.com/blog/timeline-mcp-breaches) |
| OWASP MCP Top 10 | OWASP | [owasp.org](https://owasp.org/www-project-mcp-top-10/) |
| MCP specification 2026-07-28 changelog | Model Context Protocol | [modelcontextprotocol.io](https://modelcontextprotocol.io/specification/2026-07-28/changelog) |
| claude-code-config (security analysis) | Trail of Bits | [github.com/trailofbits/claude-code-config](https://github.com/trailofbits/claude-code-config) |

### Academic Research

| Paper | Authors | Link |
|-------|---------|------|
| "Can You Trust Your Copilot?" | Chen et al. | [arXiv:2509.20388](https://arxiv.org/abs/2509.20388) |

### Vendor Documentation

| Resource | Source | Link |
|----------|--------|------|
| Claude Code Security Docs | Anthropic | [code.claude.com](https://code.claude.com/docs/en/security) |
| Claude Code Hooks Docs | Anthropic | [code.claude.com](https://code.claude.com/docs/en/hooks) |
| Sandboxing | Anthropic | [code.claude.com](https://code.claude.com/docs/en/sandboxing) |
| Permissions and permission modes | Anthropic | [permissions](https://code.claude.com/docs/en/permissions) / [modes](https://code.claude.com/docs/en/permission-modes) |
| Plugin security and trust | Anthropic | [code.claude.com](https://code.claude.com/docs/en/plugins/security) |

### Related Projects

| Project | Researcher | Link |
|---------|-----------|------|
| Agent Snitch List (companion project) | pwchiefy | [github.com/pwchiefy/agent-snitch-list](https://github.com/pwchiefy/agent-snitch-list) |
| Trae IDE Telemetry Analysis | Unit221b | Referenced in [agent-snitch-list](https://github.com/pwchiefy/agent-snitch-list/blob/main/tools/trae.md) |

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
