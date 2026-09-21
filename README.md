# @nesvet/biome-config

[![CI](https://github.com/nesvet/biome-config/actions/workflows/ci.yaml/badge.svg)](https://github.com/nesvet/biome-config/actions/workflows/ci.yaml)
[![npm](https://img.shields.io/npm/v/@nesvet/biome-config)](https://www.npmjs.com/package/@nesvet/biome-config)

My [Biome](https://biomejs.dev/) config. Tabs, double quotes, `type` over `interface`, no trailing commas, almost no wrapping (`lineWidth: 320`).

Needs `@biomejs/biome` `^2.5.0`.

```sh
bun add -d @nesvet/biome-config @biomejs/biome
```

```json
{
	"$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
	"extends": ["@nesvet/biome-config/node"]
}
```

`/node` requires the `node:` import protocol. Drop `/node` if you don't want that.

`Bun` is a known global. Imports are grouped (bun/node, packages, aliases, paths, CSS) with no blank lines between groups. Floating Promises are errors. CommonJS is an error. JSX files get React and a11y rules even if `react` is not in `package.json`.

Do not append `/biome.json` to `extends`.

Monorepo package:

```json
{
	"extends": "//"
}
```

Override anything in your own `biome.json`. Files matching `*.config.ts` / `*.config.js` (and `.mjs`, `.cjs`, `.mts`, `.cts`) may use a default export: `noDefaultExport` is off there so tool configs still format and lint. Object and type property names may be CONSTANT_CASE (POSIX env keys) and may start with `_` or `$`. A `const` may be PascalCase; a `let` may not.

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
