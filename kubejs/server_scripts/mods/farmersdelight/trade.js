if (global.hasAllMods(['farmersdelight', 'createdelightcore', 'morejs'])) {
  let $IntRange = Java.loadClass('com.almostreliable.morejs.features.villager.IntRange');
  let addExistingTrade = (event, profession, level, inputs, output) => {
    if (inputs.every(global.itemStackExists) && global.itemStackExists(output)) {
      event.addTrade(profession, level, inputs, output);
    }
  };
  let replaceTrades = (event, profession, level, trades) => {
    event.removeModdedTypedTrades([profession], new $IntRange(level, level));
    trades.forEach((trade) => addExistingTrade(event, profession, level, trade[0], trade[1]));
  };
  let addTrades = (event, profession, level, trades) => {
    trades.forEach((trade) => addExistingTrade(event, profession, level, trade[0], trade[1]));
  };

  MoreJS.villagerTrades((event) => {
    let profession = 'minecraft:farmer';

    replaceTrades(event, profession, 1, [
      [['32x minecraft:wheat'], 'createdelightcore:copper_coin'],
      [['32x vintagedelight:oat'], 'createdelightcore:copper_coin'],
      [['32x farmersdelight:rice_panicle'], 'createdelightcore:copper_coin'],
      [['32x culturaldelights:corn_cob'], 'createdelightcore:copper_coin'],
      [['32x minecraft:potato'], 'createdelightcore:copper_coin'],
      [['32x minecraft:carrot'], 'createdelightcore:copper_coin'],
      [['32x minecraft:beetroot'], 'createdelightcore:copper_coin'],
      [['32x frycooks_delight:canola'], 'createdelightcore:copper_coin'],
      [['32x vintagedelight:peanut'], 'createdelightcore:copper_coin'],
      [['16x vintagedelight:cucumber'], 'createdelightcore:copper_coin'],
      [['16x culturaldelights:eggplant'], 'createdelightcore:copper_coin'],
      [['16x festival_delicacies:eggplant'], 'createdelightcore:copper_coin'],
      [['16x farmersdelight:tomato'], 'createdelightcore:copper_coin'],
      [['16x farmersdelight:onion'], 'createdelightcore:copper_coin'],
      [['16x festival_delicacies:greenonion'], 'createdelightcore:copper_coin'],
      [['16x vintagedelight:ghost_pepper'], 'createdelightcore:copper_coin'],
      [['createdelightcore:copper_coin'], '8x minecraft:bread'],
    ]);

    addTrades(event, profession, 2, [
      [['16x festival_delicacies:chinese_cabbage'], 'createdelightcore:copper_coin'],
    ]);

    replaceTrades(event, profession, 3, [
      [['4x minecraft:melon'], '2x createdelightcore:copper_coin'],
      [['8x neapolitan:banana'], '2x createdelightcore:copper_coin'],
      [['22x supplementaries:flax_seeds'], 'createdelightcore:copper_coin'],
      [['3x createdelightcore:copper_coin'], '18x minecraft:cookie'],
      [['3x createdelightcore:copper_coin'], '12x neapolitan:strawberry_scones'],
    ]);
  });
}
