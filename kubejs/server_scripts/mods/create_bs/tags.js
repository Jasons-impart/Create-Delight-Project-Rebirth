if (global.hasMod('create_bs')) {
  ServerEvents.tags('item', (event) => {
    event.add('c:obsidians', ['minecraft:obsidian']);
  });
}
