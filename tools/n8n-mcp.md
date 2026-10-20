# n8n-MCP

| Field | Value |
|-------|-------|
| Repository | https://github.com/czlonkowski/n8n-mcp |
| Type | MCP Server |
| Stars | 23K |
| Telemetry | Yes |
| Default State | ON (opt-out; first-run notice links the privacy policy) |
| Analytics Providers | Project-operated ingest at `telemetry.n8n-mcp.com` (Microsoft Azure, EU); AI service providers for dataset processing |
| Disable Method | `npx n8n-mcp telemetry disable`, or env `N8N_MCP_TELEMETRY_DISABLED=true` / `TELEMETRY_DISABLED=true` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

An MCP server that gives coding agents n8n node documentation, workflow validation and, when an n8n API URL and key are configured, tools to create, update and run workflows on your n8n instance. It runs locally via `npx n8n-mcp`, in Docker, or in a multi-tenant HTTP mode for hosted deployments.

## Telemetry Details

- **Default:** Enabled on first run; the config file records an installation ID and the opt-in state
- **Installation ID:** A 16-character hash derived from hostname, platform, architecture and home directory path (Docker/cloud: boot ID). The policy calls this pseudonymous, not anonymous
- **Data collected (per PRIVACY.md, Version 2, effective 2026-09-28):**
  - Tool names, success, duration
  - The free-text `intent` argument of workflow-update tools (for example "Add error handling for API failures") after pattern-based scrubbing, plus the operation types applied
  - **Sanitized workflow structures** for workflows created, updated or validated through the server: node types, node names, connections and the node parameters that survive sanitization
  - Error categories, platform/arch/Node version/Docker and cloud detection, startup and request timing
- **Use of data:** "to build datasets and machine learning models for workflow generation". The policy allows sharing or licensing the anonymized workflow dataset and models with third parties "including commercial partners"
- **License grant:** "By leaving telemetry enabled you grant us a worldwide, non-exclusive, royalty-free, perpetual license" to the submitted data
- **Retention:** Raw events 7 days, then reduced to counts; workflow change records are anonymized after 7 days and kept in the dataset

## Security Concerns

- **Workflow content leaves your machine by default.** Workflows often encode business logic, internal system names and customer-specific steps. Sanitization is pattern-based, and the policy itself says it "cannot guarantee that every piece of sensitive data is caught"
- **Sanitizer bug already happened:** CVE-2026-45582 (fixed in 2.51.3) — the telemetry sanitizer could retain fragments of URL-shaped node parameters (tenant IDs, short secrets in query strings, signed parameters) and send them to the telemetry backend, contrary to PRIVACY.md
- **Steady stream of server-side advisories in 2026:** authenticated SSRF (CVE-2026-39974, CVE-2026-42449, CVE-2026-44694), sensitive request data and tool-call arguments in logs (CVE-2026-41495, CVE-2026-42282), cross-tenant access to workflow version backups (CVE-2026-54052, critical; CVE-2026-55608), and fallback to process-level n8n credentials in multi-tenant mode (CVE-2026-45707). Most affect the HTTP / multi-tenant deployment, not the local stdio mode
- **Write access to production automation:** With API credentials configured, the agent can modify and trigger live workflows that themselves hold credentials to other systems

## How to Opt Out

1. Run `npx n8n-mcp telemetry disable` (check with `npx n8n-mcp telemetry status`)
2. Docker / MCP client config: set `N8N_MCP_TELEMETRY_DISABLED=true` in the server environment
3. Disable before the first workflow tool call; the first-run notice treats leaving telemetry on as acceptance of the policy
4. Run the latest release (2.94.3 on 2026-10-20) to pick up the advisory fixes above

## Evidence

- Audited commit: [`19b09f50`](https://github.com/czlonkowski/n8n-mcp/tree/19b09f50efd8c78d46e0c9a6f670271efcb87123) (v2.94.3, released 2026-10-19)
- Privacy policy (default ON, data list, ML/dataset use, license grant): [PRIVACY.md#L9](https://github.com/czlonkowski/n8n-mcp/blob/19b09f50efd8c78d46e0c9a6f670271efcb87123/PRIVACY.md#L9), [#L21-L31](https://github.com/czlonkowski/n8n-mcp/blob/19b09f50efd8c78d46e0c9a6f670271efcb87123/PRIVACY.md#L21-L31), [#L77-L112](https://github.com/czlonkowski/n8n-mcp/blob/19b09f50efd8c78d46e0c9a6f670271efcb87123/PRIVACY.md#L77-L112)
- Telemetry endpoint: [src/telemetry/telemetry-types.ts#L120](https://github.com/czlonkowski/n8n-mcp/blob/19b09f50efd8c78d46e0c9a6f670271efcb87123/src/telemetry/telemetry-types.ts#L120)
- Opt-out env vars: [src/telemetry/config-manager.ts#L291-L292](https://github.com/czlonkowski/n8n-mcp/blob/19b09f50efd8c78d46e0c9a6f670271efcb87123/src/telemetry/config-manager.ts#L291-L292)
- Sanitizers: [src/telemetry/workflow-sanitizer.ts](https://github.com/czlonkowski/n8n-mcp/blob/19b09f50efd8c78d46e0c9a6f670271efcb87123/src/telemetry/workflow-sanitizer.ts), [src/telemetry/intent-sanitizer.ts](https://github.com/czlonkowski/n8n-mcp/blob/19b09f50efd8c78d46e0c9a6f670271efcb87123/src/telemetry/intent-sanitizer.ts)
- Advisories: [GHSA-f3rg-xqjj-cj9w (CVE-2026-45582)](https://github.com/advisories/GHSA-f3rg-xqjj-cj9w), [GHSA-j6r7-6fhx-77wx (CVE-2026-54052)](https://github.com/advisories/GHSA-j6r7-6fhx-77wx), [GHSA-jxx9-px88-pj69 (CVE-2026-45707)](https://github.com/advisories/GHSA-jxx9-px88-pj69), [GHSA-4ggg-h7ph-26qr (CVE-2026-39974)](https://github.com/advisories/GHSA-4ggg-h7ph-26qr), [GHSA-56c3-vfp2-5qqj (CVE-2026-42449)](https://github.com/advisories/GHSA-56c3-vfp2-5qqj), [GHSA-cmrh-wvq6-wm9r (CVE-2026-44694)](https://github.com/advisories/GHSA-cmrh-wvq6-wm9r), [GHSA-pfm2-2mhg-8wpx (CVE-2026-41495)](https://github.com/advisories/GHSA-pfm2-2mhg-8wpx), [GHSA-wg4g-395p-mqv3 (CVE-2026-42282)](https://github.com/advisories/GHSA-wg4g-395p-mqv3), [GHSA-2cf7-hpwf-47h9 (CVE-2026-55608)](https://github.com/advisories/GHSA-2cf7-hpwf-47h9)
- Star count: GitHub API, 23,102 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
