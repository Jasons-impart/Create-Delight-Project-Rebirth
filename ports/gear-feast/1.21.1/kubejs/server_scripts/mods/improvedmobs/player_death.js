// 源：参考包 1.20.1 kubejs/server_scripts/Improved Mobs/player_death.js
// 1.21.1 适配：难度读取改走 global.Difficulty（tenshilib attachment）。
if (global.hasMod('improvedmobs')) {
  EntityEvents.death('minecraft:player', (event) => {
    const player = event.entity;
    if (!player.isPlayer()) return;

    const Difficulty = global.Difficulty;
    const raw = Difficulty.getPlayerRawValue(player);
    const tier = Difficulty.getPlayerTier(player);
    const tierStart = tier === 0 ? 0 : Difficulty.tierThreshold[tier - 1];
    const tierProgress = raw - tierStart;
    const lossRate = 0.35;
    const grain = 5;

    const loss = Math.ceil((tierProgress * lossRate) / grain) * grain;

    if (loss >= tierProgress) {
      if (tierProgress < grain) {
        if (tier > 0) {
          const prevStart = tier <= 1 ? 0 : Difficulty.tierThreshold[tier - 2];
          const prevEnd = Difficulty.tierThreshold[tier - 1];
          const newRaw = prevStart + Math.floor((prevEnd - prevStart) * 0.8);
          global.UpdateRank(player, newRaw - raw, 'death');
        }
      } else {
        const newRaw = tierStart + 1;
        global.UpdateRank(player, newRaw - raw, 'death');
      }
    } else {
      global.UpdateRank(player, -loss, 'death');
    }
  });
}
