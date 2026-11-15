// 源：CDR 1.21.1 kubejs/server_scripts/mods/mbd2/hydropower_station.js
// MBD2 原生 schema，原样加载。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2'])) return;
  let mbd = event.recipes.createdelightcore;

  mbd
    .hydropower_station()
    .outputRPM(32.0)
    .duration(100000)
    .id('createdelightcore:hydropower_station/legacy_generation');
});
