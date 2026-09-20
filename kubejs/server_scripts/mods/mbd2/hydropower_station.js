// MBD2 原生 schema；机器和配方类型在 Core 注册。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2'])) return;
  let mbd = event.recipes.createdelightcore;

  mbd
    .hydropower_station()
    .outputRPM(32.0)
    .duration(100000)
    .id('createdelightcore:hydropower_station/legacy_generation');
});
