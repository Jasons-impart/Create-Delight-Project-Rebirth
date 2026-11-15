if (global.hasMod('cratedelight')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['cratedelight:potato_crate_smelting_fd']);
  });
}
