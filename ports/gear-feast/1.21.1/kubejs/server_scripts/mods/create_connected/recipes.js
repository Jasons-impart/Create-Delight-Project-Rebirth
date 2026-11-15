if (global.hasAllMods(['create_connected', 'create', 'createaddition', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'create:crafting/kinetics/encased_chain_drive',
      'create:crafting/kinetics/encased_chain_drive_from_zinc',
    ]);

    event
      .shapeless('3x create:encased_chain_drive', [
        'create:andesite_casing',
        'createaddition:iron_rod',
      ])
      .id('createdelightcore:create_connected/crafting/kinetics/encased_chain_drive');

    event
      .shapeless('3x create:encased_chain_drive', [
        'create:andesite_casing',
        'vintageimprovements:zinc_rod',
      ])
      .id('createdelightcore:create_connected/crafting/kinetics/encased_chain_drive_from_zinc');

    event.recipes.create
      .item_application('create_connected:fan_freezing_catalyst', [
        'create_connected:empty_fan_catalyst',
        'minecraft:powder_snow_bucket',
      ])
      .id('createdelightcore:create_connected/item_application/kinetics/fan_freezing_catalyst');

    event
      .shapeless('create_connected:empty_fan_catalyst', ['create_connected:fan_freezing_catalyst'])
      .id('createdelightcore:create_connected/crafting/kinetics/empty_fan_catalyst');
  });
}
