if (global.hasAllMods(['createdelightcore', 'mbd2', 'create'])) {
  ServerEvents.recipes((event) => {
    event
      .shaped('createdelightcore:mechanic_grinding_wheel', ['AAA', 'ACB', 'AAA'], {
        A: 'create:andesite_alloy',
        B: 'create:shaft',
        C: 'minecraft:grindstone',
      })
      .id('createdelightcore:mbd2/mechanic_grinding_wheel');
  });
}
