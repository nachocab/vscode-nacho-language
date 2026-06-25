# Change Log

All notable changes to the Nacho extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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
