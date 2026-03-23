#!/usr/bin/env npx tsx
/**
 * skills-snitch-list — Weekly Extension Scanner
 *
 * Scans Claude Code extensions (skills, hooks, MCP servers, plugins, proxies)
 * for telemetry changes and security concerns:
 *   Phase 1: GitHub commit messages mentioning telemetry/security keywords
 *   Phase 2: New releases / tags on tracked repos
 *   Phase 3: Aggregator awesome-list change detection
 *   Phase 4: npm registry scanning for new claude-skill/claude-code packages
 *
 * Usage:
 *   npx tsx scripts/scan-extensions.ts
 *   npx tsx scripts/scan-extensions.ts --dry-run          # Seed baseline, no change alerts
 *   npx tsx scripts/scan-extensions.ts --create-issues    # Auto-create GitHub issues
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { execFile, type ExecFileException } from 'node:child_process';
import { promisify } from 'node:util';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SCAN_STATE = path.join(ROOT, 'data/scan-state.json');
const REPORTS_DIR = path.join(ROOT, 'reports');
const PID_FILE = path.join(os.homedir(), '.skills-snitch-scanner.pid');

// Repos to monitor for telemetry changes
const MONITORED_REPOS: MonitoredRepo[] = [
  { name: 'gstack', repo: 'garrytan/gstack', risk: 'telemetry' },
  { name: 'DesktopCommanderMCP', repo: 'wonderwhy-er/DesktopCommanderMCP', risk: 'telemetry' },
  { name: 'Windows-MCP', repo: 'CursorTouch/Windows-MCP', risk: 'telemetry' },
  { name: 'XcodeBuildMCP', repo: 'getsentry/XcodeBuildMCP', risk: 'telemetry' },
  { name: 'loki-mode', repo: 'asklokesh/claudeskill-loki-mode', risk: 'telemetry' },
  { name: 'claude-mem', repo: 'thedotmack/claude-mem', risk: 'critical' },
  { name: 'claude-code-router', repo: 'musistudio/claude-code-router', risk: 'critical' },
  { name: 'tweakcc', repo: 'Piebald-AI/tweakcc', risk: 'critical' },
  { name: 'homunculus', repo: 'humanplane/homunculus', risk: 'critical' },
  { name: 'superpowers', repo: 'obra/superpowers', risk: 'safe' },
  { name: 'mattpocock-skills', repo: 'mattpocock/skills', risk: 'safe' },
  { name: 'obsidian-skills', repo: 'kepano/obsidian-skills', risk: 'safe' },
  { name: 'everything-claude-code', repo: 'affaan-m/everything-claude-code', risk: 'high' },
  { name: 'antigravity-awesome-skills', repo: 'sickn33/antigravity-awesome-skills', risk: 'medium' },
  { name: 'opencode-skills', repo: 'anthropics/skills', risk: 'safe' },
  { name: 'openskills', repo: 'numman-ali/openskills', risk: 'safe' },
  { name: 'baoyu-skills', repo: 'JimLiu/baoyu-skills', risk: 'safe' },
  { name: 'marketingskills', repo: 'coreyhaines31/marketingskills', risk: 'safe' },
  { name: 'claude-skills-jeffallan', repo: 'Jeffallan/claude-skills', risk: 'safe' },
  { name: 'claude-skills-alirezarezvani', repo: 'alirezarezvani/claude-skills', risk: 'safe' },
  { name: 'frontend-slides', repo: 'zarazhangrui/frontend-slides', risk: 'safe' },
  { name: 'pm-skills', repo: 'phuryn/pm-skills', risk: 'safe' },
  { name: 'trailofbits-skills', repo: 'trailofbits/skills', risk: 'safe' },
  { name: 'devika', repo: 'stitionai/devika', risk: 'safe' },
  { name: 'Dimillian-Skills', repo: 'Dimillian/Skills', risk: 'safe' },
  { name: 'mcollina-skills', repo: 'mcollina/skills', risk: 'safe' },
];

// Awesome-list aggregators to check for new entries
const AGGREGATOR_REPOS = [
  'travisvn/awesome-claude-skills',
  'BehiSecc/awesome-claude-skills',
  'ComposioHQ/awesome-claude-skills',
  'hesreallyhim/awesome-claude-code',
  'VoltAgent/awesome-agent-skills',
  'affaan-m/everything-claude-code',
];

const TELEMETRY_KEYWORDS = [
  'posthog', 'segment', 'amplitude', 'mixpanel', 'rudderstack',
  'google-analytics', 'sentry', 'bugsnag', 'rollbar', 'datadog',
  'telemetry', 'analytics', 'tracking', 'phone-home', 'phone_home',
  'metrics', 'usage-data', 'usage_data', 'opentelemetry', 'otlp',
  'opt-out', 'opt_out', 'opt-in', 'opt_in', 'disable-telemetry',
  'disable_telemetry', 'statsig', 'supabase', 'beacon', 'pixel',
  'fingerprint', 'device_id', 'machine_id', 'installation_id',
];

const SECURITY_KEYWORDS = [
  'dangerously-skip-permissions', 'bypass-permissions', 'bypassPermissions',
  'ANTHROPIC_BASE_URL', 'enableAllProjectMcpServers',
  'allowed-tools.*Bash\\(\\*\\)', 'curl.*\\|.*bash', 'eval\\(',
  'child_process', 'execSync', 'spawn\\(', 'exec\\(',
];

const GITHUB_CONCURRENCY = 5;
const GITHUB_DELAY_MS = 100;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MonitoredRepo {
  name: string;
  repo: string;
  risk: string;
}

interface ScanState {
  lastScanDate: string | null;
  lastKnownTags: Record<string, string>;
  aggregatorHashes: Record<string, string>;
}

interface CommitMatch {
  repo: string;
  name: string;
  sha: string;
  message: string;
  date: string;
  matchedKeywords: string[];
  matchedFiles: string[];
  keywordType: 'telemetry' | 'security';
}

interface ReleaseChange {
  repo: string;
  name: string;
  previousTag: string;
  newTag: string;
  publishedAt: string;
  url: string;
}

interface AggregatorChange {
  repo: string;
  changed: boolean;
  newEntries: string[];
}

interface NpmPackageChange {
  name: string;
  version: string;
  description: string;
  url: string;
}

interface ScanReport {
  date: string;
  reposScanned: number;
  aggregatorsChecked: number;
  commitMatches: CommitMatch[];
  releaseChanges: ReleaseChange[];
  aggregatorChanges: AggregatorChange[];
  npmPackages: NpmPackageChange[];
  errors: string[];
  isDryRun: boolean;
}

// ---------------------------------------------------------------------------
// PID Guard
// ---------------------------------------------------------------------------

function acquirePidLock(): boolean {
  if (fs.existsSync(PID_FILE)) {
    const existingPid = parseInt(fs.readFileSync(PID_FILE, 'utf-8').trim(), 10);
    try {
      process.kill(existingPid, 0);
      console.error(`Scanner already running (PID ${existingPid}). Exiting.`);
      return false;
    } catch {
      // Stale PID file — previous process is gone
      console.log(`Removing stale PID file (PID ${existingPid}).`);
    }
  }
  fs.writeFileSync(PID_FILE, String(process.pid));
  return true;
}

function setupSignalHandlers(): void {
  const cleanup = () => {
    try { fs.unlinkSync(PID_FILE); } catch { /* ignore */ }
    process.exit(0);
  };
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
  process.on('exit', () => {
    try { fs.unlinkSync(PID_FILE); } catch { /* ignore */ }
  });
}

