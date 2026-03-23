# Contributing to Skills Snitch List

Thank you for helping make the Claude Code extension ecosystem more transparent. This guide covers how to contribute audits, update existing entries, and report security concerns.

## Before You Start

1. Read [METHODOLOGY.md](METHODOLOGY.md) to understand how audits are conducted and how risk levels are assigned.
2. Read [REFERENCES.md](REFERENCES.md) for context on known attack vectors and prior incidents.
3. Familiarize yourself with the 6 attack vectors and the SAFE / SUSPICIOUS / TELEMETRY FOUND classification system.

## Adding a New Extension Audit

### Step 1: Check for duplicates

Search the `reports/` directory and open issues to make sure the extension has not already been audited.

### Step 2: Clone and pin the extension

```bash
git clone <extension-repo-url> /tmp/audit-<extension-name>
cd /tmp/audit-<extension-name>
git log -1 --format="%H %ci"  # Record the commit hash and date
```

Always audit a pinned commit, never `HEAD` of a moving branch.

### Step 3: Conduct the audit

Follow the methodology in [METHODOLOGY.md](METHODOLOGY.md):

1. Search for all network, telemetry, credential, file system, and execution patterns using the keyword lists.
2. Trace data flows from user input to network output.
3. Check the dependency tree for known-malicious or telemetry-containing packages.
4. Evaluate against all 6 attack vectors.
5. Assign a risk level: SAFE, SUSPICIOUS, or TELEMETRY FOUND.

### Step 4: Write the report

Create a new file in `reports/` following this naming convention:

```
reports/<extension-name>.md
```

Use this template:

```markdown
# <Extension Name>

| Field | Value |
|-------|-------|
| Repository | <URL> |
| Type | skill / hook / MCP server / plugin / proxy / config |
| Version audited | <version or commit hash> |
| Audit date | YYYY-MM-DD |
| Risk level | SAFE / SUSPICIOUS / TELEMETRY FOUND |

## Summary

One paragraph describing the extension's stated purpose and the audit finding.

## Network Calls

List every outbound network call found in the source code:

| File | Line | Destination | Data sent | Purpose |
|------|------|-------------|-----------|---------|

If none found, state "No outbound network calls found."

## Telemetry

Describe any telemetry found, including:
- What data is collected
- Where it is sent
- Whether it is opt-in, opt-out, or mandatory
- How to disable it (if possible)

If none found, state "No telemetry found."

## Attack Vector Analysis

### 1. Prompt Injection
### 2. Data Exfiltration
### 3. Credential Harvesting
### 4. Arbitrary Code Execution
### 5. Supply Chain Risk
### 6. Persistence / Privilege Escalation

For each vector: "No indicators found" or describe findings with file paths and line numbers.

## Dependencies

List notable dependencies and any transitive telemetry risks.

## Conclusion

Final assessment and any recommendations.
```

### Step 5: Update the main table

Add an entry to the appropriate table in `README.md`.

### Step 6: Submit a pull request

- Title: `audit: <extension-name> (<risk-level>)`
- Body: Brief summary of findings
- Ensure the report file and README update are both included

## Updating an Existing Entry

When an extension releases a new version that may change its risk profile:

1. Create a new report file: `reports/<extension-name>-v<version>.md`
2. Reference the previous audit in the new report.
3. Update the main table in `README.md` if the risk level changed.
4. Submit a PR with title: `re-audit: <extension-name> (<old-level> -> <new-level>)`

Do **not** delete or overwrite the previous audit file. The history of audits is valuable.

## Reporting a Security Concern

If you have found a security issue in a Claude Code extension:

### Public disclosure (non-urgent)

1. File an issue using the [Security Concern template](.github/ISSUE_TEMPLATE/security-concern.yml).
2. Include specific evidence: file paths, line numbers, code snippets, network captures.
3. Note whether you have notified the extension author.

### Coordinated disclosure (urgent / actively exploited)

1. **Do not file a public issue.**
2. Contact the extension author directly with a 90-day disclosure deadline.
3. If the author is unresponsive after 90 days, file a public issue with full details.
4. If the vulnerability is actively being exploited, file immediately and note the urgency.

## Evidence Standards

All contributions must meet these evidence standards:

### Required

- **Pinned commit hash** — every finding must reference a specific commit, not "the latest version."
- **File paths and line numbers** — every claim about source code must include the exact location.
- **Code snippets** — include the relevant code, not just a description of it.
- **Reproducibility** — another auditor should be able to clone the repo at the same commit and verify your findings.

### Preferred

- **Network captures** — HAR files, tcpdump output, or mitmproxy logs showing actual network behavior.
- **Dependency tree output** — `npm ls`, `pip freeze`, `cargo tree`, etc.
- **Diff from previous version** — when updating an audit, highlight what changed.

### Not acceptable

- "I heard this extension phones home" without evidence.
- Screenshots of README claims without source code verification.
- Findings based on a different version than what is documented.
- AI-generated analysis without human verification of the specific claims.

## Code of Conduct

- **Be factual.** Audits are technical documents, not opinion pieces. State what the code does, not what you think the author intended.
- **Be precise.** "Line 47 of `src/telemetry.ts` calls `fetch('https://example.com/track')`" is useful. "This extension seems sketchy" is not.
- **Be fair.** Many extensions have legitimate reasons for network calls. The goal is transparency, not punishment.
- **Respond to disputes.** If an extension author disputes a finding, engage constructively. If they are correct, update the audit.

## Disputes

Extension authors can dispute any finding by filing an issue using the [Dispute template](.github/ISSUE_TEMPLATE/dispute.yml). Disputes are taken seriously and handled promptly:

1. The original auditor (or another maintainer) reviews the dispute.
2. If the dispute is valid, the audit is corrected and the README is updated.
3. If the dispute is invalid, a detailed explanation is provided.
4. Disputed entries are labeled `disputed` until resolution.

## Questions?

Open a discussion or file an issue. We are happy to help with audit methodology or review draft reports before submission.
