if (global.hasAllMods(['createoreexcavation', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const { create, createoreexcavation, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:createoreexcavation/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const processingOutput = (item, count, chance) => {
      if (chance < 1) {
        return CreateItem.of(Item.of(item, count || 1), chance);
      }

      return count && count > 1 ? Item.of(item, count) : item;
    };
    const processingOutputs = (outputs) =>
      outputs
        .filter((output) => true)
        .map((output) => processingOutput(output.item, output.count, output.chance || 1));
    const addProcessing = (recipeBuilder, path, input, outputs) => {
      let recipeOutputs = processingOutputs(outputs);

      if (
        recipeOutputs.length === 0 ||
        (path.startsWith('vibrating/') && recipeOutputs.length > 4)
      ) {
        return;
      }

      recipeBuilder(recipeOutputs, input).id(id(path));
    };

    event.remove({ mod: 'createoreexcavation', type: 'createoreexcavation:vein' });
    event.remove({ mod: 'createoreexcavation', type: 'createoreexcavation:drilling' });
    [
      'createoreexcavation:vein_finder',
      'createoreexcavation:extractor',
      'createoreexcavation:drilling_machine',
    ].forEach(removeIfPresent);

    const addVein = (name, icon, path, spacing, separation, salt, biomeTag) => {
      createoreexcavation
        .vein(`{"text": "${name}"}`, icon)
        .placement(spacing, separation, salt)
        .biomeWhitelist(biomeTag)
        .id(id(`ore_vein_type/${path}`));
    };

    const addDrilling = (
      output,
      veinPath,
      baseFluid,
      baseStress,
      baseProcessingTime,
      minOilLevel
    ) => {
      const fluids = [
        {
          id: 'createdelightcore:ice_lubricating_oil',
          amount: baseFluid.amount * 0.05,
          stress: baseStress * 0.5,
          ticks: baseProcessingTime * 0.1,
          drill: 'createoreexcavation:netherite_drill',
        },
        {
          id: 'createdelightcore:lubricating_oil',
          amount: baseFluid.amount * 0.1,
          stress: baseStress * 0.75,
          ticks: baseProcessingTime * 0.2,
          drill: 'createoreexcavation:diamond_drill',
        },
        {
          id: baseFluid.id,
          amount: baseFluid.amount,
          stress: baseStress,
          ticks: baseProcessingTime,
          drill: 'createoreexcavation:drill',
        },
      ];
      const count = fluids.length + 1 - minOilLevel;

      for (let index = 0; index < count; index++) {
        const fluid = fluids[index];

        createoreexcavation
          .drilling(output, id(`ore_vein_type/${veinPath}`), fluid.ticks)
          .fluid(Fluid.of(fluid.id, fluid.amount))
          .drill(fluid.drill)
          .stress(fluid.stress)
          .id(id(`drilling/${output.split(':')[1]}_using_${fluid.id.split(':')[1]}`));
      }
    };

    addVein(
      '主世界金属矿簇',
      'createdelightcore:overworld_metal_ore_cluster',
      'overworld_metal_ore_cluster',
      64,
      8,
      114514,
      'minecraft:is_overworld'
    );
    addVein(
      '主世界贵金属矿簇',
      'createdelightcore:overworld_noble_metal_ore_cluster',
      'overworld_noble_metal_ore_cluster',
      128,
      16,
      721,
      'minecraft:is_overworld'
    );
    addVein(
      '下界矿簇',
      'createdelightcore:nether_ore_cluster',
      'nether_ore_cluster',
      64,
      8,
      114514,
      'minecraft:is_nether'
    );
    addVein(
      '月球矿簇',
      'createdelightcore:moon_ore_cluster',
      'moon_ore_cluster',
      64,
      8,
      114514,
      'northstar:moon_biomes'
    );
    addVein(
      '火星矿簇',
      'createdelightcore:mars_ore_cluster',
      'mars_ore_cluster',
      64,
      8,
      114514,
      'northstar:mars_biomes'
    );
    addVein(
      '水星矿簇',
      'createdelightcore:mercury_ore_cluster',
      'mercury_ore_cluster',
      64,
      8,
      114514,
      'northstar:mercury_biomes'
    );
    addVein(
      '金星矿簇',
      'createdelightcore:venus_ore_cluster',
      'venus_ore_cluster',
      128,
      16,
      721,
      'northstar:venus_biomes'
    );

    addDrilling(
      'createdelightcore:overworld_metal_ore_cluster',
      'overworld_metal_ore_cluster',
      Fluid.water(500),
      1024,
      8000,
      1
    );
    addDrilling(
      'createdelightcore:overworld_noble_metal_ore_cluster',
      'overworld_noble_metal_ore_cluster',
      Fluid.water(500),
      1536,
      10000,
      1
    );
    addDrilling(
      'createdelightcore:nether_ore_cluster',
      'nether_ore_cluster',
      Fluid.lava(500),
      2048,
      12000,
      1
    );
    addDrilling(
      'createdelightcore:mercury_ore_cluster',
      'mercury_ore_cluster',
      Fluid.lava(1000),
      2048,
      2000,
      3
    );
    addDrilling(
      'createdelightcore:venus_ore_cluster',
      'venus_ore_cluster',
      Fluid.lava(500),
      2048,
      8000,
      3
    );

    addDrilling(
      'createdelightcore:moon_ore_cluster',
      'moon_ore_cluster',
      Fluid.of('netherexp:ectoplasm', 500),
      1024,
      4000,
      1
    );
    addDrilling(
      'createdelightcore:mars_ore_cluster',
      'mars_ore_cluster',
      Fluid.of('netherexp:ectoplasm', 500),
      1536,
      4000,
      2
    );

    create
      .mechanical_crafting(
        'createoreexcavation:extractor',
        ['ABCBA', 'BDEDB', 'FGHGB', 'BIIIB', 'ABBBA'],
        {
          A: 'createmetallurgy:steel_block',
          B: 'createdelightcore:steel_sheet',
          C: 'create:mechanical_pump',
          D: 'create:electron_tube',
          E: 'create:hose_pulley',
          F: 'create:brass_casing',
          G: 'create_sa:hydraulic_engine',
          H: 'create:mechanical_drill',
          I: 'create:sturdy_sheet',
        }
      )
      .id(id('mechanical_crafting/extractor'));

    create
      .mechanical_crafting(
        'createoreexcavation:drilling_machine',
        ['ABCBA', 'BDEDB', 'FGHGJ', 'BIIIB', 'ABBBA'],
        {
          A: 'createmetallurgy:steel_block',
          B: 'createdelightcore:steel_sheet',
          C: 'create:mechanical_pump',
          D: 'create:electron_tube',
          E: 'create:spout',
          F: 'create:brass_casing',
          G: 'create_sa:heat_engine',
          H: 'create:mechanical_drill',
          I: 'create:sturdy_sheet',
          J: 'create:brass_tunnel',
        }
      )
      .id(id('mechanical_crafting/drilling_machine'));

    event
      .shaped('createdelightcore:prospector', ['ABA', 'ACA', 'AAA'], {
        A: 'createmetallurgy:steel_ingot',
        B: 'createdelightcore:prospector_core',
        C: 'minecraft:tinted_glass',
      })
      .id(id('crafting/prospector'));

    event
      .shaped('createdelightcore:prospector_core', ['AAA', 'ABA', 'AAA'], {
        A: 'createutilities:polished_amethyst',
        B: 'minecraft:ender_eye',
      })
      .id(id('crafting/prospector_core'));

    addProcessing(
      (outputs, input) => create.crushing(outputs, input),
      'crushing/overworld_metal_ore_cluster',
      'createdelightcore:overworld_metal_ore_cluster',
      [
        { item: 'create:crushed_raw_copper', chance: 0.75 },
        { item: 'create:crushed_raw_tin', chance: 0.75 },
        { item: 'minecraft:coal', chance: 0.6 },
        { item: 'create:crushed_raw_iron', chance: 0.5 },
        { item: 'create:crushed_raw_zinc', chance: 0.5 },
        { item: 'minecraft:redstone', count: 4, chance: 0.3 },
      ]
    );
    addProcessing(
      (outputs, input) => vintageimprovements.vibrating(outputs, input),
      'vibrating/overworld_metal_ore_cluster',
      'createdelightcore:overworld_metal_ore_cluster',
      [
        { item: 'createoreexcavation:raw_redstone', chance: 0.75 },
        { item: 'minecraft:raw_iron', chance: 0.6 },
        { item: 'create:raw_zinc', chance: 0.6 },
        { item: 'minecraft:coal', chance: 0.5 },
        { item: 'minecraft:raw_copper', chance: 0.25 },
        { item: 'createdelightcore:raw_tin', chance: 0.25 },
      ]
    );

    addProcessing(
      (outputs, input) => create.crushing(outputs, input),
      'crushing/overworld_noble_metal_ore_cluster',
      'createdelightcore:overworld_noble_metal_ore_cluster',
      [
        { item: 'create:crushed_raw_silver', chance: 0.5 },
        { item: 'create:crushed_raw_gold', chance: 0.5 },
        { item: 'minecraft:lapis_lazuli', count: 4, chance: 0.4 },
        { item: 'minecraft:emerald', chance: 0.2 },
        { item: 'minecraft:diamond', chance: 0.1 },
      ]
    );
    addProcessing(
      (outputs, input) => vintageimprovements.vibrating(outputs, input),
      'vibrating/overworld_noble_metal_ore_cluster',
      'createdelightcore:overworld_noble_metal_ore_cluster',
      [
        { item: 'createoreexcavation:raw_diamond', chance: 0.2 },
        { item: 'createoreexcavation:raw_emerald', chance: 0.3 },
        { item: 'minecraft:lapis_lazuli', count: 4, chance: 0.4 },
        { item: 'iceandfire:raw_silver', chance: 0.25 },
        { item: 'minecraft:raw_gold', chance: 0.25 },
      ]
    );

    addProcessing(
      (outputs, input) => create.crushing(outputs, input),
      'crushing/nether_ore_cluster',
      'createdelightcore:nether_ore_cluster',
      [
        { item: 'minecraft:quartz', chance: 0.75 },
        { item: 'minecraft:gold_nugget', count: 3, chance: 0.5 },
        { item: 'createmetallurgy:crushed_raw_tungsten', chance: 0.3 },
        { item: 'minecraft:netherite_scrap', chance: 0.05 },
      ]
    );
    addProcessing(
      (outputs, input) => vintageimprovements.vibrating(outputs, input),
      'vibrating/nether_ore_cluster',
      'createdelightcore:nether_ore_cluster',
      [
        { item: 'createmetallurgy:raw_tungsten', chance: 0.5 },
        { item: 'minecraft:ancient_debris', chance: 0.3 },
        { item: 'minecraft:quartz', chance: 0.25 },
        { item: 'minecraft:gold_nugget', count: 3, chance: 0.25 },
      ]
    );

    addProcessing(
      (outputs, input) => create.crushing(outputs, input),
      'crushing/moon_ore_cluster',
      'createdelightcore:moon_ore_cluster',
      [
        { item: 'create:crushed_raw_zinc', count: 2 },
        { item: 'northstar:rutile_concentrate' },
        { item: 'minecraft:glowstone_dust' },
        { item: 'minecraft:lapis_lazuli', count: 4, chance: 0.5 },
        { item: 'minecraft:redstone', count: 2, chance: 0.5 },
        { item: 'northstar:lunar_sapphire_shard', chance: 0.1 },
      ]
    );
    addProcessing(
      (outputs, input) => vintageimprovements.vibrating(outputs, input),
      'vibrating/moon_ore_cluster',
      'createdelightcore:moon_ore_cluster',
      [
        { item: 'create:raw_zinc' },
        { item: 'northstar:rutile_concentrate' },
        { item: 'northstar:raw_glowstone_ore' },
        { item: 'minecraft:lapis_lazuli', count: 2, chance: 0.5 },
        { item: 'createoreexcavation:raw_redstone', chance: 0.2 },
        { item: 'northstar:lunar_sapphire_shard', chance: 0.3 },
      ]
    );

    addProcessing(
      (outputs, input) => create.crushing(outputs, input),
      'crushing/mars_ore_cluster',
      'createdelightcore:mars_ore_cluster',
      [
        { item: 'create:crushed_raw_iron', count: 2 },
        { item: 'minecraft:quartz', count: 2 },
        { item: 'northstar:raw_martian_iron_ore', count: 2, chance: 0.3 },
        { item: 'create:crushed_raw_zinc', chance: 0.4 },
        { item: 'create:crushed_raw_copper', chance: 0.5 },
        { item: 'minecraft:redstone', count: 2 },
        { item: 'createdelightcore:crushed_raw_titanium', chance: 0.2 },
      ]
    );
    addProcessing(
      (outputs, input) => vintageimprovements.vibrating(outputs, input),
      'vibrating/mars_ore_cluster',
      'createdelightcore:mars_ore_cluster',
      [
        { item: 'minecraft:raw_iron' },
        { item: 'minecraft:quartz' },
        { item: 'northstar:raw_martian_iron_ore', count: 2, chance: 0.4 },
        { item: 'create:raw_zinc', chance: 0.3 },
        { item: 'minecraft:raw_copper', chance: 0.4 },
        { item: 'createoreexcavation:raw_redstone', chance: 0.4 },
        { item: 'northstar:raw_titanium_ore', chance: 0.4 },
      ]
    );

    addProcessing(
      (outputs, input) => create.crushing(outputs, input),
      'crushing/venus_ore_cluster',
      'createdelightcore:venus_ore_cluster',
      [
        { item: 'minecraft:quartz', count: 3 },
        { item: 'create:crushed_raw_iron', count: 3, chance: 0.6 },
        { item: 'createdelightcore:crushed_raw_titanium' },
        { item: 'create:crushed_raw_gold', count: 2, chance: 0.75 },
        { item: 'create:crushed_raw_zinc', chance: 0.5 },
        { item: 'minecraft:redstone', chance: 0.5 },
        { item: 'minecraft:diamond', chance: 0.1 },
      ]
    );
    addProcessing(
      (outputs, input) => vintageimprovements.vibrating(outputs, input),
      'vibrating/venus_ore_cluster',
      'createdelightcore:venus_ore_cluster',
      [
        { item: 'minecraft:quartz' },
        { item: 'minecraft:raw_iron' },
        { item: 'northstar:raw_titanium_ore' },
        { item: 'minecraft:raw_gold' },
        { item: 'create:raw_zinc', chance: 0.5 },
        { item: 'createoreexcavation:raw_redstone', chance: 0.25 },
        { item: 'createoreexcavation:raw_diamond', chance: 0.1 },
      ]
    );

    addProcessing(
      (outputs, input) => create.crushing(outputs, input),
      'crushing/mercury_ore_cluster',
      'createdelightcore:mercury_ore_cluster',
      [
        { item: 'minecraft:redstone', count: 2 },
        { item: 'minecraft:lapis_lazuli', count: 2 },
        { item: 'minecraft:glowstone_dust' },
        { item: 'createmetallurgy:crushed_raw_tungsten', chance: 0.8 },
        { item: 'create:crushed_raw_gold', chance: 0.5 },
        { item: 'createdelightcore:crushed_raw_titanium', chance: 0.3 },
      ]
    );
    addProcessing(
      (outputs, input) => vintageimprovements.vibrating(outputs, input),
      'vibrating/mercury_ore_cluster',
      'createdelightcore:mercury_ore_cluster',
      [
        { item: 'createoreexcavation:raw_redstone', chance: 0.2 },
        { item: 'minecraft:lapis_lazuli' },
        { item: 'northstar:raw_glowstone_ore' },
        { item: 'createmetallurgy:raw_tungsten' },
        { item: 'minecraft:raw_gold', chance: 0.75 },
        { item: 'northstar:raw_titanium_ore', chance: 0.5 },
      ]
    );

    removeIfPresent('createoreexcavation:extractor/water');
  });
}

if (global.hasAllMods(['createoreexcavation', 'ratatouille', 'alexscaves'])) {
  ServerEvents.recipes((event) => {
    const { createoreexcavation } = event.recipes;
    const id = (path) => `createdelightcore:createoreexcavation/${path}`;

    createoreexcavation
      .vein('{"text": "可可原浆"}', 'ratatouille:cocoa_liquor_bucket')
      .placement(128, 8, 1919810)
      .biomeWhitelist('createdelightcore:has_cocoa_liquor')
      .id(id('ore_vein_type/cocoa_liquor'));

    createoreexcavation
      .extracting(Fluid.of('ratatouille:cocoa_liquor', 100), id('ore_vein_type/cocoa_liquor'), 100)
      .stress(1024)
      .id(id('extracting/cocoa_liquor'));
  });
}

if (global.hasAllMods(['createoreexcavation', 'create', 'the_bumblezone'])) {
  ServerEvents.recipes((event) => {
    const { createoreexcavation } = event.recipes;
    const id = (path) => `createdelightcore:createoreexcavation/${path}`;

    createoreexcavation
      .vein('{"text": "蜂蜜"}', 'create:honey_bucket')
      .placement(128, 8, 114514)
      .biomeWhitelist('createdelightcore:has_honey')
      .id(id('ore_vein_type/honey'));

    createoreexcavation
      .extracting(Fluid.of('create:honey', 100), id('ore_vein_type/honey'), 100)
      .stress(1024)
      .fluid(Fluid.of('the_bumblezone:sugar_water', 250))
      .id(id('extracting/honey'));
  });
}
