#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { generateIntegrityManifest } from './pack-integrity.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const packTemplateDir = path.join(repoRoot, 'pack');
const integrityManifestPath = path.join(
  repoRoot,
  'kubejs',
  'config',
  'createdelight_pack_integrity_expected.json'
);
const globalPackageName = '@bro-know-my/packwiz';

const commands = new Set([
  'help',
  'menu',
  'setup-tools',
  'prepare-pack',
  'check',
  'refresh',
  'list',
  'update',
  'add-curseforge',
  'add-url',
  'add-github',
  'remove-mod',
  'install-files',
  'install-files-headless',
  'install-files-retry',
  'download-files',
  'modlist',
  'generate-integrity-manifest',
  'export-client',
  'export-curseforge',
  'export-server',
  'export-server-installer',
]);

const packRootTemplateFiles = [
  'pack.toml',
  'icon.png',
  'server-icon.png',
  'start.bat',
  'start.sh',
  'variables.txt',
  path.join('PCL', 'Logo.png'),
  path.join('PCL', 'Setup.ini'),
];

function color(code, message) {
  return process.stdout.isTTY ? `\u001b[${code}m${message}\u001b[0m` : message;
}

function writeInfo(message) {
  console.log(color(36, `[信息] ${message}`));
}

function writeSuccess(message) {
  console.log(color(32, `[完成] ${message}`));
}

function writeWarn(message) {
  console.log(color(33, `[警告] ${message}`));
}

function writeFail(message) {
  console.error(color(31, `[错误] ${message}`));
}

function showHelp() {
  console.log(`Create Delight Project Rebirth 开发工具

用法：
  devtool.bat help
  devtool.bat menu
  devtool.bat setup-tools
  devtool.bat prepare-pack
  devtool.bat check
  devtool.bat refresh
  devtool.bat list
  devtool.bat update [mod-name | --all]
  devtool.bat add-curseforge <project|url|project-id> [file-id] [bkmpw args...]
  devtool.bat add-url <side> <name> <filename> <url> <sha256>
  devtool.bat add-github <owner/repo|url> [bkmpw args...]
  devtool.bat remove-mod <name|metadata-file>
  devtool.bat install-files [attempts] [delay-seconds]
  devtool.bat install-files-headless [attempts] [delay-seconds]
  devtool.bat install-files-retry [attempts] [delay-seconds]
  devtool.bat download-files [jobs] [--force]
  devtool.bat modlist [output-dir]
  devtool.bat generate-integrity-manifest
  devtool.bat export-curseforge [output.zip] [client|server|both]   # 客户端 CurseForge 安装包
  devtool.bat export-client [output.zip] [root-dir]                 # 客户端全量包，自带 mod 文件
  devtool.bat export-server [output.zip]                            # 开箱即用服务端全量包
  devtool.bat export-server-installer [output.zip]                  # bkmpw 下载型服务端安装包

Linux/macOS 可使用 ./devtool.sh 执行同样命令。

说明：
  - 直接运行本脚本会进入交互式菜单。
  - 本工具调用全局 npm 包 ${globalPackageName} 提供的 bkmpw 命令。
  - 缺少 bkmpw 时运行 devtool.bat setup-tools，或手动运行 npm install -g ${globalPackageName}。
  - 所有新增 mod 元数据默认写入 mods/*.pw.toml；可手动移动到 mods/common、mods/client、mods/server。
  - install-files/download-files 由 bkmpw 执行，只处理清单记录的托管文件，不清理手动塞入且未入清单的 jar。
  - 菜单 13 是客户端 CurseForge 安装包；14 是客户端全量包；15 是开箱即用服务端包；16 是 bkmpw 下载型服务端安装包。
  - 首次拉取仓库后运行 prepare-pack，展开本地发布根目录文件。`);
}

function commandName(name) {
  if (process.platform === 'win32' && (name === 'npm' || name === 'bkmpw')) return `${name}.cmd`;
  return name;
}

