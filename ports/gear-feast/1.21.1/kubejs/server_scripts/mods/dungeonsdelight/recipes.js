if (global.hasMod('dungeonsdelight')) {
  ServerEvents.recipes((event) => {
    const { farmersdelight, ratatouille } = event.recipes;

    event.remove({ output: 'dungeonsdelight:soft_serve_sniffer_egg' });

    if (global.hasMod('farmersdelight')) {
      remove_recipes_id(event, ['farmersdelight:cutting/sculk_mayo_block']);

      farmersdelight
        .cutting('dungeonsdelight:ghast_calamari', '#c:tools/knife', ['mynethersdelight:ghasta'])
        .id('createdelightcore:dungeonsdelight/cutting/ghast_calamari');
    }

    if (global.hasAllMods(['trailandtales_delight', 'cosmopolitan', 'create'])) {
      event.recipes.create
        .filling('dungeonsdelight:soft_serve_sniffer_egg', [
          'trailandtales_delight:cooked_sniffer_egg_block',
          Fluid.of('cosmopolitan:adzuki_ice_cream', 1000),
        ])
        .id('createdelightcore:dungeonsdelight/filling/soft_serve_sniffer_egg');
    }

    if (global.hasMod('ratatouille')) {
      event
        .custom({
          type: 'ratatouille:threshing',
          ingredients: [{ item: 'dungeonsdelight:gunk' }],
          processing_time: 400,
          results: [
            { id: 'dungeonsdelight:wormroot_tendrils' },
            { id: 'minecraft:bone_meal', count: 2, chance: 0.6 },
            { id: 'minecraft:slime_ball', count: 2, chance: 0.4 },
            { id: 'farmersdelight:straw', count: 2 },
          ],
        })
        .id('createdelightcore:dungeonsdelight/threshing/gunk');

      event
        .custom({
          type: 'ratatouille:squeezing',
          ingredients: [
            { item: 'ratatouille:sausage_casing' },
            { type: 'neoforge:single', fluid: 'createdelightcore:slime', amount: 250 },
            { item: 'dungeonsdelight:sniffer_shank' },
          ],
          processing_time: 200,
          results: [{ id: 'dungeonsdelight:snifferwurst' }],
        })
        .id('createdelightcore:dungeonsdelight/squeezing/snifferwurst');
    }
  });
}
