if (global.hasAllMods(['vinery', 'create', 'farmersdelight'])) {
  ServerEvents.recipes((event) => {
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    [
      'conditional:create/mixing/red_grape_juice_mixing',
      'conditional:create/mixing/red_taiga_grape_juice_mixing',
      'conditional:create/mixing/red_jungle_grape_juice_mixing',
      'conditional:create/mixing/red_savanna_grape_juice_mixing',
      'conditional:create/mixing/white_grape_juice_mixing',
      'conditional:create/mixing/white_taiga_grape_juice_mixing',
      'conditional:create/mixing/white_jungle_grape_juice_mixing',
      'conditional:create/mixing/white_savanna_grape_juice_mixing',
    ].forEach(removeIfPresent);

    remove_recipes_id(event, [
      'vinery:straw_hat',
      'vinery:winemaker_apron',
      'vinery:winemaker_leggings',
      'vinery:winemaker_boots',
      'vinery:apples',
      'vinery:apple_bag',
    ]);

    event.recipes.create
      .haunting('vinery:rotten_cherry', 'vinery:cherry')
      .id('createdelightcore:vinery/haunting/rotten_cherry');

    remove_recipes_input(event, ['vinery:dark_cherry_boat']);
    remove_recipes_output(event, ['vinery:dark_cherry_boat']);

    [
      ['vinery:apple_log', 'minecraft:stripped_oak_log'],
      ['vinery:apple_wood', 'minecraft:stripped_oak_wood'],
      ['vinery:dark_cherry_log', 'vinery:stripped_dark_cherry_log'],
      ['vinery:dark_cherry_wood', 'vinery:stripped_dark_cherry_wood'],
    ].forEach((log) => {
      const path = log[0].split(':')[1];
      event.recipes.create.cutting(log[1], log[0]).id(`createdelightcore:vinery/cutting/${path}`);
      event.recipes.farmersdelight
        .cutting(log[0], '#minecraft:axes', [log[1], 'farmersdelight:tree_bark'])
        .sound('minecraft:item.axe.strip')
        .id(`createdelightcore:vinery/cutting/${path}_fd`);
    });
  });
}
