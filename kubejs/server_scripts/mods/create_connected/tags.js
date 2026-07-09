if (global.hasMod('create_connected')) {
  ServerEvents.tags('block', (event) => {
    if (global.blockExists('create_connected:fan_freezing_catalyst')) {
      event.add(
        'createdelightcore:fan_processing_catalysts/freezing',
        'create_connected:fan_freezing_catalyst'
      );
    }
  });
}
