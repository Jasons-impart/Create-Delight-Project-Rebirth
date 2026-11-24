if (global.hasMod('youkaishomecoming')) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, ratatouille } = event.recipes;
    const id = (path) => `createdelightcore:youkaishomecoming/${path}`;
    const dieselFermenting = (path, results, ingredients, processingTime) => {
      event.recipes.createdieselgenerators
        .basin_fermenting(results, ingredients)
        .processingTime(processingTime)
        .id(id(`basin_fermenting/${path}`));
      event.recipes.createdieselgenerators
        .bulk_fermenting(results, ingredients)
        .processingTime(Math.floor(processingTime / 2))
        .id(id(`bulk_fermenting/${path}`));
    };
    const fillAndEmptyBottle = (itemId, fluidId, fillingPath, emptyingPath) => {
      event
        .custom({
          type: 'create:filling',
          ingredients: [
            { item: 'minecraft:glass_bottle' },
            { type: 'fluid_stack', amount: 250, fluid: fluidId },
          ],
          results: [{ item: { id: itemId } }],
        })
        .id(id(`filling/${fillingPath}`));
      event
        .custom({
          type: 'create:emptying',
          ingredients: [{ item: itemId }],
          results: [
            { item: { id: 'minecraft:glass_bottle' } },
            { amount: 250, id: fluidId },
          ],
        })
        .id(id(`emptying/${emptyingPath}`));
    };

    remove_recipes_id(event, [
      'youkaishomecoming:cooking/onigili',
      'youkaishomecoming:cooking/pork_rice_ball',
      'youkaishomecoming:cooking/tamagoyaki',
      'youkaishomecoming:cooking/tofu',
      'youkaishomecoming:cutting/mandrake_root_cutting',
      'youkaishomecoming:cutting/pods_cutting',
      'youkaishomecoming:cutting/raw_lamprey_cutting',
    ]);

    create.compacting('supplementaries:ash', 'create:limestone').heated().id(id('compacting/ash'));

    event.replaceInput(
      { id: 'youkaishomecoming:cooking/imitation_crab' },
      'minecraft:wheat',
      'bakeries:flour'
    );

    event.replaceInput(
      { id: 'youkaishomecoming:cooking/longevity_noodles' },
      Ingredient.of('#c:foods/pasta'),
      'createdelightcore:vermicelli'
    );

    event
      .shapeless('2x youkaishomecoming:onigili', [
        'minecraft:dried_kelp',
        '2x createdelightcore:empty_riceball',
        Ingredient.of('#c:foods/vegetable'),
      ])
      .id(id('crafting/onigili'));

    farmersdelight
      .cooking(
        'meals',
        [
          'createdelightcore:empty_riceball',
          'createdelightcore:empty_riceball',
          Ingredient.of('#c:foods/raw_pork'),
        ],
        '2x youkaishomecoming:pork_rice_ball',
        1.0,
        200
      )
      .id(id('cooking/pork_rice_ball'));

    create
      .compacting(Fluid.of('createdelightcore:soya_milk', 250), [
        Fluid.water(100),
        'youkaishomecoming:soybean',
      ])
      .heated()
      .id(id('compacting/soya_milk'));

    create
      .mixing('youkaishomecoming:tofu', [
        Fluid.of('createdelightcore:soya_milk', 250),
        Fluid.of('bakeries:salt_water', 10),
      ])
      .id(id('mixing/tofu'));

    create
      .pressing('youkaishomecoming:clay_saucer', 'minecraft:clay_ball')
      .id(id('pressing/clay_saucer'));

    ratatouille
      .threshing(
        ['youkaishomecoming:soybean', CreateItem.of('youkaishomecoming:soybean', 0.5)],
        'youkaishomecoming:pods'
      )
      .processingTime(200)
      .id(id('threshing/pods'));

    farmersdelight
      .cooking(
        'misc',
        ['youkaishomecoming:soybean', 'youkaishomecoming:soybean', Ingredient.of('#c:dusts/salt')],
        'youkaishomecoming:tofu',
        1.0,
        200
      )
      .id(id('cooking/tofu'));

    farmersdelight
      .cutting('youkaishomecoming:mandrake_root', Ingredient.of('#c:tools/knife'), [
        'youkaishomecoming:stripped_mandrake_root',
      ])
      .id(id('cutting/mandrake_root'));
    farmersdelight
      .cutting('youkaishomecoming:raw_lamprey', Ingredient.of('#c:tools/knife'), [
        '2x youkaishomecoming:raw_lamprey_fillet',
      ])
      .id(id('cutting/raw_lamprey'));

    create
      .crushing(
        [
          '3x youkaishomecoming:ice_cube',
          CreateItem.of(Item.of('3x youkaishomecoming:ice_cube'), 0.25),
        ],
        'minecraft:ice'
      )
      .id(id('crushing/ice_cube'));

    create
      .milling('youkaishomecoming:matcha', Ingredient.of('#c:tea_leaves/green'))
      .id(id('milling/matcha'));

    create
      .compacting('youkaishomecoming:tamagoyaki', [
        Fluid.of('createdelightcore:egg_yolk', 500),
        Fluid.of('minecraft:milk', 250),
        'minecraft:sugar',
      ])
      .heated()
      .id(id('compacting/tamagoyaki'));

    event.replaceInput(
      { output: 'youkaishomecoming:flesh_chocolate_mousse' },
      'minecraft:wheat',
      'create:dough'
    );
    event.replaceInput(
      { output: 'youkaishomecoming:scarlet_devil_cake' },
      'minecraft:wheat',
      'create:dough'
    );
    event.replaceInput(
      { mod: 'youkaishomecoming', not: { id: 'youkaishomecoming:cooking/imitation_crab' } },
      'minecraft:wheat',
      'farmersdelight:rice'
    );
    event.replaceInput(
      { mod: 'youkaishomecoming' },
      'minecraft:cocoa_beans',
      'create:bar_of_chocolate'
    );
    if (global.hasMod('neapolitan')) {
      event.replaceInput(
        { output: 'youkaishomecoming:apaki' },
        'minecraft:pink_petals',
        'neapolitan:dried_vanilla_pods'
      );
    }
    if (global.hasMod('fruitsdelight')) {
      event.replaceInput(
        { output: 'youkaishomecoming:avgolemono' },
        'minecraft:glow_berries',
        'fruitsdelight:lemon_slice'
      );
    }
    event.replaceInput(
      {
        output: ['youkaishomecoming:blazing_red_curry', 'youkaishomecoming:mapo_tofu'],
      },
      'minecraft:blaze_powder',
      Ingredient.of('#mynethersdelight:hot_spice')
    );
    if (global.hasMod('trailandtales_delight')) {
      event.replaceInput(
        { output: ['youkaishomecoming:sakura_mochi', 'youkaishomecoming:seven_colored_yokan'] },
        'minecraft:cherry_leaves',
        'trailandtales_delight:cherry_petal'
      );
    }
    event.replaceInput({}, 'youkaishomecoming:tea_leaves', Ingredient.of('#c:tea_leaves/green'));

    remove_recipes_output(event, [
      'youkaishomecoming:tea_leaf_bag',
      'youkaishomecoming:green_coffee_bean',
      'youkaishomecoming:coffee_beans',
      'youkaishomecoming:ice_cube',
    ]);
    remove_recipes_id(event, [
      'youkaishomecoming:redbean_bag',
      'youkaishomecoming:coffee_bean_bag',
      'youkaishomecoming:oily_bean_curd_from_tofu_campfire',
      'youkaishomecoming:oily_bean_curd_from_tofu_smelting',
      'youkaishomecoming:oily_bean_curd_from_tofu_smoking',
      'youkaishomecoming:red_velvet',
      'youkaishomecoming:red_velvet_assemble',
      'youkaishomecoming:red_velvet_cake',
      'youkaishomecoming:emptying/blood_bottle_emptying',
      'youkaishomecoming:red_velvet_cake_slice',
      'youkaishomecoming:clay_saucer_from_clay_ball_stonecutting',
      'youkaishomecoming:redbean_from_redbean_bag',
      'youkaishomecoming:tea_leaves_from_tea_leaf_bag',
      'youkaishomecoming:copper_tank_from_copper_block_stonecutting',
      'youkaishomecoming:copper_faucet_from_copper_ingot_stonecutting',
      'youkaishomecoming:cucumber_crate',
      'youkaishomecoming:cucumber_seeds_from_cucumber_crate',
      'youkaishomecoming:cucumber_from_cucumber_crate',
      'youkaishomecoming:cucumber_seeds',
      'youkaishomecoming:green_tea_bag',
      'youkaishomecoming:green_tea_leaves_from_green_tea_bag',
      'youkaishomecoming:oolong_tea_bag',
      'youkaishomecoming:oolong_tea_leaves_from_oolong_tea_bag',
      'youkaishomecoming:black_tea_bag',
      'youkaishomecoming:black_tea_leaves_from_black_tea_bag',
      'youkaishomecoming:cooking/mayonnaise_bottle',
      'youkaishomecoming:cooking/butter',
      'youkaishomecoming:green_tea_leaves_from_tea_leaves_drying',
      'youkaishomecoming:black_grape_crate',
      'youkaishomecoming:black_grape_from_black_grape_crate',
      'youkaishomecoming:coffee_powder',
      'youkaishomecoming:straw_from_wheat_drying',
      'youkaishomecoming:doughnut',
      'youkaishomecoming:sake_bottle_from_glass_stonecutting',
      'youkaishomecoming:simple_basin/white_grape_juice',
      'youkaishomecoming:simple_basin/black_grape_juice',
      'youkaishomecoming:simple_basin/red_grape_juice',
      'youkaishomecoming:cuisine_mixed/california_roll',
      'youkaishomecoming:tobiko_gunkan',
      'youkaishomecoming:cuisine_ordered/tobiko_gunkan',
      'youkaishomecoming:cuisine_ordered/roe_california_roll',
      'youkaishomecoming:cuisine_ordered/kelp_roll',
    ]);
    if (global.hasMod('vinery')) {
      remove_recipes_id(event, [
        'vinery:red_grape',
        'vinery:white_grape',
        'vinery:white_grape_bag',
        'vinery:red_grape_bag',
      ]);
    }

    if (global.hasMod('ratatouille')) {
      event.forEachRecipe({ type: 'youkaishomecoming:drying_rack' }, (recipe) => {
        const result = recipe.getOriginalRecipeResult();
        if (String(result.getId()) === 'brewinandchewin:jerky') {
          return;
        }
        event.recipes.ratatouille
          .baking(result, recipe.getOriginalRecipeIngredients())
          .processingTime(200)
          .id(id(`baking/${String(result.getId()).split(':')[1]}`));
      });
    }

    if (global.hasAllMods(['ratatouille', 'butchercraft'])) {
      create
        .sequenced_assembly('youkaishomecoming:red_velvet', 'ratatouille:cake_base', [
          create.filling('ratatouille:cake_base', [
            'ratatouille:cake_base',
            Fluid.of('butchercraft:blood_fluid'),
          ]),
          create.deploying('ratatouille:cake_base', [
            'ratatouille:cake_base',
            'youkaishomecoming:flesh',
          ]),
        ])
        .loops(1)
        .transitionalItem('ratatouille:cake_base')
        .id(id('sequenced_assembly/red_velvet_cake'));
    }

    if (global.hasMod('vintagedelight')) {
      event
        .custom({
          type: 'youkaishomecoming:simple_fermentation',
          ingredients: [{ tag: 'c:mushrooms' }],
          inputFluid: {
            amount: 1000,
            id: 'youkaishomecoming:mio',
          },
          outputFluid: {
            amount: 1000,
            id: 'createdelightcore:vinegar',
          },
          results: [{ count: 4, id: 'vintagedelight:organic_mash' }],
          time: 2400,
        })
        .id(id('simple_fermentation/vinegar'));
    }

    if (global.hasMod('createdieselgenerators')) {
      dieselFermenting(
        'mio',
        Fluid.of('youkaishomecoming:mio', 1000),
        [
          Ingredient.of('#c:crops/rice'),
          Ingredient.of('#c:crops/rice'),
          Ingredient.of('#c:crops/rice'),
          Ingredient.of('#c:crops/rice'),
          Fluid.water(1000),
        ],
        1800
      );
      dieselFermenting(
        'soy_sauce',
        Fluid.of('youkaishomecoming:soy_sauce', 1000),
        [
          'youkaishomecoming:soybean',
          'youkaishomecoming:soybean',
          'youkaishomecoming:soybean',
          'youkaishomecoming:soybean',
          Fluid.water(1000),
        ],
        1800
      );
      if (global.hasMod('vintagedelight')) {
        dieselFermenting(
          'vinegar',
          ['4x vintagedelight:organic_mash', Fluid.of('createdelightcore:vinegar', 1000)],
          [Ingredient.of('#c:mushrooms'), Fluid.of('youkaishomecoming:mio', 1000)],
          1800
        );
      }
    }

    if (global.hasMod('butchercraft')) {
      create
        .mixing(Fluid.of('createdelightcore:scarlet_tea', 1000), [
          Fluid.of('butchercraft:blood_fluid', 1000),
          Ingredient.of('#c:tea_leaves/black'),
        ])
        .id(id('mixing/scarlet_tea'));
    }
    if (global.hasMod('fruitsdelight')) {
      create
        .mixing(Fluid.of('createdelightcore:lemon_black_tea', 1000), [
          Fluid.water(1000),
          Ingredient.of('#c:tea_leaves/black'),
          'fruitsdelight:lemon_slice',
          'minecraft:sugar',
        ])
        .id(id('mixing/lemon_black_tea'));
    }
    create
      .mixing(Fluid.of('createdelightcore:saidi_tea', 1000), [
        Fluid.water(1000),
        Ingredient.of('#c:tea_leaves/black'),
        'minecraft:sugar',
        'minecraft:sugar',
      ])
      .id(id('mixing/saidi_tea'));
    create
      .mixing(Fluid.of('createdelightcore:cornflower_tea', 500), [
        Fluid.water(500),
        'minecraft:cornflower',
      ])
      .id(id('mixing/cornflower_tea'));
    if (global.hasMod('trailandtales_delight')) {
      create
        .mixing(Fluid.of('createdelightcore:sakura_honey_tea', 500), [
          Fluid.water(500),
          Fluid.of('create:honey', 250),
          'trailandtales_delight:dried_cherry_petal',
        ])
        .id(id('mixing/sakura_honey_tea'));
    }
    create
      .mixing(Fluid.of('createdelightcore:genmai_tea', 500), [
        Fluid.water(500),
        Ingredient.of('#c:tea_leaves/green'),
        Ingredient.of('#c:crops/rice'),
      ])
      .id(id('mixing/genmai_tea'));
    create
      .mixing(Fluid.of('createdelightcore:green_water', 500), [
        Fluid.water(500),
        Ingredient.of('#c:foods/cabbage'),
      ])
      .id(id('mixing/green_water'));
    create
      .mixing(Fluid.of('createdelightcore:white_tea', 500), [
        Fluid.water(500),
        'youkaishomecoming:white_tea_leaves',
      ])
      .id(id('mixing/white_tea'));
    if (global.hasMod('ratatouille')) {
      create
        .mixing(Fluid.of('createdelightcore:tea_mocha', 1000), [
          Fluid.water(1000),
          Ingredient.of('#c:tea_leaves/black'),
          'ratatouille:cocoa_powder',
          Fluid.of('minecraft:milk', 250),
        ])
        .id(id('mixing/tea_mocha'));
    }

    // 4.2.1 tea bottles share IDs with Youkai fluids, so filling/emptying
    // must use explicit item JSON. lemon_black_tea is not registered as a
    // Youkai item or fluid in 4.2.1 (only a CDC fluid remains).
    [
      'scarlet_tea',
      'tea_mocha',
      'saidi_tea',
      'white_tea',
      'cornflower_tea',
      'sakura_honey_tea',
      'genmai_tea',
      'green_water',
    ].forEach((tea) => {
      fillAndEmptyBottle(
        `youkaishomecoming:${tea}`,
        `createdelightcore:${tea}`,
        tea,
        tea
      );
    });

    [
      'espresso',
      'americano',
      'ristretto',
      'latte',
      'affogato',
      'con_panna',
      'cappuccino',
      'macchiato',
      'mocha',
    ].forEach((coffee) => {
      fillAndEmptyBottle(
        `youkaishomecoming:${coffee}`,
        `createdelightcore:${coffee}_fluid`,
        `${coffee}_from_fluid`,
        `${coffee}_fluid_from_bottle`
      );
    });

    create
      .filling(Item.of('youkaishomecoming:americano'), [
        'youkaishomecoming:espresso',
        Fluid.water(250),
      ])
      .id(id('filling/americano'));
    create
      .filling(Item.of('youkaishomecoming:latte'), [
        'youkaishomecoming:espresso',
        Fluid.of('minecraft:milk', 250),
      ])
      .id(id('filling/latte'));
    if (global.hasMod('createcafe')) {
      create
        .mixing(Fluid.of('createdelightcore:espresso_fluid', 1000), [
          Fluid.of('createdelightcore:americano_fluid', 1000),
          'createcafe:coffee_grounds',
        ])
        .heated()
        .id(id('mixing/espresso_fluid'));
      create
        .deploying('youkaishomecoming:ristretto', [
          'youkaishomecoming:espresso',
          'createcafe:coffee_grounds',
        ])
        .id(id('deploying/ristretto'));
    }
    if (global.hasMod('ratatouille')) {
      create
        .deploying('youkaishomecoming:mocha', [
          'youkaishomecoming:latte',
          'ratatouille:cocoa_powder',
        ])
        .id(id('deploying/mocha'));
    }
  });
}
