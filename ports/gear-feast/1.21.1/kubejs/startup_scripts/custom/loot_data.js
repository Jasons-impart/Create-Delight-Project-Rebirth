// priority: 900
// 源：参考包 1.20.1 kubejs/startup_scripts/custom/loot_data.js
// 1.21.1 适配：createdelight:dread_heart -> createdelightcore:dread_heart
// 物品 id 与实体 id 均已按本地 jar 校验存在。

global.difficultyLoots = {
  'createdelightcore:dread_heart': [
    { entity: 'iceandfire:dread_lich', tier: 3, chance: 0.25 },
    { entity: 'iceandfire:dread_knight', tier: 3, chance: 0.12 },
    { entity: 'iceandfire:dread_ghoul', tier: 3, chance: 0.05 },
    { entity: 'iceandfire:dread_thrall', tier: 3, chance: 0.05 },
  ],
  'iceandfire:cockatrice_eye': [
    { entity: 'iceandfire:cockatrice', tier: 2, chance: 0.5 },
  ],
  'iceandfire:dragonsteel_ice_ingot': [
    { entity: 'iceandfire:dread_lich', tier: 3, chance: 0.1 },
    { entity: 'iceandfire:dread_knight', tier: 3, chance: 0.1 },
    { entity: 'iceandfire:dread_thrall', tier: 3, chance: 0.05 },
    { entity: 'iceandfire:dread_ghoul', tier: 3, chance: 0.05 },
  ],
};