function quoteWindowsArg(arg) {
  if (arg.length === 0) return '""';
  if (!/[ \t&()^%!"<>|]/.test(arg)) return arg;
  return `"${arg.replace(/([%"^])/g, '^$1')}"`;
}

function getSpawnInvocation(executable, args) {
  const spawnArgs =
    process.platform === 'win32' && (executable === 'npm' || executable === 'bkmpw')
      ? ['/d', '/s', '/c', [commandName(executable), ...args].map(quoteWindowsArg).join(' ')]
      : args;
  const spawnExecutable =
    process.platform === 'win32' && (executable === 'npm' || executable === 'bkmpw')
      ? process.env.ComSpec || 'cmd.exe'
      : commandName(executable);

  return { spawnExecutable, spawnArgs };
}

function run(executable, args, { stdio = 'inherit', check = true, timeout } = {}) {
  const { spawnExecutable, spawnArgs } = getSpawnInvocation(executable, args);

  const result = spawnSync(spawnExecutable, spawnArgs, {
    cwd: repoRoot,
    stdio,
    encoding: 'utf8',
    timeout,
  });

  if (result.error) {
    if (check) throw result.error;
    return result;
  }
  if (check && result.status !== 0) {
    throw new Error(`${executable} 执行失败，退出码 ${result.status}。`);
  }
  return result;
}

function runAsync(executable, args, { timeout } = {}) {
  const { spawnExecutable, spawnArgs } = getSpawnInvocation(executable, args);

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timedOut = false;

    const child = spawn(spawnExecutable, spawnArgs, {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    const timer =
      timeout === undefined
        ? null
        : setTimeout(() => {
            timedOut = true;
            child.kill();
          }, timeout);

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve({ error, status: null, stdout, stderr });
    });
    child.on('close', (status) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve({
        error: timedOut ? new Error(`${executable} 执行超时。`) : null,
        status,
        stdout,
        stderr,
      });
    });
  });
}

function getCommandVersion(executable) {
  const result = run(executable, ['--version'], { stdio: 'pipe', check: false });
  if (result.error || result.status !== 0) return null;
  return `${result.stdout ?? result.stderr ?? ''}`.trim();
}

function getNpmVersion() {
  return getCommandVersion('npm');
}

function getBkmpwVersion() {
  return getCommandVersion('bkmpw');
}

let cachedLatestBkmpwPackageVersion;
let pendingLatestBkmpwPackageVersion;
let menuBkmpwUpdateNoticeShown = false;

function parseSemver(version) {
  const match = `${version ?? ''}`.match(/(\d+)\.(\d+)\.(\d+)(?:[-+][0-9A-Za-z.-]+)?/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    raw: match[0],
  };
}

function compareSemver(a, b) {
  for (const key of ['major', 'minor', 'patch']) {
    if (a[key] !== b[key]) return a[key] < b[key] ? -1 : 1;
  }
  return 0;
}

async function getLatestBkmpwPackageVersion() {
  if (cachedLatestBkmpwPackageVersion !== undefined) return cachedLatestBkmpwPackageVersion;
  if (pendingLatestBkmpwPackageVersion) return pendingLatestBkmpwPackageVersion;

  pendingLatestBkmpwPackageVersion = runAsync(
    'npm',
    ['view', globalPackageName, 'version', '--silent'],
    { timeout: 8000 }
  ).then((result) => {
    if (result.error || result.status !== 0) {
      cachedLatestBkmpwPackageVersion = null;
    } else {
      cachedLatestBkmpwPackageVersion = `${result.stdout ?? result.stderr ?? ''}`.trim() || null;
    }
    pendingLatestBkmpwPackageVersion = null;
    return cachedLatestBkmpwPackageVersion;
  });

  return pendingLatestBkmpwPackageVersion;
}

function getBkmpwUpdateStatus(localVersion, latestVersion) {
  if (latestVersion === undefined) return { state: 'checking' };
  if (!latestVersion) return { state: 'unknown' };

  const localSemver = parseSemver(localVersion);
  const latestSemver = parseSemver(latestVersion);
  if (!localSemver || !latestSemver) return { state: 'unknown', latestVersion };

  if (compareSemver(localSemver, latestSemver) < 0) {
    return {
      state: 'outdated',
      localVersion: localSemver.raw,
      latestVersion: latestSemver.raw,
    };
  }

  return { state: 'current', localVersion: localSemver.raw, latestVersion: latestSemver.raw };
}

