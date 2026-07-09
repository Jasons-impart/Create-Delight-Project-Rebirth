if (global.hasAllMods(['lightmanscurrency', 'createdelightcore', 'morejs'])) {
  MoreJS.villagerTrades((event) => {
    const banker = 'lightmanscurrency:banker';

    event.removeModdedTypedTrades([banker], MoreUtils.range(1));

    [
      [['5x createdelightcore:iron_coin'], 'lightmanscurrency:cash_register'],
      [['createdelightcore:copper_coin'], 'lightmanscurrency:terminal'],
      [['8x createdelightcore:iron_coin'], 'lightmanscurrency:atm'],
      [['createdelightcore:copper_coin'], 'lightmanscurrency:portable_gem_terminal'],
      [['8x createdelightcore:iron_coin'], 'lightmanscurrency:portable_atm'],
      [
        ['4x createdelightcore:iron_coin', '8x createdelightcore:iron_coin'],
        'lightmanscurrency:trading_core',
      ],
    ].forEach((trade) => {
      event.addTrade(banker, 1, trade[0], trade[1]);
    });
  });
}
