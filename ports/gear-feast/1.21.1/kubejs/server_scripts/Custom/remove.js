// 源：参考包 1.20.1 kubejs/server_scripts/Custom/remove.js
// 1.21.1 适配：remove_recipes_mod 已补入 server_scripts/util/recipes.js。
ServerEvents.recipes((event) => {
  remove_recipes_id(event, [
    'create:crafting/materials/rose_quartz',
    'createmetallurgy:belt_grinder',
    'createmetallurgy:sandpaper_belt',
    'minecraft:dispenser',
    'torchmaster:frozen_pearl',
    'torchmaster:feral_flare_lantern',
  ]);

  // ftbquests / itemfilters 本地未安装，对应配方本就不存在，这里仅保留原意（空转）。
  remove_recipes_mod(event, ['ftbquests', 'itemfilters']);
});
