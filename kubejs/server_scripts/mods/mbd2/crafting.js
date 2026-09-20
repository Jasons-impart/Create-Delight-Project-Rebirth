// 机器制作配方；注册项和运行逻辑由 Core 提供。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2', 'create'])) return;
  let create = event.recipes.create;

  create
    .item_application('createdelightcore:steel_casing', [
      'create:andesite_casing',
      Ingredient.of('#c:ingots/steel'),
    ])
    .id('createdelightcore:steel_casing');
  event
    .shapeless('createdelightcore:steel_glass_casing', [
      'createdelightcore:steel_casing',
      'create:framed_glass',
    ])
    .id('createdelightcore:shaped/steel_glass_casing');
  event
    .shapeless('createdelightcore:steel_clear_glass_casing', [
      'createdelightcore:steel_glass_casing',
      'create:framed_glass',
    ])
    .id('createdelightcore:shaped/steel_clear_glass_casing');
  create
    .item_application('createdelightcore:forge_steel_casing', [
      'northstar:tungsten_sheetmetal',
      'createdelightcore:forged_steel_ingot',
    ])
    .id('createdelightcore:forge_steel_casing');

  create
    .mechanical_crafting(
      'createdelightcore:alloy_electric_furnace',
      ['ABBBA', 'ACCCA', 'ADEDA', 'AFFFA', 'AAAAA'],
      {
        A: '#c:plates/steel',
        B: '#c:plates/bronze',
        C: 'northstar:circuit',
        D: 'createmetallurgy:industrial_crucible',
        E: 'vintageimprovements:redstone_module',
        F: 'create:sturdy_sheet',
      }
    )
    .acceptMirrored(false)
    .id('createdelightcore:mbd2/alloy_electric_furnace');

  event.recipes.minecraft
    .crafting_shapeless('createdelightcore:andesite_export_bus', [
      'createdelightcore:andesite_import_bus',
    ])
    .id('createdelightcore:mbd2/andesite_export_bus_from_import_bus');

  create
    .item_application('createdelightcore:andesite_import_bus', [
      'create:andesite_casing',
      'functionalstorage:controller_extension',
    ])
    .id('createdelightcore:mbd2/andesite_import_bus');

  event.recipes.minecraft
    .crafting_shapeless('createdelightcore:andesite_import_bus', [
      'createdelightcore:andesite_export_bus',
    ])
    .id('createdelightcore:mbd2/andesite_import_bus_from_export_bus');

  create
    .mechanical_crafting(
      'createdelightcore:big_centrifuge',
      ['AABAA', 'ACCDA', 'FCEDF', 'ACDDA', 'AABAA'],
      {
        A: 'createdelightcore:steel_casing',
        B: 'createdelightcore:magnetic_mechanism',
        C: 'alexscavesup:azure_neodymium_ingot',
        D: 'alexscavesup:scarlet_neodymium_ingot',
        E: 'alexscavesup:heart_of_iron',
        F: 'northstar:circuit',
      }
    )
    .acceptMirrored(true)
    .id('createdelightcore:mbd2/big_centrifuge');

  event.recipes.minecraft
    .crafting_shaped('createdelightcore:butchery_room', ['ABA', 'BCB', 'ABA'], {
      A: 'create:andesite_casing',
      B: 'create:andesite_alloy',
      C: 'create:precision_mechanism',
    })
    .id('createdelightcore:mbd2/butchery_room');

  create
    .mechanical_crafting(
      'createdelightcore:centrifuge_rotor',
      [' A A ', 'ABABA', ' ACA ', 'ABABA', ' A A '],
      {
        A: 'northstar:titanium_sheet',
        B: '#c:springs/over_1000',
        C: 'vintageimprovements:centrifuge',
      }
    )
    .acceptMirrored(true)
    .id('createdelightcore:mbd2/centrifuge_rotor');

  event.recipes.minecraft
    .crafting_shaped('createdelightcore:copper_coil', ['ABA', 'BCB', 'ABA'], {
      A: 'createaddition:copper_wire',
      B: 'create:copper_sheet',
      C: 'createdelightcore:steel_casing',
    })
    .id('createdelightcore:mbd2/copper_coil');

  create
    .sequenced_assembly('createdelightcore:copper_coil', 'createdelightcore:steel_casing', [
      create.deploying('createdelightcore:steel_casing', [
        'createdelightcore:steel_casing',
        'createaddition:copper_wire',
      ]),
      create.deploying('createdelightcore:steel_casing', [
        'createdelightcore:steel_casing',
        'create:copper_sheet',
      ]),
    ])
    .transitionalItem('createdelightcore:steel_casing')
    .loops(2)
    .id('createdelightcore:mbd2/copper_coil_sequenced');

  event.recipes.minecraft
    .crafting_shaped('createdelightcore:create_in', [' A ', 'ABA', ' A '], {
      A: 'create:cogwheel',
      B: 'create:gearbox',
    })
    .id('createdelightcore:mbd2/create_in');

  create
    .sequenced_assembly('createdelightcore:dragon_steel_fan', 'createdelightcore:forge_steel_fan', [
      create.deploying('createdelightcore:forge_steel_fan', [
        'createdelightcore:forge_steel_fan',
        'ae2:sky_dust',
      ]),
      create.filling('createdelightcore:forge_steel_fan', [
        'createdelightcore:forge_steel_fan',
        { type: 'neoforge:tag', tag: 'createdelightcore:molten_dragon_steel', amount: 90 },
      ]),
      create.pressing('createdelightcore:forge_steel_fan', ['createdelightcore:forge_steel_fan']),
    ])
    .transitionalItem('createdelightcore:forge_steel_fan')
    .loops(4)
    .id('createdelightcore:mbd2/dragon_steel_fan');

  create
    .mechanical_crafting(
      'createdelightcore:fission_fuel_assembly',
      ['AAAAA', 'ABCBA', 'ABCBA', 'AAAAA'],
      {
        A: 'create_new_age:reactor_casing',
        B: 'alexscavesup:uranium_rod',
        C: 'alexscavesup:fissile_core',
      }
    )
    .acceptMirrored(true)
    .id('createdelightcore:mbd2/fission_fuel_assembly');

  create
    .mechanical_crafting(
      'createdelightcore:fission_reactor',
      ['AAAAA', 'ABCBA', 'ADEDA', 'ABCBA', 'AAAAA'],
      {
        A: 'create_new_age:reactor_casing',
        B: 'northstar:circuit',
        C: 'alexscavesup:fissile_core',
        D: 'northstar:advanced_circuit',
        E: 'vintageimprovements:redstone_module',
      }
    )
    .acceptMirrored(true)
    .id('createdelightcore:mbd2/fission_reactor');

  create
    .item_application('createdelightcore:fission_reactor_controller', [
      'createdelightcore:forge_steel_casing',
      'vintageimprovements:redstone_module',
    ])
    .id('createdelightcore:mbd2/fission_reactor_controller');

  create
    .sequenced_assembly('createdelightcore:forge_steel_fan', 'createdelightcore:steel_fan', [
      create.deploying('createdelightcore:steel_fan', [
        'createdelightcore:steel_fan',
        'ae2:sky_dust',
      ]),
      create.filling('createdelightcore:steel_fan', [
        'createdelightcore:steel_fan',
        Fluid.of('createdelightcore:molten_forged_steel', 90),
      ]),
      create.pressing('createdelightcore:steel_fan', ['createdelightcore:steel_fan']),
    ])
    .transitionalItem('createdelightcore:steel_fan')
    .loops(4)
    .id('createdelightcore:mbd2/forge_steel_fan');

  event.recipes.minecraft
    .crafting_shapeless('createdelightcore:forged_steel_export_bus', [
      'createdelightcore:forged_steel_import_bus',
    ])
    .id('createdelightcore:mbd2/forged_steel_export_bus_from_import_bus');

  create
    .item_application('createdelightcore:forged_steel_import_bus', [
      'createdelightcore:forge_steel_casing',
      'functionalstorage:controller_extension',
    ])
    .id('createdelightcore:mbd2/forged_steel_import_bus');

  event.recipes.minecraft
    .crafting_shapeless('createdelightcore:forged_steel_import_bus', [
      'createdelightcore:forged_steel_export_bus',
    ])
    .id('createdelightcore:mbd2/forged_steel_import_bus_from_export_bus');

  create
    .mechanical_crafting(
      'createdelightcore:hydropower_station',
      ['AAAAA', 'ABBCA', 'ABDCA', 'ABCCA', 'AAAAA'],
      {
        A: 'ae2:sky_stone_brick',
        B: 'ae2:fluix_crystal',
        C: 'minecraft:quartz',
        D: 'vintageimprovements:redstone_module',
      }
    )
    .acceptMirrored(false)
    .id('createdelightcore:mbd2/hydropower_station');

  event.recipes.minecraft
    .crafting_shapeless('createdelightcore:steel_export_bus', [
      'createdelightcore:steel_import_bus',
    ])
    .id('createdelightcore:mbd2/steel_export_bus_from_import_bus');

  create
    .mechanical_crafting(
      'createdelightcore:steel_fan',
      [' A A ', 'ABBBA', ' BCB ', 'ABBBA', ' A A '],
      { A: 'createdelightcore:steel_sheet', B: 'ae2:sky_dust', C: 'createdelightcore:wooden_fan' }
    )
    .acceptMirrored(false)
    .id('createdelightcore:mbd2/steel_fan');

  create
    .item_application('createdelightcore:steel_import_bus', [
      'createdelightcore:steel_casing',
      'functionalstorage:controller_extension',
    ])
    .id('createdelightcore:mbd2/steel_import_bus');

  event.recipes.minecraft
    .crafting_shapeless('createdelightcore:steel_import_bus', [
      'createdelightcore:steel_export_bus',
    ])
    .id('createdelightcore:mbd2/steel_import_bus_from_export_bus');

  create
    .mechanical_crafting(
      'createdelightcore:wooden_fan',
      [' A A ', 'ABBBA', ' BCB ', 'ABBBA', ' A A '],
      { A: '#minecraft:wooden_slabs', B: '#minecraft:logs', C: 'create:large_water_wheel' }
    )
    .acceptMirrored(false)
    .id('createdelightcore:mbd2/wooden_fan');
});
