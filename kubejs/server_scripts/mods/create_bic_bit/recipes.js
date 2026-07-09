if (global.hasAllMods(['create_bic_bit', 'create', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:create_bic_bit/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const filling = (path, output, input, fluid) => {
      event.recipes.create.filling(output, [input, Fluid.of(fluid, 250)]).id(id(`filling/${path}`));
    };

    [
      'create_bic_bit:mixing/mayonnaise',
      'create_bic_bit:mixing/mayonnaise_recipe',
      'create_bic_bit:mixing/curdled_milk',
      'create_bic_bit:mixing/raw_churros',
      'create_bic_bit:compat/farmersdelight/raw_churros',
      'create_bic_bit:mixing/raw_cheese_souffle',
      'create_bic_bit:mixing/bitterballen',
      'create_bic_bit:mixing/raw_frikandel',
      'create_bic_bit:compat/farmersdelight/frikandel',
      'create_bic_bit:mixing/raw_kroket',
      'create_bic_bit:compat/farmersdelight/kroket',
      'create_bic_bit:compat/farmersdelight/bitterballen',
      'create_bic_bit:compat/farmersdelight/oliebollen',
      'create_bic_bit:mixing/raw_eggball',
      'create_bic_bit:mixing/raw_fries',
      'create_bic_bit:compat/farmersdelight/raw_fries',
      'create_bic_bit:filling/ketchup_bottle',
      'create_bic_bit:emptying/ketchup',
      'create_bic_bit:filling/ketchup_kroket_sandwich',
      'create_bic_bit:filling/ketchup_mayonnaise_kroket_sandwich',
      'create_bic_bit:filling/mayonnaise_ketchup_kroket_sandwich',
      'create_bic_bit:filling/mayonnaise_kroket_sandwich',
      'create_bic_bit:filling/ketchup_frikandel_sandwich',
      'create_bic_bit:filling/ketchup_mayonnaise_frikandel_sandwich',
      'create_bic_bit:filling/mayonnaise_ketchup_frikandel_sandwich',
      'create_bic_bit:filling/mayonnaise_frikandel_sandwich',
      'create_bic_bit:filling/wrapped_ketchup_fries',
      'create_bic_bit:filling/wrapped_ketchup_mayonnaise_fries',
      'create_bic_bit:filling/wrapped_mayonnaise_ketchup_fries',
      'create_bic_bit:filling/wrapped_mayonnaise_fries',
      'create_bic_bit:mixing/frying_oil',
      'create_bic_bit:mixing/frying_oil_recipe',
      'create_bic_bit:deep_frying/bitterballen',
      'create_bic_bit:deep_frying/cheese_souffle',
      'create_bic_bit:deep_frying/churros',
      'create_bic_bit:deep_frying/crystallised_oil',
      'create_bic_bit:deep_frying/eggball',
      'create_bic_bit:deep_frying/enderball',
      'create_bic_bit:deep_frying/fries',
      'create_bic_bit:deep_frying/frikandel',
      'create_bic_bit:deep_frying/froglightochre',
      'create_bic_bit:deep_frying/froglightpearlescent',
      'create_bic_bit:deep_frying/froglightverdant',
      'create_bic_bit:deep_frying/ice',
      'create_bic_bit:deep_frying/kroket',
      'create_bic_bit:deep_frying/oliebollen',
      'create_deepfried:mixing/raw_springroll',
      'create_deepfried:compat/farmersdelight/mixing/raw_springroll',
      'create_deepfried:deep_frying/springroll',
      'create_deepfried:compat/farmersdelight/deep_frying/onion_rings',
      'create_deepfried:compat/farmersdelight/mixing/raw_onion_rings',
      'create_deepfried:compat/farmersdelight/mixing/raw_onion_rings2',
      'create_deepfried:compat/farmersdelight/deep_frying/arancini',
      'create_deepfried:compat/farmersdelight/deep_frying/blooming_onion',
      'create_deepfried:compat/farmersdelight/deep_frying/panzerotto',
      'create_deepfried:deep_frying/apfelkuchle',
      'create_deepfried:deep_frying/berliner',
      'create_deepfried:deep_frying/calamari',
      'create_deepfried:deep_frying/chicken_nuggets',
      'create_deepfried:deep_frying/corn_dog',
      'create_deepfried:deep_frying/deepfried_chocolate',
      'create_deepfried:deep_frying/donut',
      'create_deepfried:deep_frying/fried_chicken',
      'create_deepfried:deep_frying/tempura',
      'create_deepfried:deep_frying/yuca_fries',
      'create_deepfried:mixing/raw_chicken_nuggets',
    ].forEach(removeIfPresent);

    if (global.hasMod('bakeries')) {
      event.recipes.create
        .mixing('create_bic_bit:raw_churros', [
          'bakeries:flour',
          'minecraft:sugar',
          Fluid.water(100),
        ])
        .id(id('mixing/raw_churros'));
    }

    if (global.hasMod('ratatouille')) {
      event.recipes.ratatouille
        .threshing(
          [
            'create_bic_bit:sunflower_seeds',
            CreateItem.of(Item.of('2x create_bic_bit:sunflower_seeds'), 0.5),
          ],
          'minecraft:sunflower'
        )
        .processingTime(200)
        .id(id('threshing/sunflower_seeds'));
    }

    event.recipes.create
      .compacting(
        Fluid.of('createdieselgenerators:plant_oil', 500),
        '2x create_bic_bit:crushed_sunflower_seeds'
      )
      .id(id('compacting/plant_oil_from_crushed_sunflower_seeds'));

    event.recipes.create
      .mixing(Fluid.of('create_bic_bit:mayonnaise', 250), [
        fluid_tag_ingredient('c:egg_yolk', 100),
        Fluid.of('createdieselgenerators:plant_oil', 250),
      ])
      .id(id('mixing/mayonnaise'));

    event.recipes.create
      .filling('create_bic_bit:ketchup_bottle', [
        'minecraft:glass_bottle',
        Fluid.of('create_bic_bit:ketchup', 250),
      ])
      .id(id('filling/ketchup_bottle'));
    event.recipes.create
      .emptying(
        [Fluid.of('create_bic_bit:ketchup', 250), 'minecraft:glass_bottle'],
        'create_bic_bit:ketchup_bottle'
      )
      .id(id('emptying/ketchup_bottle'));

    [
      [
        'ketchup_kroket_sandwich',
        'create_bic_bit:ketchup_topped_kroket_sandwich',
        'create_bic_bit:kroket_sandwich',
      ],
      [
        'mayonnaise_ketchup_kroket_sandwich',
        'create_bic_bit:mayonnaise_ketchup_topped_kroket_sandwich',
        'create_bic_bit:mayonnaise_topped_kroket_sandwich',
      ],
      [
        'ketchup_frikandel_sandwich',
        'create_bic_bit:ketchup_topped_frikandel_sandwich',
        'create_bic_bit:frikandel_sandwich',
      ],
      [
        'mayonnaise_ketchup_frikandel_sandwich',
        'create_bic_bit:mayonnaise_ketchup_topped_frikandel_sandwich',
        'create_bic_bit:mayonnaise_topped_frikandel_sandwich',
      ],
      [
        'wrapped_ketchup_fries',
        'create_bic_bit:wrapped_ketchup_topped_fries',
        'create_bic_bit:wrapped_fries',
      ],
      [
        'wrapped_mayonnaise_ketchup_fries',
        'create_bic_bit:wrapped_mayonnaise_ketchup_topped_fries',
        'create_bic_bit:wrapped_mayonnaise_topped_fries',
      ],
    ].forEach((recipe) => filling(recipe[0], recipe[1], recipe[2], 'create_bic_bit:ketchup'));

    event.recipes.create
      .mixing(Fluid.of('create_bic_bit:curdled_milk', 1000), [
        Fluid.of('createdelightcore:vinegar', 250),
        Fluid.of('minecraft:milk', 1000),
        'createdelightcore:dry_yeast',
      ])
      .heated()
      .id(id('mixing/curdled_milk'));

    event.recipes.create
      .compacting('vintagedelight:cheese_curds', Fluid.of('create_bic_bit:curdled_milk', 250))
      .id(id('compacting/cheese_curds'));

    if (global.hasAllMods(['bakeries', 'trailandtales_delight'])) {
      event.recipes.create
        .mixing('create_bic_bit:raw_cheese_souffle', [
          Ingredient.of('#c:cheese'),
          'bakeries:flour',
          fluid_tag_ingredient('c:egg_yolk', 100),
        ])
        .id(id('mixing/raw_cheese_souffle'));
    }

    if (global.hasMod('farmersdelight')) {
      event.recipes.create
        .mixing('create_bic_bit:sweet_dough', [
          Fluid.of('create:honey', 100),
          'farmersdelight:wheat_dough',
        ])
        .id(id('mixing/sweet_dough'));
    }

    if (global.hasMod('bakeries')) {
      [
        [
          'create_bic_bit:raw_frikandel',
          ['#c:ground_meat/raw', 'bakeries:flour', fluid_tag_ingredient('c:egg_yolk', 100)],
        ],
        [
          'create_bic_bit:raw_kroket',
          [
            '#c:ground_meat/raw',
            '2x bakeries:flour',
            'createdelightcore:butter',
            fluid_tag_ingredient('c:egg_yolk', 100),
          ],
        ],
        [
          '2x create_bic_bit:raw_bitterballen',
          [
            '#c:ground_meat/raw',
            'bakeries:flour',
            'createdelightcore:butter',
            fluid_tag_ingredient('c:egg_yolk', 100),
          ],
        ],
      ].forEach((recipe) => {
        event.recipes.create
          .mixing(
            recipe[0],
            recipe[1].map((ingredient) =>
              typeof ingredient === 'string' && ingredient.startsWith('#')
                ? Ingredient.of(ingredient)
                : ingredient
            )
          )
          .id(
            id(
              `mixing/${
                String(recipe[0])
                  .replace(/^\d+x\s+/, '')
                  .split(':')[1]
              }`
            )
          );
      });
    }

    if (global.hasAllMods(['mynethersdelight', 'bakeries'])) {
      event.recipes.create
        .mixing('create_bic_bit:raw_eggball', [
          'mynethersdelight:boiled_egg',
          'bakeries:flour',
          Fluid.water(50),
        ])
        .id(id('mixing/raw_eggball'));
    }

    if (global.hasAllMods(['create_deepfried', 'bakeries'])) {
      event.recipes.create
        .mixing('createdelightcore:unfried_calamari', [
          'bakeries:flour',
          'createdelightcore:raw_calamari',
          Fluid.water(50),
        ])
        .id(id('mixing/unfried_calamari'));

      event.recipes.create
        .mixing('create_deepfried:raw_tempura', [
          'bakeries:flour',
          Ingredient.of('#c:foods/seafood'),
          Fluid.water(50),
        ])
        .id(id('mixing/raw_tempura_from_seafood'));
      event.recipes.create
        .mixing('create_deepfried:raw_tempura', [
          'bakeries:flour',
          Ingredient.of('#c:vegetables').withCount(3),
          Fluid.water(50),
        ])
        .id(id('mixing/raw_tempura_from_vegetables'));

      event.recipes.create
        .mixing('create_deepfried:raw_onion_rings', [
          'someassemblyrequired:sliced_onion',
          'bakeries:flour',
          Fluid.water(50),
        ])
        .id(id('mixing/raw_onion_rings'));

      event.recipes.create
        .deploying('create_deepfried:raw_donut', ['farmersdelight:wheat_dough', 'minecraft:stick'])
        .keepHeldItem()
        .id(id('deploying/raw_donut'));
    }
  });
}

