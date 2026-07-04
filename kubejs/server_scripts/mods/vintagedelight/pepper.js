if (global.hasAllMods(['vintagedelight', 'mynethersdelight'])) {
  ServerEvents.recipes((event) => {
    event
      .shapeless('vintagedelight:stuffed_burrito', [
        'culturaldelights:tortilla',
        'farmersdelight:beef_patty',
        '#c:crops/cabbage',
        '#c:crops/tomato',
        'trailandtales_delight:cheese_slice',
        '#mynethersdelight:hot_spice',
      ])
      .id('createdelightcore:vintagedelight/crafting/stuffed_burrito');

    event
      .shapeless('mynethersdelight:spicy_skewer', [
        '#c:foods/raw_strider',
        'vintagedelight:ghost_pepper',
        'minecraft:blaze_rod',
        'vintagedelight:ghost_pepper',
      ])
      .id('createdelightcore:vintagedelight/crafting/spicy_skewer');
  });
}
