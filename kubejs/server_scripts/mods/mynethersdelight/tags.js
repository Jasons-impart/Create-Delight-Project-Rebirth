if (global.hasMod('mynethersdelight')) {
  ServerEvents.tags('item', (event) => {
    event.add(
      'mynethersdelight:ghast_meats',
      ['dungeonsdelight:ghast_tentacle', 'dungeonsdelight:ghast_calamari'].filter((id) =>
        global.itemExists(id)
      )
    );

    [
      'mynethersdelight:hoglin_sausage',
      'mynethersdelight:roasted_sausage',
      'mynethersdelight:slices_of_bread',
      'mynethersdelight:toasts',
    ]
      .filter((id) => global.itemExists(id))
      .forEach((item) => {
        event.removeAllTagsFrom(item);
      });

    event.add(
      'c:vines/nether',
      [
        'minecraft:weeping_vines',
        'minecraft:twisting_vines',
        'netherexp:weeping_ivy',
        'netherexp:twisting_ivy',
      ].filter((id) => global.itemExists(id))
    );
  });
}
