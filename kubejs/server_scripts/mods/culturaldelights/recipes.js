if (global.hasMod('culturaldelights')) {
  ServerEvents.recipes((event) => {
    const { farmersdelight } = event.recipes;
    const id = (path) => `createdelightcore:culturaldelights/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    [
      'culturalrecipes:cutting/raw_calamari',
      'culturalrecipes:cutting/raw_calamari_from_glowsquid',
      'culturalrecipes:cutting/wild_cucumbers',
      'culturalrecipes:corn_dough',
      'culturalrecipes:cutting/wild_corn',
      'culturalrecipes:cutting/corn_kernels',
      'culturalrecipes:smelting/cooked_squid',
      'culturalrecipes:smelting/cooked_squid_from_campfire',
      'culturalrecipes:smelting/cooked_squid_from_smoking',
      'culturalrecipes:egg_roll',
      'culturalrecipes:pufferfish_roll',
      'culturalrecipes:tropical_roll',
      'culturalrecipes:calamari_roll',
      'culturalrecipes:midori_roll',
      'culturalrecipes:chicken_roll',
      'culturalrecipes:cooking/elote',
    ].forEach(removeIfPresent);

    event.replaceInput(
      { id: 'culturalrecipes:cooking/eggplant_parmesan_block' },
      Ingredient.of('#c:milk'),
      Ingredient.of('#c:cheese')
    );

    event
      .shapeless('createdelightcore:raw_empanada', [
        '2x culturaldelights:corn_dough',
        Ingredient.of('#culturaldelights:avocados'),
        Ingredient.of('#c:crops/tomato'),
        Ingredient.of('#c:crops/onion'),
      ])
      .id(id('crafting/raw_empanada'));

    if (global.hasMod('farmersdelight')) {
      farmersdelight
        .cooking(
          'meals',
          [
            Ingredient.of('#c:cheese'),
            'culturaldelights:corn_cob',
            Ingredient.of('#c:crops/onion'),
          ],
          'culturaldelights:elote',
          2.0,
          400,
          'minecraft:stick'
        )
        .id(id('cooking/elote'));

      farmersdelight
        .cutting('vintagedelight:cucumber', '#c:tools/knife', ['2x culturaldelights:cut_cucumber'])
        .id(id('cutting/cucumber'));

      farmersdelight
        .cutting('culturaldelights:wild_cucumbers', '#c:tools/knife', [
          'vintagedelight:cucumber_seeds',
          'minecraft:green_dye',
        ])
        .id(id('cutting/wild_cucumbers'));
    }

    event
      .shapeless('2x culturaldelights:rice_ball', [
        'minecraft:dried_kelp',
        'createdelightcore:empty_riceball',
        'createdelightcore:empty_riceball',
        Ingredient.of('#c:foods/berry'),
        Ingredient.of('#c:foods/raw_fish'),
      ])
      .id(id('crafting/rice_ball'));

    if (global.hasMod('crabbersdelight')) {
      event
        .shapeless('crabbersdelight:squid_barrel', ['9x culturaldelights:squid'])
        .id(id('crafting/squid_barrel'));
      event
        .shapeless('9x culturaldelights:squid', ['crabbersdelight:squid_barrel'])
        .id(id('crafting/squid_from_barrel'));
      event
        .shapeless('crabbersdelight:glow_squid_barrel', ['9x culturaldelights:glow_squid'])
        .id(id('crafting/glow_squid_barrel'));
      event
        .shapeless('9x culturaldelights:glow_squid', ['crabbersdelight:glow_squid_barrel'])
        .id(id('crafting/glow_squid_from_barrel'));
    }
  });
}
