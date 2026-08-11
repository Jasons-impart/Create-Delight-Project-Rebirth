if (global.hasAllMods(['alexscavesup', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/toxic_caves/${path}`;

    function addGrowingCluster(stages, fluid, amount) {
      for (let index = 1; index < stages.length; index += 1) {
        create
          .sequenced_assembly(stages[index], stages[index - 1], [
            create.filling(stages[index - 1], [stages[index - 1], Fluid.of(fluid, amount)]),
          ])
          .loops(4)
          .transitionalItem(stages[index - 1])
          .id(id(`growing/${stages[index].split(':')[1]}`));
      }
    }

    remove_recipes_id(event, [
      'alexscavesup:nuclear_furnace_component',
      'alexscavesup:nuclear_bomb',
      'alexscavesup:uranium_from_block',
      'alexscavesup:block_of_uranium',
      'vintageimprovements:craft/sulfur_item_to_nuggets',
      'vintageimprovements:craft/sulfur_block_to_items',
      'vintageimprovements:craft/sulfur_items_to_block',
      'vintageimprovements:craft/sulfur_nuggets_to_item',
      'vintageimprovements:pressurizing/sulfuric_acid',
    ]);

    vintageimprovements
      .pressurizing(
        [CreateItem.of('alexscavesup:radgill', 0.01), Fluid.of('minecraft:lava', 250)],
        [Ingredient.of('#minecraft:fishes'), Fluid.of('alexscavesup:acid', 1000)]
      )
      .heated()
      .id(id('pressurizing/radgill'));

    vintageimprovements
      .pressurizing(
        [CreateItem.of('alexscavesup:radgill_bucket', 0.05), Fluid.of('minecraft:lava', 250)],
        [Ingredient.of('#createdelightcore:fish_buckets'), Fluid.of('alexscavesup:acid', 1000)]
      )
      .heated()
      .id(id('pressurizing/radgill_bucket'));

    create
      .crushing(
        ['createdelightcore:uranium_dust', CreateItem.of('createdelightcore:uranium_dust', 0.25)],
        'alexscavesup:uranium'
      )
      .id(id('crushing/uranium_dust'));

    addGrowingCluster(
      [
        'alexscavesup:sulfur_dust',
        'alexscavesup:sulfur_bud_small',
        'alexscavesup:sulfur_bud_medium',
        'alexscavesup:sulfur_bud_large',
        'alexscavesup:sulfur_cluster',
      ],
      'vintageimprovements:sulfuric_acid',
      50
    );

    vintageimprovements
      .pressurizing(Fluid.of('vintageimprovements:sulfur_dioxide', 500), 'alexscavesup:sulfur_dust')
      .processingTime(100)
      .secondaryFluidOutput(0)
      .heated()
      .id(id('pressurizing/sulfur_dioxide_from_dust'));

    vintageimprovements
      .pressurizing(Fluid.of('vintageimprovements:sulfuric_acid', 500), [
        Fluid.water(500),
        Fluid.of('vintageimprovements:sulfur_trioxide', 500),
      ])
      .processingTime(100)
      .secondaryFluidInput(0)
      .id(id('pressurizing/sulfuric_acid'));

    vintageimprovements
      .pressurizing('27x alexscavesup:toxic_paste', [
        'createdelightcore:depleted_uranium_dust',
        Fluid.of('createdelightcore:slime', 270),
        'minecraft:mud',
      ])
      .heated()
      .id(id('pressurizing/toxic_paste'));

    kubejs
      .shapeless('alexscavesup:block_of_uranium', '9x createdelightcore:enriched_uraniumdust')
      .id(id('block_of_uranium'));

    kubejs
      .shapeless('9x createdelightcore:enriched_uraniumdust', 'alexscavesup:block_of_uranium')
      .id(id('uranium_from_block'));

    create
      .mechanical_crafting('alexscavesup:fissile_core', ['ABA', 'ACA', 'AAA'], {
        A: 'create:iron_sheet',
        B: 'createdelightcore:bleak_electron_tube',
        C: 'createdelightcore:enriched_uraniumdust',
      })
      .id(id('mechanical_crafting/nuclear_fissile_core'));

    create
      .mechanical_crafting(
        'alexscavesup:nuclear_bomb',
        ['AAAAAAA', 'ABBBBBA', 'ABCCCBA', 'ABCDCBA', 'ABCCCBA', 'ABBBBBA', 'AAAAAAA'],
        {
          A: 'createdelightcore:steel_sheet',
          B: 'minecraft:tnt',
          C: 'alexscavesup:block_of_uranium',
          D: 'alexscavesup:fissile_core',
        }
      )
      .id(id('mechanical_crafting/nuclear_bomb'));

    create
      .filling('alexscavesup:radon_bottle', [
        'minecraft:glass_bottle',
        Fluid.of('createdelightcore:radon', 250),
      ])
      .id(id('filling/radon_bottle'));

    create
      .emptying(
        ['minecraft:glass_bottle', Fluid.of('createdelightcore:radon', 250)],
        'alexscavesup:radon_bottle'
      )
      .id(id('emptying/radon'));

    vintageimprovements
      .pressurizing(
        CreateItem.of('alexscavesup:uranium_shard', 0.1),
        Fluid.of('alexscavesup:acid', 500),
        160
      )
      .superheated()
      .id(id('pressurizing/uranium_shard'));
  });
}

if (global.hasMod('alexscavesup') && global.hasMod('create')) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/toxic_caves/${path}`;

    remove_recipes_id(event, ['alexscavesup:uranium_rod']);

    create
      .sequenced_assembly('3x alexscavesup:uranium_rod', 'alexscavesup:block_of_uranium', [
        create.pressing('alexscavesup:block_of_uranium', 'alexscavesup:block_of_uranium'),
        create.deploying('alexscavesup:block_of_uranium', [
          'alexscavesup:block_of_uranium',
          'create:iron_sheet',
        ]),
        create.deploying('alexscavesup:block_of_uranium', [
          'alexscavesup:block_of_uranium',
          'create:iron_sheet',
        ]),
        create.cutting('alexscavesup:block_of_uranium', 'alexscavesup:block_of_uranium'),
      ])
      .transitionalItem('alexscavesup:block_of_uranium')
      .loops(1)
      .id(id('sequenced_assembly/uranium_rod'));
  });
}

