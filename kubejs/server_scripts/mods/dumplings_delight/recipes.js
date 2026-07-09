if (global.hasAllMods(['dumplings_delight', 'farmersdelight'])) {
  ServerEvents.recipes((event) => {
    const { farmersdelight } = event.recipes;
    const id = (path) => `createdelightcore:dumplings_delight/${path}`;
    const itemId = (stack) => String(stack).replace(/^\d+x\s+/, '');
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const cooking = (path, output, ingredients) => {
      farmersdelight
        .cooking(
          'meals',
          ingredients.map((ingredient) => Ingredient.of(ingredient)),
          output,
          1.0,
          200
        )
        .id(id(`cooking/${path}`));
    };

    [
      'beef_tomato_boiled_dumpling',
      'calamari_boiled_dumpling',
      'chicken_mushroom_boiled_dumpling',
      'cod_boiled_dumpling',
      'dandelion_leaf_boiled_dumpling',
      'eggplant_egg_boiled_dumpling',
      'fungus_boiled_dumpling',
      'garlic_chive_egg_boiled_dumpling',
      'mushroom_boiled_dumpling',
      'mutton_boiled_dumpling',
      'pork_cabbage_boiled_dumpling',
      'pork_celery_boiled_dumpling',
      'pork_fennel_boiled_dumpling',
      'pork_kelp_boiled_dumpling',
      'pork_potato_boiled_dumpling',
      'pufferfish_boiled_dumpling',
      'rabbit_meat_boiled_dumpling',
      'salmon_boiled_dumpling',
      'tomato_egg_boiled_dumpling',
    ].forEach((name) => removeIfPresent(`dumplings_delight:dumpling/${name}`));

    ['pork_cabbage_wonton', 'pork_carrot_wonton', 'pork_mushroom_wonton'].forEach((name) =>
      removeIfPresent(`dumplings_delight:wonton/${name}`)
    );

    cooking('pork_cabbage_boiled_dumpling', '2x dumplings_delight:pork_cabbage_boiled_dumpling', [
      '#c:foods/dough',
      'butchercraft:pork_stewmeat',
      '#c:crops/cabbage',
      '#c:crops/greenonion',
    ]);
    cooking('pork_kelp_boiled_dumpling', '2x dumplings_delight:pork_kelp_boiled_dumpling', [
      '#c:foods/dough',
      'butchercraft:pork_stewmeat',
      'minecraft:kelp',
      '#c:crops/greenonion',
    ]);
    cooking('pork_potato_boiled_dumpling', '2x dumplings_delight:pork_potato_boiled_dumpling', [
      '#c:foods/dough',
      'butchercraft:pork_stewmeat',
      'minecraft:brown_mushroom',
      'minecraft:potato',
      '#c:crops/greenonion',
    ]);
    cooking('pork_fennel_boiled_dumpling', 'dumplings_delight:pork_fennel_boiled_dumpling', [
      '#c:foods/dough',
      'butchercraft:pork_stewmeat',
      '#c:crops/fennel',
      '#c:crops/greenonion',
    ]);
    cooking('mutton_boiled_dumpling', '2x dumplings_delight:mutton_boiled_dumpling', [
      '#c:foods/dough',
      'butchercraft:lamb_stewmeat',
      '#c:crops/greenonion',
    ]);
    cooking(
      'chicken_mushroom_boiled_dumpling',
      '2x dumplings_delight:chicken_mushroom_boiled_dumpling',
      [
        '#c:foods/dough',
        'butchercraft:chicken_stewmeat',
        'minecraft:brown_mushroom',
        '#c:crops/greenonion',
      ]
    );
    cooking('cod_boiled_dumpling', '2x dumplings_delight:cod_boiled_dumpling', [
      '#c:foods/dough',
      'farmersdelight:cod_slice',
      '#c:eggs',
      '#c:crops/greenonion',
    ]);
    cooking('salmon_boiled_dumpling', '2x dumplings_delight:salmon_boiled_dumpling', [
      '#c:foods/dough',
      'farmersdelight:salmon_slice',
      'minecraft:carrot',
    ]);
    cooking('eggplant_egg_boiled_dumpling', '2x dumplings_delight:eggplant_egg_boiled_dumpling', [
      '#c:foods/dough',
      '#c:eggs',
      '#c:crops/eggplant',
      '#c:crops/greenonion',
    ]);
    cooking('mushroom_boiled_dumpling', '2x dumplings_delight:mushroom_boiled_dumpling', [
      '#c:foods/dough',
      'minecraft:brown_mushroom',
      'minecraft:red_mushroom',
      '#c:crops/greenonion',
    ]);
    cooking('fungus_boiled_dumpling', '2x dumplings_delight:fungus_boiled_dumpling', [
      '#c:foods/dough',
      'minecraft:warped_fungus',
      'minecraft:crimson_fungus',
      '#c:crops/greenonion',
    ]);
    cooking(
      'garlic_chive_egg_boiled_dumpling',
      '2x dumplings_delight:garlic_chive_egg_boiled_dumpling',
      ['#c:foods/dough', '#c:crops/garlic_chive', '#c:eggs']
    );
    cooking(
      'dandelion_leaf_boiled_dumpling',
      '2x dumplings_delight:dandelion_leaf_boiled_dumpling',
      ['#c:foods/dough', 'minecraft:dandelion', '#c:eggs', 'minecraft:brown_mushroom']
    );
    cooking('pufferfish_boiled_dumpling', '2x dumplings_delight:pufferfish_boiled_dumpling', [
      '#c:foods/dough',
      '#c:foods/pufferfish',
      '#c:crops/greenonion',
    ]);
    cooking('rabbit_meat_boiled_dumpling', '2x dumplings_delight:rabbit_meat_boiled_dumpling', [
      '#c:foods/dough',
      'butchercraft:rabbit_stewmeat',
      '#c:crops/greenonion',
    ]);
    cooking('beef_tomato_boiled_dumpling', '2x dumplings_delight:beef_tomato_boiled_dumpling', [
      '#c:foods/dough',
      'butchercraft:beef_stewmeat',
      'butchercraft:beef_stewmeat',
      '#c:vegetables/tomato',
      '#c:crops/greenonion',
    ]);
    cooking('calamari_boiled_dumpling', '2x dumplings_delight:calamari_boiled_dumpling', [
      '#c:foods/dough',
      'createdelightcore:raw_calamari',
      'minecraft:brown_mushroom',
      '#c:crops/greenonion',
    ]);
    cooking('tomato_egg_boiled_dumpling', '2x dumplings_delight:tomato_egg_boiled_dumpling', [
      '#c:foods/dough',
      '#c:vegetables/tomato',
      '#c:eggs',
      '#c:crops/greenonion',
    ]);

    cooking('pork_cabbage_wonton', 'dumplings_delight:pork_cabbage_wonton', [
      '#c:foods/dough',
      '#c:foods/raw_pork',
      '#c:crops/cabbage',
      '#c:crops/greenonion',
      'minecraft:dried_kelp',
    ]);
    cooking('pork_mushroom_wonton', 'dumplings_delight:pork_mushroom_wonton', [
      '#c:foods/dough',
      '#c:foods/raw_pork',
      'minecraft:brown_mushroom',
      '#c:crops/greenonion',
      'minecraft:dried_kelp',
    ]);
    cooking('pork_carrot_wonton', 'dumplings_delight:pork_carrot_wonton', [
      '#c:foods/dough',
      '#c:foods/raw_pork',
      '#c:eggs',
      'minecraft:carrot',
      'minecraft:dried_kelp',
    ]);
  });
}
