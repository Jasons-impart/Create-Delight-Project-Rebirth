// priority: 900
// 源：参考包 1.20.1 kubejs/server_scripts/Improved Mobs/system.js
// 1.21.1 适配：
//   - Improved Mobs 1.21.1 删除了 CrossPlatformStuff#getPlayerDifficultyData；
//     玩家难度改为 tenshilib 的 PLAYER_DIFFICULTY attachment。
//   - KubeJS 2101 只允许 startup 写 global，因此难度对象与 UpdateRank 在 startup 定义，
//     server 脚本只做读取与事件注册。
//   - KubeJS 2101 的 Rhino 不允许「脚本顶层块语句里出现 const」：
//     实测 if/for/while/裸块内的 const 会抛 redeclaration of var <name>
//     （let 不受影响，函数体内的 const 也不受影响）。
//     因此这里整体包进 IIFE，并用 CD 前缀避免与共享作用域里的名字相撞。
(function () {
  if (!global.hasMod('improvedmobs')) {
    return;
  }

  const CDAttachmentRegister = Java.loadClass(
    'io.github.flemmli97.tenshilib.loader.registry.AttachmentRegister'
  );
  const CDImprovedMobsAttachments = Java.loadClass(
    'io.github.flemmli97.improvedmobs.common.registry.ImprovedMobsAttachments'
  );
  // startup 作用域不保证有 KubeJS 的 Text 绑定，直接用原版 Component。
  const CDComponent = Java.loadClass('net.minecraft.network.chat.Component');

  const CDDifficulty = {};

  CDDifficulty.playerData = function (player) {
    return CDAttachmentRegister.INSTANCE.getAttachment(
      player,
      CDImprovedMobsAttachments.PLAYER_DIFFICULTY.get()
    );
  };

  /**
   * @param {Internal.ServerPlayer} player
   * @returns {number}
   */
  CDDifficulty.getPlayerRawValue = function (player) {
    return this.playerData(player).getDifficultyLevel();
  };

  CDDifficulty.setPlayerRawValue = function (player, number) {
    this.playerData(player).setDifficultyLevel(Number(number));
    global.difficultyCache = Number(number);
  };

  CDDifficulty.getPlayerTier = function (player) {
    const raw = this.getPlayerRawValue(player);
    for (let index = 0; index < this.tierThreshold.length; index++) {
      if (raw <= this.tierThreshold[index]) return index;
    }
    return this.tierThreshold.length;
  };

  CDDifficulty.getPlayerCurrentProcess = function (player) {
    const tier = this.getPlayerTier(player);
    const rawValue = this.getPlayerRawValue(player);
    if (tier > 0 && tier !== this.tierThreshold.length) {
      return (
        (rawValue - this.tierThreshold[tier - 1]) /
        (this.tierThreshold[tier] - this.tierThreshold[tier - 1])
      );
    }
    return tier === this.tierThreshold.length ? 1 : 0;
  };

  CDDifficulty.tierThreshold = [0, 100, 200, 300, 450, 600];

  CDDifficulty.getTierFromValue = function (value) {
    for (let index = 0; index < this.tierThreshold.length; index++) {
      if (value <= this.tierThreshold[index]) return index;
    }
    return this.tierThreshold.length;
  };

  CDDifficulty.getProgressBar = function (rawValue) {
    const tier = this.getTierFromValue(rawValue);
    let process;
    if (tier === 0) {
      process = 0;
    } else if (tier < this.tierThreshold.length) {
      process =
        (rawValue - this.tierThreshold[tier - 1]) /
        (this.tierThreshold[tier] - this.tierThreshold[tier - 1]);
    } else {
      process = 1;
    }
    process = Math.max(0, Math.min(1, process));
    const filled = Math.round(process * 10);
    let bar = '';
    for (let i = 0; i < 10; i++) {
      bar += i < filled ? '§a■' : '§8■';
    }
    return bar;
  };

  global.Difficulty = CDDifficulty;

  /**
   * @param {Internal.ServerPlayer} player
   * @param {number} value
   * @param {string=} source
   */
  global.UpdateRank = function (player, value, source) {
    value = parseInt(value, 10);
    const data = CDDifficulty.playerData(player);
    if (!data || player.persistentData.getBoolean('disableRankChange')) return;

    const raw = CDDifficulty.getPlayerRawValue(player);
    if (raw + value < 0) value = -raw;

    const oldTier = CDDifficulty.getPlayerTier(player);
    CDDifficulty.setPlayerRawValue(player, raw + value);
    const newTier = CDDifficulty.getPlayerTier(player);
    const newRaw = CDDifficulty.getPlayerRawValue(player);
    const bar = CDDifficulty.getProgressBar(newRaw);
    const tierText = '难度阶段 ' + newTier;

    if (value > 0) {
      if (newTier > oldTier) {
        player.server.runCommandSilent(
          `title ${player.username} title {"text":"难度提升","color":"gold","bold":true}`
        );
      }
      player.displayClientMessage(CDComponent.literal(`§a▲ ${tierText} §8[${bar}§8]`), true);
    } else {
      if (newTier < oldTier) {
        player.server.runCommandSilent(
          `title ${player.username} subtitle {"text":"难度下降","color":"dark_red"}`
        );
      }
      const prefix = source === 'death' ? '§c死亡惩罚 → ' : '§c▼ ';
      player.displayClientMessage(CDComponent.literal(`${prefix}${tierText} §8[${bar}§8]`), true);
    }
  };

  // server / client 侧不能写 global，统一走 startup 里定义的 setter。
  global.CDSetDifficultyCache = function (value) {
    global.difficultyCache = Number(value);
  };
})();
