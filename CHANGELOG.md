# Change Log

All notable changes to the Nacho extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.20.0]

### Fixed

- `->`, `->>`, `==`, `<=` and `>=` highlight as single operators rather than splitting into a shorter operator and a leftover character.
- Toggle Block Comment wraps lines in `<!-- -->`, the block comment the grammar highlights, rather than `/* */`.
- `@vscode/test-electron` 3.1.0 resolves the VS Code executable from `Info.plist`, so the suite launches against builds whose macOS binary is named `Code`.
- The `getSymbols simple` expectation asserts the per-level `SymbolKind` that `getSymbol` returns.

### Changed

- Numbers joined to a word by a dot (`x.5`, `v1.2`) stay unhighlighted through a lookbehind on the number rule, so words no longer carry a `text.nacho` scope. The grammar emits about 16% fewer tokens.
- A number written with a leading dot, such as `.5`, is highlighted.
- Line comments are a single `match` rule, and the TextMate-only `fileTypes`, `foldingStartMarker`, `foldingStopMarker` and `keyEquivalent` keys are gone.
- Test tooling requires Node 22 or newer, pinned in `.nvmrc`. TypeScript 5.9.3 and `@types/node` 22 come with it, since the modern `@types/node` declarations (generic `Buffer`) are only served to TypeScript 5.7+.
- Lockfile bumps `brace-expansion` to 1.1.18, 2.1.4 and 5.0.9, clearing three high-severity DoS advisories.
- Test-tooling versions are exact rather than caret ranges.

## [0.19.0]

### Added

- Folding ranges for indented blocks, so any line with deeper-indented lines under it folds, alongside the heading folds.

### Changed

- Lockfile bumps `js-yaml` to 4.3.2 (Dependabot #14, #16).

## [0.18.1]

### Added

- Extension icon.

## [0.18.0]

### Added

- Folding-range provider that folds each heading to its deepest descendant, consistent with the symbol outline.

### Changed

- Grammar no longer highlights text between colons (`:...:`).
- Deduplicated the three string rules in the TextMate grammar via a shared repository.
- Rewrote the README.

### Fixed

- Removed duplicate language alias in `package.json`.
- Removed dead `getTestSymbols` code.
- Forced patched `serialize-javascript` via an npm override to clear devDependency vulnerabilities.
