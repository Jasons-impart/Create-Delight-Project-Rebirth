if (global.hasAllMods(['collectorsreap', 'farmersdelight', 'create', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:collectorsreap/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const itemIngredientExists = (ingredient) => {
      if (String(ingredient).startsWith('#')) {
        return true;
      }

      return true;
    };

    const makeCake = (input, output) => {
      create
        .deploying(output, ['minecraft:cake', input])
        .id(id(`deploying/${output.split(':')[1]}`));
    };

    const cooking = (path, ingredients, output, container) => {
      const recipe = container
        ? farmersdelight.cooking('meals', ingredients, output, 1.0, 200, container)
        : farmersdelight.cooking('meals', ingredients, output, 1.0, 200);

      recipe.id(id(`cooking/${path}`));
    };

    const limeadeFluidRecipe = (name, ingredients, extraFromLimeade) => {
      const fluid = `create_central_kitchen:${name}`;

      create.mixing(Fluid.of(fluid, 500), ingredients).id(id(`mixing/${name}`));

      if (extraFromLimeade) {
        create
          .mixing(Fluid.of(fluid, 500), [
            Ingredient.of(extraFromLimeade),
            Fluid.of('create_central_kitchen:limeade', 500),
          ])
          .id(id(`mixing/${name}_from_limeade`));
      }

      create
        .emptying([Fluid.of(fluid, 250), 'minecraft:glass_bottle'], `collectorsreap:${name}`)
        .id(id(`emptying/${name}`));
      create
        .filling(`collectorsreap:${name}`, [Fluid.of(fluid, 250), 'minecraft:glass_bottle'])
        .id(id(`filling/${name}`));
    };

    remove_recipes_output(event, [
      'collectorsreap:lime_cake',
      'collectorsreap:pomegranate_cake',
      'collectorsreap:lime_cookie',
      'collectorsreap:pink_dragon_fruit_cake',
      'collectorsreap:lucuma_cake',
    ]);

    [
      'collectorsreap:cutting/clam',
      'collectorsreap:fermenting/cream_cheese_from_milk_and_salt',
      'collectorsreap:food/big_rice_ball',
      'collectorsreap:food/candied_lime',
      'collectorsreap:food/lime_pie',
      'collectorsreap:food/portobello_quiche',
      'collectorsreap:food/pomegranate_smoothie',
      'collectorsreap:food/uni_roll',
      'collectorsreap:food/clam_roll',
      'collectorsreap:food/berry_limeade',
      'collectorsreap:food/pink_limeade',
      'collectorsreap:food/limeade',
      'collectorsreap:food/mint_limeade',
    ].forEach(removeIfPresent);

    event.remove({ output: '#collectorsreap:gummies' });

    event.replaceInput(
      { id: 'collectorsreap:food/buttered_legs' },
      'collectorsreap:chieftain_leg',
      Ingredient.of('#c:foods/crab_leg')
    );
    event.replaceInput(
      { id: 'collectorsreap:food/buttered_legs' },
      Ingredient.of('#c:milk'),
      'createdelightcore:butter'
    );
    event.replaceInput({}, 'collectorsreap:cooked_tiger_prawn', Ingredient.of('#c:foods/shrimps'));
    event.replaceInput(
      { id: 'collectorsreap:food/prawn_noodles' },
      Ingredient.of('#c:pasta'),
      'createdelightcore:vermicelli'
    );

    makeCake('collectorsreap:lime', 'collectorsreap:lime_cake');
    makeCake('collectorsreap:pomegranate', 'collectorsreap:pomegranate_cake');
    makeCake('collectorsreap:pink_dragon_fruit', 'collectorsreap:pink_dragon_fruit_cake');
    makeCake('collectorsreap:lucuma', 'collectorsreap:lucuma_cake');

    kubejs
      .shapeless('collectorsreap:big_rice_ball', [
        'minecraft:dried_kelp',
        'createdelightcore:empty_riceball',
        'createdelightcore:empty_riceball',
        'createdelightcore:empty_riceball',
      ])
      .id(id('crafting/big_rice_ball'));

    farmersdelight
      .cutting('collectorsreap:clam', '#c:tools/knife', [
        'collectorsreap:clam_meat',
        { chance: 0.1, count: 1, id: 'collectorsreap:lunar_pearl' },
      ])
      .id(id('cutting/clam'));

    create
      .filling('collectorsreap:candied_lime', [
        'collectorsreap:lime_slice',
        Fluid.of('create:honey', 250),
      ])
      .id(id('filling/candied_lime'));
    cooking(
      'candied_lime',
      ['minecraft:honey_bottle', 'collectorsreap:lime_slice'],
      'collectorsreap:candied_lime'
    );

    cooking(
      'lime_pie',
      [
        'collectorsreap:lime',
        'collectorsreap:lime',
        'collectorsreap:lime',
        'minecraft:sugar',
        'farmersdelight:pie_crust',
        Ingredient.of('#c:eggs'),
      ],
      'collectorsreap:lime_pie'
    );
    cooking(
      'portobello_quiche',
      [
        'collectorsreap:portobello',
        Ingredient.of('#c:cheese'),
        Ingredient.of('#c:crops/onion'),
        Ingredient.of('#c:eggs'),
        'farmersdelight:pie_crust',
        Ingredient.of('#c:eggs'),
      ],
      'collectorsreap:portobello_quiche'
    );

    const gummies = [
      ['chocolate', 'create:bar_of_chocolate'],
      ['lime', 'collectorsreap:lime'],
      ['pomegranate', 'collectorsreap:pomegranate'],
      ['apple', 'minecraft:apple'],
      ['glow_berries', 'minecraft:glow_berries', 'glow_berry'],
      ['melon', 'minecraft:melon_slice'],
      ['strawberry', 'neapolitan:strawberries'],
      ['banana', 'neapolitan:banana'],
      ['vanilla', 'neapolitan:dried_vanilla_pods'],
      ['mint', 'neapolitan:mint_leaves'],
      ['adzuki', 'neapolitan:roasted_adzuki_beans'],
      ['coffee', 'createcafe:coffee_grounds'],
      ['bullet_pepper', 'mynethersdelight:bullet_pepper'],
      ['pink_dragon_fruit', 'collectorsreap:pink_dragon_fruit'],
      ['lucuma', 'collectorsreap:lucuma'],
      ['carrot', 'minecraft:carrot'],
      ['sweet_berries', 'minecraft:sweet_berries', 'sweet_berry'],
      ['beetroot', 'minecraft:beetroot'],
    ];

    gummies
      .filter((gummy) => itemIngredientExists(gummy[1]))
      .forEach((gummy) => {
        const output = `collectorsreap:${gummy[2] || gummy[0]}_gummy`;

        create
          .mixing(Item.of(output, 8), [
            Fluid.of('createdelightcore:slime', 810),
            fluid_tag_ingredient('c:honey', 1000),
            gummy[1],
          ])
          .id(id(`mixing/gummy/${gummy[0]}_from_honey`));
        create
          .mixing(Item.of(output, 8), [
            Fluid.of('createdelightcore:slime', 810),
            Fluid.of('createdelightcore:base_syrup', 1000),
            gummy[1],
          ])
          .id(id(`mixing/gummy/${gummy[0]}_from_base_syrup`));
        cooking(
          `gummy/${gummy[0]}`,
          [gummy[1], 'minecraft:honey_bottle', 'minecraft:slime_ball'],
          output
        );
      });

    kubejs
      .shapeless('collectorsreap:limeade', [
        'collectorsreap:lime',
        'minecraft:sugar',
        'minecraft:glass_bottle',
      ])
      .id(id('crafting/limeade'));
    kubejs
      .shapeless('collectorsreap:berry_limeade', [
        'collectorsreap:limeade',
        Ingredient.of('#c:foods/berry'),
      ])
      .id(id('crafting/berry_limeade_from_limeade'));
    kubejs
      .shapeless('collectorsreap:berry_limeade', [
        'collectorsreap:lime',
        Ingredient.of('#c:foods/berry'),
        'minecraft:sugar',
        'minecraft:glass_bottle',
      ])
      .id(id('crafting/berry_limeade'));
    kubejs
      .shapeless('collectorsreap:pink_limeade', [
        'collectorsreap:limeade',
        'collectorsreap:pomegranate',
      ])
      .id(id('crafting/pink_limeade_from_limeade'));
    kubejs
      .shapeless('collectorsreap:pink_limeade', [
        'collectorsreap:lime',
        'collectorsreap:pomegranate',
        'minecraft:sugar',
        'minecraft:glass_bottle',
      ])
      .id(id('crafting/pink_limeade'));
    kubejs
      .shapeless('collectorsreap:mint_limeade', [
        'collectorsreap:limeade',
        Ingredient.of('#neapolitan:mint_leaves'),
      ])
      .id(id('crafting/mint_limeade_from_limeade'));
    kubejs
      .shapeless('collectorsreap:mint_limeade', [
        'collectorsreap:lime',
        Ingredient.of('#neapolitan:mint_leaves'),
        'minecraft:sugar',
        'minecraft:glass_bottle',
      ])
      .id(id('crafting/mint_limeade'));

    // 呃呃啊啊: create_central_kitchen limeade fluids are missing for now.
    // limeadeFluidRecipe('limeade', ['collectorsreap:lime', 'minecraft:sugar']);
    // limeadeFluidRecipe(
    //   'berry_limeade',
    //   ['collectorsreap:lime', Ingredient.of('#c:foods/berry'), 'minecraft:sugar'],
    //   '#c:foods/berry'
    // );
    // limeadeFluidRecipe(
    //   'pink_limeade',
    //   ['collectorsreap:lime', 'collectorsreap:pomegranate', 'minecraft:sugar'],
    //   'collectorsreap:pomegranate'
    // );
    // limeadeFluidRecipe(
    //   'mint_limeade',
    //   ['collectorsreap:lime', Ingredient.of('#neapolitan:mint_leaves'), 'minecraft:sugar'],
    //   '#neapolitan:mint_leaves'
    // );

    cooking(
      'potato_fritters',
      [
        'createdelightcore:raw_potato_pancake',
        'collectorsreap:lime',
        'collectorsreap:lime',
        Ingredient.of('#c:crops/onion'),
      ],
      'collectorsreap:potato_fritters'
    );
  });
}
