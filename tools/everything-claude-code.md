# Everything Claude Code

| Field | Value |
|-------|-------|
| Repository | https://github.com/affaan-m/everything-claude-code |
| Type | Config Bundle |
| Stars | 101K |
| Telemetry | Partial (InsAIts SDK is opt-in third-party) |
| Default State | OFF (InsAIts requires explicit opt-in) |
| Analytics Providers | InsAIts SDK (opt-in) |
| Disable Method | Do not enable InsAIts integration |
| Risk Level | HIGH |
| Last Verified | 2026-03-23 |

## What It Does

Everything Claude Code is a comprehensive configuration bundle that modifies every layer of the Claude Code stack. It provides curated settings, hooks, MCP server configurations, skill collections, and workflow optimizations. It aims to be an all-in-one enhancement package for Claude Code power users.

## Telemetry Details

- **InsAIts SDK:** A third-party analytics SDK is included as an opt-in integration. When enabled, InsAIts collects usage data about Claude Code sessions
- **Session transcript hooks:** The bundle configures hooks that capture process session transcripts locally. These transcripts contain complete records of Claude Code sessions including prompts, responses, tool calls, and results
- **Local session storage:** Session transcripts are stored locally on disk. While not transmitted externally by default, the local storage creates a persistent archive of all agent activity
- **InsAIts is opt-in:** The InsAIts SDK integration requires explicit user activation and is not enabled by default

## Security Concerns

- **Modifies every layer:** This bundle touches Claude Code settings, hooks, MCP server configs, and skills simultaneously. The blast radius of a compromised version is the entire Claude Code installation
- **Session transcript hooks:** Even without external telemetry, the local session transcript capture creates a comprehensive record of all agent activity. This includes:
  - All user prompts and instructions
  - All code Claude reads, writes, or modifies
  - All tool calls and their results
  - All file paths and system information exposed during sessions
  - Any credentials or secrets that appear in session context
- **InsAIts SDK trust surface:** Enabling InsAIts means sharing session data with a third-party service. The data retention, access policies, and security posture of InsAIts must be evaluated independently
- **101K stars = high-value target:** The extreme popularity makes this a prime target for supply chain attacks. A compromised update could affect a massive number of developers
- **Hook-based architecture:** Hooks execute code at specific points in the Claude Code lifecycle. Malicious hooks could intercept, modify, or exfiltrate data at these execution points
- **Configuration complexity:** The all-in-one nature means users may not fully understand every configuration change being applied. Hidden or non-obvious settings could alter security-relevant behavior

## How to Opt Out

For InsAIts telemetry:
1. Do not enable the InsAIts SDK integration
2. If previously enabled, remove the InsAIts configuration from your setup
3. Review InsAIts documentation for data deletion requests if you previously opted in

For local session transcripts:
1. Identify and disable the session transcript hooks in the bundle's hook configuration
2. Delete any previously captured session transcript files
3. Review transcript files before deletion to check for captured credentials that may need rotation

General risk mitigation:
1. Review all configuration changes the bundle makes before applying
2. Selectively apply only the components you need rather than the full bundle
3. Pin to a specific version and audit before updating

## Evidence

- Config bundle modifies settings, hooks, MCP configs, and skills across all Claude Code layers
- Session transcript hooks capture complete session records locally
- InsAIts SDK included as opt-in third-party analytics integration
- Local session storage contains full agent activity history
- 101K stars makes it one of the most popular Claude Code extensions

## Changelog
- 2026-03-23: Initial entry
