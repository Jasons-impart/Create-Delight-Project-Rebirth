if (global.hasAllMods(['the_bumblezone', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:the_bumblezone/${path}`;

    // 可能有人会问我写个下面的检测是什么意思 额因为我把rm配方id静默返回改成丢ERROR了 所以需要做个判断来规避掉这个问题
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const firstFluid = (ids) => ids.find((fluid) => global.fluidExists(fluid));
    const royalJelly = firstFluid([
      'the_bumblezone:royal_jelly_fluid_still',
      'the_bumblezone:royal_jelly_fluid',
    ]);
    const sugarWater = firstFluid([
      'the_bumblezone:sugar_water_still',
      'the_bumblezone:sugar_water',
    ]);

    [
      'the_bumblezone:bee_bread/from_bucket',
      'the_bumblezone:bee_soup',
      'the_bumblezone:sugar_water_bucket',
    ].forEach(removeIfPresent);

    if (royalJelly) {
      create
        .compacting('the_bumblezone:royal_jelly_block', Fluid.of(royalJelly, 1000))
        .id(id('compacting/royal_jelly'));
      create
        .mixing(Fluid.of(royalJelly, 1000), 'the_bumblezone:royal_jelly_block')
        .heated()
        .id(id('mixing/royal_jelly'));
      create
        .filling('the_bumblezone:royal_jelly_bottle', [
          'minecraft:glass_bottle',
          Fluid.of(royalJelly, 250),
        ])
        .id(id('filling/royal_jelly_bottle'));

      event
        .shapeless('the_bumblezone:royal_jelly_block', 'the_bumblezone:royal_jelly_bucket')
        .replaceIngredient('the_bumblezone:royal_jelly_bucket', 'minecraft:bucket')
        .id(id('crafting/royal_jelly_block_from_bucket'));
      event
        .shapeless('the_bumblezone:royal_jelly_bucket', [
          'minecraft:bucket',
          'the_bumblezone:royal_jelly_block',
        ])
        .id(id('crafting/royal_jelly_bucket_from_block'));
    }

    create
      .compacting('minecraft:honey_block', Fluid.of('create:honey', 1000))
      .id(id('compacting/honey'));
    create
      .emptying([Fluid.of('create:honey', 1000), 'minecraft:bucket'], 'create:honey_bucket')
      .id(id('emptying/honey_bucket'));
    create
      .filling('minecraft:honey_bottle', ['minecraft:glass_bottle', Fluid.of('create:honey', 250)])
      .id(id('filling/honey_bottle'));

    event
      .shapeless('create:honey_bucket', [
        'minecraft:bucket',
        'minecraft:honey_bottle',
        'minecraft:honey_bottle',
        'minecraft:honey_bottle',
        'minecraft:honey_bottle',
      ])
      .replaceIngredient('minecraft:honey_bottle', 'minecraft:glass_bottle')
      .id(id('crafting/honey_bucket_from_honey_bottles'));

    create
      .filling('the_bumblezone:bee_bread', [
        'the_bumblezone:pollen_puff',
        Fluid.of('create:honey', 250),
      ])
      .id(id('filling/bee_bread'));

    if (global.hasMod('farmersdelight')) {
      farmersdelight
        .cooking(
          'meals',
          [
            'the_bumblezone:bee_bread',
            'minecraft:beetroot',
            'minecraft:potato',
            'minecraft:honeycomb',
            'minecraft:honeycomb',
            'the_bumblezone:bee_stinger',
          ],
          'the_bumblezone:bee_soup',
          1.0,
          200
        )
        .id(id('cooking/bee_soup'));
    }

    create
      .mixing(Fluid.of('create:honey', 50), [
        Fluid.of('minecraft:water', 50),
        'the_bumblezone:honey_crystal_shards',
      ])
      .heated()
      .id(id('mixing/honey_crystal_shards'));
    create
      .compacting(
        ['minecraft:honeycomb', Fluid.of('create:honey', 250)],
        'the_bumblezone:filled_porous_honeycomb_block'
      )
      .id(id('compacting/filled_porous_honeycomb_block'));
    create
      .compacting('minecraft:honeycomb', 'the_bumblezone:porous_honeycomb_block')
      .id(id('compacting/porous_honeycomb_block'));
    create
      .cutting('9x minecraft:honeycomb', Ingredient.of('#the_bumblezone:carvable_wax'))
      .id(id('cutting/carvable_wax'));
    create
      .compacting('minecraft:honeycomb', 'the_bumblezone:empty_honeycomb_brood_block')
      .id(id('compacting/empty_honeycomb_brood_block'));

    if (sugarWater && royalJelly) {
      create
        .mixing(Fluid.of('create:honey', 100), [Fluid.of(sugarWater, 100), Fluid.of(royalJelly, 5)])
        .id(id('mixing/honey_from_sugar_water'));
      create
        .filling('the_bumblezone:sugar_water_bottle', [
          'minecraft:glass_bottle',
          Fluid.of(sugarWater, 250),
        ])
        .id(id('filling/sugar_water_bottle'));
      create
        .emptying(
          [Fluid.of(sugarWater, 250), 'minecraft:glass_bottle'],
          'the_bumblezone:sugar_water_bottle'
        )
        .id(id('emptying/sugar_water_bottle'));
    }

    vintageimprovements
      .vacuumizing('5x the_bumblezone:glistering_honey_crystal', [
        Fluid.of('create_enchantment_industry:experience', 30),
        'the_bumblezone:glistering_honey_crystal',
      ])
      .id(id('vacuumizing/glistering_honey_crystal'));

    vintageimprovements
      .pressurizing(
        [Fluid.of('createdelightcore:base_syrup', 25), Fluid.water(500)],
        Fluid.of(sugarWater, 500)
      )
      .secondaryFluidOutput(1)
      .processingTime(100)
      .heated()
      .id(id('pressurizing/sugar_water'));

    create
      .sequenced_assembly(
        'the_bumblezone:crystalline_flower',
        'createdelightcore:unactivated_crystalline_flower',
        [
          create.filling('createdelightcore:unactivated_crystalline_flower', [
            'createdelightcore:unactivated_crystalline_flower',
            Fluid.of('create_enchantment_industry:experience', 1000),
          ]),
        ]
      )
      .transitionalItem('createdelightcore:unactivated_crystalline_flower')
      .loops(8)
      .id(id('sequenced_assembly/crystalline_flower_activate'));
  });
}
