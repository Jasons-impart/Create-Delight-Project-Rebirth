if (global.hasAllMods(['ae2', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:ae2/wireless/${path}`;
    const incompleteWirelessTerminal = 'createdelightcore:incomplete_wireless_terminal';
    const incompleteWirelessCraftingTerminal =
      'createdelightcore:incomplete_wireless_crafting_terminal';

    event.remove({ id: 'ae2:network/wireless_terminal' });
    event.remove({ id: 'ae2:network/wireless_crafting_terminal' });
    event.remove({ id: 'ae2:network/upgrade_wireless_crafting_terminal' });

    create
      .sequenced_assembly('ae2:wireless_terminal', 'ae2:terminal', [
        create.deploying(incompleteWirelessTerminal, [
          incompleteWirelessTerminal,
          'ae2:dense_energy_cell',
        ]),
        create.deploying(incompleteWirelessTerminal, [
          incompleteWirelessTerminal,
          'ae2:wireless_receiver',
        ]),
        create
          .deploying(incompleteWirelessTerminal, [
            incompleteWirelessTerminal,
            Ingredient.of('#ae2:quartz_wrench'),
          ])
          .keepHeldItem(),
      ])
      .loops(1)
      .transitionalItem(incompleteWirelessTerminal)
      .id(id('wireless_terminal'));

    create
      .sequenced_assembly('ae2:wireless_crafting_terminal', 'ae2:crafting_terminal', [
        create.deploying(incompleteWirelessCraftingTerminal, [
          incompleteWirelessCraftingTerminal,
          'ae2:dense_energy_cell',
        ]),
        create.deploying(incompleteWirelessCraftingTerminal, [
          incompleteWirelessCraftingTerminal,
          'ae2:wireless_receiver',
        ]),
        create
          .deploying(incompleteWirelessCraftingTerminal, [
            incompleteWirelessCraftingTerminal,
            Ingredient.of('#ae2:quartz_wrench'),
          ])
          .keepHeldItem(),
      ])
      .loops(1)
      .transitionalItem(incompleteWirelessCraftingTerminal)
      .id(id('wireless_crafting_terminal_from_crafting_terminal'));

    create
      .sequenced_assembly('ae2:wireless_crafting_terminal', 'ae2:wireless_terminal', [
        create.deploying(incompleteWirelessCraftingTerminal, [
          incompleteWirelessCraftingTerminal,
          'minecraft:crafting_table',
        ]),
        create.deploying(incompleteWirelessCraftingTerminal, [
          incompleteWirelessCraftingTerminal,
          'ae2:calculation_processor',
        ]),
      ])
      .transitionalItem(incompleteWirelessCraftingTerminal)
      .loops(1)
      .id(id('wireless_crafting_terminal_from_wireless_terminal'));
  });
}
