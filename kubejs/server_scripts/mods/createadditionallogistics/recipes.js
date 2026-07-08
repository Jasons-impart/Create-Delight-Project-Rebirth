if (global.hasAllMods(['createadditionallogistics', 'create_connected'])) {
  ServerEvents.recipes((event) => {
    if (true) {
      event.replaceInput(
        { output: 'createadditionallogistics:flexible_shaft' },
        'create:brass_casing',
        'create_connected:brass_gearbox'
      );
    }
  });
}
