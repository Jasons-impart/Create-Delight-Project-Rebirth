// Core owns machine behavior. Processing uses MBD2's native KubeJS recipe schema.
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
  // Vanilla's crafter replaces the removed Quark crafter in 1.21.
  event.recipes.create
    .mechanical_crafting(
      'createdelightcore:mechanical_craft_encoder',
      ['AABAA', 'ABCBA', 'BCDCB', 'ABCBA', 'AABAA'],
      {
        A: 'create:brass_sheet',
        B: 'minecraft:crafter',
        C: 'create:brass_casing',
        D: 'create:factory_gauge',
      }
    )
    .id('createdelightcore:mechanical_crafting/mechanical_craft_encoder');
});
