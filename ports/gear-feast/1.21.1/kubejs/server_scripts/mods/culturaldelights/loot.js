if (global.hasAllMods(['culturaldelights', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event
      .addBlockModifier('culturaldelights:wild_corn')
      .replaceLoot('minecraft:wheat_seeds', 'culturaldelights:corn_kernels');
  });
}
