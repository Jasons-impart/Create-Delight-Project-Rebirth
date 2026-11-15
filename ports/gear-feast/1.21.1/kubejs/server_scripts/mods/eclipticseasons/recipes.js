if (global.hasAllMods(['eclipticseasons', 'create', 'cmr', 'create_enchantment_industry'])) {
  ServerEvents.recipes((event) => {
    ['spring', 'summer', 'autumn', 'winter'].forEach((season) => {
      const essence = `eclipticseasons:${season}_greenhouse_essence`;

      event.recipes.create
        .sequenced_assembly(`2x ${essence}`, essence, [
          event.recipes.create.deploying(essence, [essence, 'create:blaze_burner']),
          event.recipes.create.deploying(essence, [essence, 'cmr:snowman_cooler']),
          event.recipes.create.filling(essence, [
            essence,
            Fluid.of('create_enchantment_industry:experience', 250),
          ]),
        ])
        .loops(1)
        .transitionalItem(essence)
        .id(`createdelightcore:eclipticseasons/sequenced_assembly/${season}_greenhouse_essence`);
    });
  });
}
