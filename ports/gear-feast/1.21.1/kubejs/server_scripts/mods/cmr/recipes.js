if (global.hasAllMods(['cmr', 'create'])) {
  ServerEvents.recipes((event) => {
    event.remove({ output: ['cmr:frozen_cake_base', 'cmr:frozen_cake'] });

    event.recipes.create
      .compacting('4x cmr:frozen_cake_base', [
        Fluid.of('createdelightcore:cake_batter', 1000),
        '2x minecraft:snowball',
      ])
      .id('createdelightcore:cmr/compacting/frozen_cake_base');

    event.recipes.create
      .filling('cmr:frozen_cake', ['cmr:frozen_cake_base', Fluid.of('netherexp:ectoplasm', 250)])
      .id('createdelightcore:cmr/filling/frozen_cake');

    if (global.hasMod('createdeco')) {
      event
        .shaped('2x cmr:empty_snowman_cooler', [' A ', 'ABA', ' A '], {
          A: 'createdeco:industrial_iron_sheet',
          B: 'minecraft:snow_block',
        })
        .id('createdelightcore:cmr/empty_snowman_cooler_from_cast_iron');
    }
  });

  ServerEvents.tags('item', (event) => {
    event.remove('cmr:snowman_cooler_fuel/regular', ['minecraft:powder_snow_bucket']);
  });
}
