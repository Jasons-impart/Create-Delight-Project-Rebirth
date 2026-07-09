if (global.hasMod('create')) {
  ServerEvents.tags('item', (event) => {
    event.add(
      'create:blaze_burner_fuel/special',
      ['mynethersdelight:magma_cake_slice', 'mynethersdelight:hot_cream_cone'].filter((id) =>
        global.itemExists(id)
      )
    );
    event.add('create:cogwheel', ['create:cogwheel', 'create:large_cogwheel']);
  });

  ServerEvents.tags('fluid', (event) => {
    event.remove('create:bottomless/deny', ['/.*molten_.*/']);
    event.add(
      'create:bottomless/allow',
      [
        'ratatouille:cocoa_liquor',
        'createdelightcore:egg_yolk',
        'create:honey',
        'createdelightcore:vinegar',
        'netherexp:ectoplasm',
        'the_bumblezone:sugar_water_still',
        'minecraft:lava',
      ].filter((id) => global.fluidExists(id))
    );
    event.add('create:bottomless/allow', ['/.*molten_.*/']);
  });
}
