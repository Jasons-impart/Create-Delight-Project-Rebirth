if (global.hasMod('createdelightcore')) {
  ServerEvents.tags('block', (event) => {
    event.add(
      'minecraft:dirt',
      ['createdelightcore:luna_soil', 'createdelightcore:phantom_compost'].filter((id) =>
        global.blockExists(id)
      )
    );
    event.add(
      'minecraft:mushroom_grow_block',
      ['createdelightcore:luna_soil', 'createdelightcore:phantom_compost'].filter((id) =>
        global.blockExists(id)
      )
    );
  });

  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => id.startsWith('#') || global.itemExists(id));

    if (global.itemExists('createdelightcore:forged_steel_sheet')) {
      event.add('c:plates', 'createdelightcore:forged_steel_sheet');
    }

    event.add(
      'createdelightcore:leather_ingredient',
      [
        'minecraft:cactus',
        'minecraft:rotten_flesh',
        'fruitsdelight:pineapple_sapling',
        'farmersdelight:canvas',
      ].filter((id) => global.itemExists(id))
    );

    const extraEggs = existingItems([
      'quark:egg_parrot_gray',
      'quark:egg_parrot_yellow_blue',
      'quark:egg_parrot_green',
      'quark:egg_parrot_blue',
      'quark:egg_parrot_red_blue',
      'iceandfire:myrmex_desert_egg',
      'iceandfire:myrmex_jungle_egg',
      'endertrigon:baby_dragon_egg',
    ]);
    event.add('c:eggs', extraEggs);

    const oversizedEggs = existingItems([
      'iceandfire:deathworm_egg_giant',
      'alexscaves:tremorsaurus_egg',
      'alexscaves:relicheirus_egg',
      'alexscaves:atlatitan_egg',
      'alexsmobs:emu_egg',
      '#c:dragon_eggs',
      'minecraft:sniffer_egg',
      'alexscaves:tremorzilla_egg',
    ]);
    event.add('c:bigger_eggs', oversizedEggs);

    event.remove(
      'c:eggs',
      existingItems([
        'iceandfire:deathworm_egg_giant',
        'alexscaves:tremorsaurus_egg',
        'alexscaves:relicheirus_egg',
        'alexscaves:atlatitan_egg',
        'alexscaves:tremorzilla_egg',
      ])
    );
    event.remove('c:moss', existingItems(['minecraft:moss_carpet']));

    event.add('c:creams', existingItems(['cosmopolitan:cream']));

    const paperRawMaterials = existingItems([
      'farmersdelight:tree_bark',
      'farmersdelight:straw',
      'createdieselgenerators:wood_chip',
    ]);
    event.add('c:papers_raw_material', paperRawMaterials);

    const saladIngredients = existingItems([
      'farmersdelight:cabbage',
      'farmersdelight:onion',
      'minecraft:carrot',
      'minecraft:beetroot',
      'minecraft:brown_mushroom',
      'minecraft:red_mushroom',
    ]);
    event.add('c:salad_ingredients', saladIngredients);

    const vegetableAliases = [
      ['carrot', ['minecraft:carrot']],
      ['cabbage', ['farmersdelight:cabbage']],
      ['onion', ['farmersdelight:onion']],
      ['tomato', ['farmersdelight:tomato']],
      ['beetroot', ['minecraft:beetroot']],
    ];
    vegetableAliases.forEach(([name, items]) => {
      const existing = existingItems(items);
      event.add(`c:vegetables/${name}`, existing);
    });
    const vegetables = [];
    vegetableAliases.forEach(([, items]) => {
      existingItems(items).forEach((item) => vegetables.push(item));
    });
    event.add('c:vegetables', vegetables);

    const rawPork = existingItems(['minecraft:porkchop']);
    event.add('c:foods/raw_pork', rawPork);

    const cookedEggs = existingItems(['minecraft:egg', 'mynethersdelight:boiled_egg']);
    event.add('c:foods/cooked_egg', cookedEggs);
    event.add('c:foods/cooked_eggs', cookedEggs);

    const animalOils = existingItems(['createdelightcore:butter', 'butchercraft:lard']);
    event.add('c:animal_oil', animalOils);

    event.add(
      'supplementaries:cookies',
      existingItems([
        'vintagedelight:oatmeal_cookie',
        'fruitsdelight:persimmon_cookie',
        'fruitsdelight:lemon_cookie',
        'fruitsdelight:cranberry_cookie',
        'fruitsdelight:bayberry_cookie',
        'collectorsreap:lime_cookie',
        'ends_delight:chorus_cookie',
      ])
    );
  });

  ServerEvents.tags('fluid', (event) => {
    const existingFluids = (ids) => ids.filter((id) => global.fluidExists(id));
    const eggYolks = existingFluids([
      'createdelightcore:egg_yolk',
      'createdelightcore:artificial_egg_yolk',
    ]);

    event.add('c:egg_yolk', eggYolks);
  });
}
