if (global.hasAllMods(['neapolitan', 'create', 'farmersdelight', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:neapolitan/${path}`;

    const packageItem = (item, storageBlock, count) => {
      kubejs
        .shapeless(storageBlock, `${count}x ${item}`)
        .id(id(`${item.split(':')[1]}_to_${storageBlock.split(':')[1]}`));
      kubejs
        .shapeless(`${count}x ${item}`, storageBlock)
        .id(id(`${storageBlock.split(':')[1]}_to_${item.split(':')[1]}`));
    };

    const makeCake = (input, output) => {
      create
        .deploying(output, ['minecraft:cake', input])
        .id(id(`deploying/${output.split(':')[1]}`));
    };

    const cutting = (input, outputs) => {
      farmersdelight
        .cutting(
          input,
          '#c:tools/knife',
          outputs.map((output) => {
            const item = { id: output[0], count: output[1] || 1 };

            if (output.length > 2) {
              item.chance = output[2];
            }

            return item;
          })
        )
        .id(id(`cutting/${input.split(':')[1]}`));
    };

    remove_recipes_id(event, [
      'neapolitan:adzuki_crate',
      'neapolitan:adzuki_beans_from_adzuki_crate',
      'neapolitan:vanilla_fudge',
      'neapolitan:banana_bread',
    ]);

    remove_recipes_output(event, [
      'neapolitan:chocolate_strawberries',
      'neapolitan:vanilla_chocolate_fingers',
      'neapolitan:chocolate_bar',
      'neapolitan:chocolate_spider_eye',
      'neapolitan:vanilla_cake',
      'neapolitan:chocolate_cake',
      'neapolitan:strawberry_cake',
      'neapolitan:banana_cake',
      'neapolitan:mint_cake',
      'neapolitan:adzuki_cake',
      'neapolitan:adzuki_curry',
      'neapolitan:adzuki_stew',
    ]);

    event.replaceInput({ id: 'neapolitan:adzuki_bun' }, 'minecraft:wheat', 'create:dough');
    if (global.hasMod('vintagedelight')) {
      event.replaceInput(
        { id: 'neapolitan:strawberry_scones' },
        'minecraft:wheat',
        'vintagedelight:oat_dough'
      );
    }
    event.replaceInput({}, 'neapolitan:chocolate_bar', 'create:bar_of_chocolate');

    makeCake('neapolitan:dried_vanilla_pods', 'neapolitan:vanilla_cake');
    makeCake('neapolitan:strawberries', 'neapolitan:strawberry_cake');
    makeCake('neapolitan:banana', 'neapolitan:banana_cake');
    makeCake('neapolitan:mint_leaves', 'neapolitan:mint_cake');
    makeCake('neapolitan:roasted_adzuki_beans', 'neapolitan:adzuki_cake');
    packageItem('neapolitan:adzuki_beans', 'neapolitan:adzuki_crate', 9);

    create
      .filling('neapolitan:chocolate_strawberries', [
        'neapolitan:strawberries',
        Fluid.of('create:chocolate', 250),
      ])
      .id(id('filling/chocolate_strawberries'));
    create
      .filling('neapolitan:vanilla_chocolate_fingers', [
        'neapolitan:dried_vanilla_pods',
        Fluid.of('create:chocolate', 250),
      ])
      .id(id('filling/vanilla_chocolate_fingers'));
    create
      .filling('neapolitan:chocolate_spider_eye', [
        'minecraft:spider_eye',
        Fluid.of('create:chocolate', 125),
      ])
      .id(id('filling/chocolate_spider_eye'));
    create
      .haunting('neapolitan:white_strawberries', 'neapolitan:strawberries')
      .id(id('haunting/white_strawberries'));

    cutting('neapolitan:banana_bunch', [
      ['neapolitan:banana', 2],
      ['neapolitan:banana', 1, 0.5],
      ['neapolitan:banana', 1, 0.25],
    ]);
    cutting('neapolitan:banana_bundle', [['neapolitan:banana_bunch', 9]]);

    farmersdelight
      .cooking(
        'meals',
        [
          'neapolitan:adzuki_beans',
          'neapolitan:adzuki_beans',
          'minecraft:beetroot',
          'minecraft:carrot',
          Ingredient.of('#c:mushrooms'),
        ],
        'neapolitan:adzuki_stew',
        10.0,
        200,
        'minecraft:bowl'
      )
      .id(id('cooking/adzuki_stew'));

    farmersdelight
      .cooking(
        'meals',
        [
          'neapolitan:adzuki_beans',
          'neapolitan:dried_banana',
          'minecraft:carrot',
          'minecraft:pumpkin',
        ],
        'neapolitan:adzuki_curry',
        10.0,
        200,
        'minecraft:bowl'
      )
      .id(id('cooking/adzuki_curry'));

    create
      .deploying(
        [
          'neapolitan:banana_bundle',
          CreateItem.of('neapolitan:banana', 0.05),
          CreateItem.of('neapolitan:banana_bunch', 0.02),
        ],
        ['neapolitan:banana_bundle', 'neapolitan:chimpanzee_head']
      )
      .keepHeldItem()
      .id(id('deploying/banana'));
  });
}
