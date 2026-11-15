if (global.hasMod('iceandfire')) {
  ServerEvents.tags('item', (event) => {
    event.add(
      'curios:head',
      ['iceandfire:earplugs', 'iceandfire:blindfold'].filter((id) => global.itemExists(id))
    );
    event.add(
      'createdelightcore:dragon_flesh',
      [
        'iceandfire:fire_dragon_flesh',
        'iceandfire:ice_dragon_flesh',
        'iceandfire:lightning_dragon_flesh',
      ].filter((id) => global.itemExists(id))
    );
    event.add(
      'c:dragon_eggs',
      [
        'iceandfire:dragonegg_red',
        'iceandfire:dragonegg_bronze',
        'iceandfire:dragonegg_gray',
        'iceandfire:dragonegg_blue',
        'iceandfire:dragonegg_white',
        'iceandfire:dragonegg_sapphire',
        'iceandfire:dragonegg_green',
        'iceandfire:dragonegg_black',
        'iceandfire:dragonegg_electric',
        'iceandfire:dragonegg_copper',
        'iceandfire:dragonegg_amethyst',
        'iceandfire:dragonegg_silver',
        'minecraft:dragon_egg',
      ].filter((id) => global.itemExists(id))
    );
  });

  ServerEvents.tags('block', (event) => {
    if (global.blockExists('iceandfire:dreadwood_log')) {
      event.add('minecraft:logs', 'iceandfire:dreadwood_log');
    }
  });

  ServerEvents.tags('fluid', (event) => {
    event.add(
      'createdelightcore:molten_dragon_steel',
      [
        'createdelightcore:molten_fire_steel',
        'createdelightcore:molten_ice_steel',
        'createdelightcore:molten_lightning_steel',
      ].filter((id) => global.fluidExists(id))
    );
  });
}
