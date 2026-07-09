if (global.hasAllMods(['iceandfire', 'idas', 'createdelightcore', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event
      .addTableModifier('idas:chests/dread_citadel/dread_citadel_throne')
      .addLoot('createdelightcore:dread_upgrade_smithing_template');
  });
}
