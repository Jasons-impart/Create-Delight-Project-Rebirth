if (global.hasMod('torchmaster')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['torchmaster:frozen_pearl', 'torchmaster:feral_flare_lantern']);
  });
}
