if (global.hasMod('kaleidoscope_doll')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['kaleidoscope_doll:doll_machine', 'kaleidoscope_doll:computer']);
  });
}
