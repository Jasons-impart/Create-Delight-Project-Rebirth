if (global.hasAllMods(['create', 'alexsmobs'])) {
  BlockEvents.rightClicked('alexsmobs:capsid', (event) => {
    const { block, player } = event;
    const mainHandItem = player.mainHandItem;
    const entityData = block.entityData;
    const entityId =
      (entityData && entityData.Items && entityData.Items[0] && entityData.Items[0].id) ||
      'unknown';

    if (
      entityId === 'create:minecart_contraption' &&
      mainHandItem.id === 'create:minecart_contraption'
    ) {
      player.swing();
      block.set('air');
      block.set('alexsmobs:capsid');
      event.cancel();
    }

    if (entityId.search('present') !== -1 && mainHandItem.id.search('present') !== -1) {
      player.swing();
      block.set('air');
      block.set('alexsmobs:capsid');
      event.cancel();
    }

    if (
      entityId.search('functionalstorage') !== -1 &&
      mainHandItem.id.search('functionalstorage') !== -1
    ) {
      player.swing();
      block.set('air');
      block.set('alexsmobs:capsid');
      event.cancel();
    }
  });
}

if (global.hasMod('create')) {
  ServerEvents.tags('block', (event) => {
    event.remove('create:safe_nbt', ['create:clipboard']);
  });
}
