if (global.hasMod('brewinandchewin')) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, vintagedelight } = event.recipes;
    const id = (path) => `createdelightcore:brewinandchewin/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const fluidResult = (fluid, amount) => {
      return { id: fluid, amount: amount };
    };
    const fluidBase = (fluid, amount) => {
      const ingredient = String(fluid).startsWith('#')
        ? { tag: String(fluid).replace(/^#/, '') }
        : { id: fluid };

      return {
        amount: amount,
        ingredient: ingredient,
        unit: 'millibuckets',
      };
    };
    const fermenting = (path, result, ingredients, baseFluid, fermentingTime, temperature) => {
      const recipe = event.recipes.brewinandchewin
        .fermenting(
          result,
          ingredients.map((ingredient) => Ingredient.of(ingredient)),
          baseFluid
        )
        .experience(1.0)
        .fermentingtime(fermentingTime || 4800)
        .temperature(temperature || 3)
        .unit('millibuckets')
        .id(id(`fermenting/${path}`));

      return recipe;
    };

    [
      'brewinandchewin:cutting/flaxen_cheese_wheel',
      'brewinandchewin:fermenting/beer_from_water',
      'brewinandchewin:fermenting/bloody_mary_from_vodka',
      'brewinandchewin:fermenting/kippers',
      'brewinandchewin:fermenting/mead_from_honey',
      'brewinandchewin:fermenting/pickled_pickles_from_honey',
      'brewinandchewin:fermenting/rice_wine_from_water',
      'brewinandchewin:fermenting/steel_toe_stout_from_strongroot_ale',
      'brewinandchewin:fermenting/vodka_from_water',
      'brewinandchewin:flaxen_cheese_wheel_from_wedges',
      'brewinandchewin:pouring/unripe_flaxen_cheese_wheel',
      'brewinandchewin:pizza',
      'brewinandchewin:pizza_from_slices',
      'brewinandchewin:cutting/pizza',
      'brewinandchewin:quiche_from_slices',
      'brewinandchewin:quiche_from_mushroom',
      'brewinandchewin:quiche_from_bacon',
      'brewinandchewin:cutting/quiche',
      'brewinandchewin:cooking/creamy_onion_soup',
      'brewinandchewin:cooking/sweet_berry_jam',
      'brewinandchewin:cooking/glow_berry_marmalade',
      'brewinandchewin:cooking/apple_jelly',
    ].forEach(removeIfPresent);

    if (global.hasAllMods(['create', 'create_bic_bit'])) {
      create
        .filling('brewinandchewin:unripe_flaxen_cheese_wheel', [
          'minecraft:honeycomb',
          Fluid.of('create_bic_bit:curdled_milk', 1000),
        ])
        .id(id('filling/unripe_flaxen_cheese_wheel'));
    }

    if (global.hasMod('vintagedelight')) {
      vintagedelight
        .fermenting('2x brewinandchewin:pickled_pickles', [
          'minecraft:sea_pickle',
          'minecraft:sea_pickle',
          'minecraft:honey_bottle',
        ])
        .processingTime(2500)
        .id(id('fermenting/pickled_pickles'));

      vintagedelight
        .fermenting('2x brewinandchewin:kippers', [
          Ingredient.of('#c:foods/safe_raw_fish'),
          Ingredient.of('#c:foods/safe_raw_fish'),
          'minecraft:dried_kelp',
          Ingredient.of('#c:dusts/salt'),
        ])
        .id(id('fermenting/kippers'));
    }

    fermenting(
      'beer',
      fluidResult('brewinandchewin:beer', 1000),
      ['ratatouille:wheat_kernels', 'createdelightcore:dry_yeast'],
      fluidBase('minecraft:water', 1000),
      4800,
      3
    );
    fermenting(
      'vodka',
      fluidResult('brewinandchewin:vodka', 1000),
      [
        Ingredient.of('#c:crops/potato'),
        'ratatouille:wheat_kernels',
        'culturaldelights:corn_kernels',
      ],
      fluidBase('minecraft:water', 1000),
      4800,
      3
    );
    fermenting(
      'mead',
      fluidResult('brewinandchewin:mead', 1000),
      ['ratatouille:wheat_kernels', 'minecraft:sweet_berries'],
      fluidBase('create:honey', 1000),
      4800,
      3
    );
    fermenting(
      'rice_wine',
      fluidResult('brewinandchewin:rice_wine', 1000),
      [Ingredient.of('#c:crops/rice'), 'createdelightcore:dry_yeast'],
      fluidBase('minecraft:water', 1000),
      4800,
      3
    );
    fermenting(
      'steel_toe_stout',
      fluidResult('brewinandchewin:steel_toe_stout', 1000),
      [
        'minecraft:iron_ingot',
        'minecraft:crimson_fungus',
        'minecraft:nether_wart',
        'ratatouille:wheat_kernels',
      ],
      fluidBase('brewinandchewin:strongroot_ale', 1000),
      4800,
      1
    );

    if (global.hasMod('butchercraft')) {
      fermenting(
        'bloody_mary',
        fluidResult('brewinandchewin:bloody_mary', 1000),
        ['butchercraft:blood_fluid_bottle'],
        fluidBase('brewinandchewin:vodka', 1000),
        4800,
        4
      );
    }

    if (global.hasMod('farmersdelight')) {
      farmersdelight
        .cooking(
          'meals',
          [
            Ingredient.of('#c:creams'),
            Ingredient.of('#c:vegetables/onion'),
            Ingredient.of('#c:vegetables'),
            Ingredient.of('#c:foods/bread'),
          ],
          'brewinandchewin:creamy_onion_soup',
          1.0,
          200
        )
        .id(id('cooking/creamy_onion_soup'));
    }
  });
}
