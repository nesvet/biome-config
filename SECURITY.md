# Security Policy

## Scope

`@nesvet/biome-config` is a shareable [Biome](https://biomejs.dev/) configuration: JSON files that set formatter, linter, and assist options. It does not execute your code, open a network connection, or read secrets. Consumers run `@biomejs/biome` on their own machines and CI.

Type-aware rules make Biome scan the project and type definitions under `node_modules`. That scan stays on the machine that runs Biome; this package does not collect it.

## Supported versions

Only the latest release receives security updates. Please upgrade to the latest version before reporting issues.

## Reporting a vulnerability

**Please do NOT open public issues for security vulnerabilities.**

Instead:
1. Use [GitHub Security Advisories](https://github.com/nesvet/biome-config/security/advisories/new) for private reporting
2. Include:
   - Clear description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

I aim to respond within 3-5 business days and will work with you to address confirmed vulnerabilities.
