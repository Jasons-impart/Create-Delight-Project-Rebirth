// 源：CDR 1.21.1 kubejs/server_scripts/mods/mbd2/assembly_line.js
// MBD2 原生 schema，本地可原样加载。
// 依赖 #c:springs/between_500_2_1000，本地由 00_spring_tags.js 注册。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2'])) return;
  let mbd = event.recipes.createdelightcore;
  // 具名端口按结构深度匹配。recipe_0 的 12 个物品输入保留旧配方限制。

  mbd
    .assembly_line()
    .slotName('item_0')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_1')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_2')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_3')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_4')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_5')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_6')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_7')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_8')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_9')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_10')
    .inputItems('minecraft:iron_ingot')
    .slotName('item_11')
    .inputItems('minecraft:iron_ingot')
    .slotName('fluid_0')
    .inputFluids('1000x minecraft:water')
    .slotName('fluid_1')
    .inputFluids('1000x minecraft:water')
    .slotName('fluid_2')
    .inputFluids('1000x minecraft:water')
    .slotName('fluid_3')
    .inputFluids('1000x minecraft:water')
    .slotName(null)
    .outputItems('minecraft:iron_ingot')
    .duration(100)
    .id('createdelightcore:assembly_line/recipe_0');

  mbd
    .assembly_line()
    .slotName('item_0')
    .inputItems('64x create:cogwheel')
    .slotName('item_1')
    .inputItems('64x create:large_cogwheel')
    .slotName('item_2')
    .inputItems('64x #c:springs/between_500_2_1000')
    .slotName('fluid_0')
    .inputFluids('1000x createdelightcore:lubricating_oil')
    .slotName(null)
    .outputItems('16x create:precision_mechanism')
    .duration(100)
    .id('createdelightcore:assembly_line/recipe_1');
});
