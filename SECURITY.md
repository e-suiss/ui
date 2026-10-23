# Security Policy

## Reporting a vulnerability

Please report vulnerabilities **privately** through GitHub's private vulnerability reporting:
**Security → Report a vulnerability** on this repository.

Do not open a public issue, pull request or discussion for a suspected vulnerability.

Please include:
- a description of the issue and its impact,
- steps to reproduce or a proof of concept,
- affected versions, components or registry items, if known.

## What to expect

- We acknowledge reports and keep you informed while we investigate.
- We follow coordinated vulnerability disclosure with a default embargo of 90 days, shortened when a vulnerability is actively exploited.
- Advisories are published as GitHub Security Advisories, and reporters are credited unless they ask otherwise.

## Scope

- the `@esuiss/ui` CLI on npm,
- the registry served from `suiss.app/ui/r`, and the components, hooks and themes it installs,
- the SwiftUI and Jetpack Compose packages published to e-suiss/uim-swift and e-suiss/uim-kotlin,
- the suiss.app site.

The project is pre-alpha. Fixes to components reach users as soon as they land on `main`, and fixes to the CLI in its next release.
