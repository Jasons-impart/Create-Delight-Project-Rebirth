if (global.hasAllMods(['ae2', 'create', 'megacells'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:ae2/megacells/machine/${path}`;
    const ae2MeP2pTunnel = Ingredient.of('#ae2:p2p_attunements/me_p2p_tunnel');
    const skySteelIngot = Ingredient.of('#c:ingots/sky_steel');
    const incompleteMegaCraftingUnit = 'createdelightcore:incomplete_mega_crafting_unit';
    const incompleteDecompressionModule = 'createdelightcore:incomplete_decompression_module';
    const incompleteMegaEnergyCell = 'createdelightcore:incomplete_mega_energy_cell';

    event.remove({ id: 'ae2:network/blocks/spatial_anchor' });
    event.remove({ id: 'megacells:crafting/decompression_module' });
    event.remove({ id: 'megacells:network/cell_dock' });

    create
      .mechanical_crafting('ae2:spatial_anchor', ['AABAA', 'ACGEA', 'BDFDB', 'AEGCA', 'AABAA'], {
        A: 'createdelightcore:space_casing',
        B: '#ae2:smart_dense_cable',
        C: 'ae2:fluix_block',
        D: 'ae2:spatial_cell_component_128',
        E: 'ae2:singularity',
        F: 'megacells:mega_energy_cell',
        G: 'ae2:controller',
      })
      .id(id('spatial_anchor'));

    create
      .sequenced_assembly('2x megacells:mega_crafting_unit', 'ae2:crafting_unit', [
        create.deploying(incompleteMegaCraftingUnit, [incompleteMegaCraftingUnit, ae2MeP2pTunnel]),
        create.deploying(incompleteMegaCraftingUnit, [
          incompleteMegaCraftingUnit,
          'megacells:accumulation_processor',
        ]),
        create.deploying(incompleteMegaCraftingUnit, [
          incompleteMegaCraftingUnit,
          'createdelightcore:bleak_electron_tube',
        ]),
      ])
      .transitionalItem(incompleteMegaCraftingUnit)
      .loops(1)
      .id(id('mega_crafting_unit'));

    event.replaceInput(
      { id: 'megacells:crafting/mega_crafting_unit' },
      'ae2:fluix_smart_cable',
      'createdelightcore:bleak_electron_tube'
    );

    create
      .sequenced_assembly('megacells:decompression_module', '#c:ingots/sky_steel', [
        create.pressing(incompleteDecompressionModule, incompleteDecompressionModule),
        create.deploying(incompleteDecompressionModule, [
          incompleteDecompressionModule,
          'megacells:compression_card',
        ]),
        create.deploying(incompleteDecompressionModule, [
          incompleteDecompressionModule,
          'ae2:logic_processor',
        ]),
        create.deploying(incompleteDecompressionModule, [
          incompleteDecompressionModule,
          'ae2:calculation_processor',
        ]),
        create.deploying(incompleteDecompressionModule, [
          incompleteDecompressionModule,
          'megacells:accumulation_processor',
        ]),
        create.deploying(incompleteDecompressionModule, [
          incompleteDecompressionModule,
          'ae2:engineering_processor',
        ]),
      ])
      .transitionalItem(incompleteDecompressionModule)
      .loops(1)
      .id(id('decompression_module'));

    create
      .sequenced_assembly(
        'megacells:mega_energy_cell',
        'megacells:accumulation_processor',
        create.deploying(incompleteMegaEnergyCell, [
          incompleteMegaEnergyCell,
          'ae2:dense_energy_cell',
        ])
      )
      .transitionalItem(incompleteMegaEnergyCell)
      .loops(4)
      .id(id('mega_energy_cell'));

    create
      .deploying(Item.of('megacells:cell_dock', 10), ['ae2:drive', skySteelIngot])
      .id(id('cell_dock'));
  });
}
