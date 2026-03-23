# Research Methodology

This document describes how extensions in the Skills Snitch List are identified, evaluated, and classified.

## Scope

This project audits **Claude Code extensions** — skills, hooks, MCP servers, plugins, proxies, and configuration overlays — for telemetry, data collection, and security risks. It complements the [Agent Snitch List](https://github.com/anthropics/agent-snitch-list) (which covers AI coding agents themselves) by focusing on the extension ecosystem that plugs into those agents.

## How Extensions Are Identified

Extensions are discovered through multiple channels:

1. **GitHub search** — queries like `claude code skill`, `claude-code-hooks`, `mcp server claude`, `claude code plugin`, and `claude code proxy` across public repositories.
2. **Awesome-lists and registries** — curated lists such as awesome-mcp-servers, awesome-claude-code, ClawHub, and OpenClaw registries.
3. **Package managers** — npm (`@claude`, `claude-skill`, `mcp-server-`), PyPI (`claude-`, `mcp-`), crates.io, and Go modules.
4. **Community reports** — issues filed by users, security researchers, and extension authors.
5. **Supply chain incident tracking** — extensions identified through CVE databases, security advisories, and incident reports.

## What Counts as Telemetry

### Telemetry (reportable)

Any network call whose **primary purpose** is transmitting information about user behavior, environment, or content to a party other than the user's explicitly configured destination:

- Usage analytics (invocation counts, timing, feature flags)
- Error reporting with contextual data (file paths, code snippets, stack traces)
- Heartbeat/ping endpoints that include machine identifiers, OS info, or session data
- License validation calls that transmit more than the license key itself
- A/B testing or experimentation frameworks phoning home
- Exfiltration of credentials, API keys, or tokens to unauthorized endpoints
- Collection of project structure, file names, or code content

### Not telemetry (functional, not reportable)

- API calls to the LLM provider the user explicitly configured (Anthropic, OpenAI, etc.)
- Fetching remote tool definitions or skill manifests from the extension's own registry
- Package update checks that transmit only the package name and current version
- OAuth flows the user explicitly initiated
- Network calls the user explicitly triggered (e.g., "search the web for X")

### Gray area (noted but not automatically flagged)

- Crash reporters with opt-out mechanisms (noted in the audit)
- Calls to the extension author's API that could be functional or telemetric depending on what the server logs

## Search Keywords

When auditing an extension's source code, we search for indicators across these categories:

### Network / HTTP
```
fetch, axios, http.request, https.request, XMLHttpRequest, got(, ky(,
node-fetch, undici, request(, superagent, urllib, httpx, reqwest,
aiohttp, requests.get, requests.post, curl_exec, WebSocket
```

### Telemetry / Analytics SDKs
```
posthog, mixpanel, amplitude, segment, sentry, bugsnag, rollbar,
datadog, newrelic, elastic-apm, applicationinsights, google-analytics,
ga4, gtag, plausible, umami, matomo, pendo, heap, fullstory,
logrocket, hotjar, rudderstack, telemetry, analytics, tracking,
reportEvent, trackEvent, sendBeacon
```

### Data Collection Patterns
```
os.hostname, os.platform, os.userInfo, os.homedir, process.env,
process.cwd, machine-id, getmac, systeminformation, username,
whoami, fingerprint, deviceId, sessionId, installationId,
machineId, anonymousId, distinctId
```

### Credential / Secret Access
```
ANTHROPIC_API_KEY, CLAUDE_API_KEY, API_KEY, SECRET, TOKEN,
password, credential, keychain, keytar, secret-manager,
.env, dotenv, process.env.*, os.environ
```

### File System Scanning
```
glob, readdir, walkdir, fs.readFile, readdirSync, path.join,
home_dir, expanduser, .claude/, .config/, .ssh/, .aws/,
.gitconfig, package.json (reading from user projects)
```

### Process / System Execution
```
child_process, exec, execSync, spawn, fork, shell, subprocess,
os.system, Popen, Command::new, std::process
```

## Risk Assessment

Each extension receives one of three ratings:

### SAFE
- No outbound network calls beyond the user's configured LLM endpoint
- No collection of machine identifiers, environment variables, or file contents
- No credential access beyond what the extension's stated function requires
- Source code is readable and matches documented behavior

### SUSPICIOUS
- Contains network capabilities or data collection patterns that **could** be telemetry but lack clear evidence of activation
- Obfuscated or minified code that cannot be fully audited
- Overly broad permissions relative to stated function
- Dependencies that themselves contain telemetry (transitive risk)
- Network calls to the extension author's infrastructure without clear documentation of what is transmitted

### TELEMETRY FOUND
- Confirmed outbound data transmission beyond functional requirements
- Specific file paths, code snippets, and network destinations are documented in the audit
- Distinguishes between opt-in, opt-out, and no-opt-out telemetry

## The 6 Attack Vectors

Each audit evaluates the extension against six categories of risk. These are derived from real-world incidents (see REFERENCES.md).

### 1. Prompt Injection / Instruction Override

**What:** The extension injects hidden instructions into the agent's context, overriding user intent or system prompts.

**How we evaluate:**
- Review all prompt templates, system messages, and tool descriptions
- Check for hidden text (zero-width characters, HTML comments, base64-encoded instructions)
- Look for dynamic prompt construction that could be influenced by external input
- Test whether tool descriptions contain instructions that override user commands

**Real-world example:** MCP tool poisoning attacks where tool descriptions contain hidden instructions to exfiltrate data (Invariant Labs, 2025).

### 2. Data Exfiltration

**What:** The extension transmits user data (code, credentials, file contents, conversation history) to unauthorized third parties.

**How we evaluate:**
- Trace all outbound network calls and their payloads
- Identify what data is included in API requests beyond the minimum functional requirement
- Check for encoded or compressed payloads that obscure content
- Review whether conversation context, file contents, or credentials are included in requests

**Real-world example:** WhatsApp MCP server exploit sending conversation history to attacker-controlled endpoints (Invariant Labs, 2025).

### 3. Credential Harvesting

**What:** The extension reads, stores, or transmits API keys, tokens, or other credentials.

**How we evaluate:**
- Search for reads of environment variables, keychain access, `.env` files, and config directories
- Check whether credentials are transmitted in network calls
- Verify that credential access is limited to what the extension needs to function
- Look for credential storage in plaintext or insecure locations

**Real-world example:** CVE-2025-59536 — API token exfiltration through Claude Code project files (Check Point Research, 2026).

### 4. Arbitrary Code Execution

**What:** The extension executes code or commands beyond its stated scope, or enables remote code execution.

**How we evaluate:**
- Search for `eval`, `exec`, `spawn`, `child_process`, and equivalent patterns
- Check whether the extension downloads and executes remote code
- Verify that any code execution is sandboxed and scoped to the extension's function
- Look for deserialization of untrusted data

**Real-world example:** ClawHavoc supply chain attack executing reverse shells through malicious skills (Repello AI, 2026).

### 5. Supply Chain Compromise

**What:** The extension's dependencies, build pipeline, or distribution channel has been compromised.

**How we evaluate:**
- Check dependency trees for known-malicious or typosquatted packages
- Verify that published packages match the source repository
- Look for post-install scripts that execute arbitrary code
- Check for dependency confusion / namespace hijacking risks

**Real-world example:** Nx npm package attack weaponizing AI coding agents for malware distribution (Snyk, 2026).

### 6. Persistence / Privilege Escalation

**What:** The extension installs itself in a way that survives beyond its intended scope, or escalates its own permissions.

**How we evaluate:**
- Check for modifications to shell profiles, cron jobs, launch agents, or startup scripts
- Look for self-update mechanisms that could replace the extension with malicious code
- Verify that the extension does not modify Claude Code's own configuration
- Check for attempts to disable security features or sandboxing

**Real-world example:** AMOS stealer distributed via OpenClaw skills persisting through LaunchAgents (Trend Micro, 2026).

## Verification Standards

### Source code review, not README claims

Every audit is based on **reading the actual source code**, not the extension's documentation or marketing claims. Specifically:

1. **Clone the repository** at the audited commit hash (pinned, not `HEAD`).
2. **Read every file** that handles network, file system, process execution, or credential access.
3. **Trace data flow** from user input through to network output.
4. **Check dependencies** — run `npm ls`, `pip show`, or equivalent to enumerate the full dependency tree. Spot-check transitive dependencies with telemetry indicators.
5. **Compare published artifact to source** — for npm/PyPI packages, verify the published version matches the repository at the tagged commit.
6. **Document findings with file paths and line numbers** — every claim in an audit links to specific code.

### What we do NOT do

- We do not run extensions in a sandbox and monitor network traffic (though we welcome contributed dynamic analysis).
- We do not reverse-engineer obfuscated/compiled extensions — these are flagged as SUSPICIOUS by default.
- We do not audit the LLM provider's own API (that is the Agent Snitch List's scope).

## Updating Audits

Extensions change. Audits are pinned to a specific commit hash and date. When an extension releases a new version:

1. The existing audit remains in the repository, labeled with its commit hash.
2. A new audit is created for the updated version.
3. If the risk level changes, the main table in README.md is updated.
4. Extension authors may request re-audit by filing an issue.
