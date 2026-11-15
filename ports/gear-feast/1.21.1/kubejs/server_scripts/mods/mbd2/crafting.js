// 源：CDR 1.21.1 kubejs/server_scripts/mods/mbd2/crafting.js
// 本地适配：没有 kubejs-create，event.recipes.create.* 全部改写为 event.custom 的原版 Create JSON；
// 原版配方改用 event.shaped / event.shapeless。
// 阻塞：dragon_steel_fan 的灌注步骤需要流体标签 createdelightcore:molten_dragon_steel，
//       本地 createdelightcore 2.0.0.7 既无该流体也无该标签，整条配方不写入（见移植报告）。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2', 'create'])) return;

  let itemApplication = (output, target, applied, id) =>
    event
      .custom({
        type: 'create:item_application',
        ingredients: [target, applied],
        results: [{ id: output }],
      })
      .id(id);

  let mechanical = (output, pattern, key, mirrored, id) =>
    event
      .custom({
        type: 'create:mechanical_crafting',
        accept_mirrored: mirrored,
        key: key,
        pattern: pattern,
        result: { id: output },
      })
      .id(id);

  itemApplication(
    'createdelightcore:steel_casing',
    { item: 'create:andesite_casing' },
    { tag: 'c:ingots/steel' },
    'createdelightcore:steel_casing'
  );
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
  itemApplication(
    'createdelightcore:forge_steel_casing',
    { item: 'northstar:tungsten_sheetmetal' },
    { item: 'createdelightcore:forged_steel_ingot' },
    'createdelightcore:forge_steel_casing'
  );

  mechanical(
    'createdelightcore:alloy_electric_furnace',
    ['ABBBA', 'ACCCA', 'ADEDA', 'AFFFA', 'AAAAA'],
    {
      A: { tag: 'c:plates/steel' },
      B: { tag: 'c:plates/bronze' },
      C: { item: 'northstar:circuit' },
      D: { item: 'createmetallurgy:industrial_crucible' },
      E: { item: 'vintageimprovements:redstone_module' },
      F: { item: 'create:sturdy_sheet' },
    },
    false,
    'createdelightcore:mbd2/alloy_electric_furnace'
  );

  event
    .shapeless('createdelightcore:andesite_export_bus', ['createdelightcore:andesite_import_bus'])
    .id('createdelightcore:mbd2/andesite_export_bus_from_import_bus');

  itemApplication(
    'createdelightcore:andesite_import_bus',
    { item: 'create:andesite_casing' },
    { item: 'functionalstorage:controller_extension' },
    'createdelightcore:mbd2/andesite_import_bus'
  );

  event
    .shapeless('createdelightcore:andesite_import_bus', ['createdelightcore:andesite_export_bus'])
    .id('createdelightcore:mbd2/andesite_import_bus_from_export_bus');

  mechanical(
    'createdelightcore:big_centrifuge',
    ['AABAA', 'ACCDA', 'FCEDF', 'ACDDA', 'AABAA'],
    {
      A: { item: 'createdelightcore:steel_casing' },
      B: { item: 'createdelightcore:magnetic_mechanism' },
      C: { item: 'alexscavesup:azure_neodymium_ingot' },
      D: { item: 'alexscavesup:scarlet_neodymium_ingot' },
      E: { item: 'alexscavesup:heart_of_iron' },
      F: { item: 'northstar:circuit' },
    },
    true,
    'createdelightcore:mbd2/big_centrifuge'
  );

  event
    .shaped('createdelightcore:butchery_room', ['ABA', 'BCB', 'ABA'], {
      A: 'create:andesite_casing',
      B: 'create:andesite_alloy',
      C: 'create:precision_mechanism',
    })
    .id('createdelightcore:mbd2/butchery_room');

  mechanical(
    'createdelightcore:centrifuge_rotor',
    [' A A ', 'ABABA', ' ACA ', 'ABABA', ' A A '],
    {
      A: { item: 'northstar:titanium_sheet' },
      B: { tag: 'c:springs/over_1000' },
      C: { item: 'vintageimprovements:centrifuge' },
    },
    true,
    'createdelightcore:mbd2/centrifuge_rotor'
  );

  event
    .shaped('createdelightcore:copper_coil', ['ABA', 'BCB', 'ABA'], {
      A: 'createaddition:copper_wire',
      B: 'create:copper_sheet',
      C: 'createdelightcore:steel_casing',
    })
    .id('createdelightcore:mbd2/copper_coil');

  event
    .custom({
      type: 'create:sequenced_assembly',
      ingredient: { item: 'createdelightcore:steel_casing' },
      loops: 2,
      results: [{ id: 'createdelightcore:copper_coil' }],
      sequence: [
        {
          type: 'create:deploying',
          ingredients: [{ item: 'createdelightcore:steel_casing' }, { item: 'createaddition:copper_wire' }],
          results: [{ id: 'createdelightcore:steel_casing' }],
        },
        {
          type: 'create:deploying',
          ingredients: [{ item: 'createdelightcore:steel_casing' }, { item: 'create:copper_sheet' }],
          results: [{ id: 'createdelightcore:steel_casing' }],
        },
      ],
      transitional_item: { id: 'createdelightcore:steel_casing' },
    })
    .id('createdelightcore:mbd2/copper_coil_sequenced');

  event
    .shaped('createdelightcore:create_in', [' A ', 'ABA', ' A '], {
      A: 'create:cogwheel',
      B: 'create:gearbox',
    })
    .id('createdelightcore:mbd2/create_in');

  mechanical(
    'createdelightcore:fission_fuel_assembly',
    ['AAAAA', 'ABCBA', 'ABCBA', 'AAAAA'],
    {
      A: { item: 'create_new_age:reactor_casing' },
      B: { item: 'alexscavesup:uranium_rod' },
      C: { item: 'alexscavesup:fissile_core' },
    },
    true,
    'createdelightcore:mbd2/fission_fuel_assembly'
  );

  mechanical(
    'createdelightcore:fission_reactor',
    ['AAAAA', 'ABCBA', 'ADEDA', 'ABCBA', 'AAAAA'],
    {
      A: { item: 'create_new_age:reactor_casing' },
      B: { item: 'northstar:circuit' },
      C: { item: 'alexscavesup:fissile_core' },
      D: { item: 'northstar:advanced_circuit' },
      E: { item: 'vintageimprovements:redstone_module' },
    },
    true,
    'createdelightcore:mbd2/fission_reactor'
  );

  itemApplication(
    'createdelightcore:fission_reactor_controller',
    { item: 'createdelightcore:forge_steel_casing' },
    { item: 'vintageimprovements:redstone_module' },
    'createdelightcore:mbd2/fission_reactor_controller'
  );

  event
    .custom({
      type: 'create:sequenced_assembly',
      ingredient: { item: 'createdelightcore:steel_fan' },
      loops: 4,
      results: [{ id: 'createdelightcore:forge_steel_fan' }],
      sequence: [
        {
          type: 'create:deploying',
          ingredients: [{ item: 'createdelightcore:steel_fan' }, { item: 'ae2:sky_dust' }],
          results: [{ id: 'createdelightcore:steel_fan' }],
        },
        {
          type: 'create:filling',
          ingredients: [
            { item: 'createdelightcore:steel_fan' },
            { type: 'neoforge:tag', tag: 'c:molten_forged_steel', amount: 90 },
          ],
          results: [{ id: 'createdelightcore:steel_fan' }],
        },
        {
          type: 'create:pressing',
          ingredients: [{ item: 'createdelightcore:steel_fan' }],
          results: [{ id: 'createdelightcore:steel_fan' }],
        },
      ],
      transitional_item: { id: 'createdelightcore:steel_fan' },
    })
    .id('createdelightcore:mbd2/forge_steel_fan');

  event
    .shapeless('createdelightcore:forged_steel_export_bus', [
      'createdelightcore:forged_steel_import_bus',
    ])
    .id('createdelightcore:mbd2/forged_steel_export_bus_from_import_bus');

  itemApplication(
    'createdelightcore:forged_steel_import_bus',
    { item: 'createdelightcore:forge_steel_casing' },
    { item: 'functionalstorage:controller_extension' },
    'createdelightcore:mbd2/forged_steel_import_bus'
  );

  event
    .shapeless('createdelightcore:forged_steel_import_bus', [
      'createdelightcore:forged_steel_export_bus',
    ])
    .id('createdelightcore:mbd2/forged_steel_import_bus_from_export_bus');

  mechanical(
    'createdelightcore:hydropower_station',
    ['AAAAA', 'ABBCA', 'ABDCA', 'ABCCA', 'AAAAA'],
    {
      A: { item: 'ae2:sky_stone_brick' },
      B: { item: 'ae2:fluix_crystal' },
      C: { item: 'minecraft:quartz' },
      D: { item: 'vintageimprovements:redstone_module' },
    },
    false,
    'createdelightcore:mbd2/hydropower_station'
  );

  event
    .shapeless('createdelightcore:steel_export_bus', ['createdelightcore:steel_import_bus'])
    .id('createdelightcore:mbd2/steel_export_bus_from_import_bus');

  mechanical(
    'createdelightcore:steel_fan',
    [' A A ', 'ABBBA', ' BCB ', 'ABBBA', ' A A '],
    {
      A: { item: 'createdelightcore:steel_sheet' },
      B: { item: 'ae2:sky_dust' },
      C: { item: 'createdelightcore:wooden_fan' },
    },
    false,
    'createdelightcore:mbd2/steel_fan'
  );

  itemApplication(
    'createdelightcore:steel_import_bus',
    { item: 'createdelightcore:steel_casing' },
    { item: 'functionalstorage:controller_extension' },
    'createdelightcore:mbd2/steel_import_bus'
  );

  event
    .shapeless('createdelightcore:steel_import_bus', ['createdelightcore:steel_export_bus'])
    .id('createdelightcore:mbd2/steel_import_bus_from_export_bus');

  mechanical(
    'createdelightcore:wooden_fan',
    [' A A ', 'ABBBA', ' BCB ', 'ABBBA', ' A A '],
    {
      A: { tag: 'minecraft:wooden_slabs' },
      B: { tag: 'minecraft:logs' },
      C: { item: 'create:large_water_wheel' },
    },
    false,
    'createdelightcore:mbd2/wooden_fan'
  );

  // dragon_steel_fan：单体流体 molten_dragon_steel 在本包不存在，
  // 但流体标签 createdelightcore:molten_dragon_steel 由 mods/iceandfire/tags.js 注册
  // （收录 molten_fire_steel / molten_ice_steel / molten_lightning_steel），因此灌注步骤用标签。
  event
    .custom({
      type: 'create:sequenced_assembly',
      ingredients: [{ item: 'createdelightcore:forge_steel_fan' }],
      loops: 4,
      results: [{ id: 'createdelightcore:dragon_steel_fan' }],
      sequence: [
        {
          type: 'create:deploying',
          ingredients: [{ item: 'createdelightcore:forge_steel_fan' }, { item: 'ae2:sky_dust' }],
          results: [{ id: 'createdelightcore:forge_steel_fan' }],
        },
        {
          type: 'create:filling',
          ingredients: [
            { item: 'createdelightcore:forge_steel_fan' },
            {
              type: 'neoforge:tag',
              tag: 'createdelightcore:molten_dragon_steel',
              amount: 90,
            },
          ],
          results: [{ id: 'createdelightcore:forge_steel_fan' }],
        },
        {
          type: 'create:pressing',
          ingredients: [{ item: 'createdelightcore:forge_steel_fan' }],
          results: [{ id: 'createdelightcore:forge_steel_fan' }],
        },
      ],
      transitional_item: { id: 'createdelightcore:forge_steel_fan' },
    })
    .id('createdelightcore:mbd2/dragon_steel_fan');
});