if (global.hasAllMods(['alexscavesup', 'northstar', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:alexscavesup/toxic_caves/${path}`;

    remove_recipes_id(event, ['alexscavesup:polymer_plate']);

    event.recipes.vintageimprovements
      .pressurizing('alexscavesup:polymer_plate', [
        Fluid.of('createdelightcore:ethylene_fluid', 100),
        Fluid.of('northstar:oxygen', 100),
      ])
      .heated()
      .id(id('pressurizing/polymer_plate'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'create_new_age', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/toxic_caves/${path}`;

    remove_recipes_id(event, [
      'create_new_age:crushing/radioactive_thorium',
      'create_new_age:mixing/thorium',
      'create_new_age:sequenced_assembly/nuclear_fuel',
    ]);

    create
      .sequenced_assembly('create_new_age:nuclear_fuel', 'createdelightcore:steel_sheet', [
        vintageimprovements.curving(
          'create_new_age:incomplete_fuel',
          'create_new_age:incomplete_fuel'
        ),
        create.deploying('create_new_age:incomplete_fuel', [
          'create_new_age:incomplete_fuel',
          'createdelightcore:carbon_plate',
        ]),
        create.deploying('create_new_age:incomplete_fuel', [
          'create_new_age:incomplete_fuel',
          Ingredient.of('#createdelightcore:fission_fuel'),
        ]),
        create.pressing('create_new_age:incomplete_fuel', 'create_new_age:incomplete_fuel'),
      ])
      .loops(1)
      .transitionalItem('create_new_age:incomplete_fuel')
      .id(id('sequenced_assembly/nuclear_fuel'));
  });
}

