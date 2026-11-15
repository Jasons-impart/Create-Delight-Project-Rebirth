// Latest legacy pack cfaaab7: custom forged steel replaces Art of Forging.
// Item/fluid registration and assets belong to Core.
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'create', 'createmetallurgy'])) return;
  const { create, createmetallurgy, vintageimprovements } = event.recipes;
  const ingot = 'createdelightcore:forged_steel_ingot';
  const sheet = 'createdelightcore:forged_steel_sheet';
  const block = 'createdelightcore:forged_steel_block';
  const molten = 'createdelightcore:molten_forged_steel';
  const id = (path) => `createdelightcore:${path}`;

  if (Platform.isLoaded('tetra')) {
    createmetallurgy
      .alloying(Fluid.of(molten, 360), [
        Fluid.of('createmetallurgy:molten_netherite', 30),
        Fluid.of('createdelightcore:spent_liquor', 250),
        '4x tetra:metal_scrap',
      ])
      .heatRequirement('superheated')
      .id(id('alloying/forged_steel'));
  }
  // The legacy helper receives "superheated" but tests "superheat", yielding 6.
  createmetallurgy
    .bulk_melting(Fluid.of(molten, 810), block)
    .minHeatRequirement(6)
    .processingTime(100)
    .id(id('bulk_melting/forged_steel_block'));
  createmetallurgy
    .melting(Fluid.of(molten, 90), ingot)
    .heatRequirement('superheated')
    .processingTime(40)
    .id(id('melting/forged_steel_ingot'));
  createmetallurgy
    .melting(Fluid.of(molten, 90), sheet)
    .heatRequirement('superheated')
    .processingTime(80)
    .id(id('melting/forged_steel_sheet'));
  createmetallurgy
    .casting_in_basin(block, Fluid.of(molten, 810))
    .processingTime(160)
    .id(id('casting_in_basin/forged_steel_block'));
  createmetallurgy
    .casting_in_table(ingot, [Fluid.of(molten, 90), 'createmetallurgy:graphite_ingot_mold'])
    .processingTime(80)
    .id(id('casting_in_table/forged_steel_ingot'));
  createmetallurgy
    .casting_in_table(sheet, [Fluid.of(molten, 90), 'createmetallurgy:graphite_plate_mold'])
    .processingTime(80)
    .id(id('casting_in_table/forged_steel_sheet'));
  if (Platform.isLoaded('vintageimprovements')) {
    create
      .sequenced_assembly(`9x ${sheet}`, block, [
        vintageimprovements.hammering(block, block),
        create.cutting(block, block),
      ])
      .loops(1)
      .transitionalItem(block)
      .id(id('sequenced_assembly/forged_steel_block_to_forged_steel_sheet'));
  }
  event
    .shaped(block, ['AAA', 'AAA', 'AAA'], { A: ingot })
    .id(id('crafting/forged_steel_ingot_2_forged_steel_block'));
  event.shapeless(`9x ${ingot}`, block).id(id('crafting/forged_steel_block_2_forged_steel_ingot'));
  create.pressing(sheet, ingot).id(id('pressing/forged_steel_sheet'));
});
