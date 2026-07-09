if (
  global.hasAllMods([
    'trailandtales_delight',
    'create',
    'createdelightcore',
    'create_enchantment_industry',
    'create_new_age',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, ratatouille, create_new_age } = event.recipes;
    const id = (path) => `createdelightcore:trailandtales_delight/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    ['trailandtales_delight:cherry_cake', 'trailandtales_delight:cooking/ancient_coffee'].forEach(
      removeIfPresent
    );

    remove_recipes_output(event, ['trailandtales_delight:ancient_coffee']);

    create
      .deploying('trailandtales_delight:cherry_cake', [
        'minecraft:cake',
        'trailandtales_delight:cherry_petal',
      ])
      .id(id('deploying/cherry_cake'));

    create
      .mixing(Fluid.of('createdelightcore:ancient_coffee', 1000), [
        'trailandtales_delight:baked_pitcher_pod',
        'trailandtales_delight:baked_torchflower_seeds',
        Fluid.of('createdelightcore:espresso_fluid', 1000),
      ])
      .id(id('mixing/ancient_coffee'));
    create
      .filling('trailandtales_delight:ancient_coffee', [
        Fluid.of('createdelightcore:ancient_coffee', 250),
        'minecraft:glass_bottle',
      ])
      .id(id('filling/ancient_coffee'));

    create
      .filling('trailandtales_delight:golden_lantern_fruit', [
        'trailandtales_delight:lantern_fruit',
        Fluid.of('createmetallurgy:molten_gold', 450),
      ])
      .id(id('filling/golden_lantern_fruit'));

    ratatouille
      .baking('trailandtales_delight:dried_cherry_petal', 'trailandtales_delight:cherry_petal')
      .processingTime(200)
      .id(id('baking/dried_cherry_petal'));

    create
      .sequenced_assembly(
        'createdelightcore:enchanted_golden_lantern_fruit',
        'trailandtales_delight:lantern_fruit',
        [
          create.filling('trailandtales_delight:lantern_fruit', [
            'trailandtales_delight:lantern_fruit',
            Fluid.of('create_enchantment_industry:experience', 120),
          ]),
          create.deploying('trailandtales_delight:lantern_fruit', [
            'trailandtales_delight:lantern_fruit',
            'minecraft:gold_block',
          ]),
          create.deploying('trailandtales_delight:lantern_fruit', [
            'trailandtales_delight:lantern_fruit',
            'minecraft:gold_block',
          ]),
          create_new_age.energising(
            'trailandtales_delight:lantern_fruit',
            'trailandtales_delight:lantern_fruit',
            2000000
          ),
        ]
      )
      .loops(4)
      .transitionalItem('trailandtales_delight:lantern_fruit')
      .id(
        'createdelightcore:trailandtales_delight/sequenced_assembly/enchanted_golden_lantern_fruit'
      );
  });
}
