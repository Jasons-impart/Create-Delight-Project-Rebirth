// 源：参考包 1.20.1 kubejs/server_scripts/Ice and Fire/prevent_summon.js
// 1.21.1 适配：
//   - Northstar 1.21.1 没有 europa 维度（只有 moon/mars/mercury/venus 及轨道），
//     悚怖怪只保留 northstar:mars 允许生成。
//   - 塞壬/海蛇原本限制在 northstar:europa；该维度不存在，若继续限制会使其无法生成，
//     因此不再写入该限制。
// 注意：KubeJS 2101 的 Rhino 不允许脚本顶层块语句里出现 const
//（if/for/while/裸块会抛 redeclaration of var <name>），因此整体包进 IIFE。
(() => {
  if (!global.hasAllMods(['iceandfire', 'northstar'])) {
    return;
  }

  const DREAD_MONSTERS = [
    'iceandfire:dread_beast',
    'iceandfire:dread_ghoul',
    'iceandfire:dread_horse',
    'iceandfire:dread_knight',
    'iceandfire:dread_lich',
    'iceandfire:dread_lich_skull',
    'iceandfire:dread_scuttler',
    'iceandfire:dread_thrall',
  ];
  const DREAD_DIMENSIONS = ['northstar:mars'];

  EntityEvents.spawned((event) => {
    const type = String(event.entity.type);
    if (DREAD_MONSTERS.indexOf(type) === -1) return;

    const dimension = String(event.level.dimension);
    if (DREAD_DIMENSIONS.indexOf(dimension) === -1) {
      event.cancel();
    }
  });
})();
