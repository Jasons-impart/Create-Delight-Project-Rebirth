if (global.hasMod('alexscavesup')) {
  ServerEvents.recipes((event) => {
    const { kubejs } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/magnetic_cave/${path}`;

    remove_recipes_id(event, ['alexscavesup:seeking_arrow']);

    kubejs
      .shapeless('alexscavesup:seeking_arrow', [
        'minecraft:arrow',
        'alexscavesup:scarlet_neodymium_ingot',
      ])
      .id(id('seeking_arrow'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/magnetic_cave/${path}`;

    create
      .crushing(
        [
          CreateItem.of('minecraft:iron_nugget', 0.15),
          CreateItem.of('vintageimprovements:vanadium_nugget', 0.1),
        ],
        'alexscavesup:galena'
      )
      .id(id('crushing/galena'));

    vintageimprovements
      .pressurizing(
        ['alexscavesup:galena', 'create_new_age:magnetite_block'],
        ['create_new_age:magnetite_block', 'minecraft:deepslate', 'minecraft:iron_nugget']
      )
      .heated()
      .id(id('pressurizing/galena'));

    create
      .mixing(
        ['alexscavesup:galena', 'create_new_age:magnetite_block'],
        ['create_new_age:magnetite_block', 'minecraft:deepslate', 'minecraft:iron_nugget']
      )
      .processingTime(5000)
      .id(id('mixing/galena'));

    vintageimprovements
      .centrifugation(
        [
          CreateItem.of('alexscavesup:energized_galena_scarlet', 0.5),
          CreateItem.of('alexscavesup:energized_galena_azure', 0.5),
        ],
        'alexscavesup:energized_galena_neutral'
      )
      .id(id('centrifugation/energized_galena_neutral'));

    create
      .crushing(
        [
          CreateItem.of('minecraft:iron_nugget', 0.2),
          CreateItem.of('vintageimprovements:vanadium_nugget', 0.2),
          CreateItem.of('alexscavesup:raw_scarlet_neodymium', 0.15),
        ],
        'alexscavesup:energized_galena_scarlet'
      )
      .id(id('crushing/energized_galena_scarlet'));

    create
      .crushing(
        [
          CreateItem.of('minecraft:iron_nugget', 0.2),
          CreateItem.of('vintageimprovements:vanadium_nugget', 0.2),
          CreateItem.of('alexscavesup:raw_azure_neodymium', 0.15),
        ],
        'alexscavesup:energized_galena_azure'
      )
      .id(id('crushing/energized_galena_azure'));

    create
      .crushing(
        [
          CreateItem.of('minecraft:iron_nugget', 0.15),
          CreateItem.of('vintageimprovements:vanadium_nugget', 0.3),
          CreateItem.of('alexscavesup:raw_scarlet_neodymium', 0.05),
          CreateItem.of('alexscavesup:raw_azure_neodymium', 0.05),
        ],
        'alexscavesup:energized_galena_neutral'
      )
      .id(id('crushing/energized_galena_neutral'));

    create
      .filling('alexscavesup:seeking_arrow', [
        'minecraft:arrow',
        Fluid.of('createdelightcore:molten_scarlet_neodymium', 10),
      ])
      .id(id('filling/seeking_arrow'));

    create
      .mixing('alexscavesup:seeking_arrow', [
        'minecraft:arrow',
        Fluid.of('createdelightcore:molten_scarlet_neodymium', 20),
      ])
      .id(id('mixing/seeking_arrow'));

    create
      .mixing('alexscavesup:ferrouslime_ball', [
        'minecraft:slime_ball',
        Ingredient.of('#c:dusts/iron'),
      ])
      .id(id('mixing/ferrouslime_ball'));

    create
      .mixing(Fluid.of('createdelightcore:ferrouslime', 90), [
        Fluid.of('createdelightcore:slime', 90),
        Ingredient.of('#c:dusts/iron'),
      ])
      .id(id('mixing/ferrouslime'));

    create
      .mixing(Fluid.of('createdelightcore:chorusslime', 90), [
        Fluid.of('createdelightcore:slime', 90),
        'minecraft:chorus_fruit',
      ])
      .id(id('mixing/chorusslime'));

    create
      .compacting('alexscavesup:ferrouslime_ball', Fluid.of('createdelightcore:ferrouslime', 90))
      .id(id('compacting/ferrouslime'));

    create
      .mixing(Fluid.of('createdelightcore:ferrouslime', 90), 'alexscavesup:ferrouslime_ball')
      .heated()
      .id(id('mixing/ferrouslime_melting'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'create_new_age', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, create_new_age, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/magnetic_cave/${path}`;

    create_new_age
      .energising('alexscavesup:energized_galena_neutral', 'alexscavesup:galena', 20000)
      .id(id('energising/energized_galena_neutral'));

    create
      .sequenced_assembly('alexscavesup:heart_of_iron', 'minecraft:iron_block', [
        vintageimprovements.turning('alexscavesup:heart_of_iron', 'alexscavesup:heart_of_iron'),
        create_new_age.energising(
          'alexscavesup:heart_of_iron',
          'alexscavesup:heart_of_iron',
          20000
        ),
      ])
      .transitionalItem('alexscavesup:heart_of_iron')
      .loops(1)
      .id(id('sequenced_assembly/heart_of_iron'));

    kubejs
      .shaped('alexscavesup:telecore', ['ABC', ' D ', '   '], {
        A: 'alexscavesup:raw_scarlet_neodymium',
        B: 'minecraft:quartz',
        C: 'alexscavesup:raw_azure_neodymium',
        D: 'create_new_age:overcharged_iron_sheet',
      })
      .id(id('telecore'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'createmetallurgy', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, createmetallurgy, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/magnetic_cave/${path}`;
    const metalProductionLine = (metal, heat, time) => {
      const block = metal[0];
      const ingot = metal[1];
      const fluid = metal[2];
      const heatLevel = heat === 'superheated' ? 9 : 6;

      createmetallurgy
        .bulk_melting(Fluid.of(fluid, 810), block)
        .minHeatRequirement(heatLevel)
        .processingTime(100)
        .id(id(`bulk_melting/${block.split(':')[1]}`));

      createmetallurgy
        .melting(Fluid.of(fluid, 90), ingot)
        .heatRequirement(heat)
        .processingTime(0.5 * time)
        .id(id(`melting/${ingot.split(':')[1]}`));

      createmetallurgy
        .casting_in_basin(block, Fluid.of(fluid, 810))
        .processingTime(2 * time)
        .id(id(`casting_in_basin/${block.split(':')[1]}`));

      createmetallurgy
        .casting_in_table(ingot, [Fluid.of(fluid, 90), 'createmetallurgy:graphite_ingot_mold'])
        .processingTime(time)
        .id(id(`casting_in_table/${ingot.split(':')[1]}`));
    };

    createmetallurgy
      .alloying(Fluid.of('createdelightcore:molten_scarlet_neodymium', 90), [
        Fluid.of('createmetallurgy:molten_iron', 180),
        'alexscavesup:raw_scarlet_neodymium',
        'alexscavesup:raw_scarlet_neodymium',
      ])
      .heatRequirement('superheated')
      .id(id('alloying/molten_scarlet_neodymium'));

    createmetallurgy
      .alloying(Fluid.of('createdelightcore:molten_azure_neodymium', 90), [
        Fluid.of('createmetallurgy:molten_iron', 180),
        'alexscavesup:raw_azure_neodymium',
        'alexscavesup:raw_azure_neodymium',
      ])
      .heatRequirement('superheated')
      .id(id('alloying/molten_azure_neodymium'));

    metalProductionLine(
      [
        'alexscavesup:block_of_scarlet_neodymium',
        'alexscavesup:scarlet_neodymium_ingot',
        'createdelightcore:molten_scarlet_neodymium',
      ],
      'heated',
      100
    );

    metalProductionLine(
      [
        'alexscavesup:block_of_azure_neodymium',
        'alexscavesup:azure_neodymium_ingot',
        'createdelightcore:molten_azure_neodymium',
      ],
      'heated',
      100
    );

    create
      .sequenced_assembly('alexscavesup:heavyweight', 'alexscavesup:block_of_scarlet_neodymium', [
        vintageimprovements
          .curving(
            'alexscavesup:block_of_scarlet_neodymium',
            'alexscavesup:block_of_scarlet_neodymium'
          )
          .mode(2),
        create.deploying('alexscavesup:block_of_scarlet_neodymium', [
          'alexscavesup:block_of_scarlet_neodymium',
          'createmetallurgy:steel_ingot',
        ]),
      ])
      .transitionalItem('alexscavesup:block_of_scarlet_neodymium')
      .loops(1)
      .id(id('sequenced_assembly/heavyweight'));

    create
      .sequenced_assembly('alexscavesup:notor_gizmo', 'createdelightcore:steel_sheet', [
        create.deploying('createdelightcore:steel_sheet', [
          'createdelightcore:steel_sheet',
          'alexscavesup:raw_azure_neodymium',
        ]),
        create.deploying('createdelightcore:steel_sheet', [
          'createdelightcore:steel_sheet',
          'alexscavesup:raw_scarlet_neodymium',
        ]),
      ])
      .transitionalItem('createdelightcore:steel_sheet')
      .loops(1)
      .id(id('sequenced_assembly/notor_gizmo'));

    create
      .sequenced_assembly(
        'createdelightcore:magnetic_mechanism',
        'vintageimprovements:vanadium_sheet',
        [
          create.filling('createdelightcore:incomplete_magnetic_mechanism', [
            'createdelightcore:incomplete_magnetic_mechanism',
            Fluid.of('createdelightcore:ferrouslime', 90),
          ]),
          create.deploying('createdelightcore:incomplete_magnetic_mechanism', [
            'createdelightcore:incomplete_magnetic_mechanism',
            'alexscavesup:scarlet_neodymium_ingot',
          ]),
          create.deploying('createdelightcore:incomplete_magnetic_mechanism', [
            'createdelightcore:incomplete_magnetic_mechanism',
            'alexscavesup:azure_neodymium_ingot',
          ]),
          create.deploying('createdelightcore:incomplete_magnetic_mechanism', [
            'createdelightcore:incomplete_magnetic_mechanism',
            'alexscavesup:tesla_bulb',
          ]),
        ]
      )
      .transitionalItem('createdelightcore:incomplete_magnetic_mechanism')
      .loops(1)
      .id(id('sequenced_assembly/magnetic_mechanism'));
  });
}
