if (global.hasMod('create_sa')) {
  ServerEvents.tags('item', (event) => {
    event.add(
      'create:upright_on_belt',
      [
        'create_sa:brass_exoskeleton_chestplate',
        'create_sa:andesite_exoskeleton_chestplate',
        'create_sa:copper_exoskeleton_chestplate',
        'create_sa:creative_filling_tank',
        'create_sa:small_filling_tank',
        'create_sa:medium_filling_tank',
        'create_sa:large_filling_tank',
        'create_sa:small_fueling_tank',
        'create_sa:medium_fueling_tank',
        'create_sa:large_fueling_tank',
        'create_sa:brass_jetpack_chestplate',
        'create_sa:andesite_jetpack_chestplate',
        'create_sa:copper_jetpack_chestplate',
      ].filter((id) => global.itemExists(id))
    );
  });

  ServerEvents.tags('fluid', (event) => {
    event.add('create_sa:fuel_fluid', ['#c:diesel', '#c:biodiesel', '#c:gasoline']);

    if (global.fluidExists('createdelightcore:fuel_mixtures')) {
      event.add('create_sa:fuel_fluid', 'createdelightcore:fuel_mixtures');
    }
  });
}