function getCachedBkmpwUpdateStatus(localVersion) {
  return getBkmpwUpdateStatus(localVersion, cachedLatestBkmpwPackageVersion);
}

async function warnIfBkmpwOutdated(localVersion) {
  const latestVersion = await getLatestBkmpwPackageVersion();
  const status = getBkmpwUpdateStatus(localVersion, latestVersion);
  if (status.state !== 'outdated') return;

  writeWarn(
    `bkmpw 当前版本 ${status.localVersion}，npm 最新版本 ${status.latestVersion}。建议运行 devtool.bat setup-tools 更新。`
  );
}

function assertNpmAvailable() {
  const version = getNpmVersion();
  if (!version) {
    throw new Error('未找到 npm。请先安装 Node.js LTS，并确认 node/npm 已加入 PATH。');
  }
  return version;
}

function assertBkmpwAvailable() {
  const version = getBkmpwVersion();
  if (!version) {
    throw new Error(
      `未找到 bkmpw。请先运行 devtool.bat setup-tools，或手动运行：npm install -g ${globalPackageName}`
    );
  }
  return version;
}

function invokeBkmpwRaw(commandArgs) {
  assertBkmpwAvailable();
  writeInfo(`bkmpw ${commandArgs.join(' ')}`);
  run('bkmpw', commandArgs);
}

function invokeBkmpwPackCommand(subCommand, commandArgs = []) {
  invokeBkmpwRaw([subCommand, repoRoot, ...commandArgs]);
}

async function setupTools() {
  const npmVersion = assertNpmAvailable();
  writeSuccess(`npm: ${npmVersion}`);
  writeInfo(`npm install -g ${globalPackageName}`);
  run('npm', ['install', '-g', globalPackageName]);
  const bkmpwVersion = assertBkmpwAvailable();
  writeSuccess(`bkmpw: ${bkmpwVersion}`);
  await warnIfBkmpwOutdated(bkmpwVersion);
}

function updateCoreBeforeSync() {
  writeInfo('同步前自动更新 create-delight-core');
  try {
    invokeBkmpwPackCommand('update', ['create-delight-core']);
  } catch (error) {
    writeWarn(`create-delight-core 自动更新失败，继续执行后续操作：${error.message}`);
  }
}

function copyFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function preparePackRoot() {
  if (!fs.existsSync(packTemplateDir)) {
    throw new Error(`缺少 pack 模板目录：${packTemplateDir}`);
  }

  for (const relative of packRootTemplateFiles) {
    const source = path.join(packTemplateDir, relative);
    const target = path.join(repoRoot, relative);
    if (!fs.existsSync(source)) {
      writeWarn(`模板缺失，跳过：pack/${relative.split(path.sep).join('/')}`);
      continue;
    }

    copyFile(source, target);
    writeSuccess(`已生成 ${relative.split(path.sep).join('/')}`);
  }

  writeInfo('.packwizignore 现在是根目录跟踪文件，prepare-pack 不再覆盖。');
}

function testRepository() {
  writeSuccess(`node: ${process.version}`);

  const npmVersion = getNpmVersion();
  if (npmVersion) writeSuccess(`npm: ${npmVersion}`);
  else writeFail('未找到 npm。请先安装 Node.js LTS，并确认 npm 已加入 PATH。');

  const bkmpwVersion = getBkmpwVersion();
  if (bkmpwVersion) writeSuccess(`bkmpw: ${bkmpwVersion}`);
  else
    writeFail(
      `未找到 bkmpw。请运行 devtool.bat setup-tools 或 npm install -g ${globalPackageName}`
    );

  const required = [
    'pack/pack.toml',
    'pack/icon.png',
    'pack/server-icon.png',
    'pack/start.bat',
    'pack/start.sh',
    'pack/variables.txt',
    'pack.toml',
    'index.toml',
    '.packwizignore',
    '.gitignore',
    'package.json',
    'package-lock.json',
    '.husky/pre-commit',
  ];

  for (const relative of required) {
    const fullPath = path.join(repoRoot, ...relative.split('/'));
    if (fs.existsSync(fullPath)) writeSuccess(`已找到 ${relative}`);
    else writeFail(`缺少 ${relative}`);
  }

  invokeBkmpwPackCommand('check');
}

