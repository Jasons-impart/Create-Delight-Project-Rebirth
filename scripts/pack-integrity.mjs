import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const NON_RUNTIME_EMBEDDED_MOD_IDS = new Set(['mixinsquared']);

function getTomlValue(text, key) {
  const match = text.match(new RegExp(`^\\s*${escapeRegExp(key)}\\s*=\\s*(.+?)\\s*$`, 'm'));
  if (!match) return null;
  const value = match[1].trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  return value;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toRepoRelative(repoRoot, filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function getModSideFromMetadataPath(repoRoot, filePath) {
  const relative = toRepoRelative(repoRoot, filePath).toLowerCase();
  if (relative.startsWith('mods/client/')) return 'client';
  if (relative.startsWith('mods/server/')) return 'server';
  return 'common';
}

function listPwTomlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.pw.toml'))
    .map((entry) => path.join(dir, entry.name));
}

function getPackModMetadata(repoRoot) {
  const metadataDirs = ['mods', 'mods/common', 'mods/client', 'mods/server'];
  const files = metadataDirs
    .flatMap((relative) => listPwTomlFiles(path.join(repoRoot, relative)))
    .sort((a, b) => a.localeCompare(b));

  return files.flatMap((filePath) => {
    const text = fs.readFileSync(filePath, 'utf8');
    const filename = getTomlValue(text, 'filename');
    if (!filename || !filename.trim()) return [];

    return [
      {
        side: getModSideFromMetadataPath(repoRoot, filePath),
        metadataPath: filePath,
        relativeMetadataPath: toRepoRelative(repoRoot, filePath),
        filename,
        jarPath: path.join(repoRoot, 'mods', filename),
      },
    ];
  });
}

class ZipArchive {
  constructor(buffer) {
    this.buffer = buffer;
    this.entries = this.#readEntries();
  }

  getEntry(name) {
    return this.entries.find((entry) => entry.name === name) ?? null;
  }

  readEntry(entry) {
    const localOffset = entry.localHeaderOffset;
    if (this.buffer.readUInt32LE(localOffset) !== 0x04034b50) {
      throw new Error(`Invalid local zip header for ${entry.name}`);
    }

    const nameLength = this.buffer.readUInt16LE(localOffset + 26);
    const extraLength = this.buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + nameLength + extraLength;
    const compressed = this.buffer.subarray(dataStart, dataStart + entry.compressedSize);

    if (entry.compressionMethod === 0) {
      return Buffer.from(compressed);
    }
    if (entry.compressionMethod === 8) {
      return zlib.inflateRawSync(compressed);
    }

    throw new Error(
      `Unsupported zip compression method ${entry.compressionMethod} for ${entry.name}`
    );
  }

  readText(name) {
    const entry = this.getEntry(name);
    if (!entry) return null;
    return this.readEntry(entry).toString('utf8');
  }

  #readEntries() {
    const eocdOffset = findEndOfCentralDirectory(this.buffer);
    const entryCount = this.buffer.readUInt16LE(eocdOffset + 10);
    const centralDirectoryOffset = this.buffer.readUInt32LE(eocdOffset + 16);
    const entries = [];
    let offset = centralDirectoryOffset;

    for (let i = 0; i < entryCount; i += 1) {
      if (this.buffer.readUInt32LE(offset) !== 0x02014b50) {
        throw new Error('Invalid central zip directory');
      }

      const compressionMethod = this.buffer.readUInt16LE(offset + 10);
      const compressedSize = this.buffer.readUInt32LE(offset + 20);
      const nameLength = this.buffer.readUInt16LE(offset + 28);
      const extraLength = this.buffer.readUInt16LE(offset + 30);
      const commentLength = this.buffer.readUInt16LE(offset + 32);
      const localHeaderOffset = this.buffer.readUInt32LE(offset + 42);
      const name = this.buffer.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');

      entries.push({ name, compressionMethod, compressedSize, localHeaderOffset });
      offset += 46 + nameLength + extraLength + commentLength;
    }

    return entries;
  }
}

function findEndOfCentralDirectory(buffer) {
  const minOffset = Math.max(0, buffer.length - 0xffff - 22);
  for (let offset = buffer.length - 22; offset >= minOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }
  throw new Error('Zip end of central directory not found');
}