if (
  global.hasAllMods([
    'alexscavesup',
    'createdieselgenerators',
    'createmetallurgy',
    'vintageimprovements',
  ])
) {
  ServerEvents.recipes((event) => {
    const { createdieselgenerators, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/toxic_caves/${path}`;

    createdieselgenerators
      .distillation(
        [
          Fluid.of('createdieselgenerators:diesel', 20),
          Fluid.of('createdieselgenerators:gasoline', 20),
        ],
        Fluid.of('createdieselgenerators:crude_oil', 100),
        100
      )
      .heatRequirement('heated')
      .id(id('distillation/crude_oil'));

    vintageimprovements
      .pressurizing(
        [Fluid.of('createdelightcore:light_crude_oil', 50), 'createmetallurgy:coke'],
        Fluid.of('createdieselgenerators:crude_oil', 100),
        60
      )
      .superheated()
      .id(id('pressurizing/crude_oil_pyrolysis'));

    vintageimprovements
      .pressurizing(
        [Fluid.of('createdelightcore:ethylene_fluid', 250), Fluid.water(250)],
        [
          Fluid.of('vintageimprovements:sulfuric_acid', 50),
          Fluid.of('createdieselgenerators:ethanol', 250),
        ]
      )
      .secondaryFluidOutput(0)
      .heated()
      .id(id('pressurizing/ethylene_fluid_from_ethanol'));

    vintageimprovements
      .pressurizing(Fluid.of('createdelightcore:lubricating_oil', 250), [
        Fluid.of('vintageimprovements:sulfuric_acid', 100),
        Fluid.of('createdelightcore:ethylene_fluid', 250),
        'vintageimprovements:vanadium_nugget',
      ])
      .superheated()
      .id(id('pressurizing/lubricating_oil'));
  });
}

if (
  global.hasAllMods(['alexscavesup', 'createdieselgenerators', 'northstar', 'vintageimprovements'])
) {
  ServerEvents.recipes((event) => {
    const { createdieselgenerators, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/toxic_caves/${path}`;

    vintageimprovements
      .pressurizing(
        [Fluid.of('createdelightcore:light_crude_oil', 100), Fluid.of('northstar:carbon', 250)],
        [Fluid.of('createdieselgenerators:crude_oil', 100), 'vintageimprovements:vanadium_nugget'],
        30,
        1
      )
      .superheated()
      .id(id('pressurizing/crude_oil_catalytic_cracking'));

    createdieselgenerators
      .distillation(
        [
          Fluid.of('createdelightcore:lubricating_oil', 20),
          Fluid.of('createdieselgenerators:diesel', 50),
          Fluid.of('createdieselgenerators:gasoline', 50),
          Fluid.of('createdelightcore:ethylene_fluid', 20),
          Fluid.of('northstar:methane', 20),
        ],
        Fluid.of('createdelightcore:light_crude_oil', 100),
        20
      )
      .heatRequirement('heated')
      .id(id('distillation/light_crude_oil'));

    vintageimprovements
      .pressurizing(
        [
          Fluid.of('createdelightcore:radon', 250),
          Fluid.of('vintageimprovements:sulfuric_acid', 250),
          'northstar:raw_glowstone_ore',
        ],
        [Fluid.of('alexscavesup:acid', 500), 'northstar:enriched_glowstone_ore']
      )
      .secondaryFluidOutput(0)
      .heated()
      .id(id('pressurizing/sulfuric_acid_using_glowstone'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'bakeries'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/toxic_caves/${path}`;

    if (!global.itemExists('bakeries:cut_cake_base')) {
      return;
    }

    remove_recipes_id(event, ['alexscavesup:spelunkie']);

    create
      .sequenced_assembly('alexscavesup:spelunkie', 'bakeries:cut_cake_base', [
        create.deploying('bakeries:cut_cake_base', [
          'bakeries:cut_cake_base',
          'alexscavesup:sulfur_dust',
        ]),
        create.pressing('bakeries:cut_cake_base', 'bakeries:cut_cake_base'),
        create.deploying('bakeries:cut_cake_base', [
          'bakeries:cut_cake_base',
          Ingredient.of('#c:creams'),
        ]),
      ])
      .loops(1)
      .transitionalItem('bakeries:cut_cake_base')
      .id(id('sequenced_assembly/spelunkie'));

    kubejs
      .shapeless('alexscavesup:spelunkie', [
        'bakeries:cut_cake_base',
        Ingredient.of('#c:creams'),
        'alexscavesup:sulfur_dust',
      ])
      .id(id('spelunkie'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'bakeries', 'cosmopolitan'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/toxic_caves/${path}`;

    if (!global.itemExists('bakeries:cut_cake_base')) {
      return;
    }

    create
      .sequenced_assembly('alexscavesup:spelunkie', 'bakeries:cut_cake_base', [
        create.deploying('bakeries:cut_cake_base', [
          'bakeries:cut_cake_base',
          'alexscavesup:sulfur_dust',
        ]),
        create.filling('bakeries:cut_cake_base', [
          'bakeries:cut_cake_base',
          Fluid.of('cosmopolitan:cream', 250),
        ]),
        create.pressing('bakeries:cut_cake_base', 'bakeries:cut_cake_base'),
      ])
      .loops(1)
      .transitionalItem('bakeries:cut_cake_base')
      .id(id('sequenced_assembly/spelunkie_with_cosmopolitan_cream'));
  });
}

if (global.hasAllMods(['alexscavesup', 'create', 'luncheonmeatsdelight'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:alexscavesup/toxic_caves/${path}`;

    create
      .sequenced_assembly('alexscavesup:slam', 'luncheonmeatsdelight:luncheon_meat_can', [
        create.deploying('luncheonmeatsdelight:luncheon_meat_can', [
          'luncheonmeatsdelight:luncheon_meat_can',
          'alexscavesup:sulfur_dust',
        ]),
        create.deploying('luncheonmeatsdelight:luncheon_meat_can', [
          'luncheonmeatsdelight:luncheon_meat_can',
          'minecraft:bone_meal',
        ]),
      ])
      .loops(1)
      .transitionalItem('luncheonmeatsdelight:luncheon_meat_can')
      .id(id('sequenced_assembly/slam'));
  });
}
