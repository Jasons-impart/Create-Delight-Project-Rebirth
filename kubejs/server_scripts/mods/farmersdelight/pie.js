if (global.hasAllMods(['farmersdelight', 'create', 'createdelightcore'])) {
  ServerEvents.tags('item', (event) => {
    event.add('createdelightcore:sculk_food_root', ['minecraft:sculk_catalyst', 'minecraft:sculk']);
  });

  ServerEvents.recipes((event) => {
    const { create, farmersdelight } = event.recipes;
    const id = (path) => `createdelightcore:farmersdelight/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const itemId = (stack) => String(stack).replace(/^\d+x\s+/, '');
    const existing = (ids) =>
      ids.every((item) => {
        if (typeof item !== 'string' || item.startsWith('#')) {
          return true;
        }

        return true;
      });
    const cooking = (path, ingredients, output, experience) => {
      if (!existing(ingredients)) {
        return;
      }

      farmersdelight
        .cooking('misc', ingredients, output, experience || 1.0, 200)
        .id(id(`cooking/${path}`));
    };

    [
      'farmersdelight:pie_crust',
      'farmersdelight:integration/create/mixing/pie_crust_from_mixing',
      'silentsdelight:sculk_catalyst_pie_crust',
      'silentsdelight:sculk_catalyst_pie',
      'create_central_kitchen:crafting/pumpkin_pie',
      'farmersdelight:chocolate_pie',
      'farmersdelight:apple_pie',
      'farmersdelight:sweet_berry_cheesecake',
      'farmersdelight:cooking/pineapple_pie',
      'casualnessdelight:stargazy_pie',
      'casualnessdelight:quiche_lorraine',
      'farmersdelight:cooking/durian_pie',
      'farmersdelight:cooking/fig_tart',
      'farmersdelight:cooking/lemon_tart',
      'ends_delight:food/chorus_fruit_pie',
      'minecraft:pumpkin_pie',
    ].forEach(removeIfPresent);

    if (global.hasMod('ratatouille')) {
      event.recipes.ratatouille
        .baking('farmersdelight:pie_crust', 'createdelightcore:puff_pastry')
        .processingTime(100)
        .id(id('baking/pie_crust'));
    }

    if (global.hasMod('silentsdelight')) {
      event
        .shapeless('silentsdelight:sculk_catalyst_pie_crust', [
          'farmersdelight:pie_crust',
          Ingredient.of('#createdelightcore:sculk_food_root'),
        ])
        .id(id('crafting/sculk_catalyst_pie_crust'));

      create
        .deploying('silentsdelight:sculk_catalyst_pie', [
          'silentsdelight:sculk_catalyst_pie_crust',
          Ingredient.of('#createdelightcore:sculk_food_root'),
        ])
        .id(id('deploying/sculk_catalyst_pie'));
    }

    [
      ['pumpkin_pie', 'farmersdelight:pumpkin_slice', 'minecraft:pumpkin_pie'],
      ['apple_pie', 'minecraft:apple', 'farmersdelight:apple_pie'],
      ['pineapple_pie', 'fruitsdelight:pineapple_slice', '3x fruitsdelight:pineapple_pie'],
      ['durian_pie', 'fruitsdelight:durian_flesh', '3x fruitsdelight:durian_pie'],
    ].forEach(([path, input, output]) => {
      cooking(
        path,
        [
          input,
          input,
          input,
          'minecraft:sugar',
          'farmersdelight:pie_crust',
          Ingredient.of('#c:eggs'),
        ],
        output
      );
    });

    cooking(
      'chorus_fruit_pie',
      [
        Ingredient.of('#minecraft:flowers'),
        'minecraft:chorus_fruit',
        'ends_delight:dried_chorus_flower',
        Ingredient.of('#c:eggs'),
        'farmersdelight:pie_crust',
        'minecraft:potato',
      ],
      'ends_delight:chorus_fruit_pie',
      10.0
    );

    cooking(
      'stargazy_pie',
      [
        Ingredient.of('#alexsmobs:shoebill_foodstuffs'),
        Ingredient.of('#alexsmobs:shoebill_foodstuffs'),
        Ingredient.of('#alexsmobs:shoebill_foodstuffs'),
        Ingredient.of('#c:eggs'),
        'farmersdelight:pie_crust',
        'minecraft:potato',
      ],
      'casualnessdelight:stargazy_pie',
      10.0
    );

    cooking(
      'quiche_lorraine',
      [
        Ingredient.of('#crabbersdelight:raw_seafood'),
        Ingredient.of('#c:cheese'),
        Ingredient.of('#c:foods/raw_meat'),
        Ingredient.of('#c:eggs'),
        'farmersdelight:pie_crust',
        Ingredient.of('#c:eggs'),
      ],
      'casualnessdelight:quiche_lorraine'
    );

    cooking(
      'sweet_berry_cheesecake',
      [
        'minecraft:sweet_berries',
        'minecraft:sweet_berries',
        'minecraft:sweet_berries',
        Ingredient.of('#c:cheese'),
        'farmersdelight:pie_crust',
        Ingredient.of('#c:cheese'),
      ],
      'farmersdelight:sweet_berry_cheesecake'
    );

    cooking(
      'fig_tart',
      [
        Ingredient.of('#c:eggs'),
        'minecraft:sugar',
        Ingredient.of('#c:milk'),
        'fruitsdelight:fig',
        'farmersdelight:pie_crust',
        'fruitsdelight:fig',
      ],
      '4x fruitsdelight:fig_tart',
      4.0
    );

    cooking(
      'lemon_tart',
      [
        Ingredient.of('#c:eggs'),
        'minecraft:sugar',
        Ingredient.of('#c:milk'),
        'fruitsdelight:lemon_slice',
        'farmersdelight:pie_crust',
        'fruitsdelight:lemon_slice',
      ],
      '4x fruitsdelight:lemon_tart',
      4.0
    );

    cooking(
      'cherry_cheese_pie',
      [
        'trailandtales_delight:cherry_petal',
        'trailandtales_delight:cherry_petal',
        'trailandtales_delight:cherry_petal',
        Ingredient.of('#c:cheese'),
        'farmersdelight:pie_crust',
        Ingredient.of('#c:cheese'),
      ],
      'trailandtales_delight:cherry_cheese_pie',
      4.0
    );

    cooking(
      'cherry_cheese_pie_from_slices',
      [
        'trailandtales_delight:cherry_cheese_slice',
        'farmersdelight:pie_crust',
        'trailandtales_delight:cherry_cheese_slice',
      ],
      'trailandtales_delight:cherry_cheese_pie'
    );

    cooking(
      'tarte_lune',
      [
        'minecraft:cornflower',
        'minecraft:allium',
        'minecraft:cornflower',
        'minecraft:sugar',
        'farmersdelight:pie_crust',
        Ingredient.of('#c:eggs'),
      ],
      'youkaishomecoming:tarte_lune',
      4.0
    );
  });
}
