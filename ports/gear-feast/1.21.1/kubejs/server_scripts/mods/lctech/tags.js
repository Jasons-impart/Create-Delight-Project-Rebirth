if (global.hasMod('lctech')) {
  ServerEvents.tags('item', (event) => {
    event.add(
      'create:upright_on_belt',
      ['lctech:battery', 'lctech:battery_large'].filter((id) => global.itemExists(id))
    );
  });
}
