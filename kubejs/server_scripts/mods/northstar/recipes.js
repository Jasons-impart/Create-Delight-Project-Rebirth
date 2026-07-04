if (
  global.hasAllMods([
    'northstar',
    'createdelightcore',
    'create',
    'create_new_age',
    'create_sa',
    'createmetallurgy',
    'vintageimprovements',
    'createdieselgenerators',
    'ae2',
    'alexscaves',
    'vintagedelight',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, create_new_age, createmetallurgy, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:northstar/${path}`;

    remove_recipes_id(event, [
      'northstar:compacting/carbon_from_biofuel',
      'northstar:mixing/titanium1',
      'northstar:mixing/titanium2',
      'northstar:sequenced_assembly/titanium',
      'northstar:crushing/sand',
      'northstar:mixing/brine',
      'northstar:compacting/brine_to_salt',
      'northstar:compacting/martian_steel_ingot',
      'northstar:compacting/biofuel_from_dried_kelp',
      'northstar:compacting/biofuel_from_dry_plant_fiber',
      'northstar:mixing/hydrocarbon_from_carbon',
      'northstar:mixing/hydrocarbon_from_sodium',
      'northstar:crafting/tungsten_block_from_ingot',
      'northstar:crafting/tungsten_ingot_from_nuggets',
      'northstar:crafting/tungsten_ingot_from_block',
      'northstar:crafting/tungsten_nugget_from_ingot',
      'northstar:crafting/titanium_ingot_from_block',
      'northstar:crafting/titanium_nugget_from_ingot',
      'northstar:crafting/titanium_ingot_from_nuggets',
    ]);

    event.remove({ type: 'northstar:electrolysis' });
    event.remove({ type: 'northstar:engraving' });
    event.remove({ output: 'northstar:titanium_ingot', type: 'minecraft:blasting' });
    event.remove({ output: 'northstar:titanium_ingot', type: 'minecraft:smelting' });
    event.remove({
      output: [
        'northstar:circuit',
        'northstar:advanced_circuit',
        'northstar:targeting_computer',
        'northstar:electrolysis_machine',
        'northstar:solar_panel',
        'northstar:circuit_engraver',
        'northstar:titanium_block',
        'northstar:hardened_precision_mechanism',
        'northstar:vanilla_ice_cream',
        'northstar:chocolate_ice_cream',
        'northstar:strawberry_ice_cream',
        'northstar:raw_ice_cream_cone',
        'northstar:ice_cream_cone',
        'northstar:sodium_catalyst',
        'northstar:dry_plant_fiber',
      ],
    });

    event.replaceInput(
      {
        output: [
          'northstar:jet_engine',
          'northstar:rocket_combustion_chamber',
          'northstar:rocket_controls',
          'northstar:rocket_station',
          'northstar:atmospheric_concentrator',
          'northstar:oxygen_filler',
        ],
      },
      'northstar:titanium_sheet',
      'createdelightcore:steel_sheet'
    );
    event.replaceInput(
      {
        output: [
          'northstar:iron_space_suit_boots',
          'northstar:iron_space_suit_leggings',
          'northstar:iron_space_suit_chestpiece',
          'northstar:iron_space_suit_helmet',
        ],
      },
      'create:iron_sheet',
      'createdelightcore:steel_sheet'
    );
    event.replaceInput(
      { output: 'northstar:rocket_station' },
      'northstar:titanium_ingot',
      'createmetallurgy:steel_ingot'
    );
    event.replaceInput(
      { output: 'northstar:atmospheric_concentrator' },
      'northstar:circuit',
      'create_sa:heat_engine'
    );
    event.replaceInput(
      { mod: 'northstar' },
      'northstar:hardened_precision_mechanism',
      'create_sa:heat_engine'
    );
    event.replaceOutput(
      { output: 'northstar:raw_titanium_ore' },
      'northstar:raw_titanium_ore',
      'createdelightcore:crushed_raw_titanium'
    );

    event
      .shaped('createdelightcore:oxygen_tank', ['AAA', 'BCB', 'DDD'], {
        A: '#minecraft:wool',
        B: 'create_sa:small_filling_tank',
        C: 'northstar:moon_sand',
        D: 'northstar:titanium_sheet',
      })
      .id(id('crafting/oxygen_tank'));

    event
      .shaped('createdelightcore:sturdy_oxygen_tank', ['AAA', 'BCB', 'DDD'], {
        A: '#minecraft:wool',
        B: 'create_sa:medium_fueling_tank',
        C: 'northstar:mars_sand',
        D: 'northstar:martian_steel_sheet',
      })
      .id(id('crafting/sturdy_oxygen_tank'));

    create_new_age
      .energising('northstar:raw_glowstone_ore', 'northstar:enriched_glowstone_ore', 10000)
      .id(id('energising/enriched_glowstone_ore'));

    event
      .shapeless('northstar:titanium_block', ['9x northstar:titanium_ingot'])
      .id(id('crafting/titanium_block_from_ingot'));
    event
      .shapeless('9x northstar:titanium_ingot', ['northstar:titanium_block'])
      .id(id('crafting/titanium_ingot_from_block'));
    event
      .shapeless('9x northstar:titanium_nugget', ['northstar:titanium_ingot'])
      .id(id('crafting/titanium_nugget_from_ingot'));
    create
      .mechanical_crafting('northstar:titanium_ingot', ['AAA', 'AAA', 'AAA'], {
        A: 'northstar:titanium_nugget',
      })
      .id(id('mechanical_crafting/titanium_ingot_from_nuggets'));
    create
      .pressing('northstar:titanium_sheet', 'northstar:titanium_ingot')
      .id(id('pressing/titanium_sheet'));

    create
      .crushing(CreateItem.of('northstar:rutile_concentrate', 0.1), 'northstar:moon_sand')
      .id(id('crushing/rutile_concentrate_from_moon_sand'));
    create
      .crushing(CreateItem.of('northstar:rutile_concentrate', 0.1), 'northstar:mars_sand')
      .id(id('crushing/rutile_concentrate_from_mars_sand'));

    vintageimprovements
      .vacuumizing(Fluid.of('northstar:titanium_tetrachloride', 250), [
        Fluid.of('northstar:chlorine', 25),
        Fluid.of('northstar:carbon', 250),
        'northstar:rutile_concentrate',
      ])
      .secondaryFluidInput(0)
      .superheated()
      .id(id('vacuumizing/titanium_tetrachloride'));

    vintageimprovements
      .vacuumizing(
        ['createdelightcore:titanium_dust', 'vintagedelight:salt_dust'],
        [Fluid.of('northstar:titanium_tetrachloride', 500), Fluid.of('northstar:sodium', 50)]
      )
      .superheated()
      .id(id('vacuumizing/titanium_dust'));

    createmetallurgy
      .melting(Fluid.of('createdelightcore:molten_titanium', 90), 'createdelightcore:titanium_dust')
      .heatRequirement('heated')
      .processingTime(30)
      .id(id('melting/molten_titanium_from_titanium_dust'));
    createmetallurgy
      .melting(
        [
          Fluid.of('createdelightcore:molten_titanium', 90),
          Fluid.of('createmetallurgy:molten_slag', 30),
        ],
        'createdelightcore:dirty_titanium_dust'
      )
      .heatRequirement('heated')
      .processingTime(40)
      .id(id('melting/molten_titanium_from_dirty_titanium_dust'));
    createmetallurgy
      .melting(
        [
          Fluid.of('createdelightcore:molten_titanium', 90),
          Fluid.of('createmetallurgy:molten_slag', 45),
        ],
        '#c:raw_materials/titanium'
      )
      .heatRequirement('heated')
      .processingTime(40)
      .id(id('melting/molten_titanium_from_raw_titanium'));

    createmetallurgy
      .casting_in_table('northstar:titanium_sheet', [
        Fluid.of('createdelightcore:molten_titanium', 90),
        'createmetallurgy:graphite_plate_mold',
      ])
      .processingTime(100)
      .id(id('casting_in_table/titanium_sheet'));

    event
      .shapeless('northstar:martian_steel_block', ['9x northstar:martian_steel'])
      .id(id('crafting/martian_steel_block_from_ingot'));
    event
      .shapeless('9x northstar:martian_steel', ['northstar:martian_steel_block'])
      .id(id('crafting/martian_steel_from_block'));
    create
      .pressing('northstar:martian_steel_sheet', 'northstar:martian_steel')
      .id(id('pressing/martian_steel_sheet'));

    createmetallurgy
      .alloying(Fluid.of('createdelightcore:molten_martian_steel', 180), [
        Fluid.of('createdelightcore:molten_titanium', 90),
        'northstar:raw_martian_iron_ore',
      ])
      .heatRequirement('superheated')
      .processingTime(100)
      .id(id('alloying/martian_steel'));
    createmetallurgy
      .casting_in_table('northstar:martian_steel_sheet', [
        Fluid.of('createdelightcore:molten_martian_steel', 90),
        'createmetallurgy:graphite_plate_mold',
      ])
      .processingTime(100)
      .id(id('casting_in_table/martian_steel_sheet'));

    const circuitAssembly = (result, base, incomplete, steps, loops) => {
      create
        .sequenced_assembly(result, base, steps(incomplete))
        .loops(loops)
        .transitionalItem(incomplete)
        .id(id(`sequenced_assembly/${result.split(':')[1]}`));
    };

    circuitAssembly(
      'northstar:circuit',
      'alexscaves:polymer_plate',
      'northstar:unfinished_circuit',
      (incomplete) => [
        create.deploying(incomplete, [incomplete, 'northstar:polished_amethyst']),
        create.deploying(incomplete, [incomplete, 'create:copper_sheet']),
        create.deploying(incomplete, [incomplete, Ingredient.of('ae2:logic_processor')]),
        vintageimprovements.laser_cutting(incomplete, incomplete),
      ],
      1
    );

    if (global.itemExists('ae2omnicells:omni_link_processor')) {
      circuitAssembly(
        'northstar:advanced_circuit',
        'northstar:circuit',
        'northstar:unfinished_advanced_circuit',
        (incomplete) => [
          create.deploying(incomplete, [incomplete, 'northstar:polished_lunar_sapphire']),
          create.deploying(incomplete, [incomplete, 'northstar:martian_steel_sheet']),
          create.deploying(incomplete, [
            incomplete,
            Ingredient.of('ae2omnicells:omni_link_processor'),
          ]),
          vintageimprovements.laser_cutting(incomplete, incomplete),
        ],
        1
      );
    }

    circuitAssembly(
      'northstar:targeting_computer',
      'createdelightcore:steel_sheet',
      'northstar:unfinished_targeting_computer',
      (incomplete) => [
        create.deploying(incomplete, [incomplete, 'northstar:polished_diamond']),
        create.deploying(incomplete, [incomplete, 'northstar:circuit']),
        create.deploying(incomplete, [incomplete, 'create_sa:heat_engine']),
        vintageimprovements.laser_cutting(incomplete, incomplete),
      ],
      1
    );

    create
      .mixing(Fluid.of('createdelightcore:fuel_mixtures', 100), [
        Fluid.of('createdieselgenerators:gasoline', 50),
        Fluid.of('createdieselgenerators:diesel', 50),
      ])
      .id(id('mixing/fuel_mixtures'));
    create
      .mixing(Fluid.of('createdelightcore:fuel_mixtures', 200), [
        Fluid.of('createdieselgenerators:gasoline', 50),
        Fluid.of('createdieselgenerators:biodiesel', 75),
      ])
      .id(id('mixing/fuel_mixtures_from_biodiesel'));
    create
      .mixing(Fluid.of('createdelightcore:ice_lubricating_oil', 500), [
        Fluid.of('createdelightcore:lubricating_oil', 250),
        'northstar:enriched_glowstone_ore',
      ])
      .heatRequirement('frozen')
      .id(id('mixing/ice_lubricating_oil'));

    create
      .mixing(Fluid.of('createdelightcore:ice_lubricating_oil', 500), [
        Fluid.of('createdelightcore:lubricating_oil', 250),
        Fluid.of('createdelightcore:ice_dragon_blood', 25),
      ])
      .id(id('mixing/ice_lubricating_oil_from_ice_dragon_blood'));
  });
}
