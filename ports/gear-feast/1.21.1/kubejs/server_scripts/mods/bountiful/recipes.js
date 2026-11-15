if (global.hasAllMods(['bountiful', 'lightmanscurrency'])) {
  ServerEvents.recipes((event) => {
    event.replaceInput(
      { mod: 'bountiful', input: 'minecraft:diamond' },
      'minecraft:diamond',
      'lightmanscurrency:trading_core'
    );
    event.replaceInput(
      { mod: 'bountiful', input: 'minecraft:gold_ingot' },
      'minecraft:gold_ingot',
      'lightmanscurrency:trading_core'
    );
  });
}
