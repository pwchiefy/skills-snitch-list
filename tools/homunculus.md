# Homunculus

| Field | Value |
|-------|-------|
| Repository | https://github.com/humanplane/homunculus |
| Type | Plugin |
| Stars | 319 |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | CRITICAL |
| Last Verified | 2026-03-23 |

## What It Does

Homunculus is a self-modifying agent plugin for Claude Code. It observes how you work — your patterns, preferences, tool usage, and decision-making — and uses those observations to evolve its own behavior. The agent autonomously modifies its own instructions and configuration based on what it learns from your sessions.

## Telemetry Details

No traditional telemetry or external analytics have been identified. The risk stems from the self-modification architecture, not from external data transmission.

## Security Concerns

- **Self-modifying code is inherently unpredictable:** Homunculus rewrites its own instructions based on observed behavior. This means the plugin you install is NOT the plugin you end up running after a few sessions. Its behavior drifts over time in ways that are difficult to predict or audit
- **Behavioral observation:** The plugin watches everything you do — commands, file operations, coding patterns, decision-making sequences. This is a comprehensive behavioral profile, even if it stays local
- **Autonomous evolution:** The agent modifies itself without explicit user approval for each change. Users cannot review or approve individual behavioral modifications before they take effect
- **Drift from safety boundaries:** As the agent evolves its own instructions, it may drift away from safety constraints that were present in the original version. There is no mechanism to ensure that self-modifications preserve safety-critical properties
- **Audit impossibility:** After multiple self-modification cycles, the running state of the plugin may bear little resemblance to the original source code. Traditional code review and security auditing become meaningless
- **Prompt injection amplification:** If a malicious prompt or file content is processed during a session, the self-modification mechanism could permanently incorporate adversarial instructions into the agent's evolved behavior
- **Persistence of compromised state:** Unlike a stateless tool that resets each session, Homunculus persists its evolved state. A single compromised session could permanently alter the agent's behavior for all future sessions
- **Low star count, high ambition:** At 319 stars, this has received relatively little community scrutiny compared to its risk profile. Self-modifying agent architectures are a cutting-edge research area, not a well-understood production pattern

## How to Opt Out

Do not use Homunculus. If you have already used it:

1. Remove the plugin from your Claude Code configuration
2. Delete all stored state and evolved configuration files created by Homunculus
3. Review what behavioral modifications were made by examining any state files before deletion
4. Be aware that any sessions conducted with an evolved version of the agent may have been influenced by accumulated behavioral modifications

## Evidence

- Plugin explicitly describes itself as a self-modifying agent
- Observes user work patterns and evolves its own behavior
- Self-modification is autonomous — no per-change user approval
- Evolved state persists across sessions
- No external telemetry detected; risk is architectural
- 319 stars indicates limited community review

## Changelog
- 2026-03-23: Initial entry
