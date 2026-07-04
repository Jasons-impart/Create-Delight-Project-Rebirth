if (
  global.hasAllMods([
    'createutilities',
    'create',
    'createmetallurgy',
    'vintageimprovements',
    'ae2',
    'functionalstorage',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, createmetallurgy, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:createutilities/${path}`;

    remove_recipes_id(event, [
      'createutilities:shaped/gearcube',
      'createutilities:shaped/void_chest',
      'createutilities:shaped/void_tank',
      'createutilities:shaped/void_battery',
      'createutilities:shaped/graviton_tube',
      'createmetallurgy:alloying/void_steel',
      'createutilities:mixing/void_steel_ingot',
      'functionalstorage:ender_drawer',
    ]);

    const voidSteel = {
      block: 'createutilities:void_steel_block',
      ingot: 'createutilities:void_steel_ingot',
      sheet: 'createutilities:void_steel_sheet',
      fluid: 'createmetallurgy:molten_void_steel',
    };

    createmetallurgy
      .bulk_melting(Fluid.of(voidSteel.fluid, 810), voidSteel.block)
      .minHeatRequirement(6)
      .processingTime(100)
      .id(id('bulk_melting/void_steel_block'));

    createmetallurgy
      .melting(Fluid.of(voidSteel.fluid, 90), voidSteel.ingot)
      .heatRequirement('heated')
      .processingTime(30)
      .id(id('melting/void_steel_ingot'));

    createmetallurgy
      .melting(Fluid.of(voidSteel.fluid, 90), voidSteel.sheet)
      .heatRequirement('heated')
      .processingTime(60)
      .id(id('melting/void_steel_sheet'));

    createmetallurgy
      .casting_in_basin(voidSteel.block, Fluid.of(voidSteel.fluid, 810))
      .processingTime(120)
      .id(id('casting_in_basin/void_steel_block'));

    createmetallurgy
      .casting_in_table(voidSteel.ingot, [
        Fluid.of(voidSteel.fluid, 90),
        'createmetallurgy:graphite_ingot_mold',
      ])
      .processingTime(60)
      .id(id('casting_in_table/void_steel_ingot'));

    createmetallurgy
      .casting_in_table(voidSteel.sheet, [
        Fluid.of(voidSteel.fluid, 90),
        'createmetallurgy:graphite_plate_mold',
      ])
      .processingTime(60)
      .id(id('casting_in_table/void_steel_sheet'));

    create
      .sequenced_assembly('9x createutilities:void_steel_sheet', voidSteel.block, [
        vintageimprovements.hammering(voidSteel.block, voidSteel.block),
        create.cutting(voidSteel.block, voidSteel.block),
      ])
      .loops(1)
      .transitionalItem(voidSteel.block)
      .id(id('sequenced_assembly/void_steel_block_to_sheets'));

    event.replaceInput(
      { id: 'createutilities:item_application/void_casing' },
      'minecraft:obsidian',
      'ae2:smooth_sky_stone_block'
    );

    createmetallurgy
      .alloying(Fluid.of(voidSteel.fluid, 90), [
        'ae2:ender_dust',
        Fluid.of('createmetallurgy:molten_steel', 90),
      ])
      .processingTime(180)
      .heatRequirement('superheated')
      .id(id('alloying/molten_void_steel'));

    createmetallurgy
      .casting_in_basin(
        'createutilities:void_casing',
        ['ae2:smooth_sky_stone_block', Fluid.of(voidSteel.fluid, 90)],
        70,
        true
      )
      .id(id('casting_in_basin/void_casing'));

    create
      .sequenced_assembly('4x createutilities:graviton_tube', voidSteel.sheet, [
        create.deploying('createdelightcore:incomplete_graviton_tube', [
          'createdelightcore:incomplete_graviton_tube',
          'ae2:ender_dust',
        ]),
        create.filling('createdelightcore:incomplete_graviton_tube', [
          'createdelightcore:incomplete_graviton_tube',
          Fluid.of('createmetallurgy:molten_tin', 10),
        ]),
        create.deploying('createdelightcore:incomplete_graviton_tube', [
          'createdelightcore:incomplete_graviton_tube',
          'createutilities:polished_amethyst',
        ]),
        create.cutting(
          'createdelightcore:incomplete_graviton_tube',
          'createdelightcore:incomplete_graviton_tube'
        ),
      ])
      .transitionalItem('createdelightcore:incomplete_graviton_tube')
      .loops(1)
      .id(id('sequenced_assembly/graviton_tube'));

    create
      .item_application('createutilities:void_battery', [
        'createaddition:modular_accumulator',
        'createutilities:graviton_tube',
      ])
      .id(id('item_application/void_battery'));

    create
      .item_application('createutilities:void_tank', [
        'create:fluid_tank',
        'createutilities:graviton_tube',
      ])
      .id(id('item_application/void_tank'));

    create
      .item_application('functionalstorage:ender_drawer', [
        { tag: 'functionalstorage:drawer' },
        'createutilities:graviton_tube',
      ])
      .id(id('item_application/ender_drawer'));

    create
      .deploying('createutilities:void_motor', [
        'createutilities:void_casing',
        'createutilities:graviton_tube',
      ])
      .id(id('deploying/void_motor'));
  });
}
