// Remaining 0488 Create/Custom recipes. Gameplay and registrations live in Core.
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['create', 'createdelightcore'])) return;
  const { create, vintageimprovements, createmetallurgy, createdieselgenerators } = event.recipes;
  const id = (path) => `createdelightcore:industrial/${path}`;
  const withMods = (mods, action) => {
    if (global.hasAllMods(mods)) action();
  };
  const remove = (recipe) => {
    if (!event.findRecipeIds(recipe).isEmpty()) event.remove({ id: recipe });
  };
  const ingredient = (value) => (value.startsWith('#') ? { tag: value.slice(1) } : { item: value });
  // Explicit Create 6 fluid-stack ingredients work inside sequenced assembly.
  const assembly = (path, input, transition, results, steps, loops) => {
    event
      .custom({
        type: 'create:sequenced_assembly',
        ingredient: ingredient(input),
        transitional_item: { id: transition },
        results: results,
        loops: loops,
        sequence: steps.map((step) => ({
          type: step[0],
          ingredients: [{ item: transition }].concat(
            step.slice(1).map((value) => (typeof value === 'string' ? ingredient(value) : value))
          ),
          results: [{ id: transition }],
        })),
      })
      .id(id(path));
  };
  const fluid = (name, amount) => ({ type: 'fluid_stack', fluid: name, amount: amount });

  withMods(['vintageimprovements', 'ae2'], () => {
    ['helmet', 'chestplate', 'leggings', 'boots'].forEach((part) => {
      // Unbreakability is supplied by Core's default item components.
      vintageimprovements
        .pressurizing(`createdelightcore:air_${part}`, [
          `minecraft:leather_${part}`,
          'ae2:quantum_entangled_singularity',
          'ae2:quantum_entangled_singularity',
        ])
        .superheated()
        .id(id(`air_${part}`));
    });
  });
  withMods(['vintageimprovements'], () => {
    remove('create:sequenced_assembly/precision_mechanism');
    assembly(
      'precision_mechanism',
      'create:golden_sheet',
      'create:incomplete_precision_mechanism',
      [{ id: 'create:precision_mechanism' }],
      [
        ['create:deploying', 'create:cogwheel'],
        ['create:deploying', 'create:large_cogwheel'],
        ['create:deploying', '#c:springs/between_500_2_1000'],
      ],
      3
    );
  });
  withMods(['createaddition', 'createmetallurgy'], () => {
    remove('create:crafting/materials/electron_tube');
    assembly(
      'electron_tube',
      'create:iron_sheet',
      'createdelightcore:incomplete_electron_tube',
      [{ id: 'create:electron_tube', count: 2 }],
      [
        ['create:deploying', '#c:wires/electric'],
        ['create:filling', fluid('createmetallurgy:molten_tin', 10)],
        ['create:deploying', 'create:polished_rose_quartz'],
        ['create:cutting'],
      ],
      1
    );
    // Legacy low-tech alternative retains its weighted iron-sheet failure result.
    assembly(
      'electron_tube_manual_sequence',
      'create:iron_sheet',
      'createdelightcore:incomplete_electron_tube',
      [{ id: 'create:electron_tube' }, { id: 'create:iron_sheet' }],
      [['create:deploying', 'create:polished_rose_quartz']],
      1
    );
  });
  withMods(['create_new_age'], () => {
    event.recipes.create_new_age
      .energising('create:electron_tube', 'createdelightcore:bleak_electron_tube', 10000)
      .id(id('energising/bleak_electron_tube'));
  });
  const milkFilling = (input, count, path) =>
    event
      .custom({
        type: 'create:filling',
        ingredients: [{ item: input }, { type: 'fluid_tag', fluid_tag: 'c:milk', amount: 250 }],
        results: [{ id: 'create:sweet_roll', count: count }],
      })
      .id(id(path));
  withMods(['alexscavesup'], () => {
    milkFilling('alexscavesup:gingerbread_crumbs', 3, 'filling/gingerbread_sweet_roll');
  });
  withMods(['create_deepfried'], () => {
    milkFilling('create_deepfried:donut', 1, 'filling/sweet_roll');
  });
  const shaped = (result, pattern, keys, path) => event.shaped(result, pattern, keys).id(id(path));
  shaped(
    '12x create:fluid_pipe',
    ['PIP'],
    { P: '#c:plates/bronze', I: '#c:ingots/bronze' },
    'bronze_pipe'
  );
  shaped(
    '12x create:fluid_pipe',
    ['P', 'I', 'P'],
    { P: '#c:plates/bronze', I: '#c:ingots/bronze' },
    'bronze_pipe_vertical'
  );
  shaped(
    '3x create:fluid_tank',
    ['P', 'B', 'P'],
    { P: '#c:plates/bronze', B: 'minecraft:barrel' },
    'bronze_tank'
  );
  withMods(['createmetallurgy'], () => {
    shaped(
      '12x create:chute',
      ['PIP'],
      { P: '#c:plates/tungsten', I: '#c:ingots/tungsten' },
      'tungsten_chute'
    );
    shaped(
      '3x create:item_vault',
      ['P', 'B', 'P'],
      { P: '#c:plates/tungsten', B: 'minecraft:barrel' },
      'tungsten_vault'
    );
    createmetallurgy
      .melting(Fluid.of('createmetallurgy:molten_iron', 360), 'minecraft:iron_trapdoor')
      .heatRequirement('heated')
      .processingTime(180)
      .id(id('melting/iron_trapdoor'));
    withMods(['supplementaries'], () => {
      createmetallurgy
        .melting(
          Fluid.of('createmetallurgy:molten_netherite', 360),
          'supplementaries:netherite_trapdoor'
        )
        .heatRequirement('superheated')
        .processingTime(240)
        .id(id('melting/netherite_trapdoor'));
    });
    withMods(['create_connected'], () => {
      shaped(
        '3x create_connected:item_silo',
        ['PBP'],
        { P: '#c:plates/tungsten', B: 'minecraft:barrel' },
        'tungsten_silo'
      );
    });
  });
  withMods(['create_connected'], () => {
    shaped(
      '3x create_connected:fluid_vessel',
      ['PBP'],
      { P: '#c:plates/bronze', B: 'minecraft:barrel' },
      'bronze_vessel'
    );
  });
  withMods(['ratatouille', 'create_enchantment_industry'], () => {
    // CEI 2.x removed ink; do not register a recipe with a nonexistent fluid.
    if (!global.fluidExists('create_enchantment_industry:ink')) return;
    assembly(
      'ink_sac',
      'ratatouille:sausage_casing',
      'ratatouille:sausage_casing',
      [{ id: 'minecraft:ink_sac' }],
      [
        ['create:filling', fluid('create_enchantment_industry:ink', 500)],
        ['create:deploying', '#c:slime_balls'],
      ],
      1
    );
  });
  withMods(['ae2', 'supplementaries'], () => {
    assembly(
      'tiny_tnt',
      'ae2:certus_quartz_dust',
      'ae2:certus_quartz_dust',
      [{ id: 'ae2:tiny_tnt' }],
      [['create:filling', fluid('supplementaries:lumisene', 100)]],
      2
    );
  });
  withMods(['createaddition', 'alexscavesup'], () => {
    // Create Addition 1.21 rolling is no longer an assembly step. Keep both machines.
    event.recipes.createaddition
      .rolling('createdelightcore:rolled_polymer_sheet', 'alexscavesup:polymer_plate')
      .id(id('rolling/polymer_sheet'));
    create
      .deploying('createdelightcore:blood_collection_device', [
        'createdelightcore:rolled_polymer_sheet',
        'createdelightcore:needle',
      ])
      .id(id('blood_collection_device'));
  });
  withMods(['explorerscompass', 'createmetallurgy'], () => {
    event.replaceInput(
      { id: 'explorerscompass:explorers_compass' },
      'minecraft:cracked_stone_bricks',
      '#c:ingots/steel'
    );
  });
  // The old fermenting helper used Diesel Generators, not Vintage Delight.
  const ferment = (name, result, inputs, heat) => {
    ['basin_fermenting', 'bulk_fermenting'].forEach((type) => {
      const recipe = createdieselgenerators[type](result, inputs)
        .processingTime(type === 'basin_fermenting' ? 600 : 300)
        .id(id(`${type}/${name}`));
      if (heat) recipe.heatRequirement(heat);
    });
  };
  withMods(['createdieselgenerators', 'farmersdelight'], () => {
    ferment('rich_soil', 'farmersdelight:rich_soil', [
      'farmersdelight:organic_compost',
      Fluid.water(100),
      Ingredient.of('#c:mushrooms'),
    ]);
  });
  withMods(['createdieselgenerators', 'mynethersdelight'], () => {
    ferment(
      'resurgent_soil',
      'mynethersdelight:resurgent_soil',
      [
        'mynethersdelight:letios_compost',
        Fluid.lava(100),
        Ingredient.of(['minecraft:warped_fungus', 'minecraft:crimson_fungus']),
      ],
      'heated'
    );
  });
  withMods(['createdieselgenerators', 'northstar', 'netherexp'], () => {
    ferment('luna_soil', 'createdelightcore:luna_soil', [
      'createdelightcore:phantom_compost',
      'northstar:enriched_glowstone_ore',
      Fluid.of('netherexp:ectoplasm', 100),
    ]);
  });
  withMods(['vintageimprovements', 'ae2'], () => {
    vintageimprovements
      .vacuumizing(
        [
          CreateItem.of('4x create:veridium', 0.5),
          CreateItem.of('4x create:asurine', 0.5),
          CreateItem.of('4x create:crimsite', 0.5),
          CreateItem.of('4x create:scoria', 0.25),
          CreateItem.of('4x create:ochrum', 0.2),
        ],
        ['createdelightcore:overworld_metal_ore_cluster', 'ae2:matter_ball']
      )
      .id(id('vacuumizing/overworld_metal_ore_cluster'));
  });
});
