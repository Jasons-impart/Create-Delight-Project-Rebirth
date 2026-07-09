if (global.hasMod('refurbished_furniture')) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:refurbished_furniture/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    const cuttingBoardCombining = (output, ingredients, count) => {
      if (ingredients.length > 5) {
        return;
      }

      event.recipes.refurbished_furniture
        .cutting_board_combining(
          Item.of(output, count || 1),
          ingredients.map((ingredient) => Ingredient.of(ingredient))
        )
        .id(id(`combining/${output.split(':')[1]}`));
    };
    const ovenBaking = (input, output, count, time) => {
      event
        .custom({
          type: 'refurbished_furniture:oven_baking',
          category: 'food',
          ingredient: { item: input },
          result: {
            count: count || 1,
            id: output,
          },
          time: time || 300,
        })
        .id(id(`oven_baking/${output.split(':')[1]}_from_${input.split(':')[1]}`));

      if (global.hasMod('ratatouille')) {
        event.recipes.ratatouille
          .baking(Item.of(output, count || 1), input)
          .processingTime(time || 300)
          .id(id(`baking/${output.split(':')[1]}_from_${input.split(':')[1]}`));
      }
    };

    event.remove({ type: 'refurbished_furniture:cutting_board_slicing' });
    remove_recipes_id(event, [
      'refurbished_furniture:knife',
      'refurbished_furniture:combining/cheese_sandwich',
      'refurbished_furniture:combining/raw_vegetable_pizza',
      'refurbished_furniture:combining/raw_meatlovers_pizza',
      'refurbished_furniture:toasting/toast',
      'refurbished_furniture:frying/sweet_berry_jam',
      'refurbished_furniture:frying/glow_berry_jam',
    ]);

    [
      'create_central_kitchen:sequenced_assembly/chicken_sandwich',
      'create_central_kitchen:sequenced_assembly/bacon_sandwich',
      'create_central_kitchen:sequenced_assembly/egg_sandwich',
      'vintagedelight:cheese_pizza',
      'vintagedelight:cheese_pizza_from_slices',
      'vintagedelight:cutting/cheese_pizza_from_cutting',
    ].forEach(removeIfPresent);

    event.remove({ output: 'refurbished_furniture:toast' });
    event.remove({ output: 'culturaldelights:avocado_toast' });
    event.remove({
      output: [
        'alexsdelight:bison_burger',
        'culturaldelights:eggplant_burger',
        'farmersdelight:hamburger',
        'silentsdelight:heartburger',
        'collectorsreap:portobello_burger',
        'alexsmobs:kangaroo_burger',
        'alexsdelight:bunfungus_sandwich',
        'culturaldelights:mutton_sandwich',
        'farmersdelight:egg_sandwich',
        'farmersdelight:chicken_sandwich',
        'farmersdelight:bacon_sandwich',
        'minersdelight:vegan_hamburger',
        'minersdelight:squid_sandwich',
        'minersdelight:insect_sandwich',
      ],
    });

    event.replaceInput(
      {
        output: [
          'vintagedelight:deluxe_burger',
          'alexsdelight:bison_burger',
          'vintagedelight:cheese_burger',
          'farmersdelight:hamburger',
          'silentsdelight:heartburger',
          'culturaldelights:eggplant_burger',
        ],
      },
      Ingredient.of('#c:foods/bread'),
      'someassemblyrequired:burger_bun'
    );

    cuttingBoardCombining('alexsdelight:bison_burger', [
      'someassemblyrequired:burger_bun',
      'alexsdelight:bison_patty',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
      '#c:vegetables/beetroot',
    ]);
    cuttingBoardCombining('culturaldelights:eggplant_burger', [
      'someassemblyrequired:burger_bun',
      '#culturaldelights:smoked_regular_eggplants',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
    ]);
    cuttingBoardCombining('farmersdelight:hamburger', [
      'someassemblyrequired:burger_bun',
      'farmersdelight:beef_patty',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
      '#c:vegetables/onion',
    ]);
    cuttingBoardCombining('silentsdelight:heartburger', [
      'someassemblyrequired:burger_bun',
      'silentsdelight:warden_heart_patty',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
      '#c:vegetables/onion',
    ]);
    cuttingBoardCombining('vintagedelight:cheese_burger', [
      'someassemblyrequired:burger_bun',
      'trailandtales_delight:cheese_slice',
      'farmersdelight:beef_patty',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
      '#c:vegetables/onion',
    ]);
    cuttingBoardCombining('vintagedelight:deluxe_burger', [
      'someassemblyrequired:burger_bun',
      '#c:foods/cooked_bacon',
      'farmersdelight:beef_patty',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
      '#c:vegetables/onion',
      'trailandtales_delight:cheese_slice',
      '#c:foods/cooked_eggs',
    ]);
    cuttingBoardCombining('collectorsreap:portobello_burger', [
      'someassemblyrequired:burger_bun',
      'collectorsreap:baked_portobello_cap',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
      '#c:vegetables/onion',
    ]);
    cuttingBoardCombining('collectorsreap:land_and_sea_burger', [
      'someassemblyrequired:burger_bun',
      'collectorsreap:chieftain_claw',
      'farmersdelight:beef_patty',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
      '#c:vegetables/onion',
    ]);

    cuttingBoardCombining('alexsmobs:kangaroo_burger', [
      'minecraft:bread',
      '#alexsdelight:cooked_kangaroo',
      '#alexsdelight:cooked_kangaroo',
      '#c:salad_ingredients',
      '#c:vegetables/carrot',
    ]);
    cuttingBoardCombining('alexsdelight:bunfungus_sandwich', [
      'minecraft:bread',
      'farmersdelight:red_mushroom_colony',
      'farmersdelight:red_mushroom_colony',
      '#alexsdelight:cooked_bunfungus',
    ]);
    cuttingBoardCombining('culturaldelights:mutton_sandwich', [
      'minecraft:bread',
      '#c:foods/cooked_mutton',
      '#c:foods/cooked_eggs',
      '#c:vegetables/beetroot',
    ]);
    cuttingBoardCombining('farmersdelight:egg_sandwich', [
      'minecraft:bread',
      '#c:foods/cooked_eggs',
      '#c:foods/cooked_eggs',
    ]);
    cuttingBoardCombining('farmersdelight:chicken_sandwich', [
      'minecraft:bread',
      '#c:foods/cooked_chicken',
      '#c:salad_ingredients',
      '#c:vegetables/carrot',
    ]);
    cuttingBoardCombining('farmersdelight:bacon_sandwich', [
      'minecraft:bread',
      '#c:foods/cooked_bacon',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
    ]);
    cuttingBoardCombining('collectorsreap:prawn_po_boy', [
      'minecraft:bread',
      'collectorsreap:cooked_tiger_prawn',
      '#c:foods/cooked_eggs',
      '#c:salad_ingredients',
      '#c:vegetables/tomato',
      '#c:vegetables/onion',
    ]);
    cuttingBoardCombining('minersdelight:vegan_hamburger', [
      'minecraft:bread',
      'minersdelight:vegan_patty',
      '#c:vegetables/cabbage',
      '#c:vegetables/tomato',
      '#c:vegetables/onion',
    ]);
    cuttingBoardCombining('minersdelight:squid_sandwich', [
      'minecraft:bread',
      'culturaldelights:cooked_squid',
    ]);
    cuttingBoardCombining('minersdelight:insect_sandwich', [
      'minecraft:bread',
      'minersdelight:cooked_arthropod',
      'minersdelight:cooked_arthropod',
    ]);

    if (global.hasAllMods(['someassemblyrequired', 'trailandtales_delight'])) {
      cuttingBoardCombining('refurbished_furniture:cheese_sandwich', [
        'someassemblyrequired:bread_slice',
        'trailandtales_delight:cheese_slice',
        'someassemblyrequired:bread_slice',
      ]);
    }

    if (global.hasAllMods(['someassemblyrequired', 'culturaldelights'])) {
      cuttingBoardCombining('culturaldelights:avocado_toast', [
        'someassemblyrequired:toasted_bread_slice',
        'culturaldelights:cut_avocado',
      ]);
    }

    cuttingBoardCombining('refurbished_furniture:raw_vegetable_pizza', [
      'create:dough',
      'trailandtales_delight:cheese_slice',
      'minecraft:carrot',
      'minecraft:beetroot',
      'minecraft:potato',
    ]);
    cuttingBoardCombining('refurbished_furniture:raw_meatlovers_pizza', [
      'create:dough',
      'butchercraft:cooked_cubed_beef',
      'farmersdelight:cooked_chicken_cuts',
      'butchercraft:cooked_cubed_pork',
    ]);
    cuttingBoardCombining('createdelightcore:raw_cheese_pizza', [
      'create:dough',
      'trailandtales_delight:cheese_slice',
      'trailandtales_delight:cheese_slice',
      'trailandtales_delight:cheese_slice',
      'trailandtales_delight:cheese_slice',
    ]);
    ovenBaking('createdelightcore:raw_cheese_pizza', 'vintagedelight:cheese_pizza', 1, 300);

    event.replaceInput(
      { type: 'refurbished_furniture:workbench_constructing' },
      'minecraft:wheat',
      'farmersdelight:straw'
    );
  });
}
