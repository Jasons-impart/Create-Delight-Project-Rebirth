if (global.hasMod('trailandtales_delight')) {
  ServerEvents.tags('item', (event) => {
    ['trailandtales_delight:cherry_cheese_slice']
      .filter((id) => global.itemExists(id))
      .forEach((item) => {
        event.add('c:cheese', item);
      });
  });
}
