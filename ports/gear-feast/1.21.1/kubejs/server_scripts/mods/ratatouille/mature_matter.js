if (global.hasAllMods(['ratatouille', 'create', 'youkaishomecoming'])) {
  ServerEvents.recipes((event) => {
    const intermediate = 'ratatouille:unprocessed_mature_matter_fold';
    event
      .custom({
        type: 'create:sequenced_assembly',
        ingredient: { item: 'ratatouille:compost_residue' },
        transitional_item: { id: intermediate },
        loops: 1,
        sequence: [
          {
            type: 'create:filling',
            ingredients: [
              { item: intermediate },
              {
                type: 'neoforge:components',
                fluids: 'create:potion',
                amount: 100,
                components: {
                  'minecraft:potion_contents': { potion: 'youkaishomecoming:aphrodisiac' },
                  'create:potion_fluid_bottle_type': 'regular',
                },
              },
            ],
            results: [{ id: intermediate }],
          },
          {
            type: 'create:pressing',
            ingredients: [{ item: intermediate }],
            results: [{ id: intermediate }],
          },
        ],
        results: [{ id: 'ratatouille:mature_matter_fold' }],
      })
      .id('createdelightcore:ratatouille/sequenced_assembly/mature_matter_fold');
  });
}
