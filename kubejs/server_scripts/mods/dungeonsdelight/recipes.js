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
      ratatouille
        .threshing(
          [
            'dungeonsdelight:wormroot_tendrils',
            CreateItem.of(Item.of('2x minecraft:bone_meal'), 0.6),
            CreateItem.of(Item.of('2x minecraft:slime_ball'), 0.4),
            '2x farmersdelight:straw',
          ],
          'dungeonsdelight:gunk'
        )
        .processingTime(400)
        .id('createdelightcore:dungeonsdelight/threshing/gunk');

      ratatouille
        .squeezing('dungeonsdelight:snifferwurst', [
          'ratatouille:sausage_casing',
          Fluid.of('createdelightcore:slime', 250),
          'dungeonsdelight:sniffer_shank',
        ])
        .id('createdelightcore:dungeonsdelight/squeezing/snifferwurst');
    }
  });
}
