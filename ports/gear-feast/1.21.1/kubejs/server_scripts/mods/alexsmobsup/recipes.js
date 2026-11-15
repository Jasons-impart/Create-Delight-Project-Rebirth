if (global.hasMod('alexsmobsup')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'alexsmobsup:mosquito_repellent_stew',
      'alexsmobsup:kangaroo_burger',
    ]);
  });
}

if (global.hasAllMods(['alexsmobsup', 'festival_delicacies', 'neapolitan'])) {
  ServerEvents.recipes((event) => {
    event.recipes.kubejs
      .shapeless('alexsmobsup:mosquito_repellent_stew', [
        'minecraft:bowl',
        'festival_delicacies:mugwort',
        '2x neapolitan:roasted_adzuki_beans',
      ])
      .id('createdelightcore:alexsmobsup/mosquito_repellent_stew_from_mugwort');
  });
}

if (global.hasAllMods(['alexsmobsup', 'ae2'])) {
  ServerEvents.recipes((event) => {
    event.recipes.kubejs
      .shapeless('createdelightcore:fragment_of_border', [
        'alexsmobsup:shattered_dimensional_carver',
        'ae2:singularity',
      ])
      .keepIngredient('alexsmobsup:shattered_dimensional_carver')
      .id('createdelightcore:alexsmobsup/fragment_of_border_from_shattered_dimensional_carver');
  });
}

if (global.hasAllMods(['alexsdelight', 'amfd', 'farmersdelight'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['alexsdelight:barbecue_on_a_stick']);

    event.recipes.kubejs
      .shapeless('2x farmersdelight:barbecue_stick', [
        'farmersdelight:tomato',
        'farmersdelight:onion',
        'amfd:singular_cooked_moose_rib',
        'minecraft:cooked_chicken',
        'minecraft:stick',
        'minecraft:stick',
      ])
      .id('alexsdelight:barbecue_on_a_stick');
  });
}
