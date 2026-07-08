if (global.hasAllMods(['createcafe', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event.addBlockModifier('minecraft:short_grass').removeLoot('createcafe:coffee_beans');
  });
}
