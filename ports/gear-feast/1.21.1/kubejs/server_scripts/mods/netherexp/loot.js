if (global.hasAllMods(['netherexp', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event
      .addEntityModifier('minecraft:hoglin')
      .removeLoot('netherexp:hogham')
      .replaceLoot('farmersdelight:ham', 'netherexp:hogham')
      .replaceLoot('farmersdelight:smoked_ham', 'netherexp:cooked_hogham');
  });
}
