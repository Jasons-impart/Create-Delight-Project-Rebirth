if (global.hasMod('createcobblestone')) {
  ServerEvents.recipes((event) => {
    event.remove({ mod: 'createcobblestone' });
  });
}
