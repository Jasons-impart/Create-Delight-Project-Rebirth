if (global.hasAllMods(['sophisticatedbackpacks', 'trailandtales_delight'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'sophisticatedbackpacks:stack_upgrade_omega_tier',
      'sophisticatedbackpacks:stack_upgrade_tier_1_from_starter',
    ]);

    [
      [
        'sophisticatedbackpacks:stack_upgrade_starter_tier',
        'minecraft:copper_ingot',
        'sophisticatedbackpacks:upgrade_base',
      ],
      [
        'sophisticatedbackpacks:stack_upgrade_tier_1',
        'minecraft:iron_ingot',
        'sophisticatedbackpacks:upgrade_base',
      ],
      [
        'sophisticatedbackpacks:stack_upgrade_tier_2',
        'minecraft:gold_ingot',
        'sophisticatedbackpacks:stack_upgrade_tier_1',
      ],
      [
        'sophisticatedbackpacks:stack_upgrade_tier_3',
        'minecraft:diamond',
        'sophisticatedbackpacks:stack_upgrade_tier_2',
      ],
      [
        'sophisticatedbackpacks:stack_upgrade_tier_4',
        'minecraft:netherite_ingot',
        'sophisticatedbackpacks:stack_upgrade_tier_3',
      ],
    ].forEach((recipe) => {
      event
        .shaped(recipe[0], ['AAA', 'ABA', 'AAA'], {
          A: recipe[1],
          B: recipe[2],
        })
        .id(recipe[0]);
    });

    event
      .shaped('sophisticatedbackpacks:feeding_upgrade', ['ABA', 'CDE', 'AFA'], {
        A: 'trailandtales_delight:cheese_slice',
        B: 'minecraft:golden_carrot',
        C: 'minecraft:golden_apple',
        D: 'sophisticatedbackpacks:upgrade_base',
        E: 'minecraft:glistering_melon_slice',
        F: 'minecraft:ender_pearl',
      })
      .id('sophisticatedbackpacks:feeding_upgrade');
  });
}
