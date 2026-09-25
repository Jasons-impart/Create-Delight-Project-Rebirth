#!/usr/bin/env python3
"""Check that release archives contain the expected pack files and mod sides."""

import argparse
import json
import tomllib
from collections import Counter
from pathlib import Path
from zipfile import ZipFile


def require(condition, message):
    if not condition:
        raise SystemExit(message)


def expected_mods(side):
    result = []
    for folder in ("common", side):
        for descriptor in (Path("mods") / folder).glob("*.pw.toml"):
            with descriptor.open("rb") as source:
                result.append(tomllib.load(source)["filename"])
    return Counter(result)


def expected_descriptors(side):
    folders = [Path("mods/common"), Path("mods") / side]
    if side == "client":
        folders.extend((Path("resourcepacks"), Path("shaderpacks")))
    return {str(path) for folder in folders for path in folder.glob("*.pw.toml")}


def expected_client_assets():
    assets = set()
    for folder in ("resourcepacks", "shaderpacks"):
        for descriptor in Path(folder).glob("*.pw.toml"):
            with descriptor.open("rb") as source:
                assets.add(f"{folder}/{tomllib.load(source)['filename']}")
    return assets


def inspect_archive(path, prefix, release_info, side, kind):
    require(path.is_file(), f"Missing archive: {path}")
    with ZipFile(path) as archive:
        bad_file = archive.testzip()
        require(bad_file is None, f"{path.name}: corrupt entry {bad_file}")
        names = [name for name in archive.namelist() if not name.endswith("/")]
        require(len(names) == len(set(names)), f"{path.name}: duplicate ZIP entries")
        base = f"{prefix}/" if prefix else ""
        if kind == "curseforge":
            require("manifest.json" in names, f"{path.name}: missing CurseForge manifest")
            manifest = json.loads(archive.read("manifest.json"))
            with Path("mods/common/create-delight-core.pw.toml").open("rb") as source:
                core = tomllib.load(source)["update"]["curseforge"]
            core_files = [entry for entry in manifest.get("files", [])
                          if entry.get("projectID") == core["project-id"]]
            require(len(core_files) == 1 and core_files[0].get("fileID") == core["file-id"],
                    f"{path.name}: Core CurseForge fileID differs from descriptor")
            relative = {name.removeprefix(base) for name in names if name.startswith(base)}
        else:
            require(all(name.startswith(base) for name in names), f"{path.name}: unexpected ZIP root")
            relative = {name.removeprefix(base) for name in names}
        info = base + "config/createdelight_release_info.json"
        require(info in names and archive.read(info) == release_info,
                f"{path.name}: missing or mismatched release info")
        require("kubejs/config/createdelight_pack_integrity_expected.json" in relative,
                f"{path.name}: missing pack integrity manifest")
        require("start.bat" in relative and "start.sh" in relative,
                f"{path.name}: missing start scripts")

        jars = Counter(name.removeprefix("mods/") for name in relative
                       if name.startswith("mods/") and name.endswith(".jar"))
        descriptors = {name for name in relative if name.endswith(".pw.toml")}
        client_assets = {name for name in relative
                         if name.endswith(".zip") and name.startswith(("resourcepacks/", "shaderpacks/"))}
        if kind == "full":
            expected = expected_mods(side)
            require(jars == expected,
                    f"{path.name}: mod jar mismatch: missing={list((expected - jars).elements())}, "
                    f"extra={list((jars - expected).elements())}")
            expected = expected_descriptors(side)
            require(descriptors == expected,
                    f"{path.name}: descriptor mismatch: "
                    f"missing={sorted(expected - descriptors)}, extra={sorted(descriptors - expected)}")
            expected_assets = expected_client_assets() if side == "client" else set()
            require(client_assets == expected_assets,
                    f"{path.name}: resource/shader pack mismatch: "
                    f"missing={sorted(expected_assets - client_assets)}, "
                    f"extra={sorted(client_assets - expected_assets)}")
        elif kind == "installer":
            expected = expected_descriptors(side)
            require(descriptors == expected,
                    f"{path.name}: descriptor mismatch: "
                    f"missing={sorted(expected - descriptors)}, extra={sorted(descriptors - expected)}")
            require(not jars, f"{path.name}: installer unexpectedly bundles mod jars")
            require(not client_assets, f"{path.name}: server installer contains client assets")
            require({"pack.toml", "index.toml", "install-server.bat", "install-server.sh"} <= relative,
                    f"{path.name}: missing pack index or installer scripts")
        else:
            expected = expected_descriptors("client")
            require(descriptors == expected,
                    f"{path.name}: descriptor mismatch: "
                    f"missing={sorted(expected - descriptors)}, extra={sorted(descriptors - expected)}")
            require(not any("/mods/server/" in f"/{name}" for name in descriptors),
                    f"{path.name}: server-only descriptor in client package")
        print(f"{path.name}: OK ({len(relative)} files, {sum(jars.values())} mod jars, "
              f"{len(descriptors)} descriptors)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("artifacts", type=Path)
    parser.add_argument("name")
    parser.add_argument("version")
    parser.add_argument("--curseforge", action="store_true")
    args = parser.parse_args()
    info = (args.artifacts / "release-info.json").read_bytes()
    packages = [
        ("Client-Full", args.name, "client", "full"),
        ("Server", "", "server", "full"),
        ("Server-Installer", "", "server", "installer"),
    ]
    if args.curseforge:
        packages.append(("Client", "overrides", "client", "curseforge"))
    expected_files = {"release-info.json"}
    for label, prefix, side, kind in packages:
        filename = f"[{label}]{args.name}-{args.version}.zip"
        expected_files.add(filename)
        inspect_archive(args.artifacts / filename, prefix, info, side, kind)
    actual_files = {path.name for path in args.artifacts.iterdir() if path.is_file()}
    require(actual_files == expected_files,
            f"Unexpected artifact set: missing={sorted(expected_files - actual_files)}, "
            f"extra={sorted(actual_files - expected_files)}")


if __name__ == "__main__":
    main()
