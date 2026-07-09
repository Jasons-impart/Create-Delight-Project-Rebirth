if (global.hasMod('createcafe')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => global.itemExists(id));
    const cafe = existingItems([
      'createcafe:iced_coffee',
      'createcafe:iced_coffee_milk',
      'createcafe:caramel_iced_coffee',
      'createcafe:banana_iced_coffee',
      'createcafe:strawberry_iced_coffee',
      'createcafe:vanilla_iced_coffee',
      'createcafe:mint_iced_coffee',
    ]);
    const milkTea = existingItems([
      'createcafe:pineapple_milk_tea',
      'createcafe:blueberry_milk_tea',
      'createcafe:lychee_milk_tea',
      'createcafe:grape_milk_tea',
      'createcafe:fig_milk_tea',
      'createcafe:durian_milk_tea',
      'createcafe:peach_milk_tea',
      'createcafe:mango_milk_tea',
      'createcafe:banana_milk_tea',
      'createcafe:watermelon_milk_tea',
      'createcafe:lemon_milk_tea',
      'createcafe:persimmon_milk_tea',
      'createcafe:orange_milk_tea',
      'createcafe:kiwi_milk_tea',
      'createcafe:sweetberry_milk_tea',
      'createcafe:pumpkin_milk_tea',
      'createcafe:apple_milk_tea',
      'createcafe:cherry_milk_tea',
      'createcafe:oreo_milk_tea',
      'createcafe:strawberry_milk_tea',
      'createcafe:avocado_milk_tea',
      'createcafe:vanilla_milk_tea',
      'createcafe:blood_orange_milk_tea',
      'createcafe:pomegranate_milk_tea',
      'createcafe:lime_milk_tea',
    ]);

    event.add('createdelightcore:cafe', cafe);
    event.add('createdelightcore:milk_tea', milkTea);
    event.add(
      'create:upright_on_belt',
      existingItems(
        cafe.concat(milkTea, [
          'createcafe:iced_coffee_cup',
          'createcafe:iced_coffee_cup_ice',
          'createcafe:boba_cup',
          'createcafe:empty_boba_cup',
        ])
      )
    );
    event.add('c:coffee_grounds', existingItems(['createcafe:coffee_grounds']));
    event.add('c:fruits/pomegranate', existingItems(['collectorsreap:pomegranate_seeds']));
    event.add(
      'c:syrup_blocks',
      existingItems([
        'createdelightcore:base_syrup',
        'createdelightcore:strawberry_syrup',
        'createdelightcore:vanilla_syrup',
        'createdelightcore:mint_syrup',
        'createdelightcore:banana_syrup',
        'cosmopolitan:berry_syrup_block',
      ])
    );
  });

  ServerEvents.tags('fluid', (event) => {
    event.add(
      'c:syrup',
      [
        'createdelightcore:base_syrup',
        'createdelightcore:strawberry_syrup',
        'createdelightcore:vanilla_syrup',
        'createdelightcore:mint_syrup',
        'createdelightcore:banana_syrup',
        'cosmopolitan:berry_syrup',
      ].filter((id) => global.fluidExists(id))
    );
  });

  ServerEvents.tags('block', (event) => {
    event.add(
      'minecraft:crops',
      ['createcafe:cassava_crop', 'createcafe:coffee_crop'].filter((id) => global.blockExists(id))
    );
  });
}
