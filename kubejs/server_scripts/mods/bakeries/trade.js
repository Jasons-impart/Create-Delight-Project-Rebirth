if (global.hasAllMods(['bakeries', 'createdelightcore', 'morejs'])) {
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

  MoreJS.villagerTrades((event) => {
    let profession = 'bakeries:pistrinamaster';

    replaceTrades(event, profession, 1, [
      [['8x createdelightcore:copper_coin'], '2x vintagedelight:salt_dust'],
      [['4x createdelightcore:copper_coin'], '2x bakeries:flour'],
      [['4x createdelightcore:copper_coin'], '2x createdelightcore:corn_flour'],
    ]);

    replaceTrades(event, profession, 2, [
      [['6x createdelightcore:copper_coin'], 'bakeries:bottle_yeast'],
      [['8x createdelightcore:copper_coin'], 'createdelightcore:dry_yeast'],
    ]);

    replaceTrades(event, profession, 3, [
      [['4x createdelightcore:butter'], '2x createdelightcore:copper_coin'],
      [['4x bakeries:brown_sugar_cube'], 'createdelightcore:copper_coin'],
      [['cosmopolitan:cream'], 'createdelightcore:copper_coin'],
      [['bakeries:foamed_cream'], 'createdelightcore:copper_coin'],
      [['bakeries:sweet_dough'], '2x createdelightcore:copper_coin'],
      [['bakeries:round_bread_dough'], '3x createdelightcore:copper_coin'],
      [['bakeries:baguette_dough'], '3x createdelightcore:copper_coin'],
      [['bakeries:croissant_dough'], '3x createdelightcore:copper_coin'],
    ]);
  });
}
