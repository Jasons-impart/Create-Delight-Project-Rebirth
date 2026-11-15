if (global.hasMod('createdieselgenerators')) {
  ServerEvents.tags('fluid', (event) => {
    ['createdelightcore:fuel_mixtures', 'createdelightcore:flowing_fuel_mixtures']
      .filter((id) => global.fluidExists(id))
      .forEach((fluid) => {
        event.add('c:biofuel', fluid);
      });
  });
}
