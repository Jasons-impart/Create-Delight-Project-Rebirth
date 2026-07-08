if (global.hasAllMods(['createaddition', 'create', 'create_sa', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, minecraft, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:createaddition/${path}`;

    remove_recipes_id(event, [
      'createaddition:compacting/cake_base',
      'createaddition:smoking/cake_base_baked',
      'createaddition:compacting/seed_oil',
      'createaddition:mixing/bioethanol',
      'createaddition:crafting/capacitor_1',
      'createaddition:crafting/capacitor_2',
      'createaddition:crafting/large_connector',
      'createaddition:compacting/biomass_pellet',
      'createaddition:crafting/biomass_pallet_block',
      'createaddition:crafting/biomass_pellet_from_biomass_pallet_block',
      'createaddition:mixing/electrum',
      'createaddition:mixing/biomass_from_crops',
      'createaddition:mixing/biomass_from_flowers',
      'createaddition:mixing/biomass_from_honeycomb',
      'createaddition:mixing/biomass_from_leaves',
      'createaddition:mixing/biomass_from_plant_foods',
      'createaddition:mixing/biomass_from_plants',
      'createaddition:mixing/biomass_from_saplings',
      'createaddition:mixing/biomass_from_stricks',
      'createaddition:mechanical_crafting/tesla_coil',
      'createaddition:mechanical_crafting/electric_motor',
      'createaddition:mechanical_crafting/alternator',
      'createaddition:crafting/modular_accumulator',
      'createaddition:crafting/portable_energy_interface',
    ]);
    remove_recipes_input(event, ['createaddition:cake_base_baked']);
    remove_recipes_output(event, ['createaddition:biomass']);

    minecraft
      .crafting_shaped('2x createaddition:capacitor', [' A ', ' B ', ' C '], {
        A: 'create:copper_sheet',
        B: 'createaddition:zinc_sheet',
        C: 'createaddition:copper_rod',
      })
      .id(id('crafting/capacitor'));

    kubejs
      .shapeless('2x createaddition:large_connector', [
        Ingredient.of('#c:rods/electric'),
        'create:andesite_alloy',
        'create:andesite_alloy',
        Ingredient.of('#c:slime_balls'),
      ])
      .id(id('crafting/large_connector'));

    create
      .sequenced_assembly('createaddition:modular_accumulator', 'create:brass_sheet', [
        vintageimprovements.curving('createdelightcore:incompleted_modular_accumulator', [
          'createdelightcore:incompleted_modular_accumulator',
        ]),
        create.deploying('createdelightcore:incompleted_modular_accumulator', [
          'createdelightcore:incompleted_modular_accumulator',
          Ingredient.of('#c:wires/electric'),
        ]),
        create.deploying('createdelightcore:incompleted_modular_accumulator', [
          'createdelightcore:incompleted_modular_accumulator',
          'createaddition:capacitor',
        ]),
        create.deploying('createdelightcore:incompleted_modular_accumulator', [
          'createdelightcore:incompleted_modular_accumulator',
          'create:brass_sheet',
        ]),
      ])
      .transitionalItem('createdelightcore:incompleted_modular_accumulator')
      .loops(1)
      .id(id('sequenced_assembly/modular_accumulator'));

    create
      .sequenced_assembly('createaddition:alternator', 'createaddition:copper_spool', [
        create.deploying('createdelightcore:incomplete_alternator', [
          'createdelightcore:incomplete_alternator',
          'create_sa:copper_magnet',
        ]),
        create.deploying('createdelightcore:incomplete_alternator', [
          'createdelightcore:incomplete_alternator',
          'createaddition:iron_rod',
        ]),
        create.deploying('createdelightcore:incomplete_alternator', [
          'createdelightcore:incomplete_alternator',
          'createaddition:copper_wire',
        ]),
      ])
      .transitionalItem('createdelightcore:incomplete_alternator')
      .loops(2)
      .id(id('sequenced_assembly/alternator'));

    create
      .sequenced_assembly('createaddition:electric_motor', 'create_sa:copper_magnet', [
        create.deploying('createdelightcore:incomplete_electric_motor', [
          'createdelightcore:incomplete_electric_motor',
          'createaddition:copper_spool',
        ]),
        create.deploying('createdelightcore:incomplete_electric_motor', [
          'createdelightcore:incomplete_electric_motor',
          'createaddition:iron_rod',
        ]),
        create.deploying('createdelightcore:incomplete_electric_motor', [
          'createdelightcore:incomplete_electric_motor',
          'createaddition:copper_wire',
        ]),
      ])
      .transitionalItem('createdelightcore:incomplete_electric_motor')
      .loops(2)
      .id(id('sequenced_assembly/electric_motor'));

    kubejs
      .shapeless('createaddition:portable_energy_interface', [
        Ingredient.of('#c:springs/below_500'),
        'create:brass_casing',
        'createaddition:copper_spool',
      ])
      .id(id('crafting/portable_energy_interface'));

    vintageimprovements
      .turning('8x createaddition:spool', Ingredient.of('#c:ingots/iron'))
      .id(id('turning/spool'));

    [
      ['createaddition:copper_spool', 'createaddition:copper_wire'],
      ['createaddition:gold_spool', 'createaddition:gold_wire'],
      ['createaddition:electrum_spool', 'createaddition:electrum_wire'],
    ].forEach((spool) => {
      create
        .sequenced_assembly(spool[0], 'createaddition:spool', [
          create.deploying('createaddition:spool', ['createaddition:spool', spool[1]]),
        ])
        .transitionalItem('createaddition:spool')
        .loops(2)
        .id(id(`sequenced_assembly/${spool[0].split(':')[1]}`));
    });
  });
}
