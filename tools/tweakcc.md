# tweakcc

| Field | Value |
|-------|-------|
| Repository | https://github.com/Piebald-AI/tweakcc |
| Type | Binary Patcher |
| Stars | 1.4K |
| Telemetry | No |
| Default State | N/A |
| Analytics Providers | None |
| Disable Method | N/A |
| Risk Level | CRITICAL |
| Last Verified | 2026-03-23 |

## What It Does

tweakcc is a binary patcher that modifies the Claude Code binary to alter system prompts and unlock unreleased or hidden features. It directly patches the compiled Claude Code application, changing its behavior at the binary level.

## Telemetry Details

No traditional telemetry has been identified. The risk profile of this tool is entirely about what it does to the Claude Code binary rather than what data it collects.

## Security Concerns

- **Binary modification:** tweakcc patches the Claude Code binary directly. This fundamentally compromises the integrity of the application. After patching, you are no longer running Anthropic's code — you are running a modified version with unknown behavioral changes
- **System prompt manipulation:** By modifying system prompts, tweakcc can alter Claude's safety boundaries, behavioral constraints, and operational guidelines. This could:
  - Remove safety checks that prevent dangerous operations
  - Alter tool-use permissions and approval flows
  - Change how Claude handles sensitive data
  - Modify the trust model between the user and the agent
- **Unlocking unreleased features:** Features that are not yet released may be gated for safety, stability, or security reasons. Bypassing these gates exposes users to untested functionality
- **Code signing invalidation:** Patching the binary will invalidate any code signatures. On macOS, this means Gatekeeper and notarization checks will fail unless the binary is re-signed with an ad-hoc signature
- **Supply chain trust destruction:** After applying tweakcc, there is no way to verify that the running binary matches Anthropic's official release. Any future security audit of the tool becomes meaningless
- **Trojan vector:** The patcher itself could inject additional code beyond what is advertised. Users must trust that the patcher only makes the claimed modifications and nothing else
- **Update fragility:** Every Claude Code update will likely require re-patching, creating a window where the binary may be in an inconsistent state. Patches designed for one version applied to another could cause crashes or undefined behavior
- **ToS violation:** Modifying the Claude Code binary almost certainly violates Anthropic's Terms of Service

## How to Opt Out

Do not use tweakcc. If you have already used it:

1. Reinstall Claude Code from the official source to restore the unmodified binary:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
2. Verify the installation integrity by checking the package hash against npm's published hash
3. Review any sessions conducted with the patched binary for unexpected behavior
4. Consider whether any safety-critical operations were performed with modified system prompts

## Evidence

- Tool explicitly describes itself as a binary patcher for Claude Code
- Modifies system prompts within the compiled application
- Unlocks features that are not available in the official release
- Direct binary modification invalidates code signing and integrity verification
- No telemetry detected, but the binary patching itself is the critical risk

## Changelog
- 2026-03-23: Initial entry
