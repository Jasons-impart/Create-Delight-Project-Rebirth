if (global.hasMod('create')) {
  ServerEvents.tags('item', (event) => {
    event.add('create:upright_on_belt', [
      'minecraft:small_amethyst_bud',
      'minecraft:medium_amethyst_bud',
      'minecraft:large_amethyst_bud',
      'minecraft:amethyst_cluster',
    ]);
  });
}
