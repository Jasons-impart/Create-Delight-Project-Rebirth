if (
  global.hasAllMods([
    'create_new_age',
    'create',
    'createaddition',
    'create_sa',
    'vintageimprovements',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, create_new_age, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:create_new_age/${path}`;

    remove_recipes_output(event, [
      'create_new_age:electrical_connector',
      'create_new_age:heat_pipe',
      'create_new_age:heat_pump',
      'create_new_age:heater',
      'create_new_age:stirling_engine',
      'create_new_age:solid_corium',
      'create_new_age:corium',
      'create_new_age:reactor_fuel_acceptor',
      'create_new_age:reactor_rod',
      'create_new_age:overcharged_iron_wire',
      'create_new_age:overcharged_golden_wire',
      'create_new_age:overcharged_diamond_wire',
      'create_new_age:reactor_heat_vent',
      'create_new_age:basic_solar_heating_plate',
      'create_new_age:advanced_solar_heating_plate',
      'create_new_age:copper_wire_block',
      'create_new_age:overcharged_iron_wire_block',
      'create_new_age:overcharged_golden_wire_block',
      'create_new_age:overcharged_diamond_wire_block',
      'create_new_age:blank_circuit',
      'create_new_age:copper_circuit',
      'create_new_age:basic_energiser',
      'create_new_age:advanced_energiser',
      'create_new_age:reinforced_energiser',
      'create_new_age:redstone_magnet',
      'create_new_age:layered_magnet',
      'create_new_age:carbon_brushes',
      'create_new_age:basic_motor',
      'create_new_age:advanced_motor',
      'create_new_age:reinforced_motor',
    ]);

    event.forEachRecipe({ type: 'createaddition:charging', mod: 'createaddition' }, (recipe) => {
      const energy = recipe.json.get('energy').asDouble;
      const input = recipe.json.get('ingredients').asJsonArray.get(0).asJsonObject;
      const itemId = input.get('item').asString;
      const count = input.has('count') ? input.get('count').asDouble : 1;
      const output = recipe.getOriginalRecipeResult();

      create_new_age
        .energising(output, Ingredient.of(itemId, count), energy)
        .id(id(`energising/${output.getId().split(':')[1]}`));
    });
    event.remove({ type: 'createaddition:charging' });

    kubejs
      .shaped('create_new_age:basic_energiser', [' A ', 'BCB', ' D '], {
        A: 'createaddition:capacitor',
        B: 'createaddition:copper_wire',
        C: 'create:andesite_casing',
        D: 'minecraft:lightning_rod',
      })
      .id(id('shaped/basic_energiser'));

    kubejs
      .shaped('create_new_age:advanced_energiser', [' A ', 'BCB', ' D '], {
        A: 'createaddition:capacitor',
        B: 'create_new_age:overcharged_golden_sheet',
        C: 'create_new_age:basic_energiser',
        D: 'vintageimprovements:laser_item',
      })
      .id(id('shaped/advanced_energiser'));

    create
      .sequenced_assembly(
        'create_new_age:reinforced_energiser',
        'create_new_age:advanced_energiser',
        [
          create.deploying('create_new_age:advanced_energiser', [
            'create_new_age:advanced_energiser',
            'create_new_age:overcharged_diamond',
          ]),
          create.deploying('create_new_age:advanced_energiser', [
            'create_new_age:advanced_energiser',
            'createdelightcore:bleak_electron_tube',
          ]),
          create.deploying('create_new_age:advanced_energiser', [
            'create_new_age:advanced_energiser',
            'alexscaves:tesla_bulb',
          ]),
        ]
      )
      .transitionalItem('create_new_age:advanced_energiser')
      .loops(1)
      .id(id('sequenced_assembly/reinforced_energiser'));

    vintageimprovements
      .pressurizing('create_new_age:magnetite_block', [
        'minecraft:iron_block',
        'alexscaves:energized_galena_neutral',
        'alexscaves:energized_galena_neutral',
        'alexscaves:energized_galena_neutral',
        'alexscaves:energized_galena_neutral',
        'alexscaves:energized_galena_neutral',
        'alexscaves:energized_galena_neutral',
        'alexscaves:energized_galena_neutral',
        'alexscaves:energized_galena_neutral',
      ])
      .heated()
      .id(id('pressurizing/magnetite_block'));

    vintageimprovements
      .pressurizing('create_new_age:redstone_magnet', [
        'create_new_age:magnetite_block',
        'minecraft:redstone',
      ])
      .heated()
      .id(id('pressurizing/redstone_magnet'));

    create
      .sequenced_assembly('create_new_age:layered_magnet', 'create_new_age:redstone_magnet', [
        create.deploying('createdelightcore:incomplete_layered_magnet', [
          'createdelightcore:incomplete_layered_magnet',
          'create_new_age:overcharged_golden_sheet',
        ]),
        create.deploying('createdelightcore:incomplete_layered_magnet', [
          'createdelightcore:incomplete_layered_magnet',
          'create_new_age:overcharged_iron_sheet',
        ]),
      ])
      .transitionalItem('createdelightcore:incomplete_layered_magnet')
      .loops(3)
      .id(id('sequenced_assembly/layered_magnet'));

    vintageimprovements
      .pressurizing('create_new_age:fluxuated_magnetite', [
        Fluid.of('alexscaves:acid', 250),
        'create_new_age:overcharged_diamond',
        'create_new_age:overcharged_diamond',
        'create_new_age:layered_magnet',
        'minecraft:blaze_powder',
        'minecraft:blaze_powder',
      ])
      .secondaryFluidInput(0)
      .heated()
      .id(id('pressurizing/fluxuated_magnetite'));

    vintageimprovements
      .pressurizing('create_new_age:netherite_magnet', [
        'create_new_age:fluxuated_magnetite',
        Fluid.of('createmetallurgy:molten_netherite', 180),
        Fluid.of('createdelightcore:molten_azure_neodymium', 180),
      ])
      .heated()
      .id(id('pressurizing/netherite_magnet_azure'));

    vintageimprovements
      .pressurizing('create_new_age:netherite_magnet', [
        'create_new_age:fluxuated_magnetite',
        Fluid.of('createmetallurgy:molten_netherite', 180),
        Fluid.of('createdelightcore:molten_scarlet_neodymium', 180),
      ])
      .heated()
      .id(id('pressurizing/netherite_magnet_scarlet'));

    create
      .sequenced_assembly('create_new_age:carbon_brushes', 'create:shaft', [
        create.deploying('createdelightcore:incomplete_carbon_brushes', [
          'createdelightcore:incomplete_carbon_brushes',
          'createaddition:copper_spool',
        ]),
        create.deploying('createdelightcore:incomplete_carbon_brushes', [
          'createdelightcore:incomplete_carbon_brushes',
          'createdelightcore:carbon_plate',
        ]),
        create.filling('createdelightcore:incomplete_carbon_brushes', [
          'createdelightcore:incomplete_carbon_brushes',
          Fluid.of('createdelightcore:molten_andesite', 810),
        ]),
      ])
      .transitionalItem('createdelightcore:incomplete_carbon_brushes')
      .loops(1)
      .id(id('sequenced_assembly/carbon_brushes'));

    create
      .mechanical_crafting(
        'create_new_age:generator_coil',
        [' A A ', 'ABCBA', ' CDC ', 'ABCBA', ' A A '],
        {
          A: 'createdeco:andesite_sheet',
          B: 'createaddition:copper_spool',
          C: 'minecraft:copper_block',
          D: 'createaddition:alternator',
        }
      )
      .id(id('mechanical_crafting/generator_coil'));

    if (true) {
      event.replaceInput(
        { id: 'create_new_age:shaped/basic_motor_extension' },
        'create_new_age:copper_circuit',
        'ae2:logic_processor'
      );
    }
    event.replaceInput(
      { id: 'create_new_age:shaped/basic_motor_extension' },
      'create_new_age:overcharged_iron',
      'createmetallurgy:steel_ingot'
    );
    if (true) {
      event.replaceInput(
        { id: 'create_new_age:mechanical_crafting/advanced_motor_extension' },
        'create_new_age:copper_circuit',
        'ae2omnicells:multidimensional_expansion_processor'
      );
    }

    create
      .sequenced_assembly('2x create_new_age:basic_motor', 'createaddition:electric_motor', [
        create.deploying('createdelightcore:incomplete_basic_motor', [
          'createdelightcore:incomplete_basic_motor',
          'createaddition:copper_spool',
        ]),
        create.deploying('createdelightcore:incomplete_basic_motor', [
          'createdelightcore:incomplete_basic_motor',
          'create_sa:heat_engine',
        ]),
        create.filling('createdelightcore:incomplete_basic_motor', [
          'createdelightcore:incomplete_basic_motor',
          Fluid.of('createdelightcore:molten_andesite', 360),
        ]),
      ])
      .transitionalItem('createdelightcore:incomplete_basic_motor')
      .loops(1)
      .id(id('sequenced_assembly/basic_motor'));

    create
      .sequenced_assembly('2x create_new_age:advanced_motor', 'create_new_age:basic_motor', [
        create.deploying('createdelightcore:incomplete_advanced_motor', [
          'createdelightcore:incomplete_advanced_motor',
          Ingredient.of('#createaddition:high_current_spools'),
        ]),
        create.deploying('createdelightcore:incomplete_advanced_motor', [
          'createdelightcore:incomplete_advanced_motor',
          'create_sa:steam_engine',
        ]),
        create.filling('createdelightcore:incomplete_advanced_motor', [
          'createdelightcore:incomplete_advanced_motor',
          Fluid.of('createmetallurgy:molten_obdurium', 360),
        ]),
      ])
      .transitionalItem('createdelightcore:incomplete_advanced_motor')
      .loops(1)
      .id(id('sequenced_assembly/advanced_motor'));

    [
      'createdelightcore:molten_azure_neodymium',
      'createdelightcore:molten_scarlet_neodymium',
    ].forEach((fluid) => {
      create
        .sequenced_assembly('2x create_new_age:reinforced_motor', 'create_new_age:advanced_motor', [
          create.deploying('createdelightcore:incomplete_reinforced_motor', [
            'createdelightcore:incomplete_reinforced_motor',
            Ingredient.of('#createaddition:high_current_spools'),
          ]),
          create.deploying('createdelightcore:incomplete_reinforced_motor', [
            'createdelightcore:incomplete_reinforced_motor',
            'createdelightcore:magnetic_mechanism',
          ]),
          create.filling('createdelightcore:incomplete_reinforced_motor', [
            'createdelightcore:incomplete_reinforced_motor',
            Fluid.of(fluid, 360),
          ]),
        ])
        .transitionalItem('createdelightcore:incomplete_reinforced_motor')
        .loops(1)
        .id(
          id(`sequenced_assembly/reinforced_motor_${fluid.split(':')[1].replace('molten_', '')}`)
        );
    });
  });
}

if (global.hasAllMods(['create_new_age', 'create', 'create_enchantment_industry'])) {
  ServerEvents.recipes((event) => {
    const { create, create_new_age } = event.recipes;
    const id = (path) => `createdelightcore:create_new_age/${path}`;
    const originalId = 'create_new_age:sequenced_assembly/enchanted_golden_apple';

    if (!event.findRecipeIds(originalId).isEmpty()) {
      event.remove({ id: originalId });
    }

    if (true && global.fluidExists('create_enchantment_industry:experience')) {
      create
        .sequenced_assembly('minecraft:enchanted_golden_apple', 'minecraft:apple', [
          create.filling('create_new_age:incomplete_enchanted_golden_apple', [
            'create_new_age:incomplete_enchanted_golden_apple',
            Fluid.of('create_enchantment_industry:experience', 120),
          ]),
          create.deploying('create_new_age:incomplete_enchanted_golden_apple', [
            'create_new_age:incomplete_enchanted_golden_apple',
            'minecraft:gold_block',
          ]),
          create.deploying('create_new_age:incomplete_enchanted_golden_apple', [
            'create_new_age:incomplete_enchanted_golden_apple',
            'minecraft:gold_block',
          ]),
          create_new_age.energising(
            'create_new_age:incomplete_enchanted_golden_apple',
            'create_new_age:incomplete_enchanted_golden_apple',
            2000000
          ),
        ])
        .transitionalItem('create_new_age:incomplete_enchanted_golden_apple')
        .loops(4)
        .id(id('sequenced_assembly/enchanted_golden_apple'));
    }
  });
}

if (
  global.hasAllMods([
    'create_new_age',
    'create',
    'northstar',
    'alexscaves',
    'createmetallurgy',
    'vintageimprovements',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:create_new_age/${path}`;

    remove_recipes_id(event, [
      'create_new_age:sequenced_assembly/reactor_casing',
      'create_new_age:shaped/reactor_glass',
    ]);

    create
      .sequenced_assembly('create_new_age:reactor_casing', 'northstar:titanium_sheetmetal', [
        create.deploying('create_new_age:incomplete_reactor_casing', [
          'create_new_age:incomplete_reactor_casing',
          'createmetallurgy:graphite',
        ]),
        create.deploying('create_new_age:incomplete_reactor_casing', [
          'create_new_age:incomplete_reactor_casing',
          'alexscaves:polymer_plate',
        ]),
        create.pressing(
          'create_new_age:incomplete_reactor_casing',
          'create_new_age:incomplete_reactor_casing'
        ),
      ])
      .transitionalItem('create_new_age:incomplete_reactor_casing')
      .loops(1)
      .id(id('sequenced_assembly/reactor_casing'));

    create
      .item_application('create_new_age:reactor_glass', [
        'create_new_age:reactor_casing',
        Ingredient.of('#c:glass_blocks'),
      ])
      .id(id('item_application/reactor_glass'));

    create
      .mixing('2x create_new_age:thorium', [
        Fluid.water(500),
        'minecraft:stone',
        'minecraft:clay',
        'create_new_age:thorium',
      ])
      .id(id('mixing/thorium_multiplication'));

    vintageimprovements
      .pressurizing('create_new_age:radioactive_thorium', [
        Fluid.of('createdelightcore:nuclear_waste', 1000),
        'create_new_age:thorium',
      ])
      .superheated()
      .id(id('pressurizing/radioactive_thorium'));

    vintageimprovements
      .vacuumizing('alexscaves:unrefined_waste', Fluid.of('createdelightcore:nuclear_waste', 500))
      .superheated()
      .id(id('vacuumizing/unrefined_waste'));
  });
}
