// 源：CDR 1.21.1 kubejs/server_scripts/mods/mbd2/single_machines.js
// 本地适配：
// 1) createdelightcore 的 KubeJS 插件在 2.0.0.7 中位于 disabled 包、不注册 recipe schema；
//    event.recipes.createdelightcore.* 实际由 MBD2 按 MBD 配方类型 id 动态注册，命名空间不变。
// 2) 本地未装 kubejs-create，event.recipes.create.mechanical_crafting 不可用，
//    mechanical_craft_encoder 改写为 event.custom 的原版 Create JSON。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2'])) return;
  const mbd = event.recipes.createdelightcore;
  mbd
    .contract_executor()
    .inputItems(['minecraft:iron_ingot', 'minecraft:iron_ingot'])
    .outputItems(['minecraft:iron_ingot', 'minecraft:iron_ingot'])
    .duration(100)
    .id('createdelightcore:contract_executor/recipe_0');
  mbd.sprinkler().inputFluids('500x minecraft:water').duration(100).id('minecraft:consume_water');
  mbd
    .electrolyzer()
    .duration(100)
    .perTick(true)
    .inputFE(20)
    .inputFluids('10x minecraft:water')
    .outputFluids(['6x northstar:hydrogen', '3x northstar:oxygen'])
    .id('createdelightcore:electrolyzer/water');
  mbd
    .electrolyzer()
    .duration(100)
    .perTick(true)
    .inputFE(100)
    .inputFluids('10x bakeries:salt_water')
    .outputFluids(['2x northstar:chlorine', '2x northstar:sodium'])
    .id('createdelightcore:electrolyzer/salt_water');

  event
    .shaped('createdelightcore:dryer', ['ABA', 'ACA', 'ADA'], {
      A: 'create:copper_bars',
      B: 'create:shaft',
      C: 'minecraft:magma_block',
      D: 'create:nozzle',
    })
    .id('createdelightcore:dryer');

  // 源：参考包 kubejs/server_scripts/Create Northstar/recipe.js:79（forge: → c:）
  event
    .shaped('createdelightcore:electrolyzer', ['AEA', 'BCB', 'ADA'], {
      A: '#c:plates/steel',
      B: 'createdieselgenerators:oil_barrel',
      C: '#c:graphite',
      D: 'createaddition:modular_accumulator',
      E: 'northstar:lunar_sapphire_crystal',
    })
    .id('createdelightcore:mbd2/electrolyzer');
  event
    .shaped('createdelightcore:sprinkler', [' A ', 'ABA', ' A '], {
      A: 'create:fluid_pipe',
      B: 'create:fluid_tank',
    })
    .id('createdelightcore:sprinkler');
  event
    .shaped('createdelightcore:greenhouse_builder', ['ABA', 'CDC', 'ABA'], {
      A: '#c:glass_blocks/colorless',
      B: 'create:iron_sheet',
      C: 'create:andesite_casing',
      D: 'create:schematicannon',
    })
    .id('createdelightcore:greenhouse_builder');
  event
    .shaped('createdelightcore:sell_bin', ['ABA', 'ACA', 'AAA'], {
      A: '#minecraft:planks',
      B: '#c:chests',
      C: 'lightmanscurrency:trading_core',
    })
    .id('createdelightcore:sell_bin');
  event
    .shaped('createdelightcore:order_deliverer_item', ['AB ', 'BC '], {
      A: 'createdelightcore:unopened_order',
      B: 'lightmanscurrency:trading_core',
      C: '#c:chests',
    })
    .id('createdelightcore:order_deliverer_item');

  // 1.21 用原版 crafter 取代已移除的 Quark crafter。
  // 本地无 kubejs-create，改为等价 Create JSON。
  event
    .custom({
      type: 'create:mechanical_crafting',
      accept_mirrored: true,
      key: {
        A: { item: 'create:brass_sheet' },
        B: { item: 'minecraft:crafter' },
        C: { item: 'create:brass_casing' },
        D: { item: 'create:factory_gauge' },
      },
      pattern: ['AABAA', 'ABCBA', 'BCDCB', 'ABCBA', 'AABAA'],
      result: { id: 'createdelightcore:mechanical_craft_encoder' },
    })
    .id('createdelightcore:mechanical_crafting/mechanical_craft_encoder');
});
