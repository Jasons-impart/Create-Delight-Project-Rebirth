if (global.hasAllMods(['create', 'createmetallurgy', 'vintageimprovements', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const { create, createmetallurgy, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:create/metallurgy/${path}`;
    const andesite = {
      block: 'create:andesite_alloy_block',
      ingot: 'create:andesite_alloy',
      nugget: 'createdelightcore:andesite_alloy_nugget',
      sheet: 'vintageimprovements:andesite_sheet',
      rod: 'vintageimprovements:andesite_rod',
      wire: 'vintageimprovements:andesite_wire',
      fluid: 'createdelightcore:molten_andesite',
    };

    createmetallurgy
      .bulk_melting(Fluid.of(andesite.fluid, 810), andesite.block)
      .minHeatRequirement(6)
      .processingTime(60)
      .id(id('bulk_melting/andesite_alloy_block'));

    [
      [andesite.ingot, 90, 60],
      [andesite.nugget, 10, 30],
      [andesite.sheet, 90, 60],
      [andesite.rod, 45, 60],
      [andesite.wire, 45, 60],
    ].forEach((recipe) => {
      createmetallurgy
        .melting(Fluid.of(andesite.fluid, recipe[1]), recipe[0])
        .heatRequirement('heated')
        .processingTime(recipe[2])
        .id(id(`melting/${recipe[0].split(':')[1]}`));
    });

    [
      [andesite.ingot, 90, 'createmetallurgy:graphite_ingot_mold', 60],
      [andesite.nugget, 10, 'createmetallurgy:graphite_nugget_mold', 30],
      [andesite.sheet, 90, 'createmetallurgy:graphite_plate_mold', 60],
      [andesite.rod, 45, 'createmetallurgy:graphite_rod_mold', 60],
    ].forEach((recipe) => {
      createmetallurgy
        .casting_in_table(recipe[0], [Fluid.of(andesite.fluid, recipe[1]), recipe[2]])
        .processingTime(recipe[3])
        .id(id(`casting_in_table/${recipe[0].split(':')[1]}`));
    });

    createmetallurgy
      .casting_in_basin(andesite.block, Fluid.of(andesite.fluid, 810))
      .processingTime(180)
      .id(id('casting_in_basin/andesite_alloy_block'));

    create
      .sequenced_assembly('9x vintageimprovements:andesite_sheet', andesite.block, [
        vintageimprovements.hammering(andesite.block, andesite.block),
        create.cutting(andesite.block, andesite.block),
      ])
      .loops(1)
      .transitionalItem(andesite.block)
      .id(id('sequenced_assembly/andesite_alloy_block_to_sheets'));

    createmetallurgy
      .alloying(Fluid.of(andesite.fluid, 270), [
        Fluid.of('createmetallurgy:molten_iron', 20),
        'minecraft:andesite',
      ])
      .heatRequirement('heated')
      .id(id('alloying/molten_andesite_from_iron'));

    createmetallurgy
      .alloying(Fluid.of(andesite.fluid, 270), [
        Fluid.of('createmetallurgy:molten_zinc', 20),
        'minecraft:andesite',
      ])
      .heatRequirement('heated')
      .id(id('alloying/molten_andesite_from_zinc'));
  });
}
