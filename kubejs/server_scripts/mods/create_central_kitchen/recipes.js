if (global.hasAllMods(['create_central_kitchen', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:create_central_kitchen/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    [
      'create_central_kitchen:mixing/apple_cider',
      'create_central_kitchen:emptying/chocolate_ice_cream',
      'create_central_kitchen:emptying/strawberry_ice_cream',
      'create_central_kitchen:emptying/vanilla_ice_cream',
      'create_central_kitchen:emptying/banana_ice_cream',
      'create_central_kitchen:emptying/mint_ice_cream',
      'create_central_kitchen:emptying/adzuki_ice_cream',
      'create_central_kitchen:mixing/chocolate_ice_cream_from_fluid_chocolate',
      'create_central_kitchen:mixing/chocolate_ice_cream',
      'create_central_kitchen:mixing/strawberry_ice_cream',
      'create_central_kitchen:mixing/vanilla_ice_cream',
      'create_central_kitchen:mixing/banana_ice_cream',
      'create_central_kitchen:mixing/mint_ice_cream',
      'create_central_kitchen:mixing/adzuki_ice_cream',
      'create_central_kitchen:mixing/chocolate_milkshake',
      'create_central_kitchen:mixing/chocolate_milkshake_from_ice_cream',
      'create_central_kitchen:mixing/strawberry_milkshake',
      'create_central_kitchen:mixing/strawberry_milkshake_from_ice_cream',
      'create_central_kitchen:mixing/vanilla_milkshake',
      'create_central_kitchen:mixing/vanilla_milkshake_from_ice_cream',
      'create_central_kitchen:mixing/banana_milkshake',
      'create_central_kitchen:mixing/banana_milkshake_from_ice_cream',
      'create_central_kitchen:mixing/mint_milkshake',
      'create_central_kitchen:mixing/mint_milkshake_from_ice_cream',
      'create_central_kitchen:mixing/adzuki_milkshake',
      'create_central_kitchen:mixing/adzuki_milkshake_from_ice_cream',
      'create_central_kitchen:emptying/chocolate_milkshake',
      'create_central_kitchen:emptying/strawberry_milkshake',
      'create_central_kitchen:emptying/vanilla_milkshake',
      'create_central_kitchen:emptying/banana_milkshake',
      'create_central_kitchen:emptying/mint_milkshake',
      'create_central_kitchen:emptying/adzuki_milkshake',
      'create_central_kitchen:mixing/tomato_sauce',
      'create_central_kitchen:haunting/white_strawberries',
      'create_central_kitchen:crafting/strawberry_scones_from_dough',
      'create_central_kitchen:crafting/adzuki_bun_from_dough',
    ].forEach(removeIfPresent);

    create
      .mixing(Fluid.of('create_central_kitchen:tomato_sauce', 250), [
        Ingredient.of('#c:crops/tomato').withCount(2),
        'minecraft:sugar',
      ])
      .id(id('mixing/tomato_sauce'));

    if (global.hasMod('corn_delight')) {
      create
        .mixing(Fluid.of('create_central_kitchen:creamy_corn_drink', 250), [
          'createdelightcore:corn_flour',
          fluid_tag_ingredient('c:milk', 250),
          'minecraft:sugar',
        ])
        .heated()
        .id(id('mixing/creamy_corn_drink'));

      create
        .filling('corn_delight:creamy_corn_drink', [
          'minecraft:glass_bottle',
          Fluid.of('create_central_kitchen:creamy_corn_drink', 250),
        ])
        .id(id('filling/creamy_corn_drink'));
      create
        .emptying(
          ['minecraft:glass_bottle', Fluid.of('create_central_kitchen:creamy_corn_drink', 250)],
          'corn_delight:creamy_corn_drink'
        )
        .id(id('emptying/creamy_corn_drink'));
    }

    if (global.hasMod('corn_delight')) {
      create
        .mixing(Fluid.of('create_central_kitchen:corn_soup', 250), [
          'createdelightcore:corn_flour',
          fluid_tag_ingredient('c:milk', 250),
          Ingredient.of('#c:salad_ingredients'),
          Ingredient.of('#brewinandchewin:raw_meats'),
        ])
        .heated()
        .id(id('mixing/corn_soup'));

      create
        .filling('corn_delight:corn_soup', [
          'minecraft:bowl',
          Fluid.of('create_central_kitchen:corn_soup', 250),
        ])
        .id(id('filling/corn_soup'));
      create
        .emptying(
          ['minecraft:bowl', Fluid.of('create_central_kitchen:corn_soup', 250)],
          'corn_delight:corn_soup'
        )
        .id(id('emptying/corn_soup'));
    }
  });
}
