# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.5] - 2026-09-21

### Changed

- Turn `noDefaultExport` off for `*.config.{ts,js,mjs,cjs,mts,cts}` so tool configs can use a default export without a local override. Formatter still runs on those files.
- Allow CONSTANT_CASE on object and type properties so POSIX env keys (`DATABASE_URL`) lint without a local override.
- Allow PascalCase on `const` (`const Button = …`). `let` stays camelCase.
- Apply the global `const` convention first so CONSTANT_CASE module constants are not shadowed by the `variable` selector.
- Make the optional underscore prefix non-capturing so `formats` apply to the identifier, not the prefix.
- Allow a leading `_` on object and type properties so `_id` matches camelCase after the prefix. Custom `formats` without `match` were checking the whole name, including the underscore.
- Treat a leading `$` like `_` in naming `match` groups, so `$name` / `$in` are checked as `name` / `in`. Biome already allows `$` and `_` prefixes; the custom conventions were stripping only underscores.
- Dev: `@biomejs/biome` `^2.5.14`. CI pins Bun `1.4.2`.

## [2.0.0] - 2026-08-20

### Changed

- **Breaking:** require `@biomejs/biome` `^2.5.0`. `linter.rules.recommended` is now `preset: "recommended"`.
- **Breaking:** enable the `types` domain (`all`) and raise `noFloatingPromises`, `noMisusedPromises`, and `useAwaitThenable` to error.
- **Breaking:** enforce `type` over `interface`; raise `useImportType`, `useExportType`, and `noCommonJs` to error.
- `javascript.globals` includes `Bun`.
- Turn `useNodejsImportProtocol` off in the base export; the `node` preset still sets it to error.
- Sort imports without blank lines between groups. Style imports (`:STYLE:`) go last. Side-effect imports are sorted.
- **Breaking:** set `javascript.formatter.trailingCommas` to `"none"`. JSON formatter trailing commas stay `"none"`.
- **Breaking:** enable `useThrowNewError`, `noUnassignedVariables`, and CSS `noInvalidPropertyInitValue`.
- Enable `useErrorCause` and `noEvolvingTypes` at warn.
- Enable nursery `useMathMinMax`, `useDomNodeTextContent`, and `noLoopFunc` at warn.
- Dev: `packageManager` is `bun@1.4.0`.

## [1.0.0] - 2026-06-05

### Added

- Initial release.

[Unreleased]: https://github.com/nesvet/biome-config/compare/2.0.5...HEAD
[2.0.5]: https://github.com/nesvet/biome-config/compare/2.0.0...2.0.5
[2.0.0]: https://github.com/nesvet/biome-config/compare/1.0.0...2.0.0
[1.0.0]: https://github.com/nesvet/biome-config/releases/tag/1.0.0
