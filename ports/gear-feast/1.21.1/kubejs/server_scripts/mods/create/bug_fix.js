if (global.hasMod('create')) {
  ServerEvents.tags('block', (event) => {
    event.remove('create:safe_nbt', ['create:clipboard']);
  });
}
