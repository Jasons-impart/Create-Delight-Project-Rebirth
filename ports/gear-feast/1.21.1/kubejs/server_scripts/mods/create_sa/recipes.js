if (global.hasAllMods(['create_sa', 'create', 'createmetallurgy', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'create_sa:blazing_pickaxe_recipe',
      'create_sa:blazing_shovel_recipe',
      'create_sa:blazing_axe_recipe',
      'create_sa:blazing_sword_recipe',
      'create_sa:vault_recipe',
      'create_sa:heap_of_experience_recipe',
      'create_sa:experience_pickaxe_recipe',
      'create_sa:experience_shovel_recipe',
      'create_sa:experience_axe_recipe',
      'create_sa:experience_sword_recipe',
      'create_sa:zinc_handle_recipe',
      'create_sa:block_picker_recipe',
      'create_sa:flamethrower_recipe',
      'create_sa:copper_magnet_recipe',
      'create_enchantment_industry:grinding/create_sa/heap_of_experience',
    ]);
    remove_recipes_output(event, [
      'create_sa:heat_engine',
      'create_sa:steam_engine',
      'create_sa:hydraulic_engine',
    ]);

    event
      .shaped('create_sa:copper_magnet', ['AAA', 'ABA', 'AAA'], {
        A: 'create:copper_sheet',
        B: 'create_new_age:magnetite_block',
      })
      .id('createdelightcore:create_sa/crafting/copper_magnet');

    event.recipes.create
      .sequenced_assembly('create_sa:hydraulic_engine', 'create:precision_mechanism', [
        event.recipes.create.filling('create_sa:incomplete_hydraulic_engine', [
          'create_sa:incomplete_hydraulic_engine',
          Fluid.of('createmetallurgy:molten_copper', 450),
        ]),
        event.recipes.create.deploying('create_sa:incomplete_hydraulic_engine', [
          'create_sa:incomplete_hydraulic_engine',
          'create:fluid_pipe',
        ]),
        event.recipes.create.filling('create_sa:incomplete_hydraulic_engine', [
          'create_sa:incomplete_hydraulic_engine',
          Fluid.water(250),
        ]),
      ])
      .loops(1)
      .transitionalItem('create_sa:incomplete_hydraulic_engine')
      .id('createdelightcore:create_sa/sequenced_assembly/hydraulic_engine');

    event.recipes.create
      .sequenced_assembly('create_sa:hydraulic_engine', 'create:copper_sheet', [
        event.recipes.create.deploying('create_sa:incomplete_hydraulic_engine', [
          'create_sa:incomplete_hydraulic_engine',
          'create:cogwheel',
        ]),
        event.recipes.create.deploying('create_sa:incomplete_hydraulic_engine', [
          'create_sa:incomplete_hydraulic_engine',
          'create:large_cogwheel',
        ]),
        event.recipes.create.deploying('create_sa:incomplete_hydraulic_engine', [
          'create_sa:incomplete_hydraulic_engine',
          Ingredient.of('#c:springs/below_500'),
        ]),
        event.recipes.create.filling('create_sa:incomplete_hydraulic_engine', [
          'create_sa:incomplete_hydraulic_engine',
          Fluid.water(100),
        ]),
      ])
      .loops(3)
      .transitionalItem('create_sa:incomplete_hydraulic_engine')
      .id('createdelightcore:create_sa/sequenced_assembly/hydraulic_engine_from_sheet');

    event.recipes.create
      .sequenced_assembly('create_sa:heat_engine', 'create_sa:hydraulic_engine', [
        event.recipes.create.filling('create_sa:incomplete_heat_engine', [
          'create_sa:incomplete_heat_engine',
          Fluid.of('createdelightcore:molten_andesite', 450),
        ]),
        event.recipes.create.deploying('create_sa:incomplete_heat_engine', [
          'create_sa:incomplete_heat_engine',
          Ingredient.of('#c:springs/between_500_2_1000'),
        ]),
        event.recipes.create.deploying('create_sa:incomplete_heat_engine', [
          'create_sa:incomplete_heat_engine',
          Ingredient.of('#c:nuggets/tungsten'),
        ]),
      ])
      .loops(1)
      .transitionalItem('create_sa:incomplete_heat_engine')
      .id('createdelightcore:create_sa/sequenced_assembly/heat_engine');

    event.recipes.create
      .sequenced_assembly('create_sa:steam_engine', 'create_sa:heat_engine', [
        event.recipes.create.filling('create_sa:incomplete_steam_engine', [
          'create_sa:incomplete_steam_engine',
          Fluid.of('createmetallurgy:molten_brass', 450),
        ]),
        event.recipes.create.deploying('create_sa:incomplete_steam_engine', [
          'create_sa:incomplete_steam_engine',
          'create:electron_tube',
        ]),
        event.recipes.create.deploying('create_sa:incomplete_steam_engine', [
          'create_sa:incomplete_steam_engine',
          'create:propeller',
        ]),
      ])
      .loops(1)
      .transitionalItem('create_sa:incomplete_steam_engine')
      .id('createdelightcore:create_sa/sequenced_assembly/steam_engine');

    event.recipes.create
      .mechanical_crafting(
        'create_sa:andesite_exoskeleton_chestplate',
        ['ABCBA', 'AADAA', 'FEAEF'],
        {
          A: 'create:andesite_alloy',
          B: 'create:shaft',
          C: 'create:belt_connector',
          D: 'create_sa:heat_engine',
          E: '#c:ingots/zinc',
          F: '#c:stones',
        }
      )
      .id('createdelightcore:create_sa/mechanical_crafting/andesite_exoskeleton');
  });
}
