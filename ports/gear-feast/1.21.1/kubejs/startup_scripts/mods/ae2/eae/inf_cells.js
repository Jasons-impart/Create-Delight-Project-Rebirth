StartupEvents.registry('item', (event) => {
  if (!global.hasMod('extendedae')) {
    return;
  }

  global.INFINITE_SOURCE_FLUIDS.forEach((fluid) => {
    if (!global.fluidExists(fluid)) {
      return;
    }

    const cellId = fluid.replace(':', '_');

    event
      .create(`createdelightcore:${cellId}_cell`, 'extendedae:custom_infinity_cell')
      .fluidType(fluid);
  });
});
