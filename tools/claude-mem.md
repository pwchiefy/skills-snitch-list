# claude-mem

| Field | Value |
|-------|-------|
| Repository | https://github.com/thedotmack/claude-mem |
| Type | Plugin |
| Stars | 40K |
| Telemetry | No (traditional) |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | CRITICAL |
| Last Verified | 2026-03-23 |

## What It Does

claude-mem is a plugin that provides persistent memory for Claude Code agents. It uses the `claude-agent-sdk` to capture and store all agent actions, decisions, and session history. The plugin creates a comprehensive log of everything Claude does during a session and persists it across sessions for retrieval.

## Telemetry Details

claude-mem does not implement traditional telemetry (no analytics providers, no external tracking services). However, the entire purpose of the plugin is to capture ALL agent actions, making it a comprehensive data collection system by design.

- **Session history capture:** Every action Claude performs is recorded
- **Agent SDK integration:** Uses `claude-agent-sdk` to hook into the agent's execution pipeline
- **Persistent storage:** All captured data is stored locally for cross-session retrieval
- **No external transmission (by default):** Data stays local, but the comprehensive nature of what is collected makes any future exfiltration or misconfiguration extremely high-impact

## Security Concerns

- **Captures everything by design:** This is not incidental telemetry — the core function is to record all agent actions. This includes commands executed, files read/written, API calls made, and reasoning patterns
- **claude-agent-sdk dependency:** The plugin depends on the `claude-agent-sdk` which provides deep hooks into the agent's execution. This is the most privileged position possible for data collection
- **Credential exposure:** If Claude reads or processes credentials, API keys, or secrets during a session, claude-mem will capture and persist them in its memory store
- **Code exposure:** All code that Claude reads, writes, or modifies during a session is captured. For proprietary codebases, this creates a persistent local copy of sensitive intellectual property in the plugin's storage
- **Session reconstruction:** The stored data allows complete reconstruction of what Claude was asked to do, how it did it, and what it accessed. This is a comprehensive audit trail that could be valuable to attackers
- **Local storage security:** The security of all captured data depends entirely on the permissions and encryption of the local storage location. If the storage directory is world-readable or on an unencrypted volume, all historical agent activity is exposed
- **Supply chain risk:** At 40K stars, this is a high-value target. A compromised update could add external data transmission to the already-comprehensive local collection

## How to Opt Out

Since the data capture IS the product, opting out means not using the plugin:

1. Remove claude-mem from your Claude Code configuration
2. Delete any stored session history files created by the plugin
3. Review stored data before deletion to check for captured credentials that may need rotation
4. If you must use memory features, consider alternatives that are more selective about what they capture

## Evidence

- Plugin uses `claude-agent-sdk` for agent execution pipeline hooks
- Core functionality is comprehensive session history capture and persistence
- All agent actions are recorded by design — this is the stated purpose
- No external analytics providers, but local data collection is exhaustive
- Storage is local; no outbound telemetry detected

## Changelog
- 2026-03-23: Initial entry
