if (global.hasMod('create_confectionery')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => global.itemExists(id));

    event.add(
      'createdelightcore:chocolate_candy',
      existingItems([
        'create_confectionery:chocolate_candy',
        'create_confectionery:chocolate_candy_1',
        'create_confectionery:chocolate_candy_2',
        'create_confectionery:chocolate_candy_3',
        'create_confectionery:black_chocolate_candy',
        'create_confectionery:black_chocolate_candy_1',
        'create_confectionery:black_chocolate_candy_2',
        'create_confectionery:black_chocolate_candy_3',
        'create_confectionery:white_chocolate_candy',
        'create_confectionery:white_chocolate_candy_1',
        'create_confectionery:white_chocolate_candy_2',
        'create_confectionery:white_chocolate_candy_3',
        'create_confectionery:ruby_chocolate_candy',
        'create_confectionery:ruby_chocolate_candy_1',
        'create_confectionery:ruby_chocolate_candy_2',
        'create_confectionery:ruby_chocolate_candy_3',
      ])
    );
    event.add(
      'createdelightcore:glazed_berries',
      existingItems([
        'create:chocolate_glazed_berries',
        'create_confectionery:black_chocolate_glazed_berries',
        'create_confectionery:white_chocolate_glazed_berries',
        'create_confectionery:caramel_glazed_berries',
        'create_confectionery:ruby_chocolate_glazed_berries',
      ])
    );
  });
}
