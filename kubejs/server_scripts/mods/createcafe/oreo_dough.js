if (global.hasAllMods(['createcafe', 'create', 'bakeries', 'ratatouille'])) {
  ServerEvents.recipes((event) => {
    event.remove({ output: 'createcafe:oreo_dough' });
    remove_recipes_id(event, ['createcafe:mixing/sugar_melting']);

    event.recipes.create
      .mixing('createcafe:oreo_dough', [
        'bakeries:flour',
        'ratatouille:cocoa_powder',
        Fluid.water(250),
      ])
      .id('createdelightcore:createcafe/mixing/oreo_dough');
  });
}
