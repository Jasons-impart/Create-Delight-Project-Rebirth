if (global.hasAllMods(['create_confectionery', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;

    create
      .mixing(Fluid.of('create_confectionery:black_chocolate', 1000), [
        'create_confectionery:black_chocolate_bricks',
      ])
      .heated()
      .id('create_confectionery:black_chocolate_recipe_6');
    create
      .mixing(Fluid.of('create:chocolate', 1000), ['create_confectionery:chocolate_bricks'])
      .heated()
      .id('create_confectionery:chocolate_recipe_6');
    create
      .mixing(Fluid.of('create_confectionery:ruby_chocolate', 1000), [
        'create_confectionery:ruby_chocolate_bricks',
      ])
      .heated()
      .id('create_confectionery:ruby_chocolate_recipe_6');
    create
      .mixing(Fluid.of('create_confectionery:white_chocolate', 1000), [
        'create_confectionery:white_chocolate_bricks',
      ])
      .heated()
      .id('create_confectionery:white_chocolate_recipe_6');
  });
}

if (global.hasAllMods(['create_confectionery', 'create', 'bakeries'])) {
  ServerEvents.recipes((event) => {
    event.recipes.create
      .mixing('2x create_confectionery:honey_candy', [
        '2x minecraft:sugar',
        'bakeries:flour',
        Fluid.of('create:honey', 250),
      ])
      .id('createdelightcore:create_confectionery/honey_candy');
  });
}

if (global.hasAllMods(['create_confectionery', 'create', 'createcafe'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['createcafe:mixing/syrups/caramel_syrup_mixing']);

    event.recipes.create
      .mixing(Fluid.of('create_confectionery:caramel', 250), [
        Fluid.water(250),
        '2x minecraft:sugar',
      ])
      .superheated()
      .id('createdelightcore:create_confectionery/caramel');

    event.recipes.create
      .filling('createcafe:caramel_iced_coffee', [
        'createcafe:iced_coffee',
        Fluid.of('create_confectionery:caramel', 250),
      ])
      .id('createdelightcore:create_confectionery/filling/caramel_iced_coffee');
  });
}

if (global.hasAllMods(['create_confectionery', 'create', 'corn_delight', 'culturaldelights'])) {
  ServerEvents.recipes((event) => {
    event.recipes.create
      .filling('corn_delight:caramel_popcorn', [
        'culturaldelights:popcorn',
        Fluid.of('create_confectionery:caramel', 250),
      ])
      .id('createdelightcore:create_confectionery/filling/caramel_popcorn');

    if (global.hasMod('farmersdelight')) {
      event.recipes.farmersdelight
        .cooking(
          'meals',
          ['create_confectionery:bar_of_caramel', 'culturaldelights:corn_kernels'],
          'corn_delight:caramel_popcorn',
          1.0,
          200
        )
        .id('createdelightcore:create_confectionery/cooking/caramel_popcorn');
    }
  });
}
