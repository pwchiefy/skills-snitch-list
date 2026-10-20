# Happy (Happy Coder)

| Field | Value |
|-------|-------|
| Repository | https://github.com/slopus/happy |
| Type | Remote-control relay (CLI wrapper + mobile/desktop app + relay server) |
| Stars | 24K |
| Telemetry | Yes (mobile/desktop app only) |
| Default State | ON (`analyticsOptOut: false`) in app builds that ship a PostHog key |
| Analytics Providers | PostHog (`us.i.posthog.com`) in `happy-app`; no analytics SDK found in `happy-cli` |
| Disable Method | App: Settings → Account → Analytics switch (sets `analyticsOptOut`, synced across devices); self-builds: `EXPO_PUBLIC_DISABLE_ANALYTICS=1` |
| Risk Level | HIGH |
| Last Verified | 2026-10-20 |

## What It Does

Happy wraps Claude Code and Codex (`happy` instead of `claude`) so you can watch and steer sessions from a phone, desktop app or browser, and invite others into a session ("Natively multiplayer"). Session data is relayed through a server, by default `https://api.cluster-fluster.com`, with a self-hostable server package in the repo. The README states that what moves between devices is end-to-end encrypted.

## Telemetry Details

- **App (`happy-app`):** PostHog React Native client with `captureAppLifecycleEvents: true` when a key is configured. Events include `account_created`, `connect_attempt`, `session_switched`, `message_sent` (client, harness, mode, machine platform, a hashed provider-account key), paywall and review-prompt events, OTA updates and friends search
- **CLI (`happy-cli`):** No analytics SDK found. It talks to the relay server and app URL for its function
- **Relay metadata:** Even with end-to-end encrypted content, the relay operator sees connection metadata (accounts, devices, timing, sizes)

## Security Concerns

- **Remote steering of a local agent:** Anyone who controls a paired device or an invited participant can send prompts to an agent running on your machine with your credentials. Treat pairing like granting shell access
- **Permission mode from afar:** The CLI supports `bypassPermissions`/`yolo` modes, and when Happy's own sandbox is enabled it starts Claude Code with `--dangerously-skip-permissions`, relying on that sandbox instead of prompts
- **System prompt injection:** Happy appends instructions to Claude's system prompt, including a mandatory call to its `change_title` tool at the start of every chat, and (unless `includeCoAuthoredBy` is false in Claude settings) instructions to add `Co-Authored-By: Happy <yesreply@happy.engineering>` to commit messages
- **Third-party relay by default:** Sessions go through the project's hosted relay unless you set `HAPPY_SERVER_URL` / `serverUrl` to a self-hosted server. We did not audit the end-to-end encryption implementation

## How to Opt Out

1. Self-host the relay (`packages/happy-server-self-host`) and point the CLI at it with `HAPPY_SERVER_URL`
2. Set `"includeCoAuthoredBy": false` in Claude Code settings if you do not want Happy credited in commits
3. Pair only devices you control; do not invite others into sessions running on machines with production credentials
4. For app analytics, turn off Settings → Account → Analytics ("No data is shared"), or build the app yourself with `EXPO_PUBLIC_DISABLE_ANALYTICS=1`

## Evidence

- Audited commit: [`b99e7f83`](https://github.com/slopus/happy/tree/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237) (`happy-cli` 1.2.5; latest release `cli-1.2.5`, 2026-09-22)
- App PostHog client and disable switches: [packages/happy-app/sources/track/tracking.ts#L1-L12](https://github.com/slopus/happy/blob/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237/packages/happy-app/sources/track/tracking.ts#L1-L12)
- Opt-out setting default and wiring: [packages/happy-app/sources/sync/settings.ts#L116](https://github.com/slopus/happy/blob/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237/packages/happy-app/sources/sync/settings.ts#L116), [sync/sync.ts#L330-L337](https://github.com/slopus/happy/blob/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237/packages/happy-app/sources/sync/sync.ts#L330-L337)
- Tracked events: [packages/happy-app/sources/track/index.ts](https://github.com/slopus/happy/blob/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237/packages/happy-app/sources/track/index.ts)
- Default relay and webapp URLs: [packages/happy-cli/src/configuration.ts#L55-L64](https://github.com/slopus/happy/blob/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237/packages/happy-cli/src/configuration.ts#L55-L64)
- System prompt and co-author text: [packages/happy-cli/src/claude/utils/systemPrompt.ts#L7-L37](https://github.com/slopus/happy/blob/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237/packages/happy-cli/src/claude/utils/systemPrompt.ts#L7-L37); default-true co-author check [claudeSettings.ts#L59-L66](https://github.com/slopus/happy/blob/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237/packages/happy-cli/src/claude/utils/claudeSettings.ts#L59-L66)
- Permission mode / skip-permissions logic: [packages/happy-cli/src/claude/runClaude.ts#L104-L113](https://github.com/slopus/happy/blob/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237/packages/happy-cli/src/claude/runClaude.ts#L104-L113)
- README E2E and multiplayer claims: [README.md#L20-L33](https://github.com/slopus/happy/blob/b99e7f83a4162b2ab6ed999fafa2398f9cc1d237/README.md#L20-L33)
- Star count: GitHub API, 24,236 on 2026-10-20

## Changelog
- 2026-10-20: Initial entry
