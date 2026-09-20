// MBD2 原生 schema；机器和配方类型在 Core 注册。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2'])) return;
  let mbd = event.recipes.createdelightcore;

  mbd
    .big_centrifugation_fuel()
    .inputRPM(32)
    .duration(10)
    .isXEIHidden(true)
    .id('createdelightcore:big_centrifugation/fuel_stress');

  mbd
    .big_centrifugation()
    .inputFluids('250x create_confectionery:black_chocolate')
    .outputItems('ratatouille:cocoa_butter')
    .outputItems('ratatouille:cocoa_solids')
    .outputFluids('250x minecraft:milk')
    .duration(100)
    .id('createdelightcore:big_centrifugation/separation/black_chocolate');

  mbd
    .big_centrifugation()
    .inputFluids('250x create:chocolate')
    .outputItems('ratatouille:cocoa_butter')
    .outputItems('ratatouille:cocoa_solids')
    .outputItems('minecraft:sugar')
    .outputFluids('250x minecraft:milk')
    .duration(100)
    .id('createdelightcore:big_centrifugation/separation/chocolate');

  mbd
    .big_centrifugation()
    .inputFluids('900x createdelightcore:ferrouslime')
    .outputFluids('900x createdelightcore:slime')
    .duration(100)
    .id('createdelightcore:big_centrifugation/separation/ferrouslime');

  mbd
    .big_centrifugation()
    .inputFluids('180x createmetallurgy:molten_brass')
    .outputFluids('90x createmetallurgy:molten_copper')
    .outputFluids('90x createmetallurgy:molten_zinc')
    .duration(100)
    .id('createdelightcore:big_centrifugation/separation/molten_brass');

  mbd
    .big_centrifugation()
    .inputFluids('360x createmetallurgy:molten_bronze')
    .outputFluids('90x createmetallurgy:molten_tin')
    .outputFluids('270x createmetallurgy:molten_copper')
    .duration(100)
    .id('createdelightcore:big_centrifugation/separation/molten_bronze');

  mbd
    .big_centrifugation()
    .inputFluids('180x createmetallurgy:molten_electrum')
    .outputFluids('90x createmetallurgy:molten_silver')
    .outputFluids('90x createmetallurgy:molten_gold')
    .duration(100)
    .id('createdelightcore:big_centrifugation/separation/molten_electrum');

  mbd
    .big_centrifugation()
    .inputFluids('250x create_confectionery:ruby_chocolate')
    .outputItems('ratatouille:cocoa_butter')
    .outputItems('ratatouille:cocoa_solids')
    .outputItems('minecraft:sugar')
    .outputFluids('250x create_dragons_plus:dragon_breath')
    .duration(100)
    .id('createdelightcore:big_centrifugation/separation/ruby_chocolate');

  mbd
    .big_centrifugation()
    .inputFluids('250x create_confectionery:white_chocolate')
    .outputItems('ratatouille:cocoa_butter')
    .outputItems('minecraft:sugar')
    .outputFluids('250x minecraft:milk')
    .duration(100)
    .id('createdelightcore:big_centrifugation/separation/white_chocolate');

  mbd
    .big_centrifugation()
    .inputItems('alexscavesup:unrefined_waste')
    .outputItems('3x alexscavesup:uranium_shard')
    .outputFluids('250x alexscavesup:acid')
    .duration(500)
    .id('createdelightcore:big_centrifugation/unrefined_waste');

  mbd
    .big_centrifugation()
    .inputItems('createdelightcore:uranium_dust')
    .chance(0.1)
    .outputItems('createdelightcore:enriched_uraniumdust')
    .chance(0.9)
    .outputItems('createdelightcore:depleted_uranium_dust')
    .duration(1000)
    .id('createdelightcore:big_centrifugation/uranium_dust');

  // 每 500 mB 奶昔分离为 250 mB 牛奶和 250 mB 同口味冰淇淋。
  [
    'adzuki',
    'apple',
    'banana',
    'beetroot',
    'carrot',
    'chocolate',
    'enchanted_fruit',
    'glow_berry',
    'lime',
    'mint',
    'pomegranate',
    'pumpkin',
    'strawberry',
    'sweet_berry',
    'vanilla',
  ].forEach((flavor) => {
    mbd
      .big_centrifugation()
      .inputFluids(`500x createdelightcore:${flavor}_milkshake`)
      .outputFluids('250x minecraft:milk', `250x createdelightcore:${flavor}_ice_cream`)
      .duration(100)
      .id(`createdelightcore:big_centrifugation/separation/${flavor}_milkshake`);
  });
});
