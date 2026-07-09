if (global.hasMod('eclipticseasons')) {
  ServerEvents.tags('item', (event) => {
    const addExisting = (tag, ids) => {
      event.add(
        tag,
        ids.filter((id) => global.itemExists(id))
      );
    };

    addExisting('eclipticseasons:crops/average_moist', [
      'frycooks_delight:canola_seeds',
      'collectorsreap:pomegranate_seeds',
      'culturaldelights:corn_kernels',
      'culturaldelights:eggplant_seeds',
      'vintagedelight:cucumber_seeds',
      'dumplings_delight:chinese_cabbage_seeds',
      'dumplings_delight:garlic',
      'dumplings_delight:greenonion',
      'dumplings_delight:eggplant_seeds',
      'dumplings_delight:fennel_seeds',
      'createdelightcore:artemisia_argyi_seed',
      'createdelightcore:adzuki_beans_seed',
      'fruitsdelight:pear_leaves',
      'fruitsdelight:pear_sapling',
      'fruitsdelight:hawberry_leaves',
      'fruitsdelight:hawberry_sapling',
      'fruitsdelight:lychee_leaves',
      'fruitsdelight:lychee_sapling',
      'fruitsdelight:orange_leaves',
      'fruitsdelight:orange_sapling',
      'fruitsdelight:apple_leaves',
      'fruitsdelight:apple_sapling',
      'fruitsdelight:kiwi_leaves',
      'fruitsdelight:kiwi_sapling',
      'fruitsdelight:cranberry',
      'neapolitan:mint_sprout',
      'vinery:red_grape_seeds',
      'vinery:white_grape_seeds',
      'vinery:dark_cherry_leaves',
      'farmersdelight:onion',
      'farmersdelight:cabbage_seeds',
      'dumplings_delight:garlic_chive_seeds',
      'fruitsdelight:fig_leaves',
      'fruitsdelight:fig_sapling',
      'fruitsdelight:blueberry_bush',
      'vintagedelight:peanut',
    ]);

    addExisting('eclipticseasons:crops/moist_humid', [
      'collectorsreap:lime_seeds',
      'fruitsdelight:persimmon_leaves',
      'fruitsdelight:persimmon_sapling',
      'fruitsdelight:peach_leaves',
      'fruitsdelight:peach_sapling',
      'fruitsdelight:mangosteen_leaves',
      'fruitsdelight:mangosteen_sapling',
      'fruitsdelight:bayberry_leaves',
      'fruitsdelight:bayberry_sapling',
      'fruitsdelight:lemon_seeds',
      'fruitsdelight:lemon_tree',
      'neapolitan:strawberry_pips',
      'fruitsdelight:durian_leaves',
      'fruitsdelight:durian_sapling',
      'neapolitan:banana_frond',
      'oceanic_delight:sea_grape',
      'vinery:dark_cherry_sapling',
      'createcafe:coffee_beans',
      'miners_delight:cave_carrot',
      'alexscaves:fiddlehead',
    ]);

    addExisting('eclipticseasons:crops/average_humid', ['farmersrespite:tea_seeds']);
    addExisting('eclipticseasons:crops/dry_moist', [
      'vinery:taiga_grape_seeds_red',
      'vinery:taiga_grape_seeds_white',
      'neapolitan:vanilla_pods',
      'vintagedelight:ghost_pepper_seeds',
      'vinery:savanna_grape_seeds_red',
      'vinery:savanna_grape_seeds_white',
      'createcafe:cassava_seeds',
      'fruitsdelight:hamimelon_seeds',
      'vintagedelight:oat_seeds',
      'trailandtales_delight:lantern_fruit_seeds',
      'youkaishomecoming:soybean',
    ]);
    addExisting('eclipticseasons:crops/dry_humid', [
      'fruitsdelight:mango_leaves',
      'fruitsdelight:mango_sapling',
      'vinery:jungle_grape_seeds_white',
      'vinery:jungle_grape_seeds_red',
      'youkaishomecoming:mandrake_root',
    ]);
    addExisting('eclipticseasons:crops/arid_average', [
      'minecraft:crimson_fungus',
      'minecraft:warped_fungus',
      'mynethersdelight:crimson_fungus_colony',
      'mynethersdelight:warped_fungus_colony',
    ]);

    addExisting('eclipticseasons:crops/all_seasons', [
      'neapolitan:vanilla_pods',
      'miners_delight:cave_carrot',
      'alexscaves:fiddlehead',
    ]);
    addExisting('eclipticseasons:crops/spring_autumn', [
      'frycooks_delight:canola_seeds',
      'vintagedelight:cucumber_seeds',
      'dumplings_delight:eggplant_seeds',
      'culturaldelights:eggplant_seeds',
      'neapolitan:strawberry_pips',
      'createdelightcore:adzuki_beans_seed',
    ]);
    addExisting('eclipticseasons:crops/spring_autumn_winter', [
      'dumplings_delight:chinese_cabbage_seeds',
    ]);
    addExisting('eclipticseasons:crops/spring_summer_autumn', [
      'dumplings_delight:garlic_chive_seeds',
      'createdelightcore:artemisia_argyi_seed',
    ]);
    addExisting('eclipticseasons:crops/spring_summer', [
      'vinery:savanna_grape_seeds_red',
      'vinery:savanna_grape_seeds_white',
      'neapolitan:mint_sprout',
    ]);
    addExisting('eclipticseasons:crops/spring', [
      'vinery:jungle_grape_seeds_red',
      'vinery:jungle_grape_seeds_white',
    ]);
    addExisting('eclipticseasons:crops/summer_autumn', [
      'vintagedelight:oat_seeds',
      'vintagedelight:ghost_pepper_seeds',
      'culturaldelights:avocado_pit',
      'vintagedelight:gearo_berry',
      'vinery:red_grape_seeds',
      'vinery:white_grape_seeds',
      'oceanic_delight:sea_grape',
    ]);
    addExisting('eclipticseasons:crops/summer', [
      'dumplings_delight:fennel_seeds',
      'youkaishomecoming:mandrake_root',
    ]);
    addExisting('eclipticseasons:crops/summer_autumn_winter', ['dumplings_delight:greenonion']);
    addExisting('eclipticseasons:crops/autumn', [
      'vintagedelight:peanut',
      'culturaldelights:corn_kernels',
      'vinery:taiga_grape_seeds_red',
      'vinery:taiga_grape_seeds_white',
      'neapolitan:banana_frond',
      'trailandtales_delight:lantern_fruit_seeds',
    ]);
    addExisting('eclipticseasons:crops/autumn_winter', ['createcafe:cassava_seeds']);
    addExisting('eclipticseasons:crops/winter', ['createcafe:coffee_beans']);
  });
}
