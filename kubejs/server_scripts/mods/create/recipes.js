if (global.hasMod('create')) {
  ServerEvents.recipes((event) => {
    const { create, createmetallurgy, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:create/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const itemId = (item) => String(item).replace(/^\d+x\s+/, '');
    const shapedIfPresent = (output, pattern, keys, path) => {
      const outputId = itemId(output);
      const ingredients = Object.keys(keys).map((key) => keys[key]);

      event.shaped(output, pattern, keys).id(id(path));
    };
    const shapelessIfPresent = (output, ingredients, path) => {
      const outputId = itemId(output);

      event.shapeless(output, ingredients).id(id(path));
    };

    [
      'create:pressing/sugar_cane',
      'create:splashing/iceandfire/crushed_raw_silver',
      'create:mixing/brass_ingot',
      'create:crafting/kinetics/empty_blaze_burner',
      'create:crafting/schematics/schematicannon',
      'create:crafting/logistics/andesite_tunnel',
      'create:crafting/logistics/andesite_funnel',
      'create:crafting/logistics/packager',
      'create:crafting/kinetics/mechanical_harvester',
      'minecraft:chain',
      'create:crafting/appliances/chain_from_zinc',
      'create:crafting/logistics/package_frogport',
      'create:crafting/materials/transmitter',
      'create:crafting/logistics/stock_link',
      'create:compacting/blaze_cake',
      'create:crafting/materials/rose_quartz',
      'createutilities:sandpaper_polishing/polished_amethyst',
    ].forEach(removeIfPresent);

    if (global.hasMod('vintageimprovements')) {
      create
        .milling('createdelightcore:carbon_dust', 'createmetallurgy:graphite')
        .id(id('milling/carbon_dust'));
      vintageimprovements
        .pressurizing('createdelightcore:carbon_plate', 'createdelightcore:carbon_dust', 200)
        .heated()
        .id(id('pressurizing/carbon_plate'));
    }

    shapedIfPresent(
      'create:stock_link',
      ['A', 'B', 'C'],
      { A: 'create:transmitter', B: 'create:item_vault', C: 'create:brass_casing' },
      'crafting/logistics/stock_link'
    );
    shapedIfPresent(
      'create:transmitter',
      ['A', 'B', 'C'],
      { A: 'minecraft:lightning_rod', B: 'createaddition:copper_spool', C: 'minecraft:redstone' },
      'crafting/materials/transmitter'
    );
    shapedIfPresent(
      'create:package_frogport',
      ['A', 'B', 'C'],
      { A: 'iceandfire:chain_sticky', B: 'create:item_vault', C: 'create:andesite_casing' },
      'crafting/logistics/package_frogport'
    );
    shapedIfPresent(
      'minecraft:chain',
      ['B', 'A', 'B'],
      { A: 'createaddition:iron_rod', B: 'minecraft:iron_nugget' },
      'crafting/chain_from_iron_rod'
    );
    shapedIfPresent(
      'minecraft:chain',
      ['B', 'A', 'B'],
      { A: 'vintageimprovements:zinc_rod', B: 'create:zinc_nugget' },
      'crafting/chain_from_zinc_rod'
    );
    shapedIfPresent(
      'create:mechanical_harvester',
      ['ABA', 'ABA', ' C '],
      { A: 'create:iron_sheet', B: 'createaddition:iron_rod', C: 'create:andesite_casing' },
      'crafting/kinetics/mechanical_harvester'
    );
    shapedIfPresent(
      'create:packager',
      [' A ', 'ABA', 'CAC'],
      { A: 'create:iron_sheet', B: 'create:cardboard_block', C: 'minecraft:redstone' },
      'crafting/logistics/packager'
    );
    shapedIfPresent(
      'create:andesite_tunnel',
      ['AA', 'BB'],
      { A: 'createdeco:andesite_sheet', B: 'minecraft:dried_kelp' },
      'crafting/logistics/andesite_tunnel'
    );
    shapedIfPresent(
      'create:andesite_funnel',
      ['A', 'B'],
      { A: 'createdeco:andesite_sheet', B: 'minecraft:dried_kelp' },
      'crafting/logistics/andesite_funnel'
    );

    create
      .mixing('minecraft:diorite', [Ingredient.of('#c:cobblestones/normal'), 'minecraft:quartz'])
      .id(id('mixing/diorite'));
    create
      .compacting('minecraft:calcite', ['minecraft:flint', 'minecraft:bone_block', Fluid.lava(100)])
      .id(id('compacting/calcite'));
    create.compacting('create:cardboard', ['3x minecraft:paper']).id(id('compacting/cardboard'));
    event
      .blasting(Item.of('create:zinc_block'), 'create:raw_zinc_block')
      .id(id('blasting/zinc_block'));
    event
      .smelting(Item.of('create:zinc_block'), 'create:raw_zinc_block')
      .id(id('smelting/zinc_block'));

    event.replaceInput(
      { id: 'create:crafting/kinetics/deployer' },
      'create:electron_tube',
      Ingredient.of('#c:springs/between_500_2_1000')
    );

    shapelessIfPresent(
      'create:rose_quartz',
      ['4x minecraft:redstone', 'minecraft:quartz'],
      'crafting/rose_quartz'
    );
    create
      .sandpaper_polishing('create:polished_rose_quartz', 'create:rose_quartz')
      .id(id('sandpaper_polishing/rose_quartz'));
    create
      .cutting('create:polished_rose_quartz', 'create:rose_quartz')
      .id(id('cutting/polished_rose_quartz'));
    event.remove({
      type: 'minecraft:stonecutting',
      output: 'create:rose_quartz_block',
      input: 'create:rose_quartz',
    });
    event.remove({
      type: 'minecraft:stonecutting',
      output: 'create:rose_quartz_tiles',
      input: 'create:polished_rose_quartz',
    });
    event.remove({
      type: 'minecraft:stonecutting',
      output: 'create:small_rose_quartz_tiles',
      input: 'create:polished_rose_quartz',
    });
    shapedIfPresent(
      '8x create:rose_quartz_block',
      ['AA', 'AA'],
      { A: 'create:rose_quartz' },
      'crafting/rose_quartz_block'
    );
    shapedIfPresent(
      '8x create:rose_quartz_tiles',
      ['AA', 'AA'],
      { A: 'create:polished_rose_quartz' },
      'crafting/rose_quartz_tiles'
    );

    if (global.hasMod('createutilities')) {
      create
        .cutting('createutilities:polished_amethyst', 'minecraft:amethyst_shard')
        .id(id('cutting/polished_amethyst'));
    }

    shapelessIfPresent(
      'create:weighted_ejector',
      ['#c:springs/between_500_2_1000', 'create:depot', 'create:cogwheel'],
      'crafting/kinetics/weighted_ejector'
    );
    shapelessIfPresent(
      '3x create:portable_storage_interface',
      ['#c:springs/below_500', 'create:andesite_casing', 'create:chute'],
      'crafting/kinetics/portable_storage_interface'
    );
    shapelessIfPresent(
      'create:portable_fluid_interface',
      ['#c:springs/below_500', 'create:copper_casing', 'create:chute'],
      'crafting/kinetics/portable_fluid_interface'
    );
    shapedIfPresent(
      'create:spout',
      ['ABA', ' C '],
      { A: 'create:copper_sheet', B: 'create:copper_casing', C: 'minecraft:dried_kelp' },
      'crafting/kinetics/spout'
    );
    shapedIfPresent(
      'create:schematicannon',
      ['D D', 'CAC', 'BBB'],
      {
        A: 'minecraft:dispenser',
        B: 'minecraft:smooth_stone',
        C: '#minecraft:logs',
        D: 'create:iron_sheet',
      },
      'crafting/schematics/schematicannon'
    );
    shapedIfPresent(
      '2x create:steam_engine',
      [' A ', ' B ', ' C '],
      { A: 'create:shaft', B: '#c:springs/between_500_2_1000', C: 'minecraft:copper_block' },
      'crafting/kinetics/steam_engine'
    );
    shapedIfPresent(
      'create:steam_whistle',
      [' A ', ' B ', ' C '],
      { A: 'create:golden_sheet', B: '#c:springs/below_500', C: 'minecraft:copper_ingot' },
      'crafting/kinetics/steam_whistle'
    );
    shapedIfPresent(
      'create:mechanical_arm',
      ['AAB', 'AC ', 'DE '],
      {
        A: 'create:brass_sheet',
        B: 'create:andesite_alloy',
        C: '#c:springs/between_500_2_1000',
        D: 'create:precision_mechanism',
        E: 'create:brass_casing',
      },
      'crafting/kinetics/mechanical_arm'
    );

    create
      .mixing('2x create:brass_nugget', [
        Ingredient.of('#c:nuggets/copper'),
        Ingredient.of('#c:nuggets/zinc'),
      ])
      .heated()
      .id(id('mixing/brass_nugget'));

    if (global.hasMod('vintageimprovements')) {
      vintageimprovements
        .turning('8x create:chute', Ingredient.of('#c:storage_blocks/iron'))
        .id(id('turning/chute'));
      vintageimprovements
        .turning('3x create:item_vault', Ingredient.of('#c:storage_blocks/iron'))
        .id(id('turning/item_vault'));
      vintageimprovements
        .turning('3x create:fluid_tank', 'minecraft:copper_block')
        .id(id('turning/fluid_tank'));
      vintageimprovements
        .curving('create:fluid_pipe', 'create:copper_sheet')
        .mode(4)
        .id(id('curving/fluid_pipe'));

      if (global.hasMod('createdelightcore')) {
        vintageimprovements
          .turning('9x create:fluid_tank', Ingredient.of('#c:storage_blocks/bronze'))
          .id(id('turning/fluid_tank_from_bronze'));
        vintageimprovements
          .curving('3x create:fluid_pipe', Ingredient.of('#c:plates/bronze'))
          .mode(4)
          .id(id('curving/fluid_pipe_from_bronze'));
        vintageimprovements
          .turning('9x create:item_vault', Ingredient.of('#c:storage_blocks/tungsten'))
          .id(id('turning/item_vault_from_tungsten'));
        vintageimprovements
          .hammering('create:sturdy_sheet', Ingredient.of('#c:ingots/steel'))
          .id(id('hammering/sturdy_sheet_from_steel'));
        vintageimprovements
          .hammering('create:sturdy_sheet', Ingredient.of('#c:ingots/tungsten'))
          .id(id('hammering/sturdy_sheet_from_tungsten'));
      }
    }

    if (global.hasMod('createmetallurgy')) {
      createmetallurgy
        .casting_in_basin('create:railway_casing', [
          'create:brass_casing',
          Fluid.of('createmetallurgy:molten_steel', 90),
        ])
        .processingTime(70)
        .id(id('casting_in_basin/railway_casing'));

      createmetallurgy
        .casting_in_basin('create:andesite_casing', [
          '#minecraft:stripped_logs',
          Fluid.of('createdelightcore:molten_andesite', 90),
        ])
        .processingTime(70)
        .id(id('casting_in_basin/andesite_casing'));
    }

    shapedIfPresent(
      'create:empty_blaze_burner',
      [' A ', 'ABA', ' A '],
      { A: 'createaddition:iron_rod', B: 'minecraft:netherrack' },
      'crafting/kinetics/empty_blaze_burner'
    );
    event
      .stonecutting(Item.of('create:industrial_iron_block', 6), 'createmetallurgy:steel_ingot')
      .id(id('stonecutting/industrial_iron_block_from_steel_ingot'));

    create
      .deploying('2x create:precision_mechanism', ['create:brass_sheet', 'alexscaves:telecore'])
      .id(id('deploying/precision_mechanism_from_telecore'));

    shapedIfPresent(
      'create:blaze_burner',
      ['AAA', 'BCB', 'BDB'],
      {
        A: 'minecraft:blaze_powder',
        B: 'minecraft:blaze_rod',
        C: 'create:empty_blaze_burner',
        D: '#mynethersdelight:bullet_pepper',
      },
      'crafting/blaze_burner'
    );

    if (global.hasMod('supplementaries')) {
      create
        .sequenced_assembly('minecraft:tnt', Ingredient.of('#c:sands'), [
          create.filling('minecraft:sand', [
            'minecraft:sand',
            Fluid.of('supplementaries:lumisene', 100),
          ]),
        ])
        .transitionalItem('minecraft:sand')
        .loops(4)
        .id(id('sequenced_assembly/tnt'));
    }

    create
      .mixing('create:pulp', Fluid.of('createdelightcore:paper_pulp', 50))
      .heated()
      .id(id('mixing/pulp'));

    [
      ['minecraft:cobbled_deepslate', 'minecraft:deepslate'],
      ['minecraft:cobblestone', 'minecraft:stone'],
    ].forEach((recipe) => {
      create.milling(recipe[0], recipe[1]).id(id(`milling/${recipe[1].split(':')[1]}`));
    });

    create
      .cutting('2x ratatouille:sausage_casing', 'minecraft:slime_ball')
      .id(id('cutting/sausage_casing'));

    create
      .compacting('2x minecraft:sponge', [
        'minecraft:sponge',
        '4x alexscaves:ping_pong_sponge',
        Fluid.water(50),
      ])
      .heated()
      .id(id('compacting/sponge'));
  });
}
