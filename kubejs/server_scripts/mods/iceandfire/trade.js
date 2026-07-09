if (global.hasAllMods(['iceandfire', 'createdelightcore', 'morejs'])) {
  let $IntRange = Java.loadClass('com.almostreliable.morejs.features.villager.IntRange');
  let addExistingTrade = (event, profession, level, inputs, output) => {
    if (inputs.every(global.itemStackExists) && global.itemStackExists(output)) {
      event.addTrade(profession, level, inputs, output);
    }
  };

  MoreJS.villagerTrades((event) => {
    let profession = 'iceandfire:scribe';
    let level = 2;

    event.removeModdedTypedTrades([profession], new $IntRange(level, level));
    [
      [['8x iceandfire:fire_lily'], 'createdelightcore:copper_coin'],
      [['7x iceandfire:frost_lily'], 'createdelightcore:copper_coin'],
      [['8x iceandfire:lightning_lily'], 'createdelightcore:copper_coin'],
      [['tetra:pristine_amethyst'], '2x createdelightcore:gold_coin'],
    ].forEach((trade) => addExistingTrade(event, profession, level, trade[0], trade[1]));
  });
}
