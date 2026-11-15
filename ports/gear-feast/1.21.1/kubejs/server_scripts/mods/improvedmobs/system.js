// priority: 100
// 源：参考包 1.20.1 kubejs/server_scripts/Improved Mobs/system.js
// 1.21.1 适配：
//   - KubeJS 2101 只允许 startup 写 global；Difficulty / UpdateRank / 缓存 setter
//     已迁到 startup_scripts/custom/improvedmobs_difficulty.js，这里只做事件注册与调用。
if (global.hasMod('improvedmobs')) {
  PlayerEvents.loggedIn((event) => {
    global.CDSetDifficultyCache(global.Difficulty.getPlayerRawValue(event.player));
  });
}
