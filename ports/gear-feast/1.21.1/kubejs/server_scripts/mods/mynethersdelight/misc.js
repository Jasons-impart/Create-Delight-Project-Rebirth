if (global.hasAllMods(['mynethersdelight', 'bakeries'])) {
  BlockEvents.rightClicked('mynethersdelight:bread_loaf_block', (event) => {
    const { block, player } = event;

    if (!player.mainHandItem.hasTag('c:tools/knife')) {
      return;
    }

    const properties = block.properties;
    const rawBites = properties.get('bites');
    if (rawBites == null) {
      return;
    }

    const bites = Number.parseInt(rawBites, 10);
    if (!Number.isFinite(bites)) {
      return;
    }

    player.swing();
    if (bites < 4) {
      properties.put('bites', String(bites + 1));
      block.set(block.id, properties);
    } else {
      block.set('air');
    }

    block.popItem('bakeries:sliced_toast');
    event.cancel();
  });
}
