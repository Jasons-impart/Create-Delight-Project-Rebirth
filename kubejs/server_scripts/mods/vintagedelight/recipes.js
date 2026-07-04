if (global.hasMod('vintagedelight')) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, minecraft, vintagedelight } = event.recipes;
    const id = (path) => `createdelightcore:vintagedelight/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const replaceInputIfPresent = (recipeId, from, to) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.replaceInput({ id: recipeId }, from, to);
      }
    };
    const fermenting = (path, output, ingredients, processingTime) => {
      return vintagedelight
        .fermenting(output, ingredients)
        .processingTime(processingTime || 100)
        .id(id(`fermenting/${path}`));
    };

    [
      'vintagedelight:cutting/cucumber_cutting',
      'culturaldelights:cutting/cut_cucumber',
      'vintagedelight:fermenting/pickle_from_fermenting',
      'vintagedelight:salt_bucket_to_salt',
      'vintagedelight:salt_from_smelting',
      'vintagedelight:fermenting/century_egg_from_fermenting',
      'vintagedelight:fermenting/kimchi_from_fermenting',
      'vintagedelight:fermenting/frost_fermenta',
      'culturaldelights:cucumber_crate',
      'culturaldelights:from_crate/cucumber',
    ].forEach(removeIfPresent);

    replaceInputIfPresent(
      'vintagedelight:cooking/pad_thai',
      Ingredient.of('#c:pasta'),
      'createdelightcore:vermicelli'
    );

    if (global.hasAllMods(['farmersdelight', 'brewinandchewin', 'trailandtales_delight'])) {
      farmersdelight
        .cutting('brewinandchewin:flaxen_cheese_wheel', '#c:tools/knife', [
          '4x trailandtales_delight:cheese_slice',
        ])
        .id(id('cutting/flaxen_cheese_wheel'));
    }

    create
      .milling(CreateItem.of('bakeries:flour', 0.5), 'vintagedelight:raw_oats')
      .id(id('milling/raw_oats_to_flour'));

    if (global.hasAllMods(['ratatouille', 'createdelightcore'])) {
      fermenting(
        'salami',
        '5x createdelightcore:salami',
        [
          'ratatouille:raw_sausage',
          'ratatouille:raw_sausage',
          'ratatouille:raw_sausage',
          'ratatouille:raw_sausage',
          'ratatouille:raw_sausage',
          Ingredient.of('#c:dusts/salt'),
        ],
        5000
      );
    }

    if (global.hasMod('culturaldelights')) {
      event
        .shapeless('vintagedelight:cucumber_crate', ['9x vintagedelight:cucumber'])
        .id(id('crafting/cucumber_crate'));
      fermenting(
        'pickle',
        '5x culturaldelights:pickle',
        [
          'vintagedelight:cucumber',
          'vintagedelight:cucumber',
          'vintagedelight:cucumber',
          'vintagedelight:cucumber',
          'vintagedelight:cucumber',
          Ingredient.of('#c:dusts/salt'),
        ],
        6000
      );
      fermenting(
        'cut_pickle',
        '5x culturaldelights:cut_pickle',
        [
          'culturaldelights:cut_cucumber',
          'culturaldelights:cut_cucumber',
          'culturaldelights:cut_cucumber',
          'culturaldelights:cut_cucumber',
          'culturaldelights:cut_cucumber',
          Ingredient.of('#c:dusts/salt'),
        ],
        3000
      );

      if (global.hasMod('farmersdelight')) {
        farmersdelight
          .cutting('culturaldelights:cut_cucumber', '#c:tools/knife', [
            'vintagedelight:cucumber_noodles',
          ])
          .id(id('cutting/cucumber_noodles'));
      }
    }

    create
      .mixing(Fluid.of('bakeries:salt_water', 250), [Fluid.water(250), 'vintagedelight:salt_dust'])
      .id(id('mixing/salt_water'));
    create
      .mixing('vintagedelight:salt_dust', Fluid.of('bakeries:salt_water', 250))
      .heated()
      .id(id('mixing/salt_dust_from_salt_water'));

    minecraft
      .smelting(Item.of('vintagedelight:salt_bucket'), 'bakeries:salt_water_bucket', 0.7, 200)
      .id(id('smelting/salt_bucket'));

    event
      .shapeless('4x vintagedelight:salt_dust', 'vintagedelight:salt_bucket')
      .id(id('crafting/salt_dust_from_salt_bucket'));

    if (global.hasMod('create_bic_bit')) {
      fermenting(
        'surstromming',
        '5x vintagedelight:surstromming',
        [
          'create_bic_bit:raw_herring',
          'create_bic_bit:raw_herring',
          'create_bic_bit:raw_herring',
          'create_bic_bit:raw_herring',
          'create_bic_bit:raw_herring',
          Ingredient.of('#c:dusts/salt'),
        ],
        2500
      );
    }

    fermenting(
      'salted_cod',
      '5x vintagedelight:salted_cod',
      [
        'minecraft:cod',
        'minecraft:cod',
        'minecraft:cod',
        'minecraft:cod',
        'minecraft:cod',
        Ingredient.of('#c:dusts/salt'),
      ],
      2500
    );
    fermenting(
      'salted_salmon',
      '5x vintagedelight:salted_salmon',
      [
        'minecraft:salmon',
        'minecraft:salmon',
        'minecraft:salmon',
        'minecraft:salmon',
        'minecraft:salmon',
        Ingredient.of('#c:dusts/salt'),
      ],
      2500
    );

    if (global.hasAllMods(['farmersdelight'])) {
      fermenting(
        'kimchi',
        '4x vintagedelight:kimchi',
        [
          'farmersdelight:cabbage_leaf',
          'farmersdelight:cabbage_leaf',
          'farmersdelight:cabbage_leaf',
          'farmersdelight:cabbage_leaf',
          Ingredient.of('#c:dusts/salt'),
          'vintagedelight:ghost_pepper',
        ],
        5000
      );
    }

    fermenting(
      'century_egg_from_sniffer_egg',
      'vintagedelight:century_egg',
      ['minecraft:sniffer_egg', Ingredient.of('#c:dusts/ash'), Ingredient.of('#c:dusts/salt')],
      72000
    );

    if (global.hasMod('alexsmobs')) {
      fermenting(
        'century_egg_from_emu_egg',
        'vintagedelight:century_egg',
        ['alexsmobs:emu_egg', Ingredient.of('#c:dusts/ash'), Ingredient.of('#c:dusts/salt')],
        72000
      );
    }

    create
      .emptying(
        [Fluid.of('createdelightcore:nut_milk', 250), 'minecraft:glass_bottle'],
        'vintagedelight:nut_milk_bottle'
      )
      .id(id('emptying/nut_milk_bottle'));
    create
      .filling('vintagedelight:nut_milk_bottle', [
        Fluid.of('createdelightcore:nut_milk', 250),
        'minecraft:glass_bottle',
      ])
      .id(id('filling/nut_milk_bottle'));
    event
      .shapeless('createdelightcore:nut_milk_bucket', [
        'vintagedelight:nut_milk_bottle',
        'vintagedelight:nut_milk_bottle',
        'vintagedelight:nut_milk_bottle',
        'vintagedelight:nut_milk_bottle',
        'minecraft:bucket',
      ])
      .replaceIngredient('vintagedelight:nut_milk_bottle', 'minecraft:glass_bottle')
      .id(id('crafting/nut_milk_bucket_from_bottles'));
    event
      .shapeless('4x vintagedelight:nut_milk_bottle', [
        'createdelightcore:nut_milk_bucket',
        '4x minecraft:glass_bottle',
      ])
      .replaceIngredient('createdelightcore:nut_milk_bucket', 'minecraft:bucket')
      .id(id('crafting/nut_milk_bottles_from_bucket'));
    create
      .mixing(Fluid.of('createdelightcore:nut_milk', 250), [
        '2x vintagedelight:peanut',
        'minecraft:sugar',
      ])
      .heated()
      .id(id('mixing/nut_milk'));

    create
      .filling('vintagedelight:vinegar_bottle', [
        'minecraft:glass_bottle',
        Fluid.of('createdelightcore:vinegar', 250),
      ])
      .id(id('filling/vinegar_bottle'));
    create
      .filling('vintagedelight:vinegar_mason_jar', [
        'vintagedelight:mason_jar',
        Fluid.of('createdelightcore:vinegar', 750),
      ])
      .id(id('filling/vinegar_mason_jar'));
    create
      .emptying(
        [Fluid.of('createdelightcore:vinegar', 250), 'minecraft:glass_bottle'],
        'vintagedelight:vinegar_bottle'
      )
      .id(id('emptying/vinegar_bottle'));
    create
      .emptying(
        [Fluid.of('createdelightcore:vinegar', 750), 'vintagedelight:mason_jar'],
        'vintagedelight:vinegar_mason_jar'
      )
      .id(id('emptying/vinegar_mason_jar'));
  });
}
