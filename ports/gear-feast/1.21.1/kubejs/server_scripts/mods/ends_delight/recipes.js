if (global.hasAllMods(['ends_delight', 'farmersdelight', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const { farmersdelight } = event.recipes;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    [
      'ends_delight:food/chorus_fruit_milk_tea',
      'ends_delight:food/chorus_cookie',
      'ends_delight:crack_non_hatchable_dragon_egg',
    ].forEach(removeIfPresent);

    event
      .shapeless('4x minecraft:dragon_breath', [
        'ends_delight:dragon_tooth',
        '4x minecraft:glass_bottle',
      ])
      .id('createdelightcore:ends_delight/dragon_breath_from_dragon_tooth');

    farmersdelight
      .cooking(
        'meals',
        [
          Ingredient.of('#c:foods/shulker_meat'),
          'ends_delight:dried_endermite_meat',
          'ends_delight:chorus_sauce',
          Ingredient.of('#c:mushrooms'),
          'createdelightcore:vermicelli',
        ],
        'ends_delight:ender_noodle',
        1.0,
        200
      )
      .id('createdelightcore:ends_delight/food/ender_noodle');

    farmersdelight
      .cutting('#c:dragon_eggs', '#minecraft:axes', [
        'ends_delight:liquid_dragon_egg',
        'ends_delight:half_dragon_egg_shell',
      ])
      .id('createdelightcore:ends_delight/cutting/dragon_egg_manual_only');

    event.recipes.create
      .cutting('4x ends_delight:ender_pearl_grain', 'minecraft:ender_pearl')
      .id('createdelightcore:ends_delight/cutting/ender_pearl_grain');

    event.recipes.create
      .compacting('minecraft:ender_pearl', ['4x ends_delight:ender_pearl_grain'])
      .id('createdelightcore:ends_delight/compacting/ender_pearl');
  });
}
