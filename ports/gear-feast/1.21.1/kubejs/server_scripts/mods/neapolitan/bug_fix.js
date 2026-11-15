if (global.hasAllMods(['neapolitan', 'farmersdelight'])) {
  BlockEvents.rightClicked('neapolitan:milk_cauldron', (event) => {
    const { player, block, hand } = event;
    const heldItem = player.getItemInHand(hand);
    const properties = block.properties;
    const level = Number(properties.get('level'));

    if (heldItem.is('minecraft:glass_bottle')) {
      const nextLevel = level - 1;
      if (nextLevel > 0) {
        properties.put('level', String(nextLevel));
        block.set('neapolitan:milk_cauldron', properties);
      } else {
        block.set('minecraft:cauldron');
      }

      player.give('farmersdelight:milk_bottle');
      heldItem.shrink(1);
      event.cancel();
      return;
    }

    if (heldItem.is('farmersdelight:milk_bottle') && level < 3) {
      properties.put('level', String(level + 1));
      block.set('neapolitan:milk_cauldron', properties);

      heldItem.shrink(1);
      player.give('minecraft:glass_bottle');
      event.cancel();
    }
  });

  BlockEvents.rightClicked('minecraft:cauldron', (event) => {
    const { player, block, hand } = event;
    const heldItem = player.getItemInHand(hand);

    if (!heldItem.is('farmersdelight:milk_bottle')) {
      return;
    }

    heldItem.shrink(1);
    player.give('minecraft:glass_bottle');
    block.set('neapolitan:milk_cauldron', { level: '1' });
    event.cancel();
  });
}
