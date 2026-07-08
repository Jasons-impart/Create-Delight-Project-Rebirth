if (global.hasMod('create_new_age')) {
  ServerEvents.tags('item', (event) => {
    event.remove('create_new_age:nuclear/hazmat_suit', [
      'minecraft:leather_helmet',
      'minecraft:leather_chestplate',
      'minecraft:leather_leggings',
      'minecraft:leather_boots',
    ]);
    event.add(
      'create_new_age:nuclear/hazmat_suit',
      [
        'alexscaves:hazmat_mask',
        'alexscaves:hazmat_chestplate',
        'alexscaves:hazmat_leggings',
        'alexscaves:hazmat_boots',
      ].filter((id) => global.itemExists(id))
    );
    event.add(
      'createaddition:high_current_spools',
      ['createaddition:gold_spool', 'createaddition:electrum_spool'].filter((id) =>
        global.itemExists(id)
      )
    );
  });

  ServerEvents.tags('block', (event) => {
    if (global.blockExists('createdelightcore:forge_steel_casing')) {
      event.add('create_new_age:stops_radiation', 'createdelightcore:forge_steel_casing');
    }
  });
}