function generateManifest() {
  generateIntegrityManifest({
    repoRoot,
    targetPath: integrityManifestPath,
    writeInfo,
    writeSuccess,
    writeWarn,
    writeFail,
  });
}

function splitArgs(raw) {
  return raw.trim().split(/\s+/).filter(Boolean);
}

async function readLine(rl, prompt) {
  return (await rl.question(prompt)).trim();
}

async function readBkmpwExtraArgs(rl, prompt = '额外 bkmpw 参数，留空表示无') {
  const raw = await readLine(rl, `${prompt}: `);
  return raw ? splitArgs(raw) : [];
}

async function pauseMenu(rl) {
  console.log('');
  await rl.question('按 Enter 继续');
}

function showMenuHeader() {
  console.clear();
  console.log(color(36, 'Create Delight Project Rebirth 开发工具'));
  console.log(color(90, `仓库路径：${repoRoot}`));

  const version = getBkmpwVersion();
  if (version) {
    console.log(color(32, `bkmpw：${version}`));
    writeBkmpwMenuUpdateLine(getCachedBkmpwUpdateStatus(version));
    startMenuBkmpwUpdateCheck(version);
  } else console.log(color(33, 'bkmpw：未安装'));

  console.log('');
}

function writeBkmpwMenuUpdateLine(status) {
  if (status.state === 'outdated') {
    console.log(
      color(
        33,
        `bkmpw 可更新：当前 ${status.localVersion}，最新 ${status.latestVersion}。请选择 S 安装/更新。`
      )
    );
  } else if (status.state === 'current') {
    console.log(color(32, `bkmpw 已是最新版本：${status.localVersion}`));
  } else if (status.state === 'checking') {
    console.log(color(36, 'bkmpw 最新版本：检查中，不影响菜单使用。'));
  } else {
    console.log(color(33, 'bkmpw 最新版本检查失败。网络不可用时可忽略此提示。'));
  }
}

function startMenuBkmpwUpdateCheck(localVersion) {
  if (!process.stdout.isTTY || cachedLatestBkmpwPackageVersion !== undefined) return;

  getLatestBkmpwPackageVersion().then((latestVersion) => {
    if (menuBkmpwUpdateNoticeShown) return;
    menuBkmpwUpdateNoticeShown = true;

    const status = getBkmpwUpdateStatus(localVersion, latestVersion);
    console.log('');
    writeBkmpwMenuUpdateLine(status);
    console.log('');
  });
}

