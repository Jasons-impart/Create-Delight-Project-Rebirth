if (global.hasAllMods(['iceandfire', 'createdelightcore', 'create', 'createmetallurgy'])) {
  ServerEvents.recipes((event) => {
    const { create, createmetallurgy } = event.recipes;
    const id = (path) => `createdelightcore:iceandfire/${path}`;
    ['fire', 'ice', 'lightning'].forEach((element) => {
      const block = `iceandfire:dragonsteel_${element}_block`;
      const ingot = `iceandfire:dragonsteel_${element}_ingot`;
      const steel = `createdelightcore:molten_${element}_steel`;
      const blood = `createdelightcore:${element}_dragon_blood`;
      remove_recipes_id(event, [`iceandfire:dragonforge/dragonsteel_${element}_ingot`]);
      createmetallurgy
        .bulk_melting(Fluid.of(steel, 810), block)
        .minHeatRequirement(6)
        .processingTime(100)
        .id(id(`bulk_melting/${element}_steel`));
      createmetallurgy
        .melting(Fluid.of(steel, 90), ingot)
        .heatRequirement('heated')
        .processingTime(80)
        .id(id(`melting/${element}_steel`));
      createmetallurgy
        .casting_in_basin(block, Fluid.of(steel, 810))
        .processingTime(320)
        .id(id(`casting_in_basin/${element}_steel`));
      createmetallurgy
        .casting_in_table(ingot, [Fluid.of(steel, 90), 'createmetallurgy:graphite_ingot_mold'])
        .processingTime(160)
        .id(id(`casting_in_table/${element}_steel`));
      createmetallurgy
        .alloying(Fluid.of(steel, 90), [
          Fluid.of('createdelightcore:molten_martian_steel', 90),
          Fluid.of(blood, 250),
          Ingredient.of(`#iceandfire:scales/dragon/${element}`),
        ])
        .heatRequirement('superheated')
        .id(id(`alloying/${element}_steel`));

      const lily = element === 'ice' ? 'frost' : element;
      const mixing = create
        .mixing(Fluid.of(blood, 500), [
          `iceandfire:${lily}_lily`,
          Fluid.of('createdelightcore:nuclear_waste', 100),
          Fluid.of(blood, 250),
        ])
        .id(id(`mixing/${element}_dragon_blood_from_nuclear_waste`));
      if (element === 'fire') mixing.heatRequirement('superheated');
      if (element === 'ice') mixing.heatRequirement('frozen');

      if (global.hasMod('ends_delight')) {
        // CE's codec retains input/blood/dragonType/cookTime; ItemStack now uses id.
        event
          .custom({
            type: 'iceandfire:dragonforge',
            input: { item: 'ends_delight:dried_chorus_flower' },
            blood: { item: 'minecraft:glass_bottle' },
            result: { id: 'minecraft:dragon_breath' },
            dragonType: element,
            cookTime: 400,
          })
          .id(id(`dragonforge/dragon_breath_${element}`));
      }
    });

    remove_recipes_output(event, ['iceandfire:copper_pile']);
    event
      .shapeless('iceandfire:copper_pile', ['2x create:copper_nugget'])
      .id(id('shapeless/copper_pile_manual_only'));
    event
      .shaped('2x createdelightcore:dread_upgrade_smithing_template', ['ABA', 'ACA', 'AAA'], {
        A: [
          'iceandfire:dragonsteel_fire_ingot',
          'iceandfire:dragonsteel_ice_ingot',
          'iceandfire:dragonsteel_lightning_ingot',
        ],
        B: 'createdelightcore:dread_heart',
        C: 'createdelightcore:dread_upgrade_smithing_template',
      })
      .id(id('dread_upgrade_smithing_template'));

    if (global.hasAllMods(['ends_delight', 'create_dragons_plus'])) {
      create
        .filling('ends_delight:raw_dragon_meat', [
          Ingredient.of('#createdelightcore:dragon_flesh'),
          Fluid.of('create_dragons_plus:dragon_breath', 250),
        ])
        .id(id('filling/raw_dragon_meat'));
    }
    if (global.hasAllMods(['vintageimprovements', 'butchercraft'])) {
      event.recipes.vintageimprovements
        .vacuumizing(
          ['butchercraft:chicken_skull_head_item', 'iceandfire:cockatrice_eye'],
          ['iceandfire:cockatrice_skull', 'butchercraft:eyeball']
        )
        .id(id('vacuumizing/cockatrice_eye'));
    }
    if (global.hasAllMods(['vintageimprovements', 'supplementaries'])) {
      let key = { item: 'supplementaries:key' };
      let keyResult = { id: 'supplementaries:key' };
      // Explicit Create 6 fluid ingredients are required inside an assembly sequence.
      event
        .custom({
          type: 'create:sequenced_assembly',
          ingredient: key,
          transitional_item: keyResult,
          loops: 1,
          results: [{ id: 'iceandfire:dread_key' }],
          sequence: [
            {
              type: 'create:filling',
              ingredients: [
                key,
                { type: 'fluid_stack', fluid: 'createdelightcore:molten_ice_steel', amount: 90 },
              ],
              results: [keyResult],
            },
            {
              type: 'create:deploying',
              ingredients: [key, { item: 'iceandfire:dread_shard' }],
              results: [keyResult],
            },
            { type: 'vintageimprovements:hammering', ingredients: [key], results: [keyResult] },
          ],
        })
        .id(id('sequenced_assembly/dread_key'));
    }
  });
}
