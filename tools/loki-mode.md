# Loki Mode

| Field | Value |
|-------|-------|
| Repository | https://github.com/PalisadeResearch/claudeskill-loki-mode |
| Type | Skill |
| Stars | 766 |
| Telemetry | Yes |
| Default State | ON |
| Analytics Providers | PostHog, OpenTelemetry |
| Disable Method | Set `LOKI_TELEMETRY_DISABLED=true` or `DO_NOT_TRACK=1` |
| Risk Level | HIGH |
| Last Verified | 2026-03-23 |

## What It Does

Loki Mode is a Claude Code skill by Palisade Research that enhances Claude's capabilities with advanced prompt engineering techniques. It modifies agent behavior through skill-level instruction injection, adding specialized reasoning patterns and workflow modifications.

## Telemetry Details

- **PostHog analytics:** Integrated PostHog client for usage analytics and event tracking
- **OpenTelemetry:** Full OpenTelemetry (OTel) instrumentation for distributed tracing and metrics collection
- **Persistent UUID:** A unique telemetry identifier is generated and stored at `~/.loki-telemetry-id`. This UUID persists across all sessions and is attached to every telemetry event
- **Dual telemetry stack:** Using both PostHog (product analytics) and OpenTelemetry (observability) means data is collected at two different levels of granularity — high-level usage patterns and detailed operational traces
- **Data collected:**
  - Skill activation and usage events (PostHog)
  - Detailed execution traces and timing data (OpenTelemetry)
  - Session metadata linked to persistent UUID
  - Feature usage patterns
- **Default state:** ON. Both telemetry systems are active unless explicitly disabled

## Security Concerns

- **Dual telemetry stack is unusual for a skill:** Skills are typically lightweight markdown/instruction files. Having both PostHog and OpenTelemetry indicates a level of instrumentation more typical of a production service than a Claude Code skill
- **Persistent UUID at known path:** `~/.loki-telemetry-id` creates a stable identifier that can be used to correlate all activity from a single machine across sessions, reinstalls, and potentially across different tools if the UUID is shared
- **Skill-level access:** As a skill, Loki Mode operates within Claude's instruction context. Telemetry from this layer can capture what Claude is being asked to do, how it reasons, and what workflows are being used
- **OpenTelemetry scope:** OTel can capture detailed trace spans including timing, parameters, and results of operations. Depending on instrumentation depth, this could include sensitive context from the agent's work
- **PostHog user profiling:** PostHog builds user profiles over time, creating a behavioral fingerprint of how each developer uses the skill

## How to Opt Out

1. Set environment variable to disable Loki-specific telemetry:
   ```
   export LOKI_TELEMETRY_DISABLED=true
   ```
2. Alternatively, use the standard `DO_NOT_TRACK` convention:
   ```
   export DO_NOT_TRACK=1
   ```
3. Add to your shell profile (`~/.zshrc`, `~/.bashrc`) for persistence:
   ```
   echo 'export LOKI_TELEMETRY_DISABLED=true' >> ~/.zshrc
   ```
4. Optionally, delete the persistent UUID file:
   ```
   rm ~/.loki-telemetry-id
   ```
5. Verify by monitoring outbound connections for PostHog and OTel collector endpoints

## Evidence

- PostHog client integrated in skill code
- OpenTelemetry SDK integrated for tracing and metrics
- Persistent UUID file: `~/.loki-telemetry-id`
- Environment variable `LOKI_TELEMETRY_DISABLED` controls telemetry
- Respects `DO_NOT_TRACK=1` standard
- Both telemetry systems enabled by default

## Changelog
- 2026-03-23: Initial entry
