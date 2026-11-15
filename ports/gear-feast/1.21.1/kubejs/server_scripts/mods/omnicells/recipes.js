if (global.hasAllMods(['ae2omnicells', 'create_new_age', 'createutilities'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'ae2omnicells:ender_ingot_from_blocks',
      'ae2omnicells:ender_ingot_block_from_ingots',
    ]);
    event
      .custom({
        type: 'create_new_age:energising',
        energy_needed: 3200,
        ingredients: [{ item: 'ae2omnicells:charged_ender_ingot' }],
        results: [{ id: 'createutilities:void_steel_ingot' }],
      })
      .id('createdelightcore:ae2/omnicells/energising/charged_ender_ingot');
  });
}
