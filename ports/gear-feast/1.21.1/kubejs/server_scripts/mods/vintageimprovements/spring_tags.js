if (global.hasMod('vintageimprovements')) {
  ServerEvents.tags('item', (event) => {
    event.add('c:springs/below_500', [
      'vintageimprovements:tin_spring',
      'vintageimprovements:golden_spring',
      'vintageimprovements:electrum_spring',
      'vintageimprovements:brass_spring',
      'vintageimprovements:bronze_spring',
      'vintageimprovements:andesite_spring',
      'vintageimprovements:zinc_spring',
      'vintageimprovements:copper_spring',
      'vintageimprovements:vanadium_spring',
      'vintageimprovements:silver_spring',
    ]);

    event.add('c:springs/between_500_2_1000', [
      'vintageimprovements:iron_spring',
      'vintageimprovements:steel_spring',
      'vintageimprovements:blaze_spring',
    ]);

    event.add('c:springs/over_1000', [
      'vintageimprovements:nethersteel_spring',
      'vintageimprovements:netherite_spring',
    ]);
  });
}
