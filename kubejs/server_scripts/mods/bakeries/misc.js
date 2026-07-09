if (global.hasMod('bakeries')) {
  BlockEvents.rightClicked('bakeries:paper_cup', (event) => {
    const { player, hand, block } = event;
    if (!player.getItemInHand(hand).is('createdelightcore:cake_batter_bucket')) {
      return;
    }

    const properties = block.properties;
    const fill = properties.get('fill');
    if (parseInt(properties.get('pile'), 10) === 4 && fill === 'false') {
      properties.put('fill', 'true');
      block.set(block.id, properties);
      player.setItemInHand(hand, 'minecraft:bucket');
      event.cancel();
    }
  });

  if (global.hasMod('ratatouille')) {
    BlockEvents.rightClicked('bakeries:soak_coffee_cut_cake_base', (event) => {
      const { player, block, server } = event;
      if (!player.mainHandItem.is('ratatouille:cocoa_powder')) {
        return;
      }

      const properties = block.properties;
      if (properties.get('stage') === 3) {
        player.swing();
        if (!player.isCreative()) {
          player.mainHandItem.count--;
        }
        server.scheduleInTicks(1, () => {
          block.set('bakeries:tiramisu');
        });
        event.cancel();
      }
    });
  }
}
