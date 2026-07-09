if (global.hasAllMods(['vinery', 'createdelightcore', 'morejs'])) {
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
    let profession = 'vinery:winemaker';

    replaceTrades(event, profession, 4, [
      [['createdelightcore:gold_coin'], 'vinery:straw_hat'],
      [['createdelightcore:gold_coin'], 'vinery:winemaker_apron'],
      [['createdelightcore:gold_coin'], 'vinery:winemaker_leggings'],
      [['createdelightcore:gold_coin'], 'vinery:winemaker_boots'],
    ]);

    replaceTrades(event, profession, 5, [
      [['createdelightcore:gold_coin'], 'vinery:clark_wine'],
      [['createdelightcore:gold_coin'], 'vinery:lilitu_wine'],
      [['createdelightcore:gold_coin'], 'vinery:jellie_wine'],
      [['createdelightcore:netherite_coin'], 'vinery:vinery_standard'],
    ]);
  });
}
