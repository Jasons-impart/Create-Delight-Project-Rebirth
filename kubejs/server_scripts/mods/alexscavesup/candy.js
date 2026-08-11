if (global.hasAllMods(['alexscavesup', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/candy/${path}`;

    remove_recipes_id(event, [
      'create:sandpaper_polishing/rose_quartz',
      'alexscavesup:hot_chocolate_bottle',
      'alexscavesup:caramel_apple',
      'alexscavesup:purple_soda_bottle_rocket',
      'alexscavesup:frostmint',
      'alexscavesup:block_of_vanilla_frosting',
      'alexscavesup:block_of_frosting',
      'alexscavesup:cake_from_cake_layer',
    ]);

    create
      .mixing(Fluid.of('alexscavesup:purple_soda', 500), [
        Fluid.water(500),
        'alexscavesup:sprinkles',
        'alexscavesup:peppermint_powder',
      ])
      .id(id('mixing/purple_honey_soda'));

    create
      .filling('alexscavesup:purple_soda_bottle', [
        'minecraft:glass_bottle',
        Fluid.of('alexscavesup:purple_soda', 250),
      ])
      .id(id('filling/purple_soda_bottle'));

    create
      .emptying(
        ['minecraft:glass_bottle', Fluid.of('alexscavesup:purple_soda', 250)],
        'alexscavesup:purple_soda_bottle'
      )
      .id(id('emptying/purple_soda_bottle'));

    create
      .deploying('alexscavesup:purple_soda_bottle_rocket', [
        'alexscavesup:purple_soda_bottle',
        Ingredient.of('#createdelightcore:mint_candy'),
      ])
      .id(id('deploying/purple_soda_bottle_rocket'));

    kubejs.shapeless('alexscavesup:block_of_frosting', '4x minecraft:sugar').id(id('frosting'));
    kubejs.shapeless('4x minecraft:sugar', 'alexscavesup:block_of_frosting').id(id('sugar'));

    kubejs
      .shaped('minecraft:cake', ['AAA', 'BBB'], {
        A: 'alexscavesup:block_of_frosting',
        B: 'alexscavesup:cake_layer',
      })
      .id(id('cake_from_cake_layer'));

    create
      .cutting('2x minecraft:cookie', 'alexscavesup:cookie_block')
      .id(id('cutting/cookie_block'));

    create
      .crushing(
        [
          Item.of('3x alexscavesup:peppermint_powder'),
          CreateItem.of(Item.of('2x alexscavesup:peppermint_powder'), 0.5),
        ],
        Ingredient.of(['alexscavesup:sharpened_candy_cane', '#createdelightcore:candy_cane'])
      )
      .id(id('crushing/peppermint_powder'));

    create
      .crushing(
        [Item.of('alexscavesup:licoroot_vine'), CreateItem.of('alexscavesup:licoroot_vine', 0.25)],
        'alexscavesup:licoroot'
      )
      .id(id('crushing/licoroot_vine'));

    create
      .item_application('alexscavesup:licoroot_sprout', [
        'alexscavesup:licoroot_vine',
        'minecraft:sugar',
      ])
      .id(id('item_application/licoroot_sprout'));

    create
      .milling('alexscavesup:gingerbread_crumbs', 'alexscavesup:gingerbread_block')
      .id(id('milling/gingerbread_crumbs'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'create_confectionery'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/candy/${path}`;

    kubejs
      .shapeless('alexscavesup:caramel_apple', [
        'create_confectionery:bar_of_caramel',
        'minecraft:apple',
      ])
      .id(id('caramel_apple'));

    create
      .filling('alexscavesup:caramel_apple', [
        'minecraft:apple',
        Fluid.of('create_confectionery:caramel', 250),
      ])
      .id(id('filling/caramel_apple'));

    create
      .compacting(
        'alexscavesup:block_of_chocolate',
        Fluid.of('create_confectionery:black_chocolate', 100)
      )
      .heatRequirement('cooled')
      .id(id('compacting/block_of_chocolate'));

    create
      .mixing(
        Fluid.of('create_confectionery:black_chocolate', 100),
        'alexscavesup:block_of_chocolate'
      )
      .heated()
      .id(id('mixing/block_of_chocolate'));

    kubejs
      .shapeless('alexscavesup:block_of_chocolate_frosting', [
        'alexscavesup:block_of_frosting',
        '#c:foods/chocolate',
      ])
      .id(id('block_of_chocolate_frosting'));

    event.recipes.minecraft
      .stonecutting(
        Item.of('alexscavesup:gingerbread_block', 6),
        'create_confectionery:gingerbread_block'
      )
      .id(id('stonecutting/gingerbread_block_from_gingerbread_block'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'neapolitan'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/candy/${path}`;

    create
      .mixing('neapolitan:mint_candies', [
        'alexscavesup:peppermint_powder',
        'minecraft:ice',
        Fluid.of('create:honey', 50),
      ])
      .id(id('mint/mint_candies'));

    kubejs
      .shapeless('neapolitan:mint_candies', [
        'alexscavesup:peppermint_powder',
        'minecraft:honey_bottle',
        'minecraft:ice',
      ])
      .replaceIngredient('minecraft:honey_bottle', 'minecraft:glass_bottle')
      .id(id('mint/mint_candies_2'));

    kubejs
      .shaped('alexscavesup:frostmint', ['AAA'], {
        A: 'neapolitan:mint_candies',
      })
      .id(id('frostmint'));

    create
      .mixing('alexscavesup:candy_cane', [
        Fluid.water(250),
        '4x minecraft:sugar',
        'neapolitan:mint_leaves',
      ])
      .id(id('mixing/candy_cane'));

    kubejs
      .shapeless('alexscavesup:block_of_vanilla_frosting', [
        'alexscavesup:block_of_frosting',
        'neapolitan:dried_vanilla_pods',
      ])
      .id(id('block_of_vanilla_frosting'));

    kubejs
      .shaped('neapolitan:vanilla_cake', ['AAA', 'BBB'], {
        A: 'alexscavesup:block_of_vanilla_frosting',
        B: 'alexscavesup:cake_layer',
      })
      .id(id('vanilla_cake_from_cake_layer'));

    kubejs
      .shaped('neapolitan:chocolate_cake', ['AAA', 'BBB'], {
        A: 'alexscavesup:block_of_chocolate_frosting',
        B: 'alexscavesup:cake_layer',
      })
      .id(id('chocolate_cake_from_cake_layer'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'cosmopolitan', 'create_deepfried'])) {
  ServerEvents.recipes((event) => {
    event.recipes.create
      .filling('alexscavesup:sweet_puff', [
        Fluid.of('cosmopolitan:cream', 250),
        'create_deepfried:berliner',
      ])
      .id('createdelightcore:alexscavesup/candy/filling/sweet_puff_spinning');
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'ratatouille'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/candy/${path}`;

    create
      .compacting('ratatouille:cake_base', '3x alexscavesup:cake_layer')
      .heated()
      .id(id('compacting/cake_base'));
    create
      .cutting('3x alexscavesup:cake_layer', 'ratatouille:cake_base')
      .id(id('cutting/cake_layer'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'farmersdelight'])) {
  ServerEvents.recipes((event) => {
    event.recipes.create
      .compacting('alexscavesup:dough_block', 'farmersdelight:wheat_dough')
      .id('createdelightcore:alexscavesup/candy/compacting/dough_block');
  });
}

if (global.hasAllMods(['alexscavesup', 'createmetallurgy'])) {
  ServerEvents.recipes((event) => {
    event.recipes.createmetallurgy
      .grinding('alexscavesup:sharpened_candy_cane', Ingredient.of('#createdelightcore:candy_cane'))
      .id('createdelightcore:alexscavesup/candy/grinding/sharpened_candy_cane');
  });
}