async function startDevMenu() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    while (true) {
      showMenuHeader();
      console.log('  S. 安装/更新全局 bkmpw 工具');
      console.log('  P. 生成/刷新根目录发布文件');
      console.log('  1. 检查仓库结构');
      console.log('  2. 刷新索引');
      console.log('  3. 查看文件列表');
      console.log('  4. 更新全部外部文件');
      console.log('  5. 更新单个外部文件');
      console.log('  6. 添加 CurseForge 项目');
      console.log('  7. 添加直链 URL');
      console.log('  8. 添加 GitHub Release 项目');
      console.log(color(33, '  9. 移除管理文件'));
      console.log(color(33, ' 10. 安装/同步托管文件到本地'));
      console.log(color(33, ' 11. 下载缺失文件到本地（不清理无关文件）'));
      console.log(' 12. 生成 modlist 清单');
      console.log(' 13. 导出客户端 CurseForge 安装包 .zip');
      console.log(' 14. 导出客户端全量包 .zip（自带 mod 文件）');
      console.log(' 15. 导出开箱即用服务端全量包 .zip');
      console.log(' 16. 导出 bkmpw 下载型服务端安装包 .zip');
      console.log(' 17. 生成完整性校验清单');
      console.log(' 18. 执行自定义 bkmpw 命令');
      console.log('  0. 退出');
      console.log('');

      const choice = await readLine(rl, '请选择: ');
      try {
        switch (choice.toLowerCase()) {
          case 's':
            await setupTools();
            await pauseMenu(rl);
            break;
          case 'p':
            preparePackRoot();
            await pauseMenu(rl);
            break;
          case '1':
            testRepository();
            await pauseMenu(rl);
            break;
          case '2':
            invokeBkmpwPackCommand('refresh');
            await pauseMenu(rl);
            break;
          case '3':
            invokeBkmpwPackCommand('list');
            await pauseMenu(rl);
            break;
          case '4':
            invokeBkmpwPackCommand('update', ['--all']);
            await pauseMenu(rl);
            break;
          case '5': {
            const name = await readLine(rl, '外部文件名称: ');
            if (!name) writeWarn('未输入名称。');
            else invokeBkmpwPackCommand('update', [name]);
            await pauseMenu(rl);
            break;
          }
          case '6': {
            const project = await readLine(rl, 'CurseForge slug、URL 或项目 ID: ');
            if (!project) writeWarn('未输入项目。');
            else
              invokeBkmpwPackCommand('add-curseforge', [
                'both',
                project,
                ...(await readBkmpwExtraArgs(rl)),
              ]);
            await pauseMenu(rl);
            break;
          }
          case '7': {
            let side = await readLine(rl, 'side：client/server/both，留空使用 both: ');
            if (!side) side = 'both';
            const name = await readLine(rl, '名称: ');
            const filename = await readLine(rl, '文件名: ');
            const url = await readLine(rl, '直链下载 URL: ');
            const hash = await readLine(rl, 'sha256: ');
            if (!name || !filename || !url || !hash)
              writeWarn('名称、文件名、URL、sha256 都不能为空。');
            else invokeBkmpwPackCommand('add-url', [side, name, filename, url, hash]);
            await pauseMenu(rl);
            break;
          }
          case '8': {
            const project = await readLine(rl, 'GitHub 仓库 owner/repo 或 URL: ');
            if (!project) writeWarn('未输入项目。');
            else
              invokeBkmpwPackCommand('add-github', [
                'both',
                project,
                ...(await readBkmpwExtraArgs(rl)),
              ]);
            await pauseMenu(rl);
            break;
          }
          case '9': {
            const name = await readLine(
              rl,
              '要移除的名称或 metadata 文件，例如 create 或 mods/common/create.pw.toml: '
            );
            if (!name) writeWarn('未输入名称。');
            else {
              invokeBkmpwPackCommand('remove', [name]);
              writeWarn('已更新清单。请继续运行菜单 10，同步本地托管文件。');
            }
            await pauseMenu(rl);
            break;
          }
          case '10': {
            const attempts = await readLine(rl, '最大尝试次数，留空使用默认值: ');
            const delay = await readLine(rl, '失败后等待秒数，留空使用默认值: ');
            const args = [attempts, delay].filter(Boolean);
            updateCoreBeforeSync();
            invokeBkmpwPackCommand('install-files-headless', args);
            await pauseMenu(rl);
            break;
          }
          case '11': {
            const jobs = await readLine(rl, '下载线程数，留空使用默认值: ');
            const force = await readLine(rl, '是否覆盖已存在文件？y/N: ');
            const args = [];
            if (jobs) args.push(jobs);
            if (/^(y|yes)$/i.test(force)) args.push('--force');
            updateCoreBeforeSync();
            invokeBkmpwPackCommand('download-files', args);
            await pauseMenu(rl);
            break;
          }
          case '12': {
            const outputDir = await readLine(rl, '输出目录，留空使用 docs/generated: ');
            invokeBkmpwPackCommand('modlist', outputDir ? [outputDir] : []);
            await pauseMenu(rl);
            break;
          }
          case '13': {
            const output = await readLine(rl, '输出文件，留空使用默认值: ');
            const args = output ? [output, 'client'] : ['client'];
            generateManifest();
            invokeBkmpwPackCommand('refresh');
            invokeBkmpwPackCommand('export-curseforge', args);
            await pauseMenu(rl);
            break;
          }
          case '14': {
            const output = await readLine(rl, '输出文件，留空使用默认值: ');
            const rootDir = await readLine(rl, 'zip 内实例目录名，留空使用 pack.toml name: ');
            const args = rootDir ? [output || 'client-full.zip', rootDir] : output ? [output] : [];
            generateManifest();
            invokeBkmpwPackCommand('refresh');
            invokeBkmpwPackCommand('export-client', args);
            await pauseMenu(rl);
            break;
          }
          case '15': {
            const output = await readLine(rl, '输出文件，留空使用默认值: ');
            generateManifest();
            invokeBkmpwPackCommand('refresh');
            invokeBkmpwPackCommand('export-server', output ? [output] : []);
            await pauseMenu(rl);
            break;
          }
          case '16': {
            const output = await readLine(rl, '输出文件，留空使用默认值: ');
            invokeBkmpwPackCommand('refresh');
            invokeBkmpwPackCommand('export-server-installer', output ? [output] : []);
            await pauseMenu(rl);
            break;
          }
          case '17':
            generateManifest();
            await pauseMenu(rl);
            break;
          case '18': {
            const custom = await readBkmpwExtraArgs(rl, 'bkmpw 原生命令参数');
            if (custom.length === 0) writeWarn('未输入命令。');
            else invokeBkmpwRaw(custom);
            await pauseMenu(rl);
            break;
          }
          case '0':
            return;
          default:
            writeWarn(`未知选项：${choice}`);
            await pauseMenu(rl);
        }
      } catch (error) {
        writeFail(error.message);
        await pauseMenu(rl);
      }
    }
  } finally {
    rl.close();
  }
}

