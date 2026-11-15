if (global.hasAllMods(['create_enchantment_industry', 'create', 'supplementaries', 'tetra'])) {
  ServerEvents.recipes((event) => {
    event.remove({ output: 'create_enchantment_industry:printer' });

    event
      .shaped('create_enchantment_industry:printer', ['ABA', ' C ', ' D '], {
        A: '#c:springs/below_500',
        B: 'create:copper_casing',
        C: 'minecraft:dried_kelp',
        D: 'create:iron_sheet',
      })
      .id('createdelightcore:create_enchantment_industry/crafting/printer');
  });
}
