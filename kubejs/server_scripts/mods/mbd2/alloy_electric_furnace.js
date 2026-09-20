// MBD2 原生 schema；机器和配方类型在 Core 注册。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2'])) return;
  let mbd = event.recipes.createdelightcore;
  // id, 原料, 产物, 每次加工 FE（非逐 tick）。
  [
    [
      'andesite_alloy_iron',
      ['2x #c:nuggets/iron', 'minecraft:andesite'],
      '3x create:andesite_alloy',
      1000,
    ],
    [
      'andesite_alloy_zinc',
      ['2x #c:nuggets/zinc', 'minecraft:andesite'],
      '3x create:andesite_alloy',
      1000,
    ],
    [
      'azure_neodymium',
      ['2x #c:ingots/iron', '2x alexscavesup:raw_azure_neodymium'],
      'alexscavesup:azure_neodymium_ingot',
      2000,
    ],
    ['brass', ['#c:ingots/copper', '#c:ingots/zinc'], '2x create:brass_ingot', 2500],
    ['bronze', ['3x #c:ingots/copper', '#c:ingots/tin'], '4x createdelightcore:bronze_ingot', 2500],
    ['copper', ['#c:dusts/copper'], 'minecraft:copper_ingot', 1000],
    ['electrum', ['#c:ingots/gold', '#c:ingots/silver'], '2x createaddition:electrum_ingot', 2500],
    ['gold', ['#c:dusts/gold'], 'minecraft:gold_ingot', 1000],
    ['iron', ['#c:dusts/iron'], 'minecraft:iron_ingot', 1000],
    [
      'martian_steel',
      ['#c:raw_materials/martian_iron_ore', '#c:ingots/titanium'],
      '2x northstar:martian_steel_ingot',
      6000,
    ],
    [
      'netherite',
      ['3x #c:ingots/gold', '3x minecraft:netherite_scrap'],
      'minecraft:netherite_ingot',
      3000,
    ],
    ['obdurium', ['3x #c:ingots/steel', '2x #c:ingots/tungsten'], '5x #c:ingots/obdurium', 4000],
    [
      'scarlet_neodymium',
      ['2x #c:ingots/iron', '2x alexscavesup:raw_scarlet_neodymium'],
      'alexscavesup:scarlet_neodymium_ingot',
      2000,
    ],
    ['silver', ['#c:dusts/silver'], 'iceandfire:silver_ingot', 1000],
    [
      'steel',
      ['3x #c:ingots/iron', 'createmetallurgy:coke'],
      '3x createmetallurgy:steel_ingot',
      3000,
    ],
    ['tin', ['#c:dusts/tin'], 'createdelightcore:tin_ingot', 1000],
    ['titanium', ['#c:dusts/titanium'], 'northstar:titanium_ingot', 3000],
    ['tungsten', ['#c:dusts/tungsten'], 'createmetallurgy:tungsten_ingot', 3000],
    [
      'void_steel',
      ['#c:ingots/steel', '#c:dusts/ender_pearl'],
      'createutilities:void_steel_ingot',
      4000,
    ],
    ['zinc', ['#c:dusts/zinc'], 'create:zinc_ingot', 1000],
  ].forEach(([name, inputs, output, energy]) => {
    mbd
      .alloy_electric_furnace()
      .inputItems(inputs)
      .outputItems(output)
      .inputFE(energy)
      .duration(100)
      .id(`createdelightcore:alloy_electric_furnace/${name}`);
  });
});