async function dispatch(command, rest) {
  switch (command) {
    case 'help':
      showHelp();
      break;
    case 'menu':
      await startDevMenu();
      break;
    case 'setup-tools':
      await setupTools();
      break;
    case 'prepare-pack':
      preparePackRoot();
      break;
    case 'check':
      testRepository();
      break;
    case 'refresh':
      invokeBkmpwPackCommand('refresh', rest);
      break;
    case 'list':
      invokeBkmpwPackCommand('list', rest);
      break;
    case 'update':
      invokeBkmpwPackCommand('update', rest);
      break;
    case 'add-curseforge':
      invokeBkmpwPackCommand('add-curseforge', ['both', ...rest]);
      invokeBkmpwPackCommand('refresh');
      break;
    case 'add-url':
      invokeBkmpwPackCommand('add-url', rest);
      invokeBkmpwPackCommand('refresh');
      break;
    case 'add-github':
      invokeBkmpwPackCommand('add-github', ['both', ...rest]);
      invokeBkmpwPackCommand('refresh');
      break;
    case 'remove-mod':
      invokeBkmpwPackCommand('remove', rest);
      invokeBkmpwPackCommand('refresh');
      writeWarn('已更新清单。请继续运行 devtool.bat install-files，同步本地托管文件。');
      break;
    case 'install-files':
    case 'install-files-headless':
      updateCoreBeforeSync();
      invokeBkmpwPackCommand('install-files-headless', rest);
      break;
    case 'install-files-retry':
      updateCoreBeforeSync();
      invokeBkmpwPackCommand('install-files-retry', rest);
      break;
    case 'download-files':
      updateCoreBeforeSync();
      invokeBkmpwPackCommand('download-files', rest);
      break;
    case 'modlist':
      invokeBkmpwPackCommand('modlist', rest);
      break;
    case 'generate-integrity-manifest':
      generateManifest();
      break;
    case 'export-client':
      generateManifest();
      invokeBkmpwPackCommand('refresh');
      invokeBkmpwPackCommand('export-client', rest);
      break;
    case 'export-curseforge':
      generateManifest();
      invokeBkmpwPackCommand('refresh');
      invokeBkmpwPackCommand('export-curseforge', rest);
      break;
    case 'export-server':
      generateManifest();
      invokeBkmpwPackCommand('refresh');
      invokeBkmpwPackCommand('export-server', rest);
      break;
    case 'export-server-installer':
      invokeBkmpwPackCommand('refresh');
      invokeBkmpwPackCommand('export-server-installer', rest);
      break;
    default:
      throw new Error(`未知命令：${command}`);
  }
}

process.chdir(repoRoot);

const [maybeCommand, ...rest] = process.argv.slice(2);
const command = maybeCommand ?? 'menu';
if (!commands.has(command)) {
  writeFail(`未知命令：${command}`);
  showHelp();
  process.exit(2);
}

try {
  await dispatch(command, rest);
} catch (error) {
  writeFail(error.message);
  if (
    command === 'menu' ||
    process.argv.length <= 2 ||
    process.env.CDPR_DEVTOOL_LAUNCHED_BY_BAT === '1'
  ) {
    console.error('');
    console.error(`Devtool exited with code: 1`);
  }
  process.exit(1);
}
