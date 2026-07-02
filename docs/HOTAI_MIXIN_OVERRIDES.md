# Hotai Mixin Overrides

This document is reserved for future local Hotai bytecode overrides used by
CDPR. There are currently no tracked Hotai `.badiff` overrides.

Hotai reads patched classes from the game directory's `hotai/` tree, applies
them during class transformation, then converts full `.class` replacements into
`.badiff` files after startup.

## Current Overrides

None.

## Record Template

When adding a new Hotai override, record:

- Source mod jar and version.
- Target class internal name.
- Hotai file path under `hotai/`.
- Crash or incompatibility that requires the override.
- Exact bytecode or annotation change.
- Validation log lines from `logs/latest.log`.

After the compatibility is moved upstream or replaced by another mechanism,
remove the obsolete override files and delete the completed entry from this
document.
