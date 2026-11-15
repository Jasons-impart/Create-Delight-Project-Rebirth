if (global.hasAllMods(['crabbersdelight', 'lootjs'])) {
  LootJS.modifiers((event) => {
    if (global.hasMod('alexsmobsup')) {
      event
        .addEntityModifier('alexsmobsup:lobster')
        .replaceLoot('alexsmobsup:lobster_tail', 'crabbersdelight:clawster');
      event
        .addEntityModifier('alexsmobsup:rain_frog')
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
