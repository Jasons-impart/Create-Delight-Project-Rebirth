# packwiz 工作流

AI agent 修改 packwiz 元数据前，也应该阅读 `.agents/skills/packwiz-modpack/SKILL.md`。

`packwiz` 是本仓库的 mod 管理工具，用于维护 `*.pw.toml`、下载来源和 `index.toml`，不是游戏启动器。

## 开发者同步

1. 安装 Java 21。
2. 克隆仓库。
3. 双击或运行根目录开发工具：

```powershell
devtool.bat
```

仓库内置 `scripts/bin/packwiz.exe` 后，开发者可以直接使用 packwiz 相关命令。

## 常用命令

刷新索引：

```powershell
devtool.bat refresh
```

添加或更新 mod：

```powershell
devtool.bat add-curseforge <project>
devtool.bat add-modrinth <project>
devtool.bat add-url <url>
devtool.bat add-github <owner/repo-or-url>
devtool.bat update <mod-slug>
devtool.bat update --all
```

下载 packwiz 元数据声明的本地文件：

```powershell
devtool.bat download-files
```

该命令不会删除本地无关文件。谨慎使用会按 manifest 清理目录的 mod 同步器。

迁移阶段扫描临时 jar 并生成 CurseForge meta：

```powershell
devtool.bat detect-curseforge
```

执行后必须人工检查生成的 `*.pw.toml` 和 `index.toml`，不要提交 `mods/*.jar`。

生成给人看的 mod 清单：

```powershell
devtool.bat modlist
```

默认输出：

```text
docs/generated/modlist.md
docs/generated/modlist.csv
```

检查仓库：

```powershell
devtool.bat check
devtool.bat list
devtool.bat serve -p 8080
```

## 服务端启动

Windows：

```powershell
.\start.bat
```

Linux/macOS：

```bash
./start.sh
```

如果缺少 `neoforge.jar`，启动脚本会按 `variables.txt` 中的 `NEOFORGE_INSTALLER_URL` 自动下载。缺少 NeoForge 生成的 args 文件时，脚本会自动安装 NeoForge，然后使用配置的 `JAVA` 通过 `win_args.txt` 或 `unix_args.txt` 启动。

`user_jvm_args.txt` 只在不存在时由 `JVM_ARGS` 创建，已有的本地内存配置不会被覆盖。

以下开关在 `variables.txt` 中配置：

```text
ACCEPT_EULA=true
AUTO_RESTART=false
RESTART_DELAY_SECONDS=10
```

## 当前目标

- Minecraft: `1.21.1`
- NeoForge: `21.1.228`
- Java: `21`
