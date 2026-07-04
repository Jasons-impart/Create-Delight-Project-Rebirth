if (global.hasAllMods(['ae2', 'extendedae', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:ae2/extendedae/machine/${path}`;
    const certusQuartzGem = Ingredient.of('#c:gems/certus_quartz');
    const fluixGem = Ingredient.of('#c:gems/fluix');
    const ironRod = Ingredient.of('#c:rods/iron');
    const incompleteCrystalFixer = 'createdelightcore:incomplete_crystal_fixer';

    remove_recipes_id(event, [
      'extendedae:assembler/ex_drive',
      'extendedae:assembler/assembler_matrix_crafter',
      'extendedae:assembler_matrix_frame',
      'extendedae:assembler/assembler_matrix_pattern',
      'extendedae:assembler/assembler_matrix_speed',
      'extendedae:assembler_matrix_wall',
      'extendedae:assembler/ex_io_port',
      'extendedae:assembler/ex_molecular_assembler',
      'extendedae:assembler/circuit_cutter',
      'extendedae:assembler/crystal_fixer',
      'extendedae:ingredient_buffer',
    ]);

    kubejs
      .shaped('extendedae:ex_io_port', ['ACB', 'CMC', 'BCA'], {
        A: 'ae2:logic_processor',
        B: 'ae2:engineering_processor',
        C: 'createdelightcore:bleak_electron_tube',
        M: 'ae2:io_port',
      })
      .id(id('ex_io_port'));

    kubejs
      .shaped('extendedae:ex_molecular_assembler', ['FAF', 'AEA', 'FAF'], {
        A: 'ae2:molecular_assembler',
        E: 'ae2:engineering_processor',
        F: 'createdelightcore:bleak_electron_tube',
      })
      .id(id('ex_molecular_assembler'));

    kubejs
      .shaped('extendedae:circuit_cutter', ['IGI', 'UCU', 'UTU'], {
        C: 'minecraft:stonecutter',
        G: 'ae2:quartz_glass',
        I: '#c:ingots/iron',
        T: 'ae2:sky_stone_tank',
        U: 'createdelightcore:ultimate_universal_press',
      })
      .id(id('circuit_cutter'));

    create
      .sequenced_assembly('extendedae:crystal_fixer', '#c:storage_blocks/iron', [
        create.pressing(incompleteCrystalFixer, incompleteCrystalFixer),
        create.deploying(incompleteCrystalFixer, [incompleteCrystalFixer, fluixGem]),
        create.deploying(incompleteCrystalFixer, [incompleteCrystalFixer, ironRod]),
        create.deploying(incompleteCrystalFixer, [incompleteCrystalFixer, ironRod]),
        create.deploying(incompleteCrystalFixer, [incompleteCrystalFixer, certusQuartzGem]),
        create.deploying(incompleteCrystalFixer, [incompleteCrystalFixer, certusQuartzGem]),
      ])
      .transitionalItem(incompleteCrystalFixer)
      .loops(1)
      .id(id('crystal_fixer'));

    create
      .item_application('extendedae:ingredient_buffer', [
        'ae2:quartz_glass',
        'ae2:cell_component_1k',
      ])
      .id(id('ingredient_buffer'));

    kubejs
      .shapeless('extendedae:ingredient_buffer', ['ae2:quartz_glass', 'ae2:cell_component_1k'])
      .id(id('shapeless/ingredient_buffer'));
  });
}

if (global.hasAllMods(['ae2', 'extendedae', 'northstar'])) {
  ServerEvents.recipes((event) => {
    const { kubejs } = event.recipes;
    const id = (path) => `createdelightcore:ae2/extendedae/northstar/${path}`;

    event.remove({ id: 'extendedae:assembler/ex_pattern_provider' });
    event.remove({ id: 'extendedae:ex_pattern_provider_upgrade' });

    kubejs
      .shaped('extendedae:ex_pattern_provider', ['ABA', 'CAC', 'DAD'], {
        A: 'ae2:pattern_provider',
        B: 'ae2:engineering_processor',
        C: 'northstar:titanium_sheet',
        D: 'ae2:capacity_card',
      })
      .id(id('ex_pattern_provider'));

    kubejs
      .shaped('extendedae:pattern_provider_upgrade', ['ABA', 'C C', 'DAD'], {
        A: 'ae2:pattern_provider',
        B: 'ae2:engineering_processor',
        C: 'northstar:titanium_sheet',
        D: 'ae2:capacity_card',
      })
      .id(id('pattern_provider_upgrade'));
  });
}

if (global.hasAllMods(['ae2', 'extendedae', 'createutilities'])) {
  ServerEvents.recipes((event) => {
    const { kubejs } = event.recipes;

    event.remove({ id: 'extendedae:assembler/wireless_connector' });
    event.remove({ id: 'extendedae:assembler/wireless_hub' });

    kubejs
      .shaped('extendedae:wireless_connect', ['ABA', 'CDC', 'ABA'], {
        A: 'createutilities:void_casing',
        B: 'ae2:wireless_receiver',
        C: '#ae2:smart_cable',
        D: 'ae2:controller',
      })
      .id('createdelightcore:ae2/extendedae/createutilities/wireless_connect');

    kubejs
      .shaped('extendedae:wireless_hub', ['ABA', 'CDC', 'ACA'], {
        A: '#ae2:smart_cable',
        B: 'ae2:quantum_link',
        C: 'ae2:engineering_processor',
        D: 'extendedae:wireless_connect',
      })
      .id('createdelightcore:ae2/extendedae/createutilities/wireless_hub');
  });
}

if (global.hasAllMods(['ae2', 'extendedae', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/extendedae/wireless/${path}`;
    const incompleteWirelessExPatternAccessTerminal =
      'createdelightcore:incomplete_wireless_ex_pat';

    event.remove({ id: 'extendedae:wireless_ex_pat' });

    create
      .sequenced_assembly('extendedae:wireless_ex_pat', 'extendedae:ex_pattern_access_part', [
        create.deploying(incompleteWirelessExPatternAccessTerminal, [
          incompleteWirelessExPatternAccessTerminal,
          'ae2:dense_energy_cell',
        ]),
        create.deploying(incompleteWirelessExPatternAccessTerminal, [
          incompleteWirelessExPatternAccessTerminal,
          'ae2:wireless_receiver',
        ]),
        create
          .deploying(incompleteWirelessExPatternAccessTerminal, [
            incompleteWirelessExPatternAccessTerminal,
            Ingredient.of('#ae2:quartz_wrench'),
          ])
          .keepHeldItem(),
      ])
      .loops(1)
      .transitionalItem(incompleteWirelessExPatternAccessTerminal)
      .id(id('wireless_ex_pat'));

    vintageimprovements
      .centrifugation('extendedae:fishbig', 'minecraft:pufferfish')
      .id('createdelightcore:ae2/extendedae/fishbig');
  });
}
