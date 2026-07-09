if (global.hasAllMods(['mynethersdelight', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event.addEntityModifier('minecraft:ghast').removeLoot('mynethersdelight:ghasmati');
  });
}
