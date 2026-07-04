if (global.hasAllMods(['alexsmobs'])) {
  BlockEvents.rightClicked('createdelightcore:fragment_of_border', (event) => {
    const { block, item, level } = event;

    if (item.id !== 'createdelightcore:fragment_of_border') {
      return;
    }

    level.destroyBlock(block.pos, true);
    item.count -= 1;
    block.createEntity('alexsmobs:farseer').spawn();
  });
}
