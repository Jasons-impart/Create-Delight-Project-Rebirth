if (global.hasMod('dungeonsdelight')) {
  ServerEvents.tags('item', (event) => {
    event.add(
      'dungeonsdelight:raw_ghast',
      ['mynethersdelight:ghasmati', 'mynethersdelight:ghasta'].filter((id) => global.itemExists(id))
    );

    event.add(
      'createdelightcore:silverfish_meat',
      ['dungeonsdelight:silverfish_abdomen', 'minersdelight:silverfish_eggs'].filter((id) =>
        global.itemExists(id)
      )
    );
  });
}
