if (global.hasMod('quark')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'quark:building/crafting/compressed/carrot_crate',
      'quark:building/crafting/compressed/potato_crate',
      'quark:building/crafting/compressed/beetroot_crate',
      'quark:building/crafting/compressed/apple_crate',
      'quark:building/crafting/compressed/golden_apple_crate',
      'quark:building/crafting/compressed/golden_carrot_crate',
      'quark:building/crafting/compressed/berry_sack',
      'quark:building/crafting/compressed/glowberry_sack',
      'quark:building/crafting/compressed/gunpowder_sack',
      'quark:mobs/smelting/cooked_crab_leg',
      'quark:mobs/smoking/cooked_crab_leg',
      'quark:mobs/campfire/cooked_crab_leg',
      'quark:building/crafting/chests/mixed_chest',
      'quark:building/crafting/chests/mixed_chest_wood',
      'quark:building/crafting/iron_ladder',
    ]);

    event.remove({
      output: [
        'quark:carrot_crate',
        'quark:potato_crate',
        'quark:beetroot_crate',
        'quark:apple_crate',
        'quark:golden_apple_crate',
        'quark:golden_carrot_crate',
        'quark:berry_sack',
        'quark:glowberry_sack',
        'quark:gunpowder_sack',
      ],
    });

    if (global.hasMod('farmersdelight')) {
      event.replaceInput(
        { id: 'quark:automation/crafting/feeding_trough' },
        'minecraft:wheat',
        'farmersdelight:straw'
      );
    }

    if (global.hasAllMods(['create_enchantment_industry', 'create'])) {
      event.recipes.create
        .mixing(Fluid.of('create_enchantment_industry:experience', 10), 'quark:ancient_fruit')
        .heated()
        .id('createdelightcore:quark/mixing/experience_from_ancient_fruit');
    }
  });
}
