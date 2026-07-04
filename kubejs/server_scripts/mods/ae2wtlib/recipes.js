if (global.hasAllMods(['ae2', 'ae2wtlib', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:ae2/ae2wtlib/machine/${path}`;
    const incompleteQuantumBridgeCard = 'createdelightcore:incomplete_quantum_bridge_card';

    event.remove({ id: 'ae2wtlib:quantum_bridge_card' });

    create
      .sequenced_assembly('ae2wtlib:quantum_bridge_card', 'ae2:advanced_card', [
        create.deploying(incompleteQuantumBridgeCard, [
          incompleteQuantumBridgeCard,
          'ae2:quantum_ring',
        ]),
        create.deploying(incompleteQuantumBridgeCard, [
          incompleteQuantumBridgeCard,
          'ae2:quantum_ring',
        ]),
        create.deploying(incompleteQuantumBridgeCard, [
          incompleteQuantumBridgeCard,
          'ae2:quantum_ring',
        ]),
        create.deploying(incompleteQuantumBridgeCard, [
          incompleteQuantumBridgeCard,
          'ae2:quantum_ring',
        ]),
        create.deploying(incompleteQuantumBridgeCard, [
          incompleteQuantumBridgeCard,
          'ae2:quantum_link',
        ]),
      ])
      .transitionalItem(incompleteQuantumBridgeCard)
      .loops(1)
      .id(id('quantum_bridge_card'));
  });
}

if (global.hasAllMods(['ae2', 'ae2wtlib', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:ae2/ae2wtlib/wireless/${path}`;
    const incompleteWirelessPatternAccessTerminal =
      'createdelightcore:incomplete_wireless_pattern_access_terminal';
    const incompleteWirelessPatternEncodingTerminal =
      'createdelightcore:incomplete_wireless_pattern_encoding_terminal';

    event.remove({ id: 'ae2wtlib:pattern_access/wireless_pattern_access_terminal' });
    event.remove({ id: 'ae2wtlib:pattern_encoding/wireless_pattern_encoding_terminal' });

    create
      .sequenced_assembly(
        'ae2wtlib:wireless_pattern_access_terminal',
        'ae2:pattern_access_terminal',
        [
          create.deploying(incompleteWirelessPatternAccessTerminal, [
            incompleteWirelessPatternAccessTerminal,
            'ae2:dense_energy_cell',
          ]),
          create.deploying(incompleteWirelessPatternAccessTerminal, [
            incompleteWirelessPatternAccessTerminal,
            'ae2:wireless_receiver',
          ]),
          create
            .deploying(incompleteWirelessPatternAccessTerminal, [
              incompleteWirelessPatternAccessTerminal,
              Ingredient.of('#ae2:quartz_wrench'),
            ])
            .keepHeldItem(),
        ]
      )
      .loops(1)
      .transitionalItem(incompleteWirelessPatternAccessTerminal)
      .id(id('wireless_pattern_access_terminal'));

    create
      .sequenced_assembly(
        'ae2wtlib:wireless_pattern_encoding_terminal',
        'ae2:pattern_encoding_terminal',
        [
          create.deploying(incompleteWirelessPatternEncodingTerminal, [
            incompleteWirelessPatternEncodingTerminal,
            'ae2:dense_energy_cell',
          ]),
          create.deploying(incompleteWirelessPatternEncodingTerminal, [
            incompleteWirelessPatternEncodingTerminal,
            'ae2:wireless_receiver',
          ]),
          create
            .deploying(incompleteWirelessPatternEncodingTerminal, [
              incompleteWirelessPatternEncodingTerminal,
              Ingredient.of('#ae2:quartz_wrench'),
            ])
            .keepHeldItem(),
        ]
      )
      .loops(1)
      .transitionalItem(incompleteWirelessPatternEncodingTerminal)
      .id(id('wireless_pattern_encoding_terminal'));
  });
}
