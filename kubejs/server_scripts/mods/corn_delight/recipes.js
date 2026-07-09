if (global.hasMod('corn_delight')) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight } = event.recipes;
    const id = (path) => `createdelightcore:corn_delight/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    [
      'corn_delight:corn_seeds_from_bag',
      'corn_delight:integration/create/milling/wild_corn',
      'corn_delight:integration/create/milling/corn',
      'corn_delight:cutting/corn',
      'corn_delight:integration/create/mixing/cornbread_batter_from_mixing',
      'corn_delight:cornbread_batter',
      'corn_delight:corn_crate',
      'corn_delight:cutting/tortilla_chip',
      'corn_delight:tortilla_from_smoking',
      'corn_delight:tortilla',
      'corn_delight:tortilla_from_campfire_cooking',
      'corn_delight:tortilla_raw',
      'corn_delight:integration/create/splashing/tortilla_raw',
      'corn_delight:cooking/creamed_corn',
      'corn_delight:taco',
      'corn_delight:corn_from_crate',
      'corn_delight:organic_compost_from_corncob',
      'corn_delight:cob_pipe',
      'corn_delight:paper_from_corncob',
      'corn_delight:cooking/corn_dog',
      'corn_delight:classic_corn_dog_from_crafting',
      'corn_delight:cooking/classic_corn_dog',
      'corn_delight:cooking/corn_soup',
      'corn_delight:cooking/nachos_block',
      'corn_delight:popcorn_from_campfire_cooking',
      'corn_delight:popcorn',
      'corn_delight:popcorn_from_smoking',
    ].forEach(removeIfPresent);

    event.replaceInput(
      { id: 'vintagedelight:stuffed_burrito' },
      Ingredient.of('#c:foods/bread'),
      'culturaldelights:tortilla'
    );
    event.replaceInput(
      { id: 'culturalrecipes:smelting/tortilla_from_campfire' },
      'culturaldelights:corn_dough',
      'corn_delight:tortilla_raw'
    );
    event.replaceInput(
      { id: 'culturalrecipes:smelting/tortilla' },
      'culturaldelights:corn_dough',
      'corn_delight:tortilla_raw'
    );
    event.replaceInput(
      { id: 'culturalrecipes:smelting/tortilla_from_smoking' },
      'culturaldelights:corn_dough',
      'corn_delight:tortilla_raw'
    );
    event.replaceInput(
      { id: 'culturalrecipes:cooking/creamed_corn' },
      'culturaldelights:corn_cob',
      'culturaldelights:corn_kernels'
    );
    event.replaceInput(
      { id: 'culturalrecipes:cooking/creamed_corn' },
      Ingredient.of('#c:milk'),
      Ingredient.of('#c:creams')
    );
    event.replaceInput(
      { id: 'corn_delight:cooking/creamy_corn_drink' },
      'culturaldelights:corn_cob',
      'createdelightcore:corn_flour'
    );

    event
      .shapeless('9x culturaldelights:corn_kernels', 'corn_delight:corn_kernel_bag')
      .id(id('crafting/corn_kernels'));

    if (global.hasMod('ratatouille')) {
      event.recipes.ratatouille
        .threshing(
          [
            '4x culturaldelights:corn_kernels',
            'farmersdelight:straw',
            CreateItem.of(Item.of('3x culturaldelights:corn_kernels'), 0.5),
          ],
          'culturaldelights:corn_cob'
        )
        .processingTime(400)
        .id(id('threshing/corn_cob'));
    }

    create
      .milling(
        [
          '2x createdelightcore:corn_flour',
          CreateItem.of(Item.of('2x createdelightcore:corn_flour'), 0.5),
        ],
        'culturaldelights:corn_kernels'
      )
      .id(id('milling/corn_flour'));
    create
      .mixing('culturaldelights:corn_dough', [Fluid.water(50), 'createdelightcore:corn_flour'])
      .id(id('mixing/corn_dough'));
    create
      .splashing('culturaldelights:corn_dough', 'createdelightcore:corn_flour')
      .id(id('splashing/corn_dough'));
    create
      .pressing(
        ['corn_delight:tortilla_raw', CreateItem.of('corn_delight:tortilla_raw', 0.5)],
        'culturaldelights:corn_dough'
      )
      .id(id('pressing/tortilla_raw'));
    event
      .shapeless('corn_delight:tortilla_raw', 'culturaldelights:corn_dough')
      .id(id('crafting/tortilla_raw'));

    if (global.hasMod('farmersdelight')) {
      farmersdelight
        .cooking(
          'meals',
          [
            'createdelightcore:corn_flour',
            'farmersdelight:cabbage_leaf',
            'minecraft:brown_mushroom',
            'minecraft:milk_bucket',
          ],
          'corn_delight:corn_soup',
          0.35,
          200
        )
        .id(id('cooking/corn_soup'));
      farmersdelight
        .cooking(
          'meals',
          [
            'culturaldelights:tortilla_chips',
            'culturaldelights:tortilla_chips',
            Ingredient.of('#c:foods/cooked_beef'),
            Ingredient.of('#c:cheese'),
            'farmersdelight:tomato_sauce',
          ],
          'corn_delight:nachos_block',
          0.35,
          200,
          'minecraft:bowl'
        )
        .id(id('cooking/nachos_block'));
      farmersdelight
        .cooking(
          'meals',
          [
            'corn_delight:cornbread',
            Ingredient.of('#c:vegetables'),
            'ratatouille:sausage',
            Ingredient.of('#c:crops/onion'),
          ],
          'corn_delight:cornbread_stuffing',
          1.0,
          200
        )
        .id(id('cooking/cornbread_stuffing'));
    }
  });
}
