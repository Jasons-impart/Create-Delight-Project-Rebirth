if (global.hasMod('create_confectionery')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'create_confectionery:candy_cane_block_recipe',
      'create_confectionery:candy_cane_recipe_2',
      'create_confectionery:candy_cane_recipe',
      'create_confectionery:honey_candy_recipe',
      'create_confectionery:black_chocolate_recipe',
      'create_confectionery:white_chocolate_recipe',
      'create_confectionery:ruby_chocolate_recipe',
      'create_confectionery:caramel_recipe',
      'create_confectionery:hot_chocolate_recipe',
    ]);
  });
}
