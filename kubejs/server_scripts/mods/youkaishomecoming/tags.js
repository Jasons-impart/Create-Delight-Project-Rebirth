if (global.hasMod('youkaishomecoming')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => global.itemExists(id));
    const addCommon = (path, ids) => {
      const existing = existingItems(ids);
      event.add(`c:${path}`, existing);
    };
    const addCommonAndForge = (path, ids) => {
      const existing = existingItems(ids);
      event.add(`c:${path}`, existing);
      event.add(`forge:${path}`, existing);
    };

    event.removeAllTagsFrom(
      existingItems([
        'youkaishomecoming:green_coffee_bean',
        'abnormals_delight:perch_slice',
        'abnormals_delight:pike_slice',
      ])
    );

    addCommonAndForge('tea_leaves/green', ['farmersrespite:green_tea_leaves']);
    addCommonAndForge('tea_leaves/oolong', ['farmersrespite:yellow_tea_leaves']);
    addCommonAndForge('tea_leaves/black', ['farmersrespite:black_tea_leaves']);

    event.add('minecraft:ice', existingItems(['youkaishomecoming:ice_cube']));

    addCommonAndForge('roe', ['oceanic_delight:salmon_eggs', 'oceanic_delight:ancient_fish_eggs']);
    addCommonAndForge('tropical', [
      'minecraft:tropical_fish',
      'crabbersdelight:tropical_fish_slice',
    ]);
    addCommonAndForge('pufferfish', ['minecraft:pufferfish', 'crabbersdelight:pufferfish_slice']);

    event.removeAllTagsFrom(
      existingItems(['collectorsreap:tiger_prawn_roe', 'collectorsreap:platinum_bass_roe'])
    );

    event.add(
      'minecraft:fishes',
      existingItems([
        'youkaishomecoming:roasted_lamprey',
        'youkaishomecoming:raw_lamprey_fillet',
        'youkaishomecoming:roasted_lamprey_fillet',
        'youkaishomecoming:raw_tuna',
        'youkaishomecoming:seared_tuna',
        'youkaishomecoming:raw_tuna_slice',
        'youkaishomecoming:seared_tuna_slice',
        'youkaishomecoming:otoro',
        'crabbersdelight:cooked_tropical_fish',
        'farmersdelight:cod_slice',
        'farmersdelight:cooked_cod_slice',
        'crabbersdelight:tropical_fish_slice',
        'crabbersdelight:cooked_tropical_fish_slice',
        'alexsdelight:raw_catfish_slice',
        'alexsdelight:cooked_catfish_slice',
        'farmersdelight:salmon_slice',
        'farmersdelight:cooked_salmon_slice',
      ])
    );

    addCommonAndForge('raw_fishes', [
      'youkaishomecoming:raw_lamprey',
      'youkaishomecoming:raw_lamprey_fillet',
      'youkaishomecoming:raw_tuna',
      'youkaishomecoming:raw_tuna_slice',
      'youkaishomecoming:otoro',
      'alexsmobs:raw_catfish',
      'alexsdelight:raw_catfish_slice',
      'alexsmobs:flying_fish',
      'alexscaves:tripodfish',
      'alexscaves:lanternfish',
    ]);
  });

  ServerEvents.tags('block', (event) => {
    event.removeAllTagsFrom(['youkaishomecoming:coffea'].filter((id) => global.blockExists(id)));
  });
}
