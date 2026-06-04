# @nesvet/biome-config

Shareable [Biome](https://biomejs.dev/) configuration: formatter, linter, and import organization.

Requires `@biomejs/biome` `>=2.4.0` (peer dependency).

## Installation

```sh
bun add -d @nesvet/biome-config @biomejs/biome
```

Or:

```sh
npm install -D @nesvet/biome-config @biomejs/biome
```

## Setup

**Node.js / CLI / backend** — `node:` import protocol enforced:

```json
{
	"$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
	"extends": ["@nesvet/biome-config/node"],
	"vcs": {
		"enabled": true,
		"clientKind": "git",
		"useIgnoreFile": true
	}
}
```

**Bun, browser, or generic TypeScript** — base config without `node:` protocol rule:

```json
{
	"$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
	"extends": ["@nesvet/biome-config"],
	"vcs": {
		"enabled": true,
		"clientKind": "git",
		"useIgnoreFile": true
	}
}
```

With `useIgnoreFile: true`, paths from `.gitignore` (including `node_modules/`) are skipped.

Optional explicit exclusions:

```json
{
	"files": {
		"includes": ["**", "!dist/**", "!build/**", "!out/**", "!**/*.min.js"]
	}
}
```

Do **not** append `/biome.json` to `extends` — use the package export name only (for example `@nesvet/biome-config/node`).

## Exports

| Export | Use case |
|--------|----------|
| `@nesvet/biome-config` | Base — formatter, linter, imports; no `node:` protocol requirement |
| `@nesvet/biome-config/node` | Base + `useNodejsImportProtocol: error` |

React and a11y rules apply to `**/*.{jsx,tsx}` in the base config.

## Package defaults

- **`formatter.lineWidth: 320`** — no practical line wrapping; override locally for shorter lines.
- **`files.ignoreUnknown: true`** — no diagnostics for unknown file types (monorepo-friendly).
- **Import groups** — `:BUN:` / `:NODE:`, packages, aliases, relative paths (`organizeImports`).
- **`noDefaultExport`** — warn.

## Monorepo

Root `biome.json` (Node backend example):

```json
{
	"extends": ["@nesvet/biome-config/node"]
}
```

Package `biome.json`:

```json
{
	"extends": "//"
}
```

## Local overrides

**Org-scoped import groups** — merge `assist.actions.source.organizeImports.options.groups` in your `biome.json` (see [organize imports](https://biomejs.dev/assist/actions/organize-imports/)).

**Runtime globals** (`Bun`, `window`, `self`):

```json
{
	"javascript": {
		"globals": ["Bun", "window", "self"]
	}
}
```

**Unused bindings** — prefix with `_` (for example `_unused`); Biome ignores them in unused-variable rules.

## License

MIT
