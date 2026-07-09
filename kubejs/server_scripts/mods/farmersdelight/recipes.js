if (global.hasAllMods(['farmersdelight', 'create'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'farmersdelight:cutting/tag_dough',
      'farmersdelight:wheat_dough_from_egg',
      'farmersdelight:wheat_dough_from_water',
      'create:emptying/compat/neapolitan/milk_bottle',
      'create:filling/compat/farmersdelight/milk_bottle',
    ]);
    remove_recipes_type(event, ['farmersdelight:dough']);

    event.recipes.farmersdelight
      .cutting('minecraft:sugar_cane', '#c:tools/knife', [
        'minecraft:sugar',
        { id: 'minecraft:sugar', chance: 0.25 },
      ])
      .id('createdelightcore:farmersdelight/cutting/sugar_cane');

    event.recipes.create
      .filling('farmersdelight:milk_bottle', [
        'minecraft:glass_bottle',
        Fluid.of('minecraft:milk', 250),
      ])
      .id('createdelightcore:farmersdelight/filling/milk_bottle');
  });
}

ServerEvents.compostableRecipes((event) => {
  [
    ['createdelightcore:adzuki_beans_seed', 0.3],
    ['dumplings_delight:eggplant_seeds', 0.3],
    ['dumplings_delight:chinese_cabbage_seeds', 0.3],
    ['dumplings_delight:garlic_chive_seeds', 0.3],
    ['dumplings_delight:fennel_seeds', 0.3],
    ['createdelightcore:artemisia_argyi_seed', 0.3],
    ['dumplings_delight:chinese_cabbage', 0.65],
    ['dumplings_delight:garlic_chive', 0.65],
    ['dumplings_delight:fennel', 0.65],
    ['dumplings_delight:eggplant', 0.65],
    ['dumplings_delight:mugwort', 0.5],
    ['dumplings_delight:garlic', 0.5],
    ['dumplings_delight:greenonion', 0.5],
    ['dumplings_delight:chinese_cabbage_leaf', 0.5],
    ['dumplings_delight:jujube', 0.5],
    ['culturaldelights:corn_cob', 0.3],
    ['culturaldelights:eggplant', 0.3],
    ['createcafe:cassava_root', 0.3],
  ].forEach((compostable) => {
    event.add(compostable[0], compostable[1]);
  });
});
