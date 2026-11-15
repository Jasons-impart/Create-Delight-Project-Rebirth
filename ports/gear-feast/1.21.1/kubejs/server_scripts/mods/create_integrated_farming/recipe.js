// 源：参考包 1.20.1 kubejs/server_scripts/Create Integrated Farming/recipe.js
// 1.21.1 适配：
//   - 本版本没有 create_integrated_farming:vacuum_harvester 物品，相关配方移除/重写不写入。
//   - 仅保留 roost：竹子替换为 #collectorsreap:dart_shooters，并追加竹篮+小麦的简化配方。
if (global.hasAllMods(['create_integrated_farming', 'farmersdelight', 'collectorsreap'])) {
  ServerEvents.recipes((event) => {
    event.replaceInput(
      { id: 'create_integrated_farming:crafting/roost' },
      'minecraft:bamboo',
      Ingredient.of('#collectorsreap:dart_shooters')
    );

    event
      .shapeless('create_integrated_farming:roost', [
        'farmersdelight:bamboo_basket',
        'minecraft:wheat',
      ])
      .id('createdelightcore:create_integrated_farming/shapeless/roost');
  });
}
