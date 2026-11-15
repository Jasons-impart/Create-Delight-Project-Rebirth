if (global.hasMod('ends_delight')) {
  [
    'ends_delight:chorus_fruit_milk_tea',
    'ends_delight:bubble_tea',
    'ends_delight:chorus_cookie',
    'createdelightcore:chorus_cookie_dough',
    'ends_delight:chorus_fruit_grain',
    'ends_delight:chorus_flower_pie',
    'ends_delight:chorus_flower_tea',
    'ends_delight:chorus_fruit_pie_slice',
  ]
    .filter((id) => true)
    .forEach((item) => {
      ItemEvents.foodEaten(item, (event) => {
        if (event.player.cooldowns.isOnCooldown(event.item.item)) {
          return;
        }
        event.player.addItemCooldown(event.item.item, 20);
      });
    });
}
