if (global.hasAllMods(['vinery', 'create', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:vinery/${path}`;
    const bottleFluid = (bottle, fluid, amount) => {
      const path = fluid.split(':')[1];
      event.recipes.create
        .filling(bottle, ['vinery:wine_bottle', Fluid.of(fluid, amount)])
        .id(id(`filling/${path}`));
      event.recipes.create
        .emptying(['vinery:wine_bottle', Fluid.of(fluid, amount)], bottle)
        .id(id(`emptying/${path}`));
    };
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const fluidBase = (fluid, amount) => {
      return {
        amount: amount,
        ingredient: { id: fluid },
        unit: 'millibuckets',
      };
    };
    const juiceFluid = (juice) => {
      const parts = juice.split('_');

      if (juice === 'apple') {
        return 'createdelightcore:apple_juice';
      }

      if (parts[1] === 'general') {
        return `createdelightcore:${parts[0]}_grapejuice`;
      }

      if (parts[1] === 'warped' || parts[1] === 'crimson') {
        return `createdelightcore:${parts[1]}_grapejuice`;
      }

      return `createdelightcore:${parts[1]}_${parts[0]}_grapejuice`;
    };
    const wineFermenting = (wine, juice, ingredients) => {
      const bottle = `vinery:${wine}`;
      const wineFluid = `createdelightcore:${wine}`;
      const baseFluid = juiceFluid(juice);

      if (!global.hasMod('brewinandchewin')) {
        return;
      }

      removeIfPresent(`vinery:wine_fermentation/${wine}`);

      event.recipes.brewinandchewin
        .fermenting(
          { id: wineFluid, amount: 1000 },
          ingredients.map((ingredient) => Ingredient.of(ingredient)),
          fluidBase(baseFluid, 1000)
        )
        .experience(1.0)
        .fermentingtime(4800)
        .temperature(3)
        .unit('millibuckets')
        .id(id(`fermenting/${wine}`));
    };

    [
      'conditional:create/mixing/red_grape_juice_mixing',
      'conditional:create/mixing/red_taiga_grape_juice_mixing',
      'conditional:create/mixing/red_jungle_grape_juice_mixing',
      'conditional:create/mixing/red_savanna_grape_juice_mixing',
      'conditional:create/mixing/white_grape_juice_mixing',
      'conditional:create/mixing/white_taiga_grape_juice_mixing',
      'conditional:create/mixing/white_jungle_grape_juice_mixing',
      'conditional:create/mixing/white_savanna_grape_juice_mixing',
    ].forEach(removeIfPresent);

    [
      ['vinery:red_grape', 'vinery:red_grapejuice', 'createdelightcore:red_grapejuice'],
      [
        'vinery:jungle_grapes_red',
        'vinery:red_jungle_grapejuice',
        'createdelightcore:jungle_red_grapejuice',
      ],
      [
        'vinery:savanna_grapes_red',
        'vinery:red_savanna_grapejuice',
        'createdelightcore:savanna_red_grapejuice',
      ],
      [
        'vinery:taiga_grapes_red',
        'vinery:red_taiga_grapejuice',
        'createdelightcore:taiga_red_grapejuice',
      ],
      ['vinery:white_grape', 'vinery:white_grapejuice', 'createdelightcore:white_grapejuice'],
      [
        'vinery:jungle_grapes_white',
        'vinery:white_jungle_grapejuice',
        'createdelightcore:jungle_white_grapejuice',
      ],
      [
        'vinery:savanna_grapes_white',
        'vinery:white_savanna_grapejuice',
        'createdelightcore:savanna_white_grapejuice',
      ],
      [
        'vinery:taiga_grapes_white',
        'vinery:white_taiga_grapejuice',
        'createdelightcore:taiga_white_grapejuice',
      ],
      // 呃呃啊啊: nethervinery warped/crimson grapejuice fluids are missing for now.
      // [
      //   'nethervinery:warped_grape',
      //   'nethervinery:warped_grapejuice',
      //   'createdelightcore:warped_grapejuice',
      // ],
      // [
      //   'nethervinery:crimson_grape',
      //   'nethervinery:crimson_grapejuice',
      //   'createdelightcore:crimson_grapejuice',
      // ],
    ].forEach((recipe) => {
      const grape = recipe[0];
      const bottle = recipe[1];
      const fluid = recipe[2];
      const path = fluid.split(':')[1];

      event.recipes.create.mixing(Fluid.of(fluid, 250), grape).id(id(`mixing/${path}`));
      bottleFluid(bottle, fluid, 250);
    });

    event.recipes.create
      .pressing('vinery:apple_mash', 'minecraft:apple')
      .id(id('pressing/apple_mash'));

    event.recipes.create
      .compacting(Fluid.of('createdelightcore:apple_juice', 250), 'vinery:apple_mash')
      .id(id('compacting/apple_juice'));

    bottleFluid('vinery:apple_juice', 'createdelightcore:apple_juice', 250);

    [
      'aegis_wine',
      'apple_cider',
      'apple_wine',
      'bolvar_wine',
      'bottle_mojang_noir',
      'chenet_wine',
      'cherry_wine',
      'chorus_wine',
      'clark_wine',
      'creepers_crush',
      'cristel_wine',
      'eiswein',
      'glowing_wine',
      'jellie_wine',
      'jo_special_mixture',
      'kelp_cider',
      'lilitu_wine',
      'magnetic_wine',
      'mead',
      'mellohi_wine',
      'noir_wine',
      'red_wine',
      'solaris_wine',
      'stal_wine',
      'strad_wine',
      'villagers_fright',
    ].forEach((wine) => {
      bottleFluid(`vinery:${wine}`, `createdelightcore:${wine}`, 250);
    });

    [
      ['aegis_wine', 'white_taiga', ['minecraft:sugar', 'minecraft:kelp', 'minecraft:iron_ingot']],
      ['apple_cider', 'apple', ['minecraft:sugar']],
      ['apple_wine', 'apple', ['vinery:apple_juice']],
      ['bolvar_wine', 'red_taiga', ['minecraft:honey_bottle', 'vinery:cherry']],
      [
        'bottle_mojang_noir',
        'red_general',
        ['minecraft:honey_bottle', 'vinery:cherry', 'vinery:red_wine'],
      ],
      ['chenet_wine', 'red_jungle', ['minecraft:spider_eye', 'minecraft:honey_bottle']],
      ['cherry_wine', 'red_general', ['vinery:cherry']],
      ['chorus_wine', 'red_taiga', ['minecraft:chorus_fruit']],
      ['clark_wine', 'white_jungle', ['minecraft:sugar']],
      ['creepers_crush', 'white_savanna', ['minecraft:gunpowder']],
      [
        'cristel_wine',
        'red_general',
        ['minecraft:sugar', 'minecraft:feather', 'minecraft:blaze_rod'],
      ],
      ['eiswein', 'white_taiga', ['minecraft:snowball']],
      ['glowing_wine', 'white_general', ['minecraft:glow_berries']],
      [
        'jellie_wine',
        'white_general',
        ['vinery:apple_wine', 'vinery:chenet_wine', 'vinery:bolvar_wine'],
      ],
      ['jo_special_mixture', 'red_savanna', ['minecraft:fermented_spider_eye']],
      ['kelp_cider', 'white_savanna', ['minecraft:kelp']],
      ['lilitu_wine', 'red_savanna', ['minecraft:honey_bottle', 'vinery:cherry']],
      ['magnetic_wine', 'red_jungle', ['minecraft:iron_ingot']],
      ['mead', 'apple', ['minecraft:honey_bottle', 'minecraft:sugar']],
      ['mellohi_wine', 'white_general', ['minecraft:sugar', 'minecraft:glowstone_dust']],
      ['noir_wine', 'red_general', ['minecraft:sweet_berries']],
      ['red_wine', 'red_general', ['minecraft:sugar']],
      ['solaris_wine', 'white_general', ['minecraft:honey_bottle', 'minecraft:sweet_berries']],
      ['stal_wine', 'red_jungle', ['minecraft:cocoa_beans', 'minecraft:sugar']],
      ['strad_wine', 'red_general', ['minecraft:cocoa_beans', 'minecraft:sugar']],
      ['villagers_fright', 'white_jungle', ['minecraft:arrow']],
    ].forEach(([wine, juice, ingredients]) => wineFermenting(wine, juice, ingredients));
  });
}
