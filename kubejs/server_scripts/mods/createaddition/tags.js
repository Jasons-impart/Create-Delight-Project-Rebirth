if (global.hasMod('createaddition')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => global.itemExists(id));

    event.add(
      'c:wires/electric',
      existingItems([
        'createaddition:electrum_wire',
        'createaddition:gold_wire',
        'vintageimprovements:silver_wire',
      ])
    );
    event.add(
      'c:rods/electric',
      existingItems([
        'createaddition:electrum_rod',
        'createaddition:gold_rod',
        'vintageimprovements:silver_rod',
      ])
    );
    event.add(
      'c:ingots/electric',
      existingItems([
        'createaddition:electrum_ingot',
        'minecraft:gold_ingot',
        'iceandfire:silver_ingot',
      ])
    );
    event.add('curios:bracelet', existingItems(['createaddition:electrum_amulet']));
    event.add('c:storage_blocks', existingItems(['createaddition:electrum_block']));
  });

  ServerEvents.tags('fluid', (event) => {
    if (global.fluidExists('createaddition:seed_oil')) {
      event.removeAllTagsFrom('createaddition:seed_oil');
    }
  });

  ServerEvents.tags('block', (event) => {
    const taggedBlocks = [
      'createaddition:electrum_block',
      'createaddition:superconducting_connector',
    ].filter((id) => global.blockExists(id));

    event.add('minecraft:mineable/pickaxe', taggedBlocks);
    event.add('minecraft:needs_iron_tool', taggedBlocks);
  });
}
