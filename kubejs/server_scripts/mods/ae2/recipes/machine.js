if (global.hasAllMods(['ae2', 'create', 'trashcans'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['ae2:network/blocks/io_condenser']);

    event.recipes.create
      .item_application('ae2:condenser', [
        'createdelightcore:iron_casing',
        'trashcans:ultimate_trash_can',
      ])
      .id('createdelightcore:ae2/trashcans/machine/item_application/condenser');
  });
}
