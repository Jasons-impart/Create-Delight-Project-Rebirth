if (global.hasMod('netherexp')) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:netherexp/${path}`;
    const cutting = (input, outputs, path) => {
      farmersdelight
        .cutting(
          input,
          '#c:tools/knife',
          outputs.map((output) => ({
            id: output[0],
            count: output[1] || 1,
          }))
        )
        .id(id(`cutting/${path || input.split(':')[1]}`));
    };

    remove_recipes_id(event, [
      'netherexp:wither_bone_block',
      'netherexp:glowcheese',
      'netherexp:nether_pizza',
      'netherexp:roasted_bone',
      'netherexp:stonecutting/from_pale_soul_slate/indented',
    ]);

    event.replaceInput(
      {
        not: [{ id: 'farmersdelight:cutting/ham' }, { id: 'farmersdelight:smoked_ham' }],
      },
      'farmersdelight:ham',
      Ingredient.of('#c:ham')
    );
    event.replaceInput(
      {
        not: [{ id: 'farmersdelight:cutting/smoked_ham' }],
      },
      'farmersdelight:smoked_ham',
      Ingredient.of('#c:cooked_ham')
    );

    cutting('netherexp:hogham', [
      ['mynethersdelight:hoglin_loin', 2],
      ['minecraft:bone', 1],
    ]);
    cutting('netherexp:cooked_hogham', [
      ['mynethersdelight:cooked_loin', 2],
      ['minecraft:bone', 1],
    ]);

    create
      .crushing(
        ['3x netherexp:banshee_powder', CreateItem.of(Item.of('netherexp:banshee_powder', 3), 0.5)],
        'netherexp:banshee_rod'
      )
      .id(id('crushing/banshee_rod'));

    kubejs
      .shapeless('netherexp:wither_bone_block', '9x iceandfire:wither_shard')
      .id(id('wither_bone_block'));
    kubejs
      .shapeless('9x iceandfire:wither_shard', 'netherexp:wither_bone_block')
      .id(id('wither_shard_from_wither_bone_block'));

    if (global.hasMod('create_bic_bit')) {
      create
        .mixing(Fluid.of('create_bic_bit:curdled_milk', 1000), [
          Ingredient.of('#netherexp:glowspores'),
          Ingredient.of('#netherexp:glowspores'),
          Fluid.of('minecraft:milk', 1000),
        ])
        .id(id('mixing/curdled_milk'));
    }

    create
      .sequenced_assembly('netherexp:nether_pizza', 'create:dough', [
        create.deploying('create:dough', ['create:dough', 'trailandtales_delight:cheese_slice']),
        create.deploying('create:dough', ['create:dough', 'mynethersdelight:hoglin_loin']),
        create.deploying('create:dough', ['create:dough', 'netherexp:warped_wart']),
        create.deploying('create:dough', ['create:dough', 'minecraft:nether_wart']),
      ])
      .transitionalItem('create:dough')
      .loops(1)
      .id(id('sequenced_assembly/nether_pizza'));

    cutting('netherexp:nether_pizza', [['netherexp:nether_pizza_slice', 4]], 'nether_pizza_slice');

    farmersdelight
      .cooking(
        'meals',
        ['netherexp:cerebrage', 'minecraft:warped_fungus', Ingredient.of('#c:cooked_ham')],
        'netherexp:roasted_bone',
        5.0,
        200,
        'minecraft:bone'
      )
      .id(id('cooking/roasted_bone'));

    create
      .compacting(Fluid.of('netherexp:ectoplasm', 200), 'netherexp:wraithing_flesh')
      .id(id('compacting/wraithing_flesh'));

    vintageimprovements
      .centrifugation(
        ['minecraft:rotten_flesh', Fluid.of('netherexp:ectoplasm', 100)],
        'netherexp:wraithing_flesh'
      )
      .id(id('centrifugation/wraithing_flesh'));

    vintageimprovements
      .centrifugation(
        ['minecraft:pumpkin', Fluid.of('netherexp:ectoplasm', 500)],
        'netherexp:sorrowsquash'
      )
      .id(id('centrifugation/sorrowsquash'));
  });
}
