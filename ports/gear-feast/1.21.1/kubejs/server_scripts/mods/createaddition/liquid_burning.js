if (global.hasMod('createaddition')) {
  ServerEvents.recipes((event) => {
    event.remove({ type: 'createaddition:liquid_burning' });
  });
}
