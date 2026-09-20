if (global.hasMod('tacz')) {
  CreateDelightCoreEvents.disabledBlocks((event) => {
    // Disable the block and its item; Core replaces newly placed/generated blocks with air.
    event.block('tacz:gun_smith_table');
  });
}
