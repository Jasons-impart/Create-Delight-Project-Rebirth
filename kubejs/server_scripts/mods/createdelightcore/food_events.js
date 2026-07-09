if (global.hasMod('createdelightcore')) {
  let existingFoods = (ids) => ids.filter((id) => true);

  existingFoods([
    'createdelightcore:empty_popsicle',
    'ends_delight:chorus_fruit_popsicle',
    'farmersdelight:melon_popsicle',
    'mynethersdelight:tear_popsicle',
    'youkaishomecoming:milk_popsicle',
    'fruitsdelight:hamimelon_popsicle',
    'collectorsreap:lime_popsicle',
    'fruitsdelight:kiwi_popsicle',
    'casualnessdelight:green_tongue',
    'youkaishomecoming:big_popsicle',
  ]).forEach((item) => {
    ItemEvents.foodEaten(item, (event) => {
      event.entity.setTicksFrozen(event.entity.getTicksFrozen() + 80);
    });
  });

  existingFoods([
    'createdelightcore:empty_popsicle',
    'ends_delight:chorus_fruit_popsicle',
    'farmersdelight:melon_popsicle',
    'mynethersdelight:tear_popsicle',
    'collectorsreap:lime_popsicle',
    'casualnessdelight:green_tongue',
  ]).forEach((item) => {
    ItemEvents.foodEaten(item, (event) => {
      event.server.scheduleInTicks(1, () => {
        if (!event.player.isCreative()) {
          event.player.give('minecraft:stick');
        }
      });
    });
  });

  existingFoods(['cmr:frozen_cake']).forEach((item) => {
    ItemEvents.foodEaten(item, (event) => {
      event.entity.setTicksFrozen(event.entity.getTicksFrozen() + 800);
    });
  });

  existingFoods([
    'seasonals:red_velvet_cupcake',
    'seasonals:mixed_berry_muffin',
    'seasonals:chocolate_pumpkin_muffin',
    'fruitsdelight:blueberry_muffin',
    'fruitsdelight:cranberry_muffin',
    'dungeonsdelight:monster_muffin',
  ]).forEach((item) => {
    ItemEvents.foodEaten(item, (event) => {
      event.server.scheduleInTicks(1, () => {
        if (!event.player.isCreative()) {
          event.player.give('bakeries:paper_cup');
        }
      });
    });
  });
}
