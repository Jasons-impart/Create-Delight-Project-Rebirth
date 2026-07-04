if (global.hasMod('alexsmobs')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['alexsmobs:mosquito_repellent_stew', 'alexsmobs:kangaroo_burger']);
  });
}

if (global.hasAllMods(['alexsmobs', 'festival_delicacies', 'neapolitan'])) {
  ServerEvents.recipes((event) => {
    event.recipes.kubejs
      .shapeless('alexsmobs:mosquito_repellent_stew', [
        'minecraft:bowl',
        'festival_delicacies:mugwort',
        '2x neapolitan:roasted_adzuki_beans',
      ])
      .id('createdelightcore:alexsmobs/mosquito_repellent_stew_from_mugwort');
  });
}

if (global.hasAllMods(['alexsmobs', 'ae2'])) {
  ServerEvents.recipes((event) => {
    event.recipes.kubejs
      .shapeless('createdelightcore:fragment_of_border', [
        'alexsmobs:shattered_dimensional_carver',
        'ae2:singularity',
      ])
      .keepIngredient('alexsmobs:shattered_dimensional_carver')
      .id('createdelightcore:alexsmobs/fragment_of_border_from_shattered_dimensional_carver');
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
