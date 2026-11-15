if (global.hasAllMods(['displaydelight', 'quality_food'])) {
  ServerEvents.tags('block', (event) => {
    const $BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries');
    const excluded = [
      'displaydelight:bowl',
      'displaydelight:food_plate',
      'displaydelight:glass_showcase',
    ];
    const displayBlocks = [];

    $BuiltInRegistries.BLOCK.keySet().forEach((key) => {
      const id = String(key);

      if (id.startsWith('displaydelight:') && !excluded.includes(id)) {
        displayBlocks.push(id);
      }
    });

    event.add('quality_food:quality_blocks', displayBlocks);
  });
}
