if (global.hasMod('createutilities')) {
  ServerEvents.tags('item', (event) => {
    event.add('c:storage_blocks', 'createutilities:void_steel_block');
    event.add('c:storage_blocks/void_steel', 'createutilities:void_steel_block');
  });

  ServerEvents.tags('block', (event) => {
    event.add('c:storage_blocks', 'createutilities:void_steel_block');
    event.add('c:storage_blocks/void_steel', 'createutilities:void_steel_block');
    event.add('minecraft:needs_diamond_tool', 'createutilities:void_steel_block');
  });
}