// ---------------------------------------------------------------------------
// GitHub API Helper (delegates to `gh` CLI for auth)
// ---------------------------------------------------------------------------

const execFileAsync = promisify(execFile);

async function ghApi(
  endpoint: string,
  queryParams: Record<string, string | number> = {},
): Promise<any> {
  const qs = Object.entries(queryParams)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  const fullEndpoint = qs ? `${endpoint}?${qs}` : endpoint;
  const args = ['api', fullEndpoint];

  try {
    const { stdout } = await execFileAsync('gh', args, {
      maxBuffer: 10 * 1024 * 1024,
    });
    return JSON.parse(stdout);
  } catch (err: unknown) {
    const execErr = err as ExecFileException & { stderr?: string };
    if (execErr.stderr?.includes('404') || execErr.stderr?.includes('Not Found')) {
      return null;
    }
    if (execErr.stderr?.includes('rate limit') || execErr.stderr?.includes('403')) {
      throw new Error(`GitHub API rate limit: ${execErr.stderr}`);
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

async function processBatches<T, R>(
  items: T[],
  batchSize: number,
  delayMs: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    if (i + batchSize < items.length) await sleep(delayMs);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Phase 1: GitHub Commit Scanning (Telemetry + Security Keywords)
// ---------------------------------------------------------------------------

async function scanRepoCommits(
  repos: MonitoredRepo[],
  scanState: ScanState,
  errors: string[],
): Promise<CommitMatch[]> {
  console.log(`Phase 1: Scanning ${repos.length} repos for telemetry/security commits...`);

  const since =
    scanState.lastScanDate ||
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const allMatches: CommitMatch[] = [];

  const results = await processBatches(
    repos,
    GITHUB_CONCURRENCY,
    GITHUB_DELAY_MS,
    async (entry): Promise<CommitMatch[]> => {
      const matches: CommitMatch[] = [];
      try {
        const commits = await ghApi(`repos/${entry.repo}/commits`, {
          since,
          per_page: 50,
        });
        if (!commits || !Array.isArray(commits)) return matches;

        for (const commit of commits.slice(0, 20)) {
          const msg = (commit.commit?.message || '').toLowerCase();

          // Check telemetry keywords
          const telemetryHits = TELEMETRY_KEYWORDS.filter(kw => msg.includes(kw));
          // Check security keywords (using regex for pattern-based keywords)
          const securityHits = SECURITY_KEYWORDS.filter(kw => {
            try {
              return new RegExp(kw, 'i').test(msg);
            } catch {
              return msg.includes(kw.toLowerCase());
            }
          });

          if (telemetryHits.length > 0 || securityHits.length > 0) {
            let matchedFiles: string[] = [];
            try {
              const detail = await ghApi(
                `repos/${entry.repo}/commits/${commit.sha}`,
              );
              if (detail?.files) {
                const allKeywords = [...TELEMETRY_KEYWORDS, ...SECURITY_KEYWORDS];
                matchedFiles = detail.files
                  .filter((f: any) =>
                    allKeywords.some(kw => {
                      try {
                        return new RegExp(kw, 'i').test(f.filename);
                      } catch {
                        return f.filename.toLowerCase().includes(kw.toLowerCase());
                      }
                    }),
                  )
                  .map((f: any) => f.filename);
              }
            } catch {
              /* skip detail-fetch failures */
            }

            if (telemetryHits.length > 0) {
              matches.push({
                repo: entry.repo,
                name: entry.name,
                sha: commit.sha.substring(0, 12),
                message: commit.commit.message.split('\n')[0].substring(0, 120),
                date: commit.commit.author?.date || '',
                matchedFiles,
                matchedKeywords: telemetryHits,
                keywordType: 'telemetry',
              });
            }

            if (securityHits.length > 0) {
              matches.push({
                repo: entry.repo,
                name: entry.name,
                sha: commit.sha.substring(0, 12),
                message: commit.commit.message.split('\n')[0].substring(0, 120),
                date: commit.commit.author?.date || '',
                matchedFiles,
                matchedKeywords: securityHits,
                keywordType: 'security',
              });
            }
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`GitHub scan failed for ${entry.repo}: ${msg}`);
      }
      return matches;
    },
  );

  for (const batch of results) {
    if (Array.isArray(batch)) allMatches.push(...batch);
  }

  const telemetryCount = allMatches.filter(m => m.keywordType === 'telemetry').length;
  const securityCount = allMatches.filter(m => m.keywordType === 'security').length;
  console.log(`  Found ${telemetryCount} telemetry + ${securityCount} security commits.`);
  return allMatches;
}

// ---------------------------------------------------------------------------
// Phase 2: New Releases / Tags
// ---------------------------------------------------------------------------

async function scanNewReleases(
  repos: MonitoredRepo[],
  scanState: ScanState,
  errors: string[],
): Promise<ReleaseChange[]> {
  console.log(`Phase 2: Checking ${repos.length} repos for new releases...`);

  const changes: ReleaseChange[] = [];

  await processBatches(
    repos,
    GITHUB_CONCURRENCY,
    GITHUB_DELAY_MS,
    async (entry): Promise<void> => {
      try {
        const releases = await ghApi(`repos/${entry.repo}/releases`, {
          per_page: 1,
        });

        if (!releases || !Array.isArray(releases) || releases.length === 0) {
          // Fall back to tags
          const tags = await ghApi(`repos/${entry.repo}/tags`, { per_page: 1 });
          if (tags && Array.isArray(tags) && tags.length > 0) {
            const latestTag = tags[0].name;
            if (scanState.lastKnownTags[entry.repo] !== latestTag) {
              changes.push({
                repo: entry.repo,
                name: entry.name,
                previousTag:
                  scanState.lastKnownTags[entry.repo] || '(first scan)',
                newTag: latestTag,
                publishedAt: '',
                url: `https://github.com/${entry.repo}/releases/tag/${latestTag}`,
              });
              scanState.lastKnownTags[entry.repo] = latestTag;
            }
          }
          return;
        }

        const latest = releases[0];
        const latestTag: string = latest.tag_name;
        if (scanState.lastKnownTags[entry.repo] !== latestTag) {
          changes.push({
            repo: entry.repo,
            name: entry.name,
            previousTag:
              scanState.lastKnownTags[entry.repo] || '(first scan)',
            newTag: latestTag,
            publishedAt: latest.published_at || '',
            url:
              latest.html_url ||
              `https://github.com/${entry.repo}/releases/tag/${latestTag}`,
          });
          scanState.lastKnownTags[entry.repo] = latestTag;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Release check failed for ${entry.repo}: ${msg}`);
      }
    },
  );

  console.log(`  ${changes.length} new releases detected.`);
  return changes;
}

// ---------------------------------------------------------------------------
// Phase 3: Aggregator Change Detection
// ---------------------------------------------------------------------------

async function scanAggregators(
  scanState: ScanState,
  isDryRun: boolean,
  errors: string[],
): Promise<AggregatorChange[]> {
  console.log(`Phase 3: Checking ${AGGREGATOR_REPOS.length} aggregator repos for changes...`);

  const changes: AggregatorChange[] = [];

  for (const repo of AGGREGATOR_REPOS) {
    try {
      const readmeData = await ghApi(`repos/${repo}/readme`);
      if (!readmeData) {
        errors.push(`Aggregator ${repo}: no README found`);
        continue;
      }

      const content = Buffer.from(readmeData.content, 'base64').toString('utf-8');
      const hash = crypto.createHash('sha256').update(content).digest('hex');

      const oldHash = scanState.aggregatorHashes[repo];
      if (oldHash && oldHash !== hash && !isDryRun) {
        // Extract GitHub repo URLs from content
        const urlMatches = content.match(
          /https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+/g,
        ) || [];
        // Deduplicate
        const uniqueUrls = [...new Set(urlMatches)];
        changes.push({
          repo,
          changed: true,
          newEntries: uniqueUrls.slice(0, 20),
        });
        console.log(`  [changed] ${repo} (${uniqueUrls.length} URLs extracted)`);
      } else if (!oldHash) {
        console.log(`  [baseline] ${repo}`);
      } else {
        console.log(`  [unchanged] ${repo}`);
      }

      scanState.aggregatorHashes[repo] = hash;
      await sleep(GITHUB_DELAY_MS);
    } catch (err: any) {
      errors.push(`Aggregator scan failed for ${repo}: ${err.message}`);
      console.log(`  [fail] ${repo}: ${err.message}`);
    }
  }

  console.log(`  ${changes.length} aggregators changed.`);
  return changes;
}

// ---------------------------------------------------------------------------
// Phase 4: npm New Package Check
// ---------------------------------------------------------------------------

async function scanNpmPackages(errors: string[]): Promise<NpmPackageChange[]> {
  const searches = ['claude-skill', 'claude-code-skill', 'mcp-server-claude'];
  console.log(`Phase 4: Searching npm for new packages (${searches.join(', ')})...`);

  const packages: NpmPackageChange[] = [];
  const seenNames = new Set<string>();

  for (const query of searches) {
    try {
      const { stdout } = await execFileAsync(
        'npm',
        ['search', query, '--json', '--long'],
        { maxBuffer: 5 * 1024 * 1024 },
      );
      const results = JSON.parse(stdout);
      if (!Array.isArray(results)) continue;

      // Filter to packages published in last 7 days
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recent = results.filter((pkg: any) => {
        if (!pkg.date) return false;
        const pubDate = new Date(pkg.date);
        return pubDate > weekAgo;
      });

      for (const pkg of recent) {
        if (seenNames.has(pkg.name)) continue;
        seenNames.add(pkg.name);
        packages.push({
          name: pkg.name,
          version: pkg.version || 'unknown',
          description: pkg.description || '',
          url: `https://www.npmjs.com/package/${pkg.name}`,
        });
      }
      console.log(`  [npm] "${query}": ${recent.length} recent packages`);
    } catch (err: any) {
      errors.push(`npm search failed for "${query}": ${err.message}`);
      console.log(`  [npm-fail] "${query}": ${err.message}`);
    }
  }

  console.log(`  ${packages.length} new npm packages found.`);
  return packages;
}

// ---------------------------------------------------------------------------
// Report Generation (Markdown)
// ---------------------------------------------------------------------------

function generateReport(report: ScanReport): string {
  const lines: string[] = [];
  const label = report.isDryRun
    ? 'Initial Baseline Scan'
    : 'Extension Scan Report';

  lines.push(`# ${label} — ${report.date}`);
  lines.push('');
  lines.push(`Scan completed: ${new Date().toISOString()}`);
  lines.push(
    `Repos scanned: ${report.reposScanned} | Aggregators checked: ${report.aggregatorsChecked}`,
  );
  lines.push('');

  // Phase 1a: Telemetry commits -----------------------------------------------
  lines.push('---');
  lines.push('');
  lines.push('## Telemetry Code Changes');
  lines.push('');

  const telemetryCommits = report.commitMatches.filter(
    m => m.keywordType === 'telemetry',
  );

  if (telemetryCommits.length === 0) {
    lines.push('No telemetry-related commits detected since last scan.');
  } else {
    const byRepo: Record<string, CommitMatch[]> = {};
    for (const m of telemetryCommits) {
      (byRepo[m.repo] ??= []).push(m);
    }
    for (const [repo, matches] of Object.entries(byRepo)) {
      const riskLabel = MONITORED_REPOS.find(r => r.repo === repo)?.risk || 'unknown';
      lines.push(`### ${matches[0].name} (\`${repo}\`) [${riskLabel}]`);
      for (const m of matches) {
        lines.push(
          `- **\`${m.sha}\`** (${m.date.substring(0, 10)}): ${m.message}`,
        );
        if (m.matchedKeywords.length > 0) {
          lines.push(`  - Keywords: ${m.matchedKeywords.join(', ')}`);
        }
        if (m.matchedFiles.length > 0) {
          lines.push(`  - Files: ${m.matchedFiles.join(', ')}`);
        }
      }
      lines.push('');
    }
  }

  // Phase 1b: Security commits -------------------------------------------------
  lines.push('---');
  lines.push('');
  lines.push('## Security-Relevant Changes');
  lines.push('');

  const securityCommits = report.commitMatches.filter(
    m => m.keywordType === 'security',
  );

  if (securityCommits.length === 0) {
    lines.push('No security-relevant commits detected since last scan.');
  } else {
    const byRepo: Record<string, CommitMatch[]> = {};
    for (const m of securityCommits) {
      (byRepo[m.repo] ??= []).push(m);
    }
    for (const [repo, matches] of Object.entries(byRepo)) {
      const riskLabel = MONITORED_REPOS.find(r => r.repo === repo)?.risk || 'unknown';
      lines.push(`### ${matches[0].name} (\`${repo}\`) [${riskLabel}]`);
      for (const m of matches) {
        lines.push(
          `- **\`${m.sha}\`** (${m.date.substring(0, 10)}): ${m.message}`,
        );
        if (m.matchedKeywords.length > 0) {
          lines.push(`  - Patterns: ${m.matchedKeywords.join(', ')}`);
        }
        if (m.matchedFiles.length > 0) {
          lines.push(`  - Files: ${m.matchedFiles.join(', ')}`);
        }
      }
      lines.push('');
    }
  }

  // Phase 2: New releases ------------------------------------------------------
  lines.push('---');
  lines.push('');
  lines.push('## New Releases');
  lines.push('');

  if (report.releaseChanges.length === 0) {
    lines.push('No new releases detected.');
  } else {
    lines.push('| Extension | Repo | Previous | New | Published |');
    lines.push('|-----------|------|----------|-----|-----------|');
    for (const r of report.releaseChanges) {
      const pub = r.publishedAt ? r.publishedAt.substring(0, 10) : '---';
      lines.push(
        `| ${r.name} | \`${r.repo}\` | ${r.previousTag} | [${r.newTag}](${r.url}) | ${pub} |`,
      );
    }
  }

  // Phase 3: Aggregator updates ------------------------------------------------
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Aggregator Updates');
  lines.push('');

  if (report.aggregatorChanges.length === 0) {
    lines.push('No aggregator awesome-lists changed since last scan.');
  } else {
    for (const a of report.aggregatorChanges) {
      lines.push(`### \`${a.repo}\``);
      lines.push('');
      if (a.newEntries.length > 0) {
        lines.push('Extracted repo URLs (may include existing entries):');
        for (const url of a.newEntries) {
          lines.push(`- ${url}`);
        }
      } else {
        lines.push('Content changed but no new repo URLs extracted.');
      }
      lines.push('');
    }
  }

  // Phase 4: npm packages ------------------------------------------------------
  lines.push('---');
  lines.push('');
  lines.push('## New npm Packages');
  lines.push('');

  if (report.npmPackages.length === 0) {
    lines.push('No new claude-related npm packages published in the last 7 days.');
  } else {
    lines.push('| Package | Version | Description |');
    lines.push('|---------|---------|-------------|');
    for (const pkg of report.npmPackages) {
      const desc = pkg.description.substring(0, 80);
      lines.push(
        `| [${pkg.name}](${pkg.url}) | ${pkg.version} | ${desc} |`,
      );
    }
  }

  // Errors ---------------------------------------------------------------------
  if (report.errors.length > 0) {
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Errors & Warnings');
    lines.push('');
    for (const e of report.errors) {
      lines.push(`- ${e}`);
    }
  }

  // Summary --------------------------------------------------------------------
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(
    `- **${telemetryCommits.length}** telemetry-related commits found`,
  );
  lines.push(
    `- **${securityCommits.length}** security-relevant commits found`,
  );
  lines.push(
    `- **${report.releaseChanges.filter(r => r.previousTag !== '(first scan)').length}** new releases (${report.releaseChanges.filter(r => r.previousTag === '(first scan)').length} first-time baselines)`,
  );
  lines.push(
    `- **${report.aggregatorChanges.length}** aggregator lists changed`,
  );
  lines.push(
    `- **${report.npmPackages.length}** new npm packages`,
  );
  lines.push(`- **${report.errors.length}** errors encountered`);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Optional: Auto-create GitHub Issues for Significant Changes
// ---------------------------------------------------------------------------

async function createIssuesForChanges(report: ScanReport): Promise<void> {
  const telemetryCommits = report.commitMatches.filter(
    m => m.keywordType === 'telemetry',
  );
  const securityCommits = report.commitMatches.filter(
    m => m.keywordType === 'security',
  );

  if (
    telemetryCommits.length === 0 &&
    securityCommits.length === 0 &&
    report.aggregatorChanges.length === 0 &&
    report.npmPackages.length === 0
  ) {
    return;
  }

  // Group commit changes by extension name
  const extensionChanges = new Map<
    string,
    { telemetry: CommitMatch[]; security: CommitMatch[] }
  >();

  for (const c of telemetryCommits) {
    const existing = extensionChanges.get(c.name) || {
      telemetry: [],
      security: [],
    };
    existing.telemetry.push(c);
    extensionChanges.set(c.name, existing);
  }
  for (const c of securityCommits) {
    const existing = extensionChanges.get(c.name) || {
      telemetry: [],
      security: [],
    };
    existing.security.push(c);
    extensionChanges.set(c.name, existing);
  }

  // Create issues for each affected extension
  for (const [extName, changes] of extensionChanges) {
    const bodyLines = [
      `## Automated Scanner Report — ${report.date}`,
      '',
    ];

    if (changes.telemetry.length > 0) {
      bodyLines.push('### Telemetry Code Changes');
      for (const c of changes.telemetry) {
        bodyLines.push(`- \`${c.sha}\`: ${c.message}`);
        bodyLines.push(`  Keywords: ${c.matchedKeywords.join(', ')}`);
      }
      bodyLines.push('');
    }

    if (changes.security.length > 0) {
      bodyLines.push('### Security-Relevant Changes');
      for (const c of changes.security) {
        bodyLines.push(`- \`${c.sha}\`: ${c.message}`);
        bodyLines.push(`  Patterns: ${c.matchedKeywords.join(', ')}`);
      }
      bodyLines.push('');
    }

    bodyLines.push('---');
    bodyLines.push(
      '*This issue was automatically created by the skills-snitch-list scanner. Please verify and update the extension entry accordingly.*',
    );

    try {
      await execFileAsync('gh', [
        'issue',
        'create',
        '--repo',
        'pwchiefy/skills-snitch-list',
        '--title',
        `[Scanner] Changes detected: ${extName}`,
        '--body',
        bodyLines.join('\n'),
        '--label',
        'scanner,needs-review',
      ]);
      console.log(`  Created issue for ${extName}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  Failed to create issue for ${extName}: ${msg}`);
    }
  }

  // Create a single issue for aggregator changes
  if (report.aggregatorChanges.length > 0) {
    const bodyLines = [
      `## Aggregator Changes Detected — ${report.date}`,
      '',
    ];
    for (const a of report.aggregatorChanges) {
      bodyLines.push(`### \`${a.repo}\``);
      if (a.newEntries.length > 0) {
        bodyLines.push('Extracted URLs:');
        for (const url of a.newEntries.slice(0, 10)) {
          bodyLines.push(`- ${url}`);
        }
      }
      bodyLines.push('');
    }
    bodyLines.push('---');
    bodyLines.push(
      '*Review these aggregator changes for new extensions that should be added to the monitored list.*',
    );

    try {
      await execFileAsync('gh', [
        'issue',
        'create',
        '--repo',
        'pwchiefy/skills-snitch-list',
        '--title',
        `[Scanner] Aggregator awesome-lists changed (${report.aggregatorChanges.length})`,
        '--body',
        bodyLines.join('\n'),
        '--label',
        'scanner,aggregator',
      ]);
      console.log(`  Created aggregator change issue`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  Failed to create aggregator issue: ${msg}`);
    }
  }

  // Create a single issue for new npm packages
  if (report.npmPackages.length > 0) {
    const bodyLines = [
      `## New npm Packages Detected — ${report.date}`,
      '',
      '| Package | Version | Description |',
      '|---------|---------|-------------|',
    ];
    for (const pkg of report.npmPackages) {
      bodyLines.push(
        `| [${pkg.name}](${pkg.url}) | ${pkg.version} | ${pkg.description.substring(0, 80)} |`,
      );
    }
    bodyLines.push('');
    bodyLines.push('---');
    bodyLines.push(
      '*Review these new packages for inclusion in the monitored list.*',
    );

    try {
      await execFileAsync('gh', [
        'issue',
        'create',
        '--repo',
        'pwchiefy/skills-snitch-list',
        '--title',
        `[Scanner] New npm packages detected (${report.npmPackages.length})`,
        '--body',
        bodyLines.join('\n'),
        '--label',
        'scanner,npm',
      ]);
      console.log(`  Created npm packages issue`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  Failed to create npm packages issue: ${msg}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const shouldCreateIssues = args.includes('--create-issues');

  console.log('\n  Skills Snitch List — Extension Scanner');
  console.log(`   ${new Date().toISOString()}`);
  console.log(
    `   Mode: ${isDryRun ? 'DRY RUN (seeding baseline)' : 'LIVE'}`,
  );
  console.log('');

  // PID guard
  if (!acquirePidLock()) {
    process.exit(1);
  }
  setupSignalHandlers();

  try {
    // Load scan state
    let scanState: ScanState = {
      lastScanDate: null,
      lastKnownTags: {},
      aggregatorHashes: {},
    };
    try {
      if (fs.existsSync(SCAN_STATE)) {
        scanState = JSON.parse(fs.readFileSync(SCAN_STATE, 'utf-8'));
      }
    } catch {
      /* start fresh */
    }

    // Ensure reports dir exists
    if (!fs.existsSync(REPORTS_DIR)) {
      fs.mkdirSync(REPORTS_DIR, { recursive: true });
    }

    const errors: string[] = [];
    const today = new Date().toISOString().substring(0, 10);

    // Phase 1: GitHub commits (telemetry + security)
    const commitMatches = await scanRepoCommits(
      MONITORED_REPOS,
      scanState,
      errors,
    );

    // Phase 2: New releases
    const releaseChanges = await scanNewReleases(
      MONITORED_REPOS,
      scanState,
      errors,
    );

    // Phase 3: Aggregator change detection
    const aggregatorChanges = await scanAggregators(
      scanState,
      isDryRun,
      errors,
    );

    // Phase 4: npm new packages
    const npmPackages = await scanNpmPackages(errors);

    // Build report
    const report: ScanReport = {
      date: today,
      reposScanned: MONITORED_REPOS.length,
      aggregatorsChecked: AGGREGATOR_REPOS.length,
      commitMatches,
      releaseChanges,
      aggregatorChanges,
      npmPackages,
      errors,
      isDryRun,
    };

    // Generate and save Markdown report
    const reportMd = generateReport(report);
    const reportPath = path.join(REPORTS_DIR, `${today}-scan.md`);
    fs.writeFileSync(reportPath, reportMd);
    console.log(`\nReport saved to: ${reportPath}`);

    // Persist scan state
    scanState.lastScanDate = new Date().toISOString();
    fs.writeFileSync(SCAN_STATE, JSON.stringify(scanState, null, 2));

    // Optional: create GitHub issues
    if (shouldCreateIssues && !isDryRun) {
      await createIssuesForChanges(report);
    }

    // Print summary
    const telemetryCount = commitMatches.filter(
      m => m.keywordType === 'telemetry',
    ).length;
    const securityCount = commitMatches.filter(
      m => m.keywordType === 'security',
    ).length;
    console.log('\n=== SCAN COMPLETE ===');
    console.log(`  Telemetry commits: ${telemetryCount}`);
    console.log(`  Security commits: ${securityCount}`);
    console.log(`  New releases: ${releaseChanges.length}`);
    console.log(`  Aggregator changes: ${aggregatorChanges.length}`);
    console.log(`  New npm packages: ${npmPackages.length}`);
    console.log(`  Errors: ${errors.length}`);
  } finally {
    // PID cleanup happens via signal handler / exit hook
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  try {
    fs.unlinkSync(PID_FILE);
  } catch {
    /* ignore */
  }
  process.exit(1);
});
