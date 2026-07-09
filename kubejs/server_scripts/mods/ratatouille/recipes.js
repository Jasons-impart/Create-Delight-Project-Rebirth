if (global.hasAllMods(['ratatouille', 'create', 'vintageimprovements', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const {
      create,
      createdieselgenerators,
      farmersdelight,
      kubejs,
      minecraft,
      ratatouille,
      vintageimprovements,
    } = event.recipes;
    const id = (path) => `createdelightcore:ratatouille/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    const curveMold = (ingredient, result, path) => {
      vintageimprovements
        .curving(result, ingredient)
        .mode(2)
        .itemAsHead('ratatouille:chocolate_mold')
        .id(id(`curving/${path}`));
    };

    if (global.hasMod('create_confectionery')) {
      curveMold('create:bar_of_chocolate', 'ratatouille:chocolate_mold_solid', 'bar_of_chocolate');
      curveMold(
        'create_confectionery:bar_of_black_chocolate',
        'createdelightcore:black_chocolate_mold_solid',
        'bar_of_black_chocolate'
      );
      curveMold(
        'create_confectionery:bar_of_white_chocolate',
        'createdelightcore:white_chocolate_mold_solid',
        'bar_of_white_chocolate'
      );
      curveMold(
        'create_confectionery:bar_of_ruby_chocolate',
        'createdelightcore:ruby_chocolate_mold_solid',
        'bar_of_ruby_chocolate'
      );
    }

    vintageimprovements
      .curving('ratatouille:cake_mold_baked', 'ratatouille:cake_base')
      .mode(2)
      .itemAsHead('ratatouille:cake_mold')
      .id(id('curving/cake_mold_baked'));

    if (global.hasMod('bakeries') && global.hasMod('vintagedelight')) {
      create
        .mixing('ratatouille:salty_dough', [
          'bakeries:flour',
          'vintagedelight:salt_dust',
          fluid_tag_ingredient('c:egg_yolk', 50),
        ])
        .id(id('mixing/salty_dough'));
    }

    if (global.hasAllMods(['butchercraft', 'mynethersdelight', 'luncheonmeatsdelight'])) {
      [
        'butchercraft:sausage_linked',
        'butchercraft:ground_beef_to_sausage',
        'butchercraft:sausage_to_block',
        'butchercraft:cooked_sausage_to_block',
        'mynethersdelight:crafting/hotdog',
      ].forEach(removeIfPresent);

      event.remove({
        output: [
          'butchercraft:sausage',
          'butchercraft:cooked_sausage',
          'mynethersdelight:hoglin_sausage',
          'mynethersdelight:roasted_sausage',
        ],
      });

      event.replaceInput(
        { id: 'mynethersdelight:crafting/breakfast_sampler' },
        'mynethersdelight:roasted_sausage',
        Ingredient.of('#c:foods/cooked_sausage')
      );
      event.replaceInput(
        { id: 'mynethersdelight:cooking/sausage_and_potatoes' },
        'mynethersdelight:hoglin_sausage',
        'ratatouille:raw_sausage'
      );

      ratatouille
        .squeezing('ratatouille:raw_sausage', [
          'ratatouille:sausage_casing',
          Fluid.of('luncheonmeatsdelight:flesh_mud', 250),
          'minecraft:sugar',
        ])
        .id(id('squeezing/raw_sausage'));

      kubejs
        .shapeless('mynethersdelight:hotdog', [
          Ingredient.of('#c:foods/cooked_sausage'),
          Ingredient.of('#c:foods/bread'),
        ])
        .id(id('crafting/hotdog'));
    }

    if (global.hasMod('create_confectionery')) {
      [
        'create_confectionery:crushed_cocoa_recipe',
        'create_confectionery:cocoa_powder_and_butter_recipe',
        'create:mixing/normal_chocolate',
        'ratatouille:freezing/chocolate_mold_filled',
      ].forEach(removeIfPresent);

      event.replaceInput(
        { mod: 'createcafe' },
        'minecraft:cocoa_beans',
        'ratatouille:cocoa_powder'
      );

      create
        .mixing(Fluid.of('create:chocolate', 250), [
          'ratatouille:cocoa_solids',
          'ratatouille:cocoa_butter',
          Fluid.of('minecraft:milk', 250),
          'minecraft:sugar',
        ])
        .heated()
        .id(id('mixing/chocolate'));

      create
        .mixing(Fluid.of('create_confectionery:black_chocolate', 250), [
          'ratatouille:cocoa_solids',
          'ratatouille:cocoa_butter',
          Fluid.of('minecraft:milk', 250),
        ])
        .heated()
        .id(id('mixing/black_chocolate'));
      create
        .filling('createdelightcore:black_chocolate_mold_filled', [
          'ratatouille:chocolate_mold',
          Fluid.of('create_confectionery:black_chocolate', 250),
        ])
        .id(id('filling/black_chocolate_mold_filled'));
      ratatouille
        .demolding(
          ['create_confectionery:bar_of_black_chocolate', 'ratatouille:chocolate_mold'],
          'createdelightcore:black_chocolate_mold_solid'
        )
        .id(id('demolding/bar_of_black_chocolate'));
      ratatouille
        .freezing(
          'createdelightcore:black_chocolate_mold_solid',
          'createdelightcore:black_chocolate_mold_filled'
        )
        .id(id('freezing/black_chocolate_mold_filled'));

      create
        .mixing(Fluid.of('create_confectionery:white_chocolate', 250), [
          'ratatouille:cocoa_butter',
          Fluid.of('minecraft:milk', 250),
          'minecraft:sugar',
        ])
        .heated()
        .id(id('mixing/white_chocolate'));
      create
        .filling('createdelightcore:white_chocolate_mold_filled', [
          'ratatouille:chocolate_mold',
          Fluid.of('create_confectionery:white_chocolate', 250),
        ])
        .id(id('filling/white_chocolate_mold_filled'));
      ratatouille
        .demolding(
          ['create_confectionery:bar_of_white_chocolate', 'ratatouille:chocolate_mold'],
          'createdelightcore:white_chocolate_mold_solid'
        )
        .id(id('demolding/bar_of_white_chocolate'));
      ratatouille
        .freezing(
          'createdelightcore:white_chocolate_mold_solid',
          'createdelightcore:white_chocolate_mold_filled'
        )
        .id(id('freezing/white_chocolate_mold_filled'));

      // 呃呃啊啊: create_dragons_plus:dragon_breath fluid is missing for now.
      // create
      //   .mixing(Fluid.of('create_confectionery:ruby_chocolate', 250), [
      //     'ratatouille:cocoa_solids',
      //     'ratatouille:cocoa_butter',
      //     Fluid.of('create_dragons_plus:dragon_breath', 250),
      //     'minecraft:sugar',
      //   ])
      //   .heated()
      //   .id(id('mixing/ruby_chocolate'));
      create
        .filling('createdelightcore:ruby_chocolate_mold_filled', [
          'ratatouille:chocolate_mold',
          Fluid.of('create_confectionery:ruby_chocolate', 250),
        ])
        .id(id('filling/ruby_chocolate_mold_filled'));
      ratatouille
        .demolding(
          ['create_confectionery:bar_of_ruby_chocolate', 'ratatouille:chocolate_mold'],
          'createdelightcore:ruby_chocolate_mold_solid'
        )
        .id(id('demolding/bar_of_ruby_chocolate'));
      ratatouille
        .freezing(
          'createdelightcore:ruby_chocolate_mold_solid',
          'createdelightcore:ruby_chocolate_mold_filled'
        )
        .id(id('freezing/ruby_chocolate_mold_filled'));

      create
        .mixing(Fluid.of('create_confectionery:hot_chocolate', 250), [
          Fluid.of('minecraft:milk', 250),
          'minecraft:sugar',
          'create:bar_of_chocolate',
        ])
        .heated()
        .id(id('mixing/hot_chocolate'));
    }

    [
      'create:milling/wheat',
      'create_central_kitchen:crafting/dough_4',
      'create_central_kitchen:crafting/dough_3',
      'create_central_kitchen:crafting/dough_2',
      'create_central_kitchen:crafting/dough_1',
      'farmersdelight:wheat_dough_from_water',
      'create:mixing/wheat_dough_egg_create',
      'minecraft:bread',
      'quark:tweaks/crafting/utility/bent/bread',
      'farmersdelight:cutting/tag_dough',
      'culturaldelights:cooking/raw_pasta',
      'refurbished_furniture:combining/wheat_flour',
      'refurbished_furniture:baking/sea_salt',
      'refurbished_furniture:dough',
      'vintagedelight:oat_dough_from_water',
      'mynethersdelight:crafting/ghast_dough',
      'ratatouille:cutting/wheat_seeds',
      'vintagedelight:cutting/oat_cutting',
      'vintagedelight:create/milling/oat',
      'farmersdelight:rice',
      'farmersdelight:integration/create/milling/rice_panicle',
      'farmersdelight:integration/create/milling/wild_rice',
      'ratatouille:threshing/rice_panicle',
      'vintagedelight:oat_bread',
      'ratatouille:threshing/wheat_kernels',
      'vintagedelight:oatmeal_cookie',
      'farmersdelight:wheat_dough_from_egg',
      'ratatouille:emptying/egg_to_yolk',
      'ratatouille:mixing/mince_meat',
      'ratatouille:mixing/salt_from_boil',
      'ratatouille:sequenced_assembly/ripen_matter_fold',
      'ratatouille:threshing/boil_stone',
    ].forEach(removeIfPresent);

    ratatouille
      .threshing(
        [
          '2x ratatouille:wheat_kernels',
          'farmersdelight:straw',
          CreateItem.of('ratatouille:wheat_kernels', 0.5),
        ],
        'minecraft:wheat'
      )
      .processingTime(200)
      .id(id('threshing/wheat_kernels'));

    farmersdelight
      .cutting('minecraft:wheat', '#c:tools/knife', [
        '2x ratatouille:wheat_kernels',
        'farmersdelight:straw',
      ])
      .id(id('cutting/wheat'));

    if (global.hasMod('vintagedelight')) {
      ratatouille
        .threshing(
          [
            '2x vintagedelight:raw_oats',
            'farmersdelight:straw',
            CreateItem.of(Item.of('2x vintagedelight:raw_oats'), 0.5),
          ],
          'vintagedelight:oat'
        )
        .processingTime(300)
        .id(id('threshing/raw_oats'));

      farmersdelight
        .cutting('vintagedelight:oat', '#c:tools/knife', [
          '2x vintagedelight:raw_oats',
          'farmersdelight:straw',
        ])
        .id(id('cutting/oat'));

      create
        .mixing('vintagedelight:oat_dough', [
          fluid_tag_ingredient('c:egg_yolk', 50),
          'vintagedelight:raw_oats',
        ])
        .id(id('mixing/oat_dough'));

      minecraft
        .smoking(Item.of('createdelightcore:oat_bread'), 'vintagedelight:oat_dough')
        .id(id('smoking/oat_bread'));
      minecraft
        .smelting(Item.of('createdelightcore:oat_bread'), 'vintagedelight:oat_dough')
        .id(id('smelting/oat_bread'));

      event.replaceInput(
        { id: 'vintagedelight:fruity_granola_bar' },
        'vintagedelight:raw_oats',
        'vintagedelight:oat_dough'
      );
      event.replaceInput(
        { id: 'vintagedelight:deluxe_granola_bar' },
        'vintagedelight:raw_oats',
        'vintagedelight:oat_dough'
      );
      event.replaceInput(
        { id: 'vintagedelight:chocolate_granola_bar' },
        'vintagedelight:raw_oats',
        'vintagedelight:oat_dough'
      );
      event.replaceInput(
        { id: 'vintagedelight:deluxe_granola_bar' },
        'minecraft:cocoa_beans',
        Ingredient.of('#c:bars/chocolate')
      );
      event.replaceInput(
        { id: 'vintagedelight:chocolate_granola_bar' },
        'minecraft:cocoa_beans',
        Ingredient.of('#c:bars/chocolate')
      );
    }

    ratatouille
      .threshing(
        [
          '3x farmersdelight:rice',
          'farmersdelight:straw',
          CreateItem.of(Item.of('2x farmersdelight:rice'), 0.5),
        ],
        'farmersdelight:rice_panicle'
      )
      .processingTime(400)
      .id(id('threshing/rice'));

    create
      .emptying(
        [Fluid.of('createdelightcore:egg_yolk', 250), 'ratatouille:egg_shell'],
        Ingredient.of('#c:eggs')
      )
      .id(id('emptying/egg_yolk'));

    create
      .mixing(Fluid.of('createdelightcore:artificial_egg_yolk', 250), [
        Fluid.of('createdelightcore:soya_milk', 250),
        Fluid.of('createdelightcore:slime', 30),
      ])
      .id(id('mixing/artificial_egg_yolk'));

    if (global.hasMod('mynethersdelight')) {
      kubejs
        .shapeless('2x mynethersdelight:ghast_dough', [
          Ingredient.of('#c:eggs'),
          'mynethersdelight:ghasmati',
          'mynethersdelight:ghasmati',
          Ingredient.of('#c:eggs'),
        ])
        .id(id('crafting/ghast_dough_manual_only'));
      create
        .mixing('mynethersdelight:ghast_dough', [
          fluid_tag_ingredient('c:egg_yolk', 100),
          'mynethersdelight:ghasmati',
        ])
        .id(id('mixing/ghast_dough'));
    }

    if (global.hasMod('fruitsdelight')) {
      farmersdelight
        .cooking(
          'meals',
          [
            'farmersdelight:rice',
            'minecraft:sugar',
            'minecraft:sugar',
            Ingredient.of('#c:foods/fruits/mangosteen'),
            Ingredient.of('#c:foods/fruits/mangosteen'),
          ],
          'fruitsdelight:mangosteen_cake',
          1.0,
          200
        )
        .id(id('cooking/mangosteen_cake'));
    }

    [
      'ratatouille:mixing/cake_batter',
      'ratatouille:filling/cake_mold_filled',
      'create:compacting/blaze_cake',
      'luncheonmeatsdelight:integration/create/mixing/flesh_mud',
      'luncheonmeatsdelight:integration/create/mixing/flesh_mud_2',
    ].forEach(removeIfPresent);

    create
      .mixing(Fluid.of('createdelightcore:cake_batter', 1000), [
        fluid_tag_ingredient('c:milk', 250),
        fluid_tag_ingredient('c:egg_yolk', 250),
        '2x bakeries:flour',
        'minecraft:sugar',
      ])
      .id(id('mixing/cake_batter'));

    create
      .filling('ratatouille:cake_mold_filled', [
        'ratatouille:cake_mold',
        Fluid.of('createdelightcore:cake_batter', 500),
      ])
      .id(id('filling/cake_mold_filled'));

    if (global.hasMod('neapolitan')) {
      create
        .filling('neapolitan:chocolate_cake', [
          'ratatouille:cake_base',
          Fluid.of('create:chocolate', 1000),
        ])
        .id(id('filling/chocolate_cake'));
    }

    create
      .compacting('4x create:blaze_cake_base', [
        Fluid.of('createdelightcore:cake_batter', 1000),
        '2x create:cinder_flour',
      ])
      .id(id('compacting/blaze_cake_base'));

    if (global.hasMod('mynethersdelight')) {
      event
        .custom({
          type: 'create:sequenced_assembly',
          ingredient: {
            item: 'ratatouille:cake_base',
          },
          transitional_item: {
            id: 'ratatouille:cake_base',
          },
          sequence: [
            {
              type: 'create:filling',
              ingredients: [
                {
                  item: 'ratatouille:cake_base',
                },
                {
                  type: 'neoforge:single',
                  fluid: 'minecraft:lava',
                  amount: 250,
                },
              ],
              results: [
                {
                  id: 'ratatouille:cake_base',
                },
              ],
            },
            {
              type: 'create:deploying',
              ingredients: [
                {
                  item: 'ratatouille:cake_base',
                },
                {
                  item: 'minecraft:gunpowder',
                },
              ],
              results: [
                {
                  id: 'ratatouille:cake_base',
                },
              ],
            },
            {
              type: 'create:deploying',
              ingredients: [
                {
                  item: 'ratatouille:cake_base',
                },
                {
                  item: 'mynethersdelight:hot_cream',
                },
              ],
              results: [
                {
                  id: 'ratatouille:cake_base',
                },
                {
                  id: 'minecraft:bucket',
                },
              ],
            },
            {
              type: 'create:deploying',
              ingredients: [
                {
                  item: 'ratatouille:cake_base',
                },
                {
                  item: 'minecraft:magma_cream',
                },
              ],
              results: [
                {
                  id: 'ratatouille:cake_base',
                },
              ],
            },
          ],
          results: [
            {
              id: 'mynethersdelight:magma_cake_block',
            },
          ],
          loops: 1,
        })
        .id(id('sequenced_assembly/magma_cake'));
    }

    if (global.hasMod('luncheonmeatsdelight')) {
      create
        .mixing(Fluid.of('luncheonmeatsdelight:flesh_mud', 250), [
          Ingredient.of('#c:foods/raw_meat'),
          Ingredient.of('#c:salts'),
          'bakeries:flour',
        ])
        .id(id('mixing/flesh_mud'));
    }

    if (global.hasAllMods(['createaddition', 'createdieselgenerators'])) {
      [
        'create:mixing/compost_test',
        'ratatouille:composting/composting',
        'ratatouille:squeezing/compost_1to1',
        'ratatouille:squeezing/compost_1to4',
        'ratatouille:squeezing/compost_2to1',
        'ratatouille:squeezing/compost_4to1',
        'ratatouille:squeezing/compost_from_melon',
      ].forEach(removeIfPresent);

      event.forEachRecipe({ output: 'ratatouille:compost_mass' }, (recipe) => {
        const path = String(recipe.getId()).split('/').pop();
        const ingredients = [];

        recipe.getOriginalRecipeIngredients().forEach((ingredient) => {
          let count = 1;

          if (path.endsWith('4to1')) {
            count = 4;
          } else if (path.endsWith('2to1')) {
            count = 2;
          }

          ingredients.push(Ingredient.of(ingredient, count));
        });

        create
          .mixing(
            Item.of('createaddition:biomass', recipe.getOriginalRecipeResult().count),
            ingredients
          )
          .id(id(`mixing/biomass/${path}`));
      });

      event.remove({ output: 'ratatouille:compost_mass' });
      event.replaceInput({}, 'ratatouille:compost_mass', 'createaddition:biomass');
      event.remove({ type: 'ratatouille:composting' });

      createdieselgenerators
        .distillation(
          [
            Fluid.of('ratatouille:compost_residue_fluid', 60),
            Fluid.of('ratatouille:compost_tea', 30),
            Fluid.of('ratatouille:bio_gas', 10),
          ],
          Fluid.of('ratatouille:compost_fluid', 100)
        )
        .processingTime(100)
        .heated()
        .id(id('distillation/compost_fluid'));

      create
        .compacting(Fluid.of('ratatouille:compost_fluid', 100), 'createaddition:biomass')
        .superheated()
        .id(id('compacting/compost_fluid'));

      event
        .custom({
          type: 'create:sequenced_assembly',
          ingredient: {
            item: 'ratatouille:compost_residue',
          },
          transitional_item: {
            id: 'ratatouille:unprocessed_ripen_matter_fold',
          },
          sequence: [
            {
              type: 'create:filling',
              ingredients: [
                {
                  item: 'ratatouille:unprocessed_ripen_matter_fold',
                },
                {
                  type: 'neoforge:single',
                  fluid: 'ratatouille:compost_tea',
                  amount: 100,
                },
              ],
              results: [
                {
                  id: 'ratatouille:unprocessed_ripen_matter_fold',
                },
              ],
            },
            {
              type: 'create:pressing',
              ingredients: [
                {
                  item: 'ratatouille:unprocessed_ripen_matter_fold',
                },
              ],
              results: [
                {
                  id: 'ratatouille:unprocessed_ripen_matter_fold',
                },
              ],
            },
          ],
          results: [
            {
              id: 'ratatouille:ripen_matter_fold',
            },
          ],
          loops: 1,
        })
        .id(id('sequenced_assembly/ripen_matter_fold'));
    }
  });
}
