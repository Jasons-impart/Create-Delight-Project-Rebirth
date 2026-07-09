ServerEvents.recipes((event) => {
  event
    .shaped('4x minecraft:reinforced_deepslate', ['ABA', 'BCB', 'ABA'], {
      A: 'minecraft:ancient_debris',
      B: 'minecraft:deepslate',
      C: 'minecraft:nether_star',
    })
    .id('createdelightcore:minecraft/crafting/reinforced_deepslate');
});
