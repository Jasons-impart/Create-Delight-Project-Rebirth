if (global.hasAllMods(['vintagedelight', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event
      .addBlockModifier('vintagedelight:oat_crop')
      .matchCustomCondition({
        condition: 'minecraft:block_state_property',
        block: 'vintagedelight:oat_crop',
        properties: {
          age: '7',
        },
      })
      .randomChance(0.75)
      .addLoot('vintagedelight:oat_seeds');
  });
}
