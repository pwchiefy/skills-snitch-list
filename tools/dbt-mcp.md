# dbt MCP Server

| Field | Value |
|-------|-------|
| Repository | https://github.com/dbt-labs/dbt-mcp |
| Type | MCP Server |
| Stars | 610 |
| Telemetry | Yes |
| Default State | ON (opt-out; follows dbt's anonymous usage stats convention) |
| Analytics Providers | dbt Labs telemetry pipeline (`dbtlabs_vortex` producer) |
| Disable Method | Env `DBT_SEND_ANONYMOUS_USAGE_STATS=false` or `DO_NOT_TRACK=1`, or `flags: send_anonymous_usage_stats: false` in `dbt_project.yml` |
| Risk Level | MEDIUM |
| Last Verified | 2026-10-20 |

## What It Does

dbt Labs' official MCP server. It lets agents run dbt CLI commands (`run`, `build`, `test`, `compile`, `show`), query the Semantic Layer, explore model lineage through the Discovery API, and call dbt Cloud admin APIs. Distributed on PyPI (`dbt-mcp`) and as an MCP Bundle (`dbt-mcp.mcpb`), and usually pointed at a real warehouse.

## Telemetry Details

- **Default:** `usage_tracking_enabled` returns `True` unless `DBT_SEND_ANONYMOUS_USAGE_STATS` is false/0, `DO_NOT_TRACK` is true/1, or `dbt_project.yml` sets `send_anonymous_usage_stats`
- **Per tool call (`ToolCalled` event):** tool name, start/end time, **arguments** (JSON-encoded), error message, dbt Cloud account ID/identifier, dev and prod environment IDs, dbt Cloud user ID, a local user ID, host, authentication method, session ID, dbt-mcp version, and size measurements of arguments and response
- **Redaction is a short denylist:** Only `sql_query` and `vars` are replaced with `***`. Other arguments, such as `node_selection`, model names and Semantic Layer query parameters, are sent as given
- **History:** Before 1.17.1 every argument was sent unredacted, including `sql_query` from `show` and `vars` from `run`/`build`/`test` (CVE-2026-44970, fixed in 1.17.1, released 2026-05-05)

## Security Concerns

- **Default-on telemetry from a warehouse-connected tool:** Model names, selectors and error messages describe your data platform. Error messages from failed SQL can include fragments of queries or data
- **Identity-linked:** Events carry dbt Cloud account and user IDs, so they are not anonymous for dbt Cloud users even though the switch is named "anonymous usage stats"
- **Warehouse write access:** `run` and `build` change production tables if the server is configured with production credentials; prompt injection through model docs or query results can trigger them

## How to Opt Out

1. Set `DO_NOT_TRACK=1` (or `DBT_SEND_ANONYMOUS_USAGE_STATS=false`) in the MCP server's environment
2. Or add to `dbt_project.yml`:
   ```yaml
   flags:
     send_anonymous_usage_stats: false
   ```
3. Upgrade to 1.17.1 or later in any case (latest PyPI release 2.7.0 on 2026-10-20)
4. Point the server at a development target, not production, unless you need production

## Evidence

- Audited commit: [`e1c71b76`](https://github.com/dbt-labs/dbt-mcp/tree/e1c71b768c68a40ef0307948bccf9c6614ed8bcd) (PyPI `dbt-mcp` 2.7.0)
- Opt-out logic and default `True`: [src/dbt_mcp/config/settings.py#L226-L247](https://github.com/dbt-labs/dbt-mcp/blob/e1c71b768c68a40ef0307948bccf9c6614ed8bcd/src/dbt_mcp/config/settings.py#L226-L247)
- Redaction denylist: [src/dbt_mcp/tracking/tracking.py#L30](https://github.com/dbt-labs/dbt-mcp/blob/e1c71b768c68a40ef0307948bccf9c6614ed8bcd/src/dbt_mcp/tracking/tracking.py#L30)
- Event construction (arguments, IDs, host): [tracking.py#L101-L175](https://github.com/dbt-labs/dbt-mcp/blob/e1c71b768c68a40ef0307948bccf9c6614ed8bcd/src/dbt_mcp/tracking/tracking.py#L101-L175)
- Advisory: [GHSA-jj54-r8gm-2fcf / CVE-2026-44970](https://github.com/dbt-labs/dbt-mcp/security/advisories/GHSA-jj54-r8gm-2fcf), [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-44970), fix [PR #752](https://github.com/dbt-labs/dbt-mcp/pull/752)
- Star count: GitHub API, 610 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
