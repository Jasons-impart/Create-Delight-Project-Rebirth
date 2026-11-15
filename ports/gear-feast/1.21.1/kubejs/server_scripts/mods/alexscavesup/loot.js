if (global.hasAllMods(['alexscavesup', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event.addEntityModifier('alexscavesup:forsaken').addLoot('createdelightcore:devil_eye');

    const licowitchLoot = event
      .addEntityModifier('alexscavesup:licowitch')
      .removeLoot('alexscavesup:vanilla_ice_cream_scoop')
      .removeLoot('alexscavesup:chocolate_ice_cream_scoop')
      .removeLoot('alexscavesup:sweetberry_ice_cream_scoop');

    [
      'createdelightcore:strawberry_ice_cream_scoop',
      'createdelightcore:banana_ice_cream_scoop',
      'createdelightcore:mint_ice_cream_scoop',
      'createdelightcore:adzuki_ice_cream_scoop',
      'createdelightcore:pomegranate_ice_cream_scoop',
      'createdelightcore:lime_ice_cream_scoop',
      'alexscavesup:vanilla_ice_cream_scoop',
      'alexscavesup:chocolate_ice_cream_scoop',
      'alexscavesup:sweetberry_ice_cream_scoop',
    ].forEach((item) => {
      licowitchLoot.pool((pool) => {
        pool.rolls([0, 1]);
        pool.addEntry(LootEntry.of(Item.of(item)).randomChance(0.33));
      });
    });
  });
}
