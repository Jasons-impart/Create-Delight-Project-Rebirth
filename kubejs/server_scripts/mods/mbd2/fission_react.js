// MBD2 原生 schema；机器和配方类型在 Core 注册。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2'])) return;
  let mbd = event.recipes.createdelightcore;

  mbd
    .fission_react()
    .inputFluids('20x netherexp:ectoplasm')
    .outputFE(40960)
    .outputFluids('20x createdelightcore:nuclear_waste')
    .duration(1)
    .id('createdelightcore:fission_react/ectoplasm_cooling');

  mbd
    .fission_react()
    .duration(1)
    .priority(2)
    .isXEIHidden(true)
    .id('createdelightcore:fission_react/empty');

  mbd
    .fission_react_fuel()
    .slotName('fuel')
    .inputItems('create_new_age:nuclear_fuel')
    .duration(800)
    .id('createdelightcore:fission_react/fuel/recipe_0');

  mbd
    .fission_react()
    .inputFluids('20x minecraft:water')
    .outputFE(40960)
    .outputFluids('20x createdelightcore:nuclear_waste')
    .duration(1)
    .priority(1)
    .id('createdelightcore:fission_react/water_cooling');
});
