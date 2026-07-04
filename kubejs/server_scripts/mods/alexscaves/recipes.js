if (global.hasMod('alexscaves')) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:alexscaves/general/${path}`;

    remove_recipes_id(event, [
      'alexscaves:azure_neodymium_ingot',
      'alexscaves:scarlet_neodymium_ingot',
      'alexscaves:deep_sea_sushi_roll',
      'alexscaves:cave_map',
    ]);

    if (global.hasMod('create_oppenheimered')) {
      remove_recipes_id(event, [
        'create_oppenheimered:mixing/sulfuric_acid',
        'create_oppenheimered:filling/acid_radrook',
        'create_oppenheimered:filling/fissile_acid_to_waste',
        'create_oppenheimered:compacting/chocolate_to_chocolate_block',
        'create_oppenheimered:compacting/compacted_dough',
        'create_oppenheimered:cutting/peppermint_powder_saw',
        'create_oppenheimered:compacting/galena',
        'create_oppenheimered:mixing/scarlet_neodymium',
        'create_oppenheimered:mixing/azure_neodymium',
        'create_oppenheimered:compacting/layer_cake',
        'create_oppenheimered:mixing/chocolate_heating',
      ]);
    }

    if (global.hasMod('cavedelight')) {
      remove_recipes_id(event, ['cavedelight:trilocaris_roll']);
    }

    if (global.hasAllMods(['create_oppenheimered', 'neapolitan'])) {
      event.replaceInput(
        { id: 'create_oppenheimered:mixing/ice_cream_licoroot' },
        'alexscaves:licoroot',
        'neapolitan:dried_vanilla_pod_block'
      );
    }

    if (global.hasMod('create')) {
      event.recipes.create
        .crushing(
          [
            '3x alexscaves:sea_glass_shards',
            CreateItem.of(Item.of('3x alexscaves:sea_glass_shards'), 0.5),
          ],
          'alexscaves:pearl'
        )
        .id(id('crushing/pearl'));
    }

    if (global.hasMod('vintageimprovements')) {
      event.recipes.vintageimprovements
        .centrifugation(['minecraft:mud', 'alexscaves:sea_glass_shards'], 'alexscaves:muck')
        .id(id('centrifugation/muck'));
    }
  });
}
