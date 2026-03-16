# cellra

## 0.2.1

### Patch Changes

- 0d14b07: ### Bug Fixes

  - Fix xlsx module import to use default export for compatibility with ESM environments

  ### Documentation

  - Update README with read_range tool documentation

## 0.2.0

### Minor Changes

- bf99628: ### Features
  - Add new `read_range` MCP tool for reading specific cell ranges from Excel sheets
  - Extract `listSheets`, `readSheet`, and `readRange` into standalone exported functions to improve reusability
