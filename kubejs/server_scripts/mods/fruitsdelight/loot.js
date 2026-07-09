if (global.hasAllMods(['fruitsdelight', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event.addBlockModifier('fruitsdelight:lemon_tree').addLoot('fruitsdelight:lemon_seeds');
    event.addBlockModifier('fruitsdelight:blueberry_bush').addLoot('fruitsdelight:blueberry');
  });
}
