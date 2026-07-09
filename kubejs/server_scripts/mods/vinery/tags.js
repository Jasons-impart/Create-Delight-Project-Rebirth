if (global.hasMod('vinery')) {
  ServerEvents.tags('item', (event) => {
    const grapes = [
      'vinery:red_grape',
      'vinery:white_grape',
      'vinery:savanna_grapes_red',
      'vinery:savanna_grapes_white',
      'vinery:taiga_grapes_red',
      'vinery:taiga_grapes_white',
      'vinery:jungle_grapes_red',
      'vinery:jungle_grapes_white',
      'nethervinery:warped_grape',
      'nethervinery:crimson_grape',
    ].filter((id) => global.itemExists(id));
    const cherries = ['vinery:cherry'].filter((id) => global.itemExists(id));

    event.add('c:fruits/grape', grapes);
    event.add('forge:fruits/grape', grapes);
    event.add('c:fruits/cherry', cherries);
    event.add('forge:fruits/cherry', cherries);

    event.add(
      'vinery:grapevine_pot',
      [
        'vinery:grapevine_pot',
        'nethervinery:crimson_grapevine_pot',
        'nethervinery:warped_grapevine_pot',
      ].filter((id) => global.itemExists(id))
    );
  });
}
