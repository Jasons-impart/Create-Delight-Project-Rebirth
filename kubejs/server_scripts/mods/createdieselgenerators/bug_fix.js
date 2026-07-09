if (global.hasAllMods(['createdieselgenerators', 'create_connected'])) {
  BlockEvents.rightClicked('create_connected:fluid_vessel', (event) => {
    if (event.player.mainHandItem.id === 'createdieselgenerators:distillation_controller') {
      event.cancel();
    }
  });
}
