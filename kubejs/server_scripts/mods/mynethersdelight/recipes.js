if (global.hasAllMods(['mynethersdelight', 'create', 'farmersdelight'])) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:mynethersdelight/${path}`;
    const cutting = (input, outputs, path) => {
      farmersdelight
        .cutting(
          input,
          '#c:tools/knife',
          outputs.map((output) => ({
            id: output[0],
            count: output[1] || 1,
            chance: output[2] || 1,
          }))
        )
        .id(id(`cutting/${path || input.split(':')[1]}`));
    };

    remove_recipes_id(event, [
      'mynethersdelight:boiled_egg_from_smoking',
      'mynethersdelight:boiled_egg_cooking',
      'mynethersdelight:cooking/fries_ghasta',
      'mynethersdelight:cooking/fried_hoglin_chop',
      'mynethersdelight:cooking/deviled_egg',
      'mynethersdelight:cooking/scotch_eggs',
      'mynethersdelight:toast_from_smoking',
      'mynethersdelight:toast_cooking',
      'mynethersdelight:toast_from_campfire_cooking',
      'mynethersdelight:crafting/sugar_alt',
      'mynethersdelight:crafting/nether_burger',
      'mynethersdelight:cutting/ghasmati',
      'mynethersdelight:cutting/minced_strider',
      'mynethersdelight:cooking/spicy_hoglin_stew',
      'mynethersdelight:crafting/bacon_wrapped_sausage_stick',
      'mynethersdelight:crafting/breakfast_sampler',
      'mynethersdelight:crafting/hotdog',
    ]);

    create
      .milling('minecraft:gunpowder', 'mynethersdelight:powder_cannon')
      .id(id('milling/powdery_cannon'));

    if (global.hasMod('vintagedelight')) {
      kubejs
        .shapeless('mynethersdelight:letios_compost', [
          '2x vintagedelight:organic_mash',
          Ingredient.of(['minecraft:soul_sand', 'minecraft:soul_soil']),
          Ingredient.of(['minecraft:crimson_roots', 'minecraft:warped_roots']),
          Ingredient.of([
            'minecraft:crimson_roots',
            'minecraft:warped_roots',
            'farmersdelight:straw',
          ]),
          '4x minecraft:bone_meal',
        ])
        .id(id('letios_compost_from_organic_mash'));
    }

    if (global.hasMod('netherexp')) {
      kubejs
        .shapeless('mynethersdelight:letios_compost', [
          Ingredient.of(['minecraft:soul_sand', 'minecraft:soul_soil']),
          '2x vintagedelight:organic_mash',
          '2x #netherexp:glowspores',
          '4x minecraft:bone_meal',
        ])
        .id(id('letios_compost_from_glowspores'));
      kubejs
        .shapeless('mynethersdelight:letios_compost', [
          Ingredient.of(['minecraft:soul_sand', 'minecraft:soul_soil']),
          '2x minecraft:rotten_flesh',
          '2x #netherexp:glowspores',
          '4x minecraft:bone_meal',
        ])
        .id(id('letios_compost_from_glowspores_2'));
    }

    kubejs
      .shaped('createdelightcore:wrapped_fries_ghasta', [' A ', ' B '], {
        A: 'mynethersdelight:fries_ghasta',
        B: 'minecraft:paper',
      })
      .id(id('crafting/wrapped_fries_ghasta'));

    farmersdelight
      .cooking('meals', [Ingredient.of('#c:eggs')], 'mynethersdelight:boiled_egg', 1.0, 200)
      .id(id('cooking/boiled_egg'));

    farmersdelight
      .cooking(
        'meals',
        [
          'mynethersdelight:hoglin_loin',
          Ingredient.of('#c:foods/dough'),
          Ingredient.of('#c:drinks/milk'),
          Ingredient.of('#c:eggs'),
          Ingredient.of('#mynethersdelight:hot_spice'),
        ],
        'mynethersdelight:fried_hoglin_chop',
        1.0,
        400
      )
      .id(id('cooking/fried_hoglin_chop'));

    if (global.hasMod('someassemblyrequired')) {
      kubejs
        .shapeless('mynethersdelight:nether_burger', [
          'someassemblyrequired:burger_bun',
          Ingredient.of('#c:foods/cooked_hoglin'),
          Ingredient.of('#c:vines/nether'),
          'minecraft:crimson_fungus',
          'minecraft:warped_fungus',
        ])
        .id(id('crafting/nether_burger'));
    }

    farmersdelight
      .cooking(
        'meals',
        [
          'mynethersdelight:boiled_egg',
          Ingredient.of('#mynethersdelight:hot_spice'),
          Ingredient.of('#c:foods/raw_pork'),
        ],
        '2x mynethersdelight:deviled_egg',
        1.0,
        100
      )
      .id(id('cooking/deviled_egg'));

    if (global.hasMod('create_bic_bit')) {
      farmersdelight
        .cooking(
          'meals',
          ['create_bic_bit:eggball', 'create_bic_bit:eggball', Ingredient.of('#c:foods/raw_beef')],
          'mynethersdelight:scotch_eggs',
          1.0,
          100,
          'minecraft:bowl'
        )
        .id(id('cooking/scotch_eggs'));
    }

    farmersdelight
      .cooking(
        'meals',
        [
          'mynethersdelight:ghasmati',
          Ingredient.of('#c:milk'),
          Ingredient.of('#c:eggs'),
          'minecraft:blaze_powder',
        ],
        'mynethersdelight:sizzling_pudding',
        1.0,
        100,
        'minecraft:bowl'
      )
      .id(id('cooking/sizzling_pudding'));

    farmersdelight
      .cooking(
        'meals',
        [
          Ingredient.of([
            'mynethersdelight:hoglin_loin',
            'mynethersdelight:hoglin_sausage',
            '#c:foods/cooked_sausage',
            'mynethersdelight:cooked_loin',
          ]),
          Ingredient.of('#c:crops/potato'),
          Ingredient.of('#c:crops/carrot'),
          Ingredient.of(['mynethersdelight:bullet_pepper', 'mynethersdelight:pepper_powder']),
        ],
        'mynethersdelight:spicy_hoglin_stew',
        1.0,
        200
      )
      .id(id('cooking/spicy_hoglin_stew'));

    kubejs
      .shapeless('mynethersdelight:bacon-wrapped_sausage_on_a_stick', [
        Ingredient.of('#c:foods/cooked_sausage'),
        'farmersdelight:cooked_bacon',
        'minecraft:stick',
      ])
      .id(id('crafting/bacon_wrapped_sausage_stick'));

    kubejs
      .shapeless('mynethersdelight:breakfast_sampler', [
        Ingredient.of('#c:foods/cooked_sausage'),
        Ingredient.of('#c:foods/cooked_sausage'),
        Ingredient.of(['minecraft:honey_bottle', 'mynethersdelight:strider_egg']),
        Ingredient.of('#c:foods/cooked_egg'),
        Ingredient.of('#c:foods/cooked_egg'),
        Ingredient.of('#c:foods/bread'),
        'minecraft:bowl',
      ])
      .id(id('crafting/breakfast_sampler'));

    kubejs
      .shapeless('mynethersdelight:hotdog', [
        Ingredient.of('#c:foods/cooked_sausage'),
        Ingredient.of('#c:foods/bread'),
      ])
      .id(id('crafting/hotdog'));

    cutting('mynethersdelight:ghasta_with_cream', [
      ['mynethersdelight:ghasta_with_cream', 1, 0.9],
      ['mynethersdelight:ghasta', 1],
    ]);

    cutting('mynethersdelight:ghasta', [
      ['mynethersdelight:ghasmati'],
      ['mynethersdelight:ghasmati', 1, 0.05],
    ]);

    cutting('mynethersdelight:strider_slice', [
      ['mynethersdelight:minced_strider', 2],
      ['minecraft:string'],
      ['minecraft:string', 2, 0.5],
    ]);

    create
      .filling('mynethersdelight:golden_egg', [
        'mynethersdelight:boiled_egg',
        Fluid.of('createmetallurgy:molten_gold', 450),
      ])
      .id(id('filling/golden_egg'));

    if (global.hasMod('netherexp')) {
      create
        .emptying(
          [Fluid.of('netherexp:ectoplasm', 250), 'minecraft:bowl', 'mynethersdelight:ghasta'],
          'mynethersdelight:plate_of_ghasta_with_cream'
        )
        .id(id('emptying/ghasta'));
    }

    if (global.hasMod('bakeries')) {
      create
        .mixing('mynethersdelight:ghast_sourdough', [
          'mynethersdelight:ghast_dough',
          '3x bakeries:flour',
        ])
        .heated()
        .processingTime(600)
        .id(id('mixing/ghast_sourdough'));

      create
        .cutting('5x bakeries:sliced_toast', 'mynethersdelight:bread_loaf')
        .id(id('cutting/sliced_toast'));
    }
  });
}

if (
  global.hasAllMods(['mynethersdelight', 'create', 'create_enchantment_industry', 'create_new_age'])
) {
  ServerEvents.recipes((event) => {
    const { create, create_new_age } = event.recipes;
    const id = (path) => `createdelightcore:mynethersdelight/${path}`;

    create
      .sequenced_assembly('mynethersdelight:enchanted_golden_egg', 'mynethersdelight:boiled_egg', [
        create.filling('mynethersdelight:boiled_egg', [
          'mynethersdelight:boiled_egg',
          Fluid.of('create_enchantment_industry:experience', 120),
        ]),
        create.deploying('mynethersdelight:boiled_egg', [
          'mynethersdelight:boiled_egg',
          'minecraft:gold_block',
        ]),
        create.deploying('mynethersdelight:boiled_egg', [
          'mynethersdelight:boiled_egg',
          'minecraft:gold_block',
        ]),
        create_new_age.energising(
          'mynethersdelight:boiled_egg',
          'mynethersdelight:boiled_egg',
          2000000
        ),
      ])
      .transitionalItem('mynethersdelight:boiled_egg')
      .loops(4)
      .id(id('sequenced_assembly/enchanted_golden_egg'));

    create
      .sequenced_assembly('createdelightcore:enchanted_golden_carrot', 'minecraft:carrot', [
        create.filling('minecraft:carrot', [
          'minecraft:carrot',
          Fluid.of('create_enchantment_industry:experience', 8),
        ]),
        create.deploying('minecraft:carrot', ['minecraft:carrot', 'minecraft:gold_ingot']),
        create.deploying('minecraft:carrot', ['minecraft:carrot', 'minecraft:gold_ingot']),
        create_new_age.energising('minecraft:carrot', 'minecraft:carrot', 100000),
      ])
      .transitionalItem('minecraft:carrot')
      .loops(4)
      .id(id('sequenced_assembly/enchanted_golden_carrot'));
  });
}