function getModIdsFromTomlText(text) {
  const ids = [];
  const blocks = text.matchAll(/(?:^|\n)\s*\[\[mods\]\]\s*([\s\S]*?)(?=\n\s*\[\[|$)/g);
  for (const block of blocks) {
    const match = block[1].match(/^\s*modId\s*=\s*"([^"]+)"/m);
    if (match) addUnique(ids, match[1].trim().toLowerCase());
  }
  return ids;
}

function normalizeFabricModId(modId) {
  return modId.trim().toLowerCase().replaceAll('-', '_');
}

function getModIdsFromFabricJson(text) {
  const metadata = JSON.parse(text);
  const ids = [];
  if (metadata.id) addUnique(ids, normalizeFabricModId(String(metadata.id)));
  if (Array.isArray(metadata.provides)) {
    for (const provided of metadata.provides) {
      addUnique(ids, normalizeFabricModId(String(provided)));
    }
  }
  return ids;
}

function getModIdsFromArchive(zip) {
  for (const entryName of ['META-INF/neoforge.mods.toml', 'META-INF/mods.toml']) {
    const toml = zip.readText(entryName);
    if (toml && toml.trim()) {
      return getModIdsFromTomlText(toml);
    }
  }

  const fabricJson = zip.readText('fabric.mod.json');
  if (fabricJson && fabricJson.trim()) {
    return getModIdsFromFabricJson(fabricJson);
  }

  return [];
}

function getNestedModIdsFromArchive(zip, depth = 0) {
  const ids = [];
  if (depth >= 4) return ids;

  for (const entry of zip.entries) {
    if (!entry.name.toLowerCase().endsWith('.jar')) continue;
    const nestedZip = new ZipArchive(zip.readEntry(entry));
    if (isKnownNonRuntimeEmbeddedJar(nestedZip)) continue;
    for (const modId of getModIdsFromArchive(nestedZip)) {
      if (!NON_RUNTIME_EMBEDDED_MOD_IDS.has(modId)) addUnique(ids, modId);
    }
    for (const modId of getNestedModIdsFromArchive(nestedZip, depth + 1)) {
      if (!NON_RUNTIME_EMBEDDED_MOD_IDS.has(modId)) addUnique(ids, modId);
    }
  }

  return ids;
}

function hasAnyEntry(zip, entryNames) {
  return entryNames.some((entryName) => zip.getEntry(entryName));
}

function isKnownNonRuntimeJar(zip) {
  return hasAnyEntry(zip, ['META-INF/services/cpw.mods.modlauncher.api.ITransformationService']);
}

function isKnownNonRuntimeEmbeddedJar(zip) {
  const manifest = zip.readText('META-INF/MANIFEST.MF') ?? '';
  return isKnownNonRuntimeJar(zip) || /^FMLModType:\s*GAMELIBRARY\s*$/im.test(manifest);
}

function isKnownNonModJar(zip) {
  return hasAnyEntry(zip, [
    'META-INF/services/net.neoforged.neoforgespi.earlywindow.GraphicsBootstrapper',
    'META-INF/services/net.neoforged.neoforgespi.earlywindow.ImmediateWindowProvider',
  ]);
}

function sortedUnique(values) {
  return [...new Set(values.filter(Boolean).map((value) => value.trim().toLowerCase()))].sort();
}

function addUnique(values, value) {
  if (value && !values.includes(value)) values.push(value);
}

function comparableManifest(manifest) {
  return JSON.stringify({
    schemaVersion: manifest.schemaVersion,
    generatedBy: manifest.generatedBy,
    expectedModIds: manifest.expectedModIds,
    sources: manifest.sources,
  });
}

export function generateIntegrityManifest({
  repoRoot,
  targetPath,
  writeInfo,
  writeSuccess,
  writeWarn,
  writeFail,
}) {
  const metadata = getPackModMetadata(repoRoot);
  if (metadata.length === 0) {
    throw new Error('未找到 mods/**/*.pw.toml，无法生成完整性清单。');
  }

  const missing = metadata.filter((mod) => !fs.existsSync(mod.jarPath));
  if (missing.length > 0) {
    writeFail('以下受管理 mod jar 缺失，请先运行 devtool.bat install-files：');
    for (const mod of missing) writeFail(`  mods/${mod.filename}`);
    throw new Error('完整性清单生成失败：缺少受管理 mod jar。');
  }

  const expected = { common: [], client: [], server: [] };
  const sources = [];
  const unresolved = [];

  for (const mod of metadata) {
    const zip = new ZipArchive(fs.readFileSync(mod.jarPath));
    const modIds = getModIdsFromArchive(zip);
    for (const nestedModId of getNestedModIdsFromArchive(zip)) {
      addUnique(modIds, nestedModId);
    }

    if (modIds.length === 0) {
      if (!isKnownNonModJar(zip)) {
        unresolved.push(mod);
        continue;
      }

      sources.push({
        side: mod.side,
        metadata: mod.relativeMetadataPath,
        filename: mod.filename,
        modIds: [],
        nonModFile: true,
      });
      continue;
    }

    if (isKnownNonRuntimeJar(zip)) {
      sources.push({
        side: mod.side,
        metadata: mod.relativeMetadataPath,
        filename: mod.filename,
        modIds: sortedUnique(modIds),
        nonRuntimeMod: true,
      });
      continue;
    }

    expected[mod.side].push(...modIds);
    sources.push({
      side: mod.side,
      metadata: mod.relativeMetadataPath,
      filename: mod.filename,
      modIds: sortedUnique(modIds),
    });
  }

  if (unresolved.length > 0) {
    writeFail(
      '以下受管理 jar 无法解析出 mod id，请先确认文件是否已同步，必要时运行 devtool.bat install-files：'
    );
    for (const mod of unresolved) writeFail(`  mods/${mod.filename} (${mod.relativeMetadataPath})`);
    throw new Error('完整性清单生成失败：无法解析受管理 jar。');
  }

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    generatedBy: 'devtool generate-integrity-manifest',
    expectedModIds: {
      common: sortedUnique(expected.common),
      client: sortedUnique(expected.client),
      server: sortedUnique(expected.server),
    },
    sources: sources.sort((a, b) =>
      `${a.side}\0${a.filename}`.localeCompare(`${b.side}\0${b.filename}`)
    ),
  };

  if (fs.existsSync(targetPath)) {
    try {
      const existingManifest = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      if (comparableManifest(existingManifest) === comparableManifest(manifest)) {
        writeSuccess(
          '完整性清单内容未变化，保留现有 kubejs/config/createdelight_pack_integrity_expected.json'
        );
        writeInfo(
          `common=${manifest.expectedModIds.common.length}, client=${manifest.expectedModIds.client.length}, server=${manifest.expectedModIds.server.length}`
        );
        return;
      }
    } catch (error) {
      writeWarn(`无法读取现有完整性清单，将重新生成：${error.message}`);
    }
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  writeSuccess('已生成 kubejs/config/createdelight_pack_integrity_expected.json');
  writeInfo(
    `common=${manifest.expectedModIds.common.length}, client=${manifest.expectedModIds.client.length}, server=${manifest.expectedModIds.server.length}`
  );
}
