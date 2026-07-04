if (global.hasAllMods(['alexscaves', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event.addEntityModifier('alexscaves:forsaken').addLoot('createdelightcore:devil_eye');

    const licowitchLoot = event
      .addEntityModifier('alexscaves:licowitch')
      .removeLoot('alexscaves:vanilla_ice_cream_scoop')
      .removeLoot('alexscaves:chocolate_ice_cream_scoop')
      .removeLoot('alexscaves:sweetberry_ice_cream_scoop');

    [
      'createdelightcore:strawberry_ice_cream_scoop',
      'createdelightcore:banana_ice_cream_scoop',
      'createdelightcore:mint_ice_cream_scoop',
      'createdelightcore:adzuki_ice_cream_scoop',
      'createdelightcore:pomegranate_ice_cream_scoop',
      'createdelightcore:lime_ice_cream_scoop',
      'alexscaves:vanilla_ice_cream_scoop',
      'alexscaves:chocolate_ice_cream_scoop',
      'alexscaves:sweetberry_ice_cream_scoop',
    ].forEach((item) => {
      licowitchLoot.pool((pool) => {
        pool.rolls([0, 1]);
        pool.addEntry(LootEntry.of(Item.of(item)).randomChance(0.33));
      });
    });
  });
}
