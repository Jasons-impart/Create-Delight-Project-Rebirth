#!/usr/bin/env python3
"""Allow a release-time Core file update without hiding other manifest drift."""

import json
import subprocess
import tomllib
from pathlib import Path


MANIFEST = Path("kubejs/config/createdelight_pack_integrity_expected.json")
CORE_DESCRIPTOR = Path("mods/common/create-delight-core.pw.toml")


def main():
    committed = json.loads(subprocess.check_output(
        ["git", "show", f"HEAD:{MANIFEST.as_posix()}"], text=True
    ))
    generated = json.loads(MANIFEST.read_text(encoding="utf-8"))
    with CORE_DESCRIPTOR.open("rb") as source:
        core_filename = tomllib.load(source)["filename"]

    core_sources = [source for source in committed["sources"]
                    if source["metadata"] == CORE_DESCRIPTOR.as_posix()]
    if len(core_sources) != 1 or core_sources[0]["side"] != "common":
        raise SystemExit("Committed integrity manifest has no unique common Core source")

    committed["generatedAt"] = generated["generatedAt"]
    core_sources[0]["filename"] = core_filename
    if committed != generated:
        raise SystemExit("Integrity manifest changed beyond Core filename; update and commit it")
    print("Integrity manifest matches committed mod IDs and sources")


if __name__ == "__main__":
    main()
