if (global.hasMod('silentsdelight')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['silentsdelight:sculk_sensor_tendril_roll']);

    if (global.hasMod('farmersdelight')) {
      remove_recipes_id(event, ['farmersdelight:kelp_roll']);
    }
  });
}
