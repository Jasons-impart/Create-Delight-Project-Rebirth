if (global.hasAllMods(['tacz', 'dummmmmmy'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['tacz:gunpowder', 'tacz:gun_smith_table', 'tacz:target']);

    event
      .shaped('tacz:target', ['AAA', 'ABA', 'AAA'], {
        A: 'minecraft:iron_ingot',
        B: 'dummmmmmy:target_dummy',
      })
      .id('createdelightcore:tacz/target');
  });
}