if (global.hasMod('create_bic_bit')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids;

    event.removeAllTagsFrom(
      existingItems([
        'create_bic_bit:unripe_cheese',
        'create_bic_bit:waxed_unripe_cheese',
        'create_bic_bit:young_cheese',
        'create_bic_bit:waxed_young_cheese',
        'create_bic_bit:aged_cheese',
        'create_bic_bit:waxed_aged_cheese',
        'create_bic_bit:unripe_cheese_wedge',
        'create_bic_bit:young_cheese_wedge',
        'create_bic_bit:aged_cheese_wedge',
        'create_deepfried:yuca',
        'create_deepfried:apple_slices',
      ])
    );
    event.add('c:mayonnaise', existingItems(['create_bic_bit:mayonnaise_bottle']));
    event.add(
      'c:foods/seafood',
      existingItems([
        '#minecraft:fishes',
        '#crabbersdelight:lobster',
        '#crabbersdelight:crab',
        '#crabbersdelight:shrimps',
      ])
    );
  });
}

if (global.hasAllMods(['create_bic_bit', 'create_deepfried', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event.addBlockModifier('minecraft:dead_bush').removeLoot('create_deepfried:yuca');
    event.addBlockModifier('minecraft:sunflower').removeLoot('create_bic_bit:sunflower_seeds');
  });
}
