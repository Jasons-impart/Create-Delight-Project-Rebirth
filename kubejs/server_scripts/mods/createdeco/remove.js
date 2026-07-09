if (global.hasAllMods(['createdeco', 'create', 'createaddition', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['create:industrial_iron_block_from_ingots_iron_stonecutting']);

    [
      'createdeco:industrial_iron_ingot',
      'createdeco:industrial_iron_block',
      'createdeco:netherite_ingot',
      'createdeco:netherite_nugget',
      'createdeco:copper_coin',
      'createdeco:iron_coin',
      'createdeco:gold_coin',
      'createdeco:netherite_coin',
      'createdeco:gold_coinstack',
      'createdeco:netherite_coinstack',
      'createdeco:brass_coin',
      'createdeco:brass_coinstack',
      'createdeco:iron_coinstack',
      'createdeco:copper_coinstack',
      'createdeco:industrial_iron_coin',
      'createdeco:industrial_iron_coinstack',
      'createdeco:zinc_coin',
      'createdeco:zinc_coinstack',
    ].forEach((output) => {
      event.remove({ output: output });
    });

    event.replaceInput({}, '#createdeco:internal/plates/zinc_plates', 'createaddition:zinc_sheet');
    event.replaceInput(
      {},
      '#createdeco:internal/plates/andesite_plates',
      'vintageimprovements:andesite_sheet'
    );
    event.replaceInput(
      {},
      '#createdeco:internal/plates/netherite_plates',
      'vintageimprovements:netherite_sheet'
    );

    event.recipes.create
      .compacting('createdeco:industrial_iron_ingot', 'minecraft:iron_ingot')
      .heated()
      .id('createdelightcore:createdeco/compacting/industrial_iron_ingot');
  });
}
