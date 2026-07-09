if (
  global.hasAllMods([
    'supplementaries',
    'create',
    'create_enchantment_industry',
    'createdieselgenerators',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:supplementaries/${path}`;

    remove_recipes_id(event, ['supplementaries:lumisene_bottle']);
    remove_recipes_output(event, ['supplementaries:sugar_cube']);

    create
      .sequenced_assembly('supplementaries:antique_ink', 'minecraft:glass_bottle', [
        create.filling('minecraft:glass_bottle', [
          'minecraft:glass_bottle',
          Fluid.of('create_enchantment_industry:ink', 1000),
        ]),
        create.deploying('minecraft:glass_bottle', ['minecraft:glass_bottle', '#minecraft:planks']),
      ])
      .transitionalItem('minecraft:glass_bottle')
      .loops(1)
      .id(id('sequenced_assembly/antique_ink'));

    create
      .mixing(Fluid.of('supplementaries:lumisene', 100), [
        Fluid.of('minecraft:water', 90),
        Fluid.of('createdelightcore:fuel_mixtures', 10),
      ])
      .id(id('mixing/lumisene_from_fuel_mixtures'));

    create
      .filling('supplementaries:lumisene_bottle', [
        'minecraft:glass_bottle',
        Fluid.of('supplementaries:lumisene', 250),
      ])
      .id(id('filling/lumisene_bottle'));

    create
      .emptying(
        ['minecraft:glass_bottle', Fluid.of('supplementaries:lumisene', 250)],
        'supplementaries:lumisene_bottle'
      )
      .id(id('emptying/lumisene_bottle'));

    create
      .emptying(
        ['minecraft:bucket', Fluid.of('supplementaries:lumisene', 1000)],
        'supplementaries:lumisene_bucket'
      )
      .id(id('emptying/lumisene_bucket'));

    kubejs
      .shapeless('supplementaries:lumisene_bucket', [
        'minecraft:bucket',
        '4x supplementaries:lumisene_bottle',
      ])
      .replaceIngredient('supplementaries:lumisene_bottle', 'minecraft:glass_bottle')
      .id(id('crafting/lumisene_bucket'));

    create
      .sequenced_assembly('supplementaries:bomb_blue', 'supplementaries:bomb', [
        create.filling('supplementaries:bomb', [
          'supplementaries:bomb',
          Fluid.of('supplementaries:lumisene', 100),
        ]),
        create.deploying('supplementaries:bomb', ['supplementaries:bomb', 'minecraft:string']),
      ])
      .transitionalItem('supplementaries:bomb')
      .loops(2)
      .id(id('sequenced_assembly/bomb_blue'));

    create
      .mixing(Fluid.of('supplementaries:lumisene', 100), [
        'minecraft:gunpowder',
        Fluid.of('createdieselgenerators:plant_oil', 100),
      ])
      .id(id('mixing/lumisene_from_plant_oil'));

    create
      .mixing(Fluid.of('supplementaries:lumisene', 100), [
        'minecraft:gunpowder',
        Fluid.of('createdieselgenerators:ethanol', 100),
      ])
      .id(id('mixing/lumisene_from_ethanol'));
  });
}
