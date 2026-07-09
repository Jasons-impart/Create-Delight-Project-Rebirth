if (global.hasMod('ratatouille')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((item) => global.itemExists(item));

    event.add(
      'c:foods/sausage',
      existingItems([
        'ratatouille:raw_sausage',
        'butchercraft:sausage',
        'mynethersdelight:hoglin_sausage',
      ])
    );
    event.add(
      'c:foods/cooked_sausage',
      existingItems(['butchercraft:cooked_sausage', 'mynethersdelight:roasted_sausage'])
    );

    const chocolateBars = existingItems([
      'create_confectionery:bar_of_black_chocolate',
      'create_confectionery:bar_of_white_chocolate',
      'create_confectionery:bar_of_ruby_chocolate',
    ]);

    event.add('c:bars/chocolate', chocolateBars);
    event.add('supplementaries:chocolate_bars', chocolateBars);
  });
}
