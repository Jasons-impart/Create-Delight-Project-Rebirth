if (global.hasAllMods(['crabbersdelight', 'lootjs'])) {
  LootJS.modifiers((event) => {
    if (global.hasMod('alexsmobs')) {
      event
        .addEntityModifier('alexsmobs:lobster')
        .replaceLoot('alexsmobs:lobster_tail', 'crabbersdelight:clawster');
      event
        .addEntityModifier('alexsmobs:rain_frog')
        .randomChance(0.1)
        .addLoot('crabbersdelight:raw_frog_leg');
    }

    if (global.hasMod('quark')) {
      event.addEntityModifier('quark:crab').removeLoot('quark:crab_shell');
    }

    event
      .addEntityModifier('minecraft:frog')
      .randomChance(0.2)
      .addLoot('crabbersdelight:raw_frog_leg');
  });
}
