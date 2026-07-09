if (global.hasAllMods(['ends_delight', 'iceandfire', 'lootjs'])) {
  LootJS.modifiers((event) => {
    const addDragonMeatLoot = (entityType) => {
      event.addEntityModifier(entityType).pool((pool) => {
        pool.rolls([3, 8]);
        pool.addEntry(LootEntry.ofItem('ends_delight:raw_dragon_meat').withWeight(30));
        pool.addEntry(LootEntry.ofItem('ends_delight:dragon_leg').withWeight(20));
        pool.addEntry(LootEntry.ofItem('ends_delight:dragon_tooth').withWeight(20));
      });
    };

    addDragonMeatLoot('minecraft:ender_dragon');
    addDragonMeatLoot('iceandfire:ice_dragon');
    addDragonMeatLoot('iceandfire:fire_dragon');
    addDragonMeatLoot('iceandfire:lightning_dragon');
  });
}
