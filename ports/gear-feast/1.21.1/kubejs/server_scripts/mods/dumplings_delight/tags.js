if (global.hasMod('dumplings_delight')) {
  ServerEvents.tags('item', (event) => {
    event.add(
      'createdelightcore:boiled_dumpling',
      [
        'dumplings_delight:pork_cabbage_boiled_dumpling',
        'dumplings_delight:pork_kelp_boiled_dumpling',
        'dumplings_delight:pork_potato_boiled_dumpling',
        'dumplings_delight:pork_fennel_boiled_dumpling',
        'dumplings_delight:mutton_boiled_dumpling',
        'dumplings_delight:lamb_boiled_dumpling',
        'dumplings_delight:chicken_mushroom_boiled_dumpling',
        'dumplings_delight:cod_boiled_dumpling',
        'dumplings_delight:salmon_boiled_dumpling',
        'dumplings_delight:eggplant_egg_boiled_dumpling',
        'dumplings_delight:mushroom_boiled_dumpling',
        'dumplings_delight:fungus_boiled_dumpling',
        'dumplings_delight:garlic_chive_egg_boiled_dumpling',
        'dumplings_delight:dandelion_leaf_boiled_dumpling',
        'dumplings_delight:pufferfish_boiled_dumpling',
        'dumplings_delight:rabbit_meat_boiled_dumpling',
      ].filter((id) => global.itemExists(id))
    );

    event.add(
      'c:seeds',
      [
        'dumplings_delight:chinese_cabbage_seeds',
        'dumplings_delight:eggplant_seeds',
        'dumplings_delight:garlic_chive_seeds',
        'dumplings_delight:fennel_seeds',
        'dumplings_delight:garlic',
      ].filter((id) => global.itemExists(id))
    );

    event.add(
      'c:foods/pufferfish',
      ['minecraft:pufferfish', 'crabbersdelight:pufferfish_slice'].filter((id) =>
        global.itemExists(id)
      )
    );
  });

  ServerEvents.tags('block', (event) => {
    event.add(
      'minecraft:crops',
      [
        'dumplings_delight:fennel',
        'dumplings_delight:chinese_cabbages',
        'dumplings_delight:eggplant',
        'dumplings_delight:garlic_chive',
        'dumplings_delight:garlic',
        'dumplings_delight:greenonion',
      ].filter((id) => global.blockExists(id))
    );
  });
}
