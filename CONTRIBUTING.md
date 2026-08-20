# Contributing to @nesvet/biome-config

Thanks for considering it. This is a solo project, so help is useful.

## Quick start

1. Fork and clone the repo
2. `bun install`
3. Change the shared config in `biome.json` or `presets/node.json`
4. Add or update fixtures under `tests/fixtures` (and `tests/preset-node/fixtures` for the Node preset)
5. Run `bun run check` and `bun run check:tests`
6. Open a PR

## What to contribute

**Good first contributions:**

- Documentation that matches actual config behaviour
- Fixtures for a rule this package already turns on
- Catching a Biome schema change after a release

**Feature ideas:** Open an issue first. A new preset or a rule that needs the project scanner on top of `types` is a design discussion, not a drive-by PR.

## Code style

The published `biome.json` is the style. Tabs, double quotes, `type` over `interface`, no trailing commas. Valid fixtures must pass `biome check --diagnostic-level=info`. Invalid fixtures must name the diagnostic they expect.

## After your PR

PRs are usually reviewed within a few days. If you don't hear back within a week, ping me.

---

**Using this in production?** Consider sponsoring on [Patreon](https://www.patreon.com/nesvet) to support long-term maintenance.
