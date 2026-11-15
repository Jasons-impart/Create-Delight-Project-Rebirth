if (global.hasMod('fruitsdelight')) {
  ServerEvents.tags('item', (event) => {
    if (global.itemExists('minecraft:slime_ball')) {
      event.add('c:gelatin', 'minecraft:slime_ball');
    }

    if (global.itemExists('createdelightcore:lush_confiture_jelly_bottle')) {
      event.add('c:jams', 'createdelightcore:lush_confiture_jelly_bottle');
      event.add('diet:fruits', 'createdelightcore:lush_confiture_jelly_bottle');
      event.add('diet:sugars', 'createdelightcore:lush_confiture_jelly_bottle');
      event.add('create:upright_on_belt', 'createdelightcore:lush_confiture_jelly_bottle');
    }

    [
      'vintagedelight:apple_sauce_bottle',
      'vintagedelight:sweet_berry_jam_bottle',
      'vintagedelight:glow_berry_jam_bottle',
      'vintagedelight:gearo_berry_mason_jar',
      'vintagedelight:gearo_berry_jam_bottle',
    ]
      .filter((id) => global.itemExists(id))
      .forEach((item) => {
        event.removeAllTagsFrom(item);
      });
  });
}
