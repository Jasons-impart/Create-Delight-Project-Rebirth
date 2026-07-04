if (global.hasMod('youkaishomecoming')) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, ratatouille } = event.recipes;
    const id = (path) => `createdelightcore:youkaishomecoming/${path}`;

    remove_recipes_id(event, [
      'youkaishomecoming:cooking/onigili',
      'youkaishomecoming:cooking/pork_rice_ball',
      'youkaishomecoming:cooking/tamagoyaki',
      'youkaishomecoming:cooking/tofu',
      'youkaishomecoming:cutting/mandrake_root_cutting',
      'youkaishomecoming:cutting/pods_cutting',
      'youkaishomecoming:cutting/raw_lamprey_cutting',
      'youkaishomecoming:cutting/red_velvet',
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
    farmersdelight
      .cutting('youkaishomecoming:red_velvet', Ingredient.of('#c:tools/knife'), [
        '4x youkaishomecoming:red_velvet_slice',
      ])
      .id(id('cutting/red_velvet'));

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
  });
}
