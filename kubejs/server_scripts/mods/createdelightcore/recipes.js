if (global.hasAllMods(['createdelightcore', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:core/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const itemId = (stack) => String(stack).replace(/^\d+x\s+/, '');

    event.recipes.createdelightcore
      .fan_freezing('minecraft:leather', 'createdelightcore:unfinished_leather')
      .id(id('fan_freezing/unfinished_leather'));

    event.recipes.vintageimprovements
      .pressurizing('createdelightcore:unfinished_leather', [
        Fluid.of('createdelightcore:slime', 45),
        Ingredient.of('#createdelightcore:leather_ingredient'),
      ])
      .heated()
      .id(id('pressurizing/unfinished_leather'));

    event.replaceInput({ id: 'minecraft:sticky_piston' }, 'minecraft:slime_ball', '#c:slime_balls');

    event.recipes.create
      .compacting('ratatouille:sausage_casing', Fluid.of('createdelightcore:slime', 30))
      .id(id('compacting/sausage_casing'));

    event.recipes.create
      .compacting('minecraft:slime_block', Fluid.of('createdelightcore:slime', 810))
      .id(id('compacting/slime_block'));

    event.recipes.create
      .compacting('minecraft:slime_ball', Fluid.of('createdelightcore:slime', 90))
      .id(id('compacting/slime_ball'));

    event.recipes.create
      .mixing(Fluid.of('createdelightcore:slime', 90), 'minecraft:slime_ball')
      .heated()
      .id(id('mixing/slime_from_ball'));

    event.recipes.create
      .mixing(Fluid.of('createdelightcore:slime', 810), 'minecraft:slime_block')
      .heated()
      .id(id('mixing/slime_from_block'));

    event.recipes.create
      .filling('create:super_glue', ['create:iron_sheet', Fluid.of('createdelightcore:slime', 90)])
      .id(id('filling/super_glue'));

    event.recipes.vintageimprovements
      .pressurizing(Fluid.of('createdelightcore:slime', 30), 'minecraft:kelp')
      .heated()
      .id(id('pressurizing/slime'));

    event.recipes.vintageimprovements
      .pressurizing('minecraft:glowstone_dust', 'minecraft:glow_berries')
      .heated()
      .id(id('pressurizing/glowstone_dust'));

    event.recipes.vintageimprovements
      .pressurizing('minecraft:deepslate', [
        Fluid.lava(50),
        Ingredient.of('#c:cobblestones/normal'),
      ])
      .heated()
      .id(id('pressurizing/deepslate'));

    if (global.hasMod('create_new_age')) {
      event.recipes.create
        .sequenced_assembly(
          [
            CreateItem.of('minecraft:budding_amethyst', 0.1),
            CreateItem.of('minecraft:amethyst_block', 0.9),
          ],
          'minecraft:amethyst_block',
          [
            event.recipes.create.filling('minecraft:amethyst_block', [
              'minecraft:amethyst_block',
              Fluid.of('createdelightcore:spent_liquor', 1000),
            ]),
            event.recipes.create_new_age.energising(
              'minecraft:amethyst_block',
              'minecraft:amethyst_block',
              20000
            ),
          ]
        )
        .transitionalItem('minecraft:amethyst_block')
        .loops(1)
        .id(id('sequenced_assembly/budding_amethyst_from_amethyst_block'));

      [
        ['minecraft:small_amethyst_bud', 'minecraft:amethyst_shard'],
        ['minecraft:medium_amethyst_bud', 'minecraft:small_amethyst_bud'],
        ['minecraft:large_amethyst_bud', 'minecraft:medium_amethyst_bud'],
        ['minecraft:amethyst_cluster', 'minecraft:large_amethyst_bud'],
      ].forEach(([result, input]) => {
        event.recipes.create
          .sequenced_assembly(result, input, [
            event.recipes.create.filling(input, [
              input,
              Fluid.of('createdelightcore:spent_liquor', 50),
            ]),
          ])
          .transitionalItem(input)
          .loops(4)
          .id(id(`filling/${result.split(':')[1]}`));
      });
    }

    event.recipes.create
      .compacting(Fluid.of('createdelightcore:unrefined_sugar', 500), [
        'minecraft:sugar_cane',
        Fluid.water(250),
      ])
      .id(id('compacting/unrefined_sugar_from_sugar_cane'));

    event.recipes.create
      .compacting(Fluid.of('createdelightcore:unrefined_sugar', 500), [
        '2x minecraft:beetroot',
        Fluid.water(250),
      ])
      .id(id('compacting/unrefined_sugar_from_beetroot'));

    event.recipes.create
      .compacting(Fluid.of('createdelightcore:unrefined_sugar', 500), [
        '3x alexscaves:licoroot_vine',
        Fluid.water(250),
      ])
      .id(id('compacting/unrefined_sugar_from_licoroot_vine'));

    event.recipes.vintageimprovements
      .pressurizing(
        [Fluid.of('createdelightcore:base_syrup', 100), Fluid.water(100)],
        Fluid.of('createdelightcore:unrefined_sugar', 200)
      )
      .secondaryFluidOutput(1)
      .heated()
      .id(id('pressurizing/melted_sugar'));

    event.recipes.vintageimprovements
      .vacuumizing('minecraft:blaze_rod', [
        'minecraft:blaze_powder',
        'minecraft:blaze_powder',
        'minecraft:blaze_powder',
        'minecraft:blaze_powder',
        'minecraft:stick',
      ])
      .id(id('vacuumizing/blaze_rod'));

    event.recipes.create
      .filling('minecraft:golden_apple', [
        'minecraft:apple',
        Fluid.of('createmetallurgy:molten_gold', 450),
      ])
      .id(id('filling/golden_apple'));

    event.recipes.create
      .filling('minecraft:golden_carrot', [
        'minecraft:carrot',
        Fluid.of('createmetallurgy:molten_gold', 30),
      ])
      .id(id('filling/golden_carrot'));

    if (global.hasMod('createmetallurgy')) {
      event.recipes.createmetallurgy
        .casting_in_basin(
          'cratedelight:golden_carrot_crate',
          ['farmersdelight:carrot_crate', Fluid.of('createmetallurgy:molten_gold', 450)],
          100,
          true
        )
        .id(id('casting_in_basin/golden_carrot_crate'));
    }

    event.recipes.kubejs
      .shapeless('9x createdelightcore:andesite_alloy_nugget', 'create:andesite_alloy')
      .id(id('crafting/andesite_alloy_nugget_from_andesite_alloy'));
    event.recipes.kubejs
      .shapeless('create:andesite_alloy', '9x createdelightcore:andesite_alloy_nugget')
      .id(id('crafting/andesite_alloy_from_nuggets'));

    event.recipes.kubejs
      .shapeless('createdelightcore:bronze_block', '9x createdelightcore:bronze_ingot')
      .id(id('crafting/bronze_block_from_ingots'));
    event.recipes.kubejs
      .shapeless('9x createdelightcore:bronze_ingot', 'createdelightcore:bronze_block')
      .id(id('crafting/bronze_ingots_from_block'));
    event.recipes.kubejs
      .shapeless('9x createdelightcore:bronze_nugget', 'createdelightcore:bronze_ingot')
      .id(id('crafting/bronze_nuggets_from_ingot'));
    event.recipes.kubejs
      .shapeless('createdelightcore:bronze_ingot', '9x createdelightcore:bronze_nugget')
      .id(id('crafting/bronze_ingot_from_nuggets'));

    event.recipes.kubejs
      .shapeless('createdelightcore:tin_block', '9x createdelightcore:tin_ingot')
      .id(id('crafting/tin_block_from_ingots'));
    event.recipes.kubejs
      .shapeless('9x createdelightcore:tin_ingot', 'createdelightcore:tin_block')
      .id(id('crafting/tin_ingots_from_block'));
    event.recipes.kubejs
      .shapeless('9x createdelightcore:tin_nugget', 'createdelightcore:tin_ingot')
      .id(id('crafting/tin_nuggets_from_ingot'));
    event.recipes.kubejs
      .shapeless('createdelightcore:tin_ingot', '9x createdelightcore:tin_nugget')
      .id(id('crafting/tin_ingot_from_nuggets'));
    event.recipes.kubejs
      .shapeless('createdelightcore:raw_tin_block', '9x createdelightcore:raw_tin')
      .id(id('crafting/raw_tin_block_from_raw_tin'));
    event.recipes.kubejs
      .shapeless('9x createdelightcore:raw_tin', 'createdelightcore:raw_tin_block')
      .id(id('crafting/raw_tin_from_block'));
    event.recipes.minecraft
      .blasting(Item.of('createdelightcore:tin_ingot'), 'createdelightcore:raw_tin')
      .id(id('blasting/tin_ingot_from_raw_tin'));
    event.recipes.minecraft
      .smelting(Item.of('createdelightcore:tin_ingot'), 'createdelightcore:raw_tin')
      .id(id('smelting/tin_ingot_from_raw_tin'));
    event.recipes.minecraft
      .blasting(Item.of('createdelightcore:tin_block'), 'createdelightcore:raw_tin_block')
      .id(id('blasting/tin_block_from_raw_tin_block'));
    event.recipes.minecraft
      .smelting(Item.of('createdelightcore:tin_block'), 'createdelightcore:raw_tin_block')
      .id(id('smelting/tin_block_from_raw_tin_block'));

    event.recipes.create
      .crushing(
        [
          'create:crushed_raw_tin',
          CreateItem.of('create:crushed_raw_tin', 0.75),
          CreateItem.of('create:experience_nugget', 0.75),
        ],
        'createdelightcore:deepslate_tin_ore'
      )
      .id(id('crushing/deepslate_tin_ore'));

    event.recipes.create
      .filling('createdelightcore:fuel_hotcream', [
        'mynethersdelight:powder_cannon',
        Fluid.of('createdelightcore:fuel_mixtures', 50),
      ])
      .id(id('filling/fuel_hotcream'));

    event.recipes.createmetallurgy
      .grinding('createdelightcore:needle', Ingredient.of('#c:rods/iron'))
      .id(id('grinding/needle'));

    if (global.hasAllMods(['ratatouille', 'refurbished_furniture'])) {
      [
        'quark:tweaks/crafting/utility/bent/cookie',
        'minecraft:cookie',
        'create_central_kitchen:compacting/cookie',
        'fruitsdelight:persimmon_cookie',
        'fruitsdelight:lemon_cookie',
        'fruitsdelight:cranberry_cookie',
        'fruitsdelight:bayberry_cookie',
        'farmersdelight:honey_cookie',
        'create_central_kitchen:compacting/honey_cookie',
        'farmersdelight:sweet_berry_cookie',
        'create_central_kitchen:compacting/sweet_berry_cookie',
        'minersdelight:bat_cookie',
        'ends_delight:food/chorus_cookie',
      ].forEach(removeIfPresent);

      [
        [
          'oatmeal_cookie_dough',
          '4x createdelightcore:oatmeal_cookie_dough',
          [
            'vintagedelight:raw_oats',
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'vintagedelight:oatmeal_cookie',
        ],
        [
          'chocolate_cookie_dough',
          '4x createdelightcore:chocolate_cookie_dough',
          [
            Ingredient.of('#c:bars/chocolate'),
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'minecraft:cookie',
        ],
        [
          'persimmon_cookie_dough',
          '4x createdelightcore:persimmon_cookie_dough',
          [
            'fruitsdelight:dried_persimmon',
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'fruitsdelight:persimmon_cookie',
        ],
        [
          'lemon_cookie_dough',
          '4x createdelightcore:lemon_cookie_dough',
          [
            'fruitsdelight:lemon_slice',
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'fruitsdelight:lemon_cookie',
        ],
        [
          'cranberry_cookie_dough',
          '4x createdelightcore:cranberry_cookie_dough',
          [
            'fruitsdelight:cranberry',
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'fruitsdelight:cranberry_cookie',
        ],
        [
          'bayberry_cookie_dough',
          '4x createdelightcore:bayberry_cookie_dough',
          [
            'fruitsdelight:bayberry',
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'fruitsdelight:bayberry_cookie',
        ],
        [
          'sweet_berry_cookie_dough',
          '4x createdelightcore:sweet_berry_cookie_dough',
          [
            'minecraft:sweet_berries',
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'farmersdelight:sweet_berry_cookie',
        ],
        [
          'honey_cookie_dough',
          '4x createdelightcore:honey_cookie_dough',
          [
            'minecraft:honeycomb',
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'farmersdelight:honey_cookie',
        ],
        [
          'lime_cookie_dough',
          '4x createdelightcore:lime_cookie_dough',
          [
            'collectorsreap:lime_slice',
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'collectorsreap:lime_cookie',
        ],
        [
          'chorus_cookie_dough',
          '4x createdelightcore:chorus_cookie_dough',
          [
            'ends_delight:chorus_fruit_grain',
            'createdelightcore:butter',
            Fluid.of('createdelightcore:cake_batter', 100),
          ],
          'ends_delight:chorus_cookie',
        ],
      ].forEach(([path, result, ingredients, cookie]) => {
        event.recipes.create.mixing(result, ingredients).id(id(`mixing/${path}`));
        event.recipes.ratatouille
          .baking(Item.of(cookie, 4), itemId(result))
          .processingTime(100)
          .id(id(`baking/${cookie.split(':')[1]}`));
        event
          .custom({
            type: 'refurbished_furniture:oven_baking',
            category: 'food',
            ingredient: { item: itemId(result) },
            result: {
              count: 4,
              id: cookie,
            },
            time: 100,
          })
          .id(id(`oven_baking/${cookie.split(':')[1]}`));
      });

      event.recipes.create
        .filling('createdelightcore:bat_cookie_dough', [
          Ingredient.of('#c:foods/bat_wing'),
          Fluid.of('createdelightcore:cake_batter', 100),
        ])
        .id(id('filling/bat_cookie_dough'));
      event.recipes.ratatouille
        .baking('minersdelight:bat_cookie', 'createdelightcore:bat_cookie_dough')
        .processingTime(100)
        .id(id('baking/bat_cookie'));
      event
        .custom({
          type: 'refurbished_furniture:oven_baking',
          category: 'food',
          ingredient: { item: 'createdelightcore:bat_cookie_dough' },
          result: {
            count: 1,
            id: 'minersdelight:bat_cookie',
          },
          time: 100,
        })
        .id(id('oven_baking/bat_cookie'));

      [
        [
          'cranberry_muffin',
          'createdelightcore:unbaked_cranberry_muffin',
          'fruitsdelight:cranberry_muffin',
          ['bakeries:paper_cup_cake_paste', 'fruitsdelight:cranberry'],
          'fruitsdelight:cooking/cranberry_muffin',
        ],
        [
          'blueberry_muffin',
          'createdelightcore:unbaked_blueberry_muffin',
          'fruitsdelight:blueberry_muffin',
          ['bakeries:paper_cup_cake_paste', 'fruitsdelight:blueberry'],
          'fruitsdelight:cooking/blueberry_muffin',
        ],
        [
          'monster_muffin',
          'createdelightcore:unbaked_monster_muffin',
          'dungeonsdelight:monster_muffin',
          [
            'bakeries:paper_cup_cake_paste',
            'dungeonsdelight:spider_extract',
            'dungeonsdelight:rotbulb',
          ],
          'dungeonsdelight:monster_cooking/misc/monster_muffin',
        ],
      ].forEach(([path, unbaked, muffin, ingredients, recipeId]) => {
        removeIfPresent(recipeId);

        if (ingredients.length === 2) {
          event.recipes.create.deploying(unbaked, ingredients).id(id(`deploying/${path}`));
        } else {
          event.recipes.create
            .sequenced_assembly(unbaked, ingredients[0], [
              event.recipes.create.deploying(ingredients[0], [ingredients[0], ingredients[1]]),
              event.recipes.create.deploying(ingredients[0], [ingredients[0], ingredients[2]]),
            ])
            .loops(1)
            .transitionalItem(ingredients[0])
            .id(id(`sequenced_assembly/${path}`));
        }

        event.recipes.ratatouille
          .baking(muffin, unbaked)
          .processingTime(100)
          .id(id(`baking/${path}`));
      });
    }

    if (global.hasAllMods(['vintagedelight', 'northstar', 'farmersdelight'])) {
      event.recipes.kubejs
        .shapeless('createdelightcore:phantom_compost', [
          '2x vintagedelight:organic_mash',
          'northstar:moon_sand',
          'northstar:raw_glowstone_ore',
          Ingredient.of(['northstar:raw_glowstone_ore', 'farmersdelight:straw']),
          '4x minecraft:bone_meal',
        ])
        .id(id('crafting/phantom_compost_from_organic_mash'));
    }

    if (global.hasMod('northstar')) {
      event.recipes.kubejs
        .shapeless('createdelightcore:phantom_compost', [
          'northstar:moon_sand',
          '2x minecraft:rotten_flesh',
          '2x northstar:raw_glowstone_ore',
          '4x minecraft:bone_meal',
        ])
        .id(id('crafting/phantom_compost'));
    }

    if (global.hasAllMods(['vintagedelight', 'northstar', 'netherexp'])) {
      event.recipes.vintagedelight
        .fermenting('createdelightcore:luna_soil', [
          'createdelightcore:phantom_compost',
          'northstar:enriched_glowstone_ore',
          Fluid.of('netherexp:ectoplasm', 100),
        ])
        .processingTime(600)
        .id(id('fermenting/luna_soil'));
    }

    if (global.hasAllMods(['lightmanscurrency'])) {
      event.recipes.kubejs
        .shaped('createdelightcore:quality_absorber', ['ABA', 'ACA', 'AAA'], {
          A: Ingredient.of('#c:plates/bronze'),
          B: 'lightmanscurrency:trading_core',
          C: 'create:rose_quartz',
        })
        .id(id('crafting/quality_absorber'));
    }

    if (global.hasMod('create')) {
      event.recipes.kubejs
        .shapeless('createdelightcore:oil_dough', [Ingredient.of('#c:animal_oil'), 'create:dough'])
        .id(id('crafting/oil_dough'));

      event.recipes.create
        .sequenced_assembly('4x createdelightcore:puff_pastry', 'createdelightcore:oil_dough', [
          event.recipes.create.deploying('createdelightcore:oil_dough_with_butter', [
            'createdelightcore:oil_dough_with_butter',
            'createdelightcore:butter',
          ]),
          event.recipes.create.pressing(
            'createdelightcore:oil_dough_with_butter',
            'createdelightcore:oil_dough_with_butter'
          ),
          event.recipes.create.deploying('createdelightcore:oil_dough_with_butter', [
            'createdelightcore:oil_dough_with_butter',
            'createdelightcore:butter',
          ]),
          event.recipes.create.pressing(
            'createdelightcore:oil_dough_with_butter',
            'createdelightcore:oil_dough_with_butter'
          ),
          event.recipes.create.cutting(
            'createdelightcore:oil_dough_with_butter',
            'createdelightcore:oil_dough_with_butter'
          ),
        ])
        .transitionalItem('createdelightcore:oil_dough_with_butter')
        .loops(1)
        .id(id('sequenced_assembly/puff_pastry'));
    }

    if (global.hasMod('farmersdelight')) {
      event.recipes.kubejs
        .shapeless('createdelightcore:empty_riceball', 'farmersdelight:cooked_rice')
        .replaceIngredient({ item: 'farmersdelight:cooked_rice' }, 'minecraft:bowl')
        .id(id('crafting/empty_riceball_from_cooked_rice'));

      event.recipes.kubejs
        .shapeless('farmersdelight:cooked_rice', [
          'createdelightcore:empty_riceball',
          'minecraft:bowl',
        ])
        .id(id('crafting/cooked_rice_from_empty_riceball'));

      event.recipes.minecraft
        .smoking(Item.of('createdelightcore:empty_riceball'), 'farmersdelight:rice')
        .id(id('smoking/empty_riceball_from_rice'));

      if (global.hasMod('create')) {
        [
          ['culturaldelights:midori_roll', 'culturaldelights:midori_roll_slice'],
          ['culturaldelights:chicken_roll', 'culturaldelights:chicken_roll_slice'],
          ['farmersdelight:kelp_roll', 'farmersdelight:kelp_roll_slice'],
          [
            'silentsdelight:sculk_sensor_tendril_roll',
            'silentsdelight:sculk_sensor_tendril_roll_slice',
          ],
          ['youkaishomecoming:tekka_maki', 'youkaishomecoming:tekka_maki_slice'],
          ['youkaishomecoming:kappa_maki', 'youkaishomecoming:kappa_maki_slice'],
          ['youkaishomecoming:shinnko_maki', 'youkaishomecoming:shinnko_maki_slice'],
          ['youkaishomecoming:salmon_futomaki', 'youkaishomecoming:salmon_futomaki_slice'],
          ['youkaishomecoming:egg_futomaki', 'youkaishomecoming:egg_futomaki_slice'],
          ['youkaishomecoming:rainbow_futomaki', 'youkaishomecoming:rainbow_futomaki_slice'],
          ['alexscaves:deep_sea_sushi_roll', 'createdelightcore:deep_sea_sushi_roll_slice'],
          ['youkaishomecoming:california_roll', 'youkaishomecoming:california_roll_slice'],
          ['youkaishomecoming:volcano_roll', 'youkaishomecoming:volcano_roll_slice'],
          ['youkaishomecoming:roe_california_roll', 'youkaishomecoming:roe_california_roll_slice'],
          ['youkaishomecoming:salmon_lover_roll', 'youkaishomecoming:salmon_lover_roll_slice'],
          ['youkaishomecoming:rainbow_roll', 'youkaishomecoming:rainbow_roll_slice'],
        ].forEach(([input, output]) => {
          event.recipes.create
            .cutting(Item.of(output, 3), input)
            .id(id(`cutting/${output.split(':')[1]}_roll`));
        });

        [
          ['crabbersdelight:pufferfish_slice', '2x culturaldelights:pufferfish_roll'],
          ['crabbersdelight:cooked_pufferfish_slice', '2x createdelightcore:fugu_roll'],
          ['farmersdelight:salmon_slice', '2x farmersdelight:salmon_roll'],
          ['farmersdelight:cod_slice', '2x farmersdelight:cod_roll'],
          ['youkaishomecoming:otoro', '2x youkaishomecoming:otoro_nigiri'],
          ['alexscaves:radgill', '2x createdelightcore:radgill_sushi'],
        ].forEach(([input, output]) => {
          event.recipes.create
            .deploying(output, ['createdelightcore:empty_riceball', input])
            .id(id(`deploying/sushi/${itemId(output).split(':')[1]}`));
        });

        event.recipes.create
          .deploying('2x culturaldelights:tropical_roll', [
            'createdelightcore:empty_riceball',
            Ingredient.of('#c:tropical'),
          ])
          .id(id('deploying/sushi/tropical_roll'));

        event.recipes.create
          .deploying('2x collectorsreap:clam_roll', [
            'createdelightcore:empty_riceball',
            Ingredient.of('#c:foods/raw_clam'),
          ])
          .id(id('deploying/sushi/clam_roll'));

        [
          ['collectorsreap:uni', '2x collectorsreap:uni_roll'],
          ['minecraft:seagrass', '2x youkaishomecoming:seagrass_gunkan'],
          ['youkaishomecoming:nattou', '2x youkaishomecoming:nattou_gunkan'],
        ].forEach(([input, output]) => {
          event.recipes.create
            .sequenced_assembly(output, 'createdelightcore:empty_riceball', [
              event.recipes.create.deploying('createdelightcore:incomplete_gunkan', [
                'createdelightcore:incomplete_gunkan',
                input,
              ]),
              event.recipes.create.deploying('createdelightcore:incomplete_gunkan', [
                'createdelightcore:incomplete_gunkan',
                'minecraft:dried_kelp',
              ]),
            ])
            .transitionalItem('createdelightcore:incomplete_gunkan')
            .loops(1)
            .id(id(`sequenced_assembly/gunkan/${itemId(output).split(':')[1]}`));
        });

        [
          ['youkaishomecoming:kabayaki', '2x youkaishomecoming:lorelei_nigiri'],
          ['youkaishomecoming:tamagoyaki', '2x youkaishomecoming:egg_nigiri'],
          ['youkaishomecoming:flesh', '2x youkaishomecoming:flesh_roll'],
        ].forEach(([input, output]) => {
          event.recipes.create
            .sequenced_assembly(output, 'createdelightcore:empty_riceball', [
              event.recipes.create.deploying('createdelightcore:incomplete_nigiri', [
                'createdelightcore:incomplete_nigiri',
                input,
              ]),
              event.recipes.create.deploying('createdelightcore:incomplete_nigiri', [
                'createdelightcore:incomplete_nigiri',
                'minecraft:dried_kelp',
              ]),
            ])
            .transitionalItem('createdelightcore:incomplete_nigiri')
            .loops(1)
            .id(id(`sequenced_assembly/nigiri/${itemId(output).split(':')[1]}`));
        });

        let createdelightcoreSushiIngredient = function (ingredient) {
          if (ingredient.startsWith('#')) {
            return { tag: ingredient.slice(1) };
          }

          return { item: ingredient };
        };
        let createdelightcoreSushiDeployingStep = function (incomplete, ingredient) {
          return {
            type: 'create:deploying',
            ingredients: [{ item: incomplete }, createdelightcoreSushiIngredient(ingredient)],
            results: [{ id: incomplete }],
          };
        };
        let createdelightcoreSushiFillingStep = function (incomplete, fluid, amount) {
          return {
            type: 'create:filling',
            ingredients: [
              { item: incomplete },
              {
                type: 'neoforge:single',
                fluid: fluid,
                amount: amount,
              },
            ],
            results: [{ id: incomplete }],
          };
        };
        let createdelightcoreSushiSequencedAssembly = function (
          output,
          input,
          incomplete,
          sequence,
          path
        ) {
          const outputId = itemId(output);
          const outputCountMatch = String(output).match(/^(\d+)x /);
          const outputCount = outputCountMatch ? Number(outputCountMatch[1]) : 1;

          if (
            !sequence.every((step) => {
              if (step.type === 'create:filling') {
                return global.fluidExists(step.ingredients[1].fluid);
              }

              const ingredient = step.ingredients[1];
              return true;
            })
          ) {
            return;
          }

          event
            .custom({
              type: 'create:sequenced_assembly',
              ingredient: { item: input },
              transitional_item: { id: incomplete },
              sequence: sequence,
              results: [{ id: outputId, count: outputCount }],
              loops: 1,
            })
            .id(id(`sequenced_assembly/sushi/${path}`));
        };

        [
          ['farmersdelight:kelp_roll', 'minecraft:carrot'],
          ['silentsdelight:sculk_sensor_tendril_roll', 'silentsdelight:sculk_sensor_tendril'],
          ['youkaishomecoming:tekka_maki', 'youkaishomecoming:raw_tuna_slice'],
          ['youkaishomecoming:kappa_maki', 'youkaishomecoming:cucumber_slice'],
          ['youkaishomecoming:shinnko_maki', 'minecraft:beetroot'],
        ].forEach(([output, ingredient]) => {
          createdelightcoreSushiSequencedAssembly(
            output,
            'minecraft:dried_kelp',
            'createdelightcore:incomplete_hosomaki',
            [
              createdelightcoreSushiDeployingStep(
                'createdelightcore:incomplete_hosomaki',
                ingredient
              ),
              createdelightcoreSushiFillingStep(
                'createdelightcore:incomplete_hosomaki',
                'youkaishomecoming:soy_sauce',
                250
              ),
              createdelightcoreSushiDeployingStep(
                'createdelightcore:incomplete_hosomaki',
                'createdelightcore:empty_riceball'
              ),
            ],
            `hosomaki/${output.split(':')[1]}`
          );
        });

        [
          [
            'culturaldelights:midori_roll',
            [
              'culturaldelights:cut_avocado',
              'culturaldelights:cut_avocado',
              'youkaishomecoming:cucumber_slice',
              'youkaishomecoming:cucumber_slice',
            ],
          ],
          [
            'culturaldelights:chicken_roll',
            [
              'minecraft:cooked_chicken',
              'minecraft:cooked_chicken',
              'minecraft:carrot',
              'minecraft:beetroot',
            ],
          ],
          [
            'youkaishomecoming:salmon_futomaki',
            [
              'farmersdelight:salmon_slice',
              'youkaishomecoming:imitation_crab',
              'minecraft:carrot',
              'youkaishomecoming:cucumber_slice',
            ],
          ],
          [
            'youkaishomecoming:egg_futomaki',
            [
              'youkaishomecoming:tamagoyaki_slice',
              'youkaishomecoming:tamagoyaki_slice',
              'youkaishomecoming:tamagoyaki_slice',
            ],
          ],
          [
            'youkaishomecoming:rainbow_futomaki',
            [
              'youkaishomecoming:imitation_crab',
              'farmersdelight:salmon_slice',
              'minecraft:carrot',
              'youkaishomecoming:tamagoyaki_slice',
              'youkaishomecoming:cucumber_slice',
            ],
          ],
          [
            'alexscaves:deep_sea_sushi_roll',
            [
              'alexscaves:tripodfish',
              'alexscaves:sea_pig',
              'alexscaves:lanternfish',
              'youkaishomecoming:cucumber_slice',
            ],
          ],
        ].forEach(([output, ingredients]) => {
          createdelightcoreSushiSequencedAssembly(
            output,
            'minecraft:dried_kelp',
            'createdelightcore:incomplete_futomaki',
            ingredients
              .map((ingredient) =>
                createdelightcoreSushiDeployingStep(
                  'createdelightcore:incomplete_futomaki',
                  ingredient
                )
              )
              .concat([
                createdelightcoreSushiFillingStep(
                  'createdelightcore:incomplete_futomaki',
                  'youkaishomecoming:soy_sauce',
                  250
                ),
                createdelightcoreSushiDeployingStep(
                  'createdelightcore:incomplete_futomaki',
                  'createdelightcore:empty_riceball'
                ),
                createdelightcoreSushiDeployingStep(
                  'createdelightcore:incomplete_futomaki',
                  'createdelightcore:empty_riceball'
                ),
              ]),
            `futomaki/${output.split(':')[1]}`
          );
        });

        createdelightcoreSushiSequencedAssembly(
          'youkaishomecoming:california_roll',
          'createdelightcore:empty_riceball',
          'createdelightcore:incomplete_california',
          [
            createdelightcoreSushiDeployingStep(
              'createdelightcore:incomplete_california',
              'createdelightcore:empty_riceball'
            ),
            createdelightcoreSushiDeployingStep(
              'createdelightcore:incomplete_california',
              'minecraft:dried_kelp'
            ),
            createdelightcoreSushiFillingStep(
              'createdelightcore:incomplete_california',
              'create_bic_bit:mayonnaise',
              250
            ),
            createdelightcoreSushiDeployingStep(
              'createdelightcore:incomplete_california',
              'youkaishomecoming:imitation_crab'
            ),
            createdelightcoreSushiDeployingStep(
              'createdelightcore:incomplete_california',
              'youkaishomecoming:tamagoyaki_slice'
            ),
            createdelightcoreSushiDeployingStep(
              'createdelightcore:incomplete_california',
              'youkaishomecoming:cucumber_slice'
            ),
          ],
          'california_roll'
        );

        createdelightcoreSushiSequencedAssembly(
          'youkaishomecoming:volcano_roll',
          'youkaishomecoming:california_roll',
          'youkaishomecoming:california_roll',
          [
            createdelightcoreSushiFillingStep(
              'youkaishomecoming:california_roll',
              'youkaishomecoming:soy_sauce',
              250
            ),
            createdelightcoreSushiDeployingStep(
              'youkaishomecoming:california_roll',
              'youkaishomecoming:raw_tuna_slice'
            ),
            createdelightcoreSushiDeployingStep(
              'youkaishomecoming:california_roll',
              'youkaishomecoming:otoro'
            ),
            createdelightcoreSushiDeployingStep(
              'youkaishomecoming:california_roll',
              'youkaishomecoming:raw_tuna_slice'
            ),
          ],
          'volcano_roll'
        );

        let createdelightcoreOceanicRoeItems = [
          'oceanic_delight:salmon_eggs',
          'oceanic_delight:ancient_fish_eggs',
        ].filter((item) => true);
        if (createdelightcoreOceanicRoeItems.length > 0) {
          createdelightcoreSushiSequencedAssembly(
            '2x youkaishomecoming:tobiko_gunkan',
            'createdelightcore:empty_riceball',
            'createdelightcore:incomplete_gunkan',
            [
              createdelightcoreSushiDeployingStep('createdelightcore:incomplete_gunkan', '#c:roe'),
              createdelightcoreSushiDeployingStep(
                'createdelightcore:incomplete_gunkan',
                'minecraft:dried_kelp'
              ),
            ],
            'gunkan/tobiko_gunkan'
          );

          event
            .custom({
              type: 'create:deploying',
              ingredients: [{ item: 'youkaishomecoming:california_roll' }, { tag: 'c:roe' }],
              results: [{ id: 'youkaishomecoming:roe_california_roll' }],
            })
            .id(id('deploying/roe_california_roll'));

          createdelightcoreSushiSequencedAssembly(
            'youkaishomecoming:rainbow_roll',
            'youkaishomecoming:roe_california_roll',
            'youkaishomecoming:roe_california_roll',
            [
              createdelightcoreSushiDeployingStep(
                'youkaishomecoming:roe_california_roll',
                'farmersdelight:salmon_slice'
              ),
              createdelightcoreSushiDeployingStep(
                'youkaishomecoming:roe_california_roll',
                'farmersdelight:cod_slice'
              ),
              createdelightcoreSushiDeployingStep(
                'youkaishomecoming:roe_california_roll',
                'youkaishomecoming:raw_tuna_slice'
              ),
            ],
            'rainbow_roll'
          );

          createdelightcoreSushiSequencedAssembly(
            'youkaishomecoming:salmon_lover_roll',
            'youkaishomecoming:roe_california_roll',
            'youkaishomecoming:roe_california_roll',
            [
              createdelightcoreSushiDeployingStep(
                'youkaishomecoming:roe_california_roll',
                'farmersdelight:salmon_slice'
              ),
              createdelightcoreSushiDeployingStep(
                'youkaishomecoming:roe_california_roll',
                'farmersdelight:salmon_slice'
              ),
              createdelightcoreSushiDeployingStep(
                'youkaishomecoming:roe_california_roll',
                'farmersdelight:salmon_slice'
              ),
            ],
            'salmon_lover_roll'
          );
        }
      }
    }

    if (global.hasAllMods(['create', 'ratatouille'])) {
      [
        ['mynethersdelight:tear_popsicle', 'minecraft:ghast_tear', 'tear_popsicle'],
        ['youkaishomecoming:big_popsicle', 'youkaishomecoming:ice_cube', 'big_popsicle'],
      ].forEach(([popsicle, ingredient, path]) => {
        const filled = `createdelightcore:${path}_mold_filled`;
        const solid = `createdelightcore:${path}_mold_solid`;

        event.recipes.create
          .sequenced_assembly(filled, 'ratatouille:popsicle_mold', [
            event.recipes.create.deploying('ratatouille:popsicle_mold', [
              'ratatouille:popsicle_mold',
              ingredient,
            ]),
            event.recipes.create.deploying('ratatouille:popsicle_mold', [
              'ratatouille:popsicle_mold',
              'minecraft:stick',
            ]),
          ])
          .loops(1)
          .transitionalItem('ratatouille:popsicle_mold')
          .id(id(`sequenced_assembly/${path}_mold_filled`));

        event.recipes.ratatouille.freezing(solid, filled).id(id(`freezing/${path}_mold_filled`));

        event.recipes.ratatouille
          .demolding([popsicle, 'ratatouille:popsicle_mold'], solid)
          .id(id(`demolding/${path}`));
      });
    }

    if (global.hasAllMods(['farmersdelight', 'casualnessdelight', 'create_bic_bit'])) {
      event.recipes.farmersdelight
        .cutting('casualnessdelight:potato_slice', '#c:tools/knife', [
          { id: 'create_bic_bit:raw_fries' },
        ])
        .id(id('cutting/raw_fries_from_potato_slice'));

      if (global.hasMod('cosmopolitan')) {
        removeIfPresent('casualnessdelight:cutting/potato_slice');

        event.recipes.farmersdelight
          .cutting('minecraft:potato', '#c:tools/knife', [{ id: 'cosmopolitan:cut_potatoes' }])
          .id(id('cutting/cut_potatoes'));

        event.recipes.farmersdelight
          .cutting('cosmopolitan:cut_potatoes', '#c:tools/knife', [
            { id: 'casualnessdelight:potato_slice' },
          ])
          .id(id('cutting/potato_slice_from_cut_potatoes'));
      }
    }

    if (global.hasAllMods(['farmersdelight', 'iceandfire'])) {
      [
        ['fire_lily_cluster', 'fire_lily'],
        ['frost_lily_cluster', 'frost_lily'],
        ['lightning_lily_cluster', 'lightning_lily'],
      ].forEach(([cluster, flower]) => {
        event.recipes.farmersdelight
          .cutting(`createdelightcore:${cluster}`, '#c:tools/knife', [
            { id: `iceandfire:${flower}`, count: 4 },
          ])
          .id(id(`cutting/${cluster}`));
      });
    }

    if (global.hasAllMods(['northstar', 'netherexp'])) {
      event.recipes.vintageimprovements
        .pressurizing(Fluid.of('createdelightcore:cryo_fuel', 100), [
          Fluid.of('northstar:hydrogen', 250),
          Fluid.of('netherexp:ectoplasm', 250),
        ])
        .secondaryFluidInput(0)
        .id(id('pressurizing/cryo_fuel'));
    }

    if (global.hasAllMods(['ratatouille', 'bakeries', 'farmersdelight'])) {
      event.replaceInput(
        { id: 'mynethersdelight:cooking/spicy_noodle_soup' },
        'mynethersdelight:ghasta',
        'createdelightcore:vermicelli'
      );

      event.recipes.ratatouille
        .squeezing('createdelightcore:vermicelli', 'bakeries:whole_wheat_dough')
        .id(id('squeezing/vermicelli'));

      event.recipes.farmersdelight
        .cooking(
          'meals',
          [
            'minecraft:carrot',
            'minecraft:brown_mushroom',
            'createdelightcore:vermicelli',
            Ingredient.of('#c:salad_ingredients'),
            Ingredient.of('#c:vegetables'),
          ],
          'farmersdelight:vegetable_noodles',
          1.0,
          200,
          'minecraft:bowl'
        )
        .id(id('cooking/vegetable_noodles'));

      event.recipes.farmersdelight
        .cooking(
          'meals',
          [
            'createdelightcore:vermicelli',
            Ingredient.of('#c:foods/cooked_egg'),
            'minecraft:dried_kelp',
            Ingredient.of('#c:foods/raw_pork'),
          ],
          'farmersdelight:noodle_soup',
          1.0,
          200,
          'minecraft:bowl'
        )
        .id(id('cooking/noodle_soup'));

      event.recipes.create
        .sequenced_assembly('4x createdelightcore:board_noodles', 'bakeries:whole_wheat_dough', [
          event.recipes.create.pressing('bakeries:whole_wheat_dough', 'bakeries:whole_wheat_dough'),
          event.recipes.create.cutting('bakeries:whole_wheat_dough', 'bakeries:whole_wheat_dough'),
        ])
        .transitionalItem('bakeries:whole_wheat_dough')
        .loops(2)
        .id(id('sequenced_assembly/board_noodles'));

      event.recipes.farmersdelight
        .cutting('bakeries:whole_wheat_dough', '#c:tools/knife', [
          { id: 'createdelightcore:board_noodles' },
        ])
        .id(id('cutting/board_noodles'));

      if (global.hasAllMods(['butchercraft', 'casualnessdelight'])) {
        event.recipes.farmersdelight
          .cooking(
            'meals',
            [
              'butchercraft:cubed_beef',
              'butchercraft:cubed_beef',
              'createdelightcore:board_noodles',
              Ingredient.of('#c:vegetables/carrot'),
              Ingredient.of('#c:vegetables/cabbage'),
              Ingredient.of('#c:vegetables/onion'),
            ],
            'casualnessdelight:beef_noodles',
            1.0,
            200,
            'minecraft:bowl'
          )
          .id(id('cooking/beef_noodles'));
      }
    }

    if (global.hasMod('createdieselgenerators')) {
      event.replaceInput({ id: 'minecraft:paper' }, 'minecraft:sugar_cane', 'minecraft:bamboo');
      event.recipes.create
        .mixing(Fluid.of('createdelightcore:unfermented_paper_pulp', 1000), [
          'minecraft:bamboo',
          Fluid.water(1000),
        ])
        .heated()
        .id(id('mixing/unfermented_paper_pulp_from_bamboo'));
      event.recipes.create
        .mixing(Fluid.of('createdelightcore:unfermented_paper_pulp', 500), [
          Ingredient.of('#c:papers_raw_material'),
          Fluid.water(500),
        ])
        .id(id('mixing/unfermented_paper_pulp_from_raw_material'));
      event.recipes.createdieselgenerators
        .basin_fermenting(
          Fluid.of('createdelightcore:paper_pulp', 1000),
          Fluid.of('createdelightcore:unfermented_paper_pulp', 1000)
        )
        .processingTime(200)
        .id(id('basin_fermenting/paper_pulp'));
      event.recipes.createdieselgenerators
        .bulk_fermenting(
          Fluid.of('createdelightcore:paper_pulp', 1000),
          Fluid.of('createdelightcore:unfermented_paper_pulp', 1000)
        )
        .processingTime(100)
        .id(id('bulk_fermenting/paper_pulp'));

      event.recipes.vintageimprovements
        .vacuumizing(
          ['createdelightcore:incomplete_paper', Fluid.water(50)],
          Fluid.of('createdelightcore:paper_pulp', 50)
        )
        .secondaryFluidOutput(0)
        .heated()
        .id(id('vacuumizing/incomplete_paper'));
      event.recipes.create
        .pressing('minecraft:paper', 'createdelightcore:incomplete_paper')
        .id(id('pressing/paper'));
    }
  });
}
