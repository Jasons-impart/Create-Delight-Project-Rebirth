if (
  global.hasAllMods(['appliedcreate', 'ae2', 'extendedae', 'create', 'createdeco', 'northstar'])
) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:appliedcreate/${path}`;

    remove_recipes_id(event, [
      'appliedcreate:me_gearbox',
      'appliedcreate:kinetic_energy_acceptor',
      'appliedcreate:creative_stress_cell',
      '/appliedcreate:stress_storage_.*/',
      '/appliedcreate:.*board/',
      '/appliedcreate:.*processor/',
      '/appliedcreate:.*housing/',
      '/^appliedcreate:.*provider$/',
    ]);

    create
      .mechanical_crafting(
        'appliedcreate:andesite_pattern_provider',
        ['AABAA', 'ABCBA', 'BCDCB', 'ABEBA', 'AABAA'],
        {
          A: 'createdeco:andesite_sheet',
          B: 'northstar:polished_lunar_sapphire',
          C: 'create:andesite_casing',
          D: 'ae2:pattern_provider',
          E: 'createdelightcore:mechanical_craft_encoder',
        }
      )
      .id(id('mechanical_crafting/andesite_pattern_provider'));

    create
      .mechanical_crafting(
        'appliedcreate:brass_pattern_provider',
        ['AABAA', 'ABCBA', 'BCDCB', 'ABEBA', 'AABAA'],
        {
          A: 'create:brass_sheet',
          B: 'northstar:martian_steel_sheet',
          C: 'create:brass_casing',
          D: 'extendedae:ex_pattern_provider',
          E: 'createdelightcore:mechanical_craft_encoder',
        }
      )
      .id(id('mechanical_crafting/brass_pattern_provider'));
  });
}
