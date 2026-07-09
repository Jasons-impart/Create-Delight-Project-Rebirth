if (global.hasMod('cosmopolitan')) {
  ServerEvents.tags('block', (event) => {
    const existingBlocks = (ids) => ids.filter((id) => global.blockExists(id));

    event.add(
      'cosmopolitan:cooling_sources',
      existingBlocks([
        'ratatouille:frozen_block',
        'iceandfire:dragonscale_blue',
        'cmr:snowman_cooler',
        'brewinandchewin:ice_crate',
      ])
    );
  });

  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => global.itemExists(id));

    event.add(
      'cosmopolitan:carotene_sources',
      existingItems(['createdelight:enchanted_golden_carrot', 'create_bic_bit:stamppot_bowl'])
    );
  });
}
