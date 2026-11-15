if (global.hasMod('createfluidstuffs')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['createfluidstuffs:multi_fluid_tank']);

    if (global.hasAllMods(['create', 'createmetallurgy'])) {
      event.recipes.create
        .filling('createfluidstuffs:multi_fluid_tank', [
          'create:fluid_tank',
          Fluid.of('createmetallurgy:molten_brass', 270),
        ])
        .id('createdelightcore:createfluidstuffs/filling/multi_fluid_tank');
    }
  });
}
