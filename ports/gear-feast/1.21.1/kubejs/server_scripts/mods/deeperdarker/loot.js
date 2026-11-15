if (global.hasAllMods(['lootjs', 'silentsdelight'])) {
  LootJS.modifiers((event) => {
    event.addEntityModifier('minecraft:warden').pool((pool) => {
      pool.rolls([1, 3]);
      pool.addEntry(LootEntry.of(Item.of('minecraft:echo_shard')).randomChance(0.3));
      pool.addEntry(LootEntry.of(Item.of('minecraft:sculk')).randomChance(0.5));
      pool.addEntry(LootEntry.of(Item.of('silentsdelight:warden_ear')).randomChance(0.3));
    });
  });
}
