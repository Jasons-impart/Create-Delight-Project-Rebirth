if (global.hasAllMods(['ae2', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/machine/${path}`;

    const ae2MeP2pTunnel = Ingredient.of('#ae2:p2p_attunements/me_p2p_tunnel');
    const certusQuartzGem = Ingredient.of('#c:gems/certus_quartz');
    const fluixDust = Ingredient.of('#c:dusts/fluix');
    const fluixGem = Ingredient.of('#c:gems/fluix');
    const glassBlock = Ingredient.of('#c:glass_blocks');
    const obduriumPlate = Ingredient.of('#c:plates/obdurium');
    const quartzGlass = Ingredient.of('#c:quartz_glass');
    const skySteelBlock = Ingredient.of('#c:storage_blocks/sky_steel');

    const incompletePatternProvider = 'createdelightcore:incomplete_pattern_provider';
    const incompleteMolecularAssembler = 'createdelightcore:incomplete_molecular_assembler';
    const incompleteInterface = 'createdelightcore:incomplete_interface';
    const incompleteMeP2pTunnel = 'createdelightcore:incomplete_me_p2p_tunnel';
    const incompleteController = 'createdelightcore:incomplete_controller';
    const incompleteCraftingUnit = 'createdelightcore:incomplete_crafting_unit';
    const incompleteDrive = 'createdelightcore:incomplete_drive';
    const incompleteEnergyCell = 'createdelightcore:incomplete_energy_cell';
    const incompleteDenseEnergyCell = 'createdelightcore:incomplete_dense_energy_cell';

    remove_recipes_id(event, [
      'ae2:materials/annihilationcore',
      'ae2:materials/formationcore',
      'ae2:network/blocks/quantum_link',
      'ae2:network/blocks/quantum_ring',
      'ae2:network/parts/tunnels_me',
      'ae2:network/blocks/spatial_io_port',
      'ae2:tools/matter_cannon',
      'ae2:network/blocks/inscribers',
      'ae2:network/blocks/pattern_providers_interface',
    ]);

    global.COLORS.forEach((color) => {
      create
        .mixing(`4x minecraft:${color}_dye`, [`minecraft:${color}_dye`, 'ae2:matter_ball'])
        .id(id(`${color}_dye_matter`));
    });

    create
      .mechanical_crafting('ae2:quantum_link', ['AABAA', 'ACDCA', 'BEFEB', 'ACGCA', 'AABAA'], {
        A: 'ae2:quartz_glass',
        B: '#ae2:glass_cable',
        C: 'ae2:fluix_pearl',
        D: 'ae2:singularity',
        E: 'ae2:dense_energy_cell',
        F: 'ae2:controller',
        G: 'ae2:interface',
      })
      .id(id('quantum_link'));

    create
      .item_application('ae2:quantum_ring', ['createdelightcore:space_casing', 'ae2:controller'])
      .id(id('quantum_ring'));

    kubejs
      .shaped('ae2:pattern_provider', ['ABA', 'CDC', 'AEA'], {
        A: '#c:plates/iron',
        B: 'ae2:annihilation_core',
        C: '#c:plates/obdurium',
        D: 'create:factory_gauge',
        E: 'ae2:formation_core',
      })
      .id(id('pattern_provider'));

    create
      .sequenced_assembly('2x ae2:pattern_provider', 'createdelightcore:iron_casing', [
        create.deploying(incompletePatternProvider, [
          incompletePatternProvider,
          'create:factory_gauge',
        ]),
        create.deploying(incompletePatternProvider, [
          incompletePatternProvider,
          'ae2:annihilation_core',
        ]),
        create.deploying(incompletePatternProvider, [
          incompletePatternProvider,
          'ae2:formation_core',
        ]),
        create.deploying(incompletePatternProvider, [incompletePatternProvider, obduriumPlate]),
      ])
      .loops(1)
      .transitionalItem(incompletePatternProvider)
      .id(id('pattern_provider_sequenced_assembly'));

    create
      .sequenced_assembly('2x ae2:molecular_assembler', 'createdelightcore:iron_casing', [
        create.deploying(incompleteMolecularAssembler, [incompleteMolecularAssembler, quartzGlass]),
        create.deploying(incompleteMolecularAssembler, [
          incompleteMolecularAssembler,
          'minecraft:crafting_table',
        ]),
        create.deploying(incompleteMolecularAssembler, [
          incompleteMolecularAssembler,
          'ae2:annihilation_core',
        ]),
        create.deploying(incompleteMolecularAssembler, [
          incompleteMolecularAssembler,
          'ae2:formation_core',
        ]),
      ])
      .loops(1)
      .transitionalItem(incompleteMolecularAssembler)
      .id(id('molecular_assembler'));

    event.replaceInput(
      { id: 'ae2:network/crafting/molecular_assembler' },
      '#c:ingots/iron',
      '#c:plates/iron'
    );

    create
      .sequenced_assembly('2x ae2:interface', 'createdelightcore:iron_casing', [
        create.deploying(incompleteInterface, [incompleteInterface, glassBlock]),
        create.deploying(incompleteInterface, [incompleteInterface, 'ae2:annihilation_core']),
        create.deploying(incompleteInterface, [incompleteInterface, 'ae2:formation_core']),
      ])
      .loops(1)
      .transitionalItem(incompleteInterface)
      .id(id('interface'));

    event.replaceInput(
      { id: 'ae2:network/blocks/interfaces_interface' },
      '#c:ingots/iron',
      '#c:plates/iron'
    );

    create
      .sequenced_assembly('2x ae2:me_p2p_tunnel', '#c:ingots/iron', [
        create.deploying(incompleteMeP2pTunnel, [
          incompleteMeP2pTunnel,
          'ae2:engineering_processor',
        ]),
        create.deploying(incompleteMeP2pTunnel, [incompleteMeP2pTunnel, 'ae2:singularity']),
        create.deploying(incompleteMeP2pTunnel, [incompleteMeP2pTunnel, fluixGem]),
      ])
      .transitionalItem(incompleteMeP2pTunnel)
      .loops(1)
      .id(id('me_p2p_tunnel'));

    kubejs
      .shaped('ae2:me_p2p_tunnel', ['ABA', 'BCB', 'DDD'], {
        A: 'ae2:singularity',
        B: 'create:iron_sheet',
        C: 'ae2:engineering_processor',
        D: '#c:gems/fluix',
      })
      .id(id('shaped/me_p2p_tunnel'));

    create
      .item_application('ae2:spatial_io_port', ['createdelightcore:space_casing', 'ae2:io_port'])
      .id(id('spatial_io_port'));

    create
      .item_application('ae2:charger', ['createdelightcore:iron_casing', 'minecraft:copper_ingot'])
      .id(id('item_application/charger'));

    event.replaceInput(
      { id: 'ae2:network/blocks/crystal_processing_charger' },
      '#c:ingots/iron',
      '#c:plates/iron'
    );

    create
      .sequenced_assembly('ae2:controller', 'createdelightcore:sky_steel_casing', [
        create.deploying(incompleteController, [incompleteController, skySteelBlock]),
        create.deploying(incompleteController, [incompleteController, fluixGem]),
        create.deploying(incompleteController, [incompleteController, 'ae2:engineering_processor']),
        create.deploying(incompleteController, [incompleteController, fluixGem]),
        create.deploying(incompleteController, [incompleteController, skySteelBlock]),
      ])
      .transitionalItem(incompleteController)
      .loops(1)
      .id(id('controller'));

    event.replaceInput(
      { id: 'ae2:network/blocks/controller' },
      'ae2:smooth_sky_stone_block',
      '#c:storage_blocks/sky_steel'
    );

    create
      .mixing('16x ae2:quartz_fiber', [
        Ingredient.of('#c:glass_blocks').withCount(4),
        Ingredient.of('#c:gems/certus_quartz').withCount(4),
      ])
      .heated()
      .id(id('quartz_fiber'));

    create
      .sequenced_assembly('2x ae2:crafting_unit', 'createdelightcore:iron_casing', [
        create.deploying(incompleteCraftingUnit, [incompleteCraftingUnit, ae2MeP2pTunnel]),
        create.deploying(incompleteCraftingUnit, [
          incompleteCraftingUnit,
          'ae2:calculation_processor',
        ]),
        create.deploying(incompleteCraftingUnit, [incompleteCraftingUnit, 'ae2:logic_processor']),
      ])
      .loops(1)
      .transitionalItem(incompleteCraftingUnit)
      .id(id('crafting_unit'));

    create
      .sequenced_assembly('ae2:drive', 'createdelightcore:iron_casing', [
        vintageimprovements.turning(incompleteDrive, incompleteDrive),
        create.deploying(incompleteDrive, [incompleteDrive, ae2MeP2pTunnel]),
        create.deploying(incompleteDrive, [incompleteDrive, 'ae2:engineering_processor']),
      ])
      .transitionalItem(incompleteDrive)
      .loops(1)
      .id(id('drive'));

    kubejs
      .shaped('ae2:wireless_receiver', ['A', 'B', 'C'], {
        A: 'ae2:fluix_pearl',
        B: '#ae2:p2p_attunements/me_p2p_tunnel',
        C: '#c:plates/iron',
      })
      .id(id('wireless_receiver'));

    event.replaceInput(
      { id: 'ae2:network/wireless_part' },
      'ae2:quartz_fiber',
      '#ae2:p2p_attunements/me_p2p_tunnel'
    );

    create
      .sequenced_assembly('ae2:energy_cell', '#c:quartz_glass', [
        create.deploying(incompleteEnergyCell, [incompleteEnergyCell, fluixDust]),
        create.deploying(incompleteEnergyCell, [incompleteEnergyCell, certusQuartzGem]),
        create.deploying(incompleteEnergyCell, [incompleteEnergyCell, fluixDust]),
        create.deploying(incompleteEnergyCell, [incompleteEnergyCell, certusQuartzGem]),
      ])
      .transitionalItem(incompleteEnergyCell)
      .loops(1)
      .id(id('energy_cell'));

    create
      .sequenced_assembly(
        'ae2:dense_energy_cell',
        'ae2:calculation_processor',
        create.deploying(incompleteDenseEnergyCell, [incompleteDenseEnergyCell, 'ae2:energy_cell'])
      )
      .transitionalItem(incompleteDenseEnergyCell)
      .loops(4)
      .id(id('dense_energy_cell'));

    create
      .item_application('ae2:sky_stone_tank', ['ae2:quartz_glass', 'ae2:sky_stone_block'])
      .id(id('sky_stone_tank'));

    kubejs
      .shapeless('ae2:sky_stone_tank', ['ae2:quartz_glass', 'ae2:sky_stone_block'])
      .id(id('misc/tank_sky_stone'));
  });
}
