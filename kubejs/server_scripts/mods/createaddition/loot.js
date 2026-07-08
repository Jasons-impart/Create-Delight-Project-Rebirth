if (global.hasAllMods(['createaddition', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event
      .addBlockModifier('createaddition:electrum_block')
      .addLoot('createaddition:electrum_block');
  });
}
