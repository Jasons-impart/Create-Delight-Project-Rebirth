// 源：参考包 1.20.1 kubejs/server_scripts/Custom/vanilla.js
// 1.21.1 适配：
//   - createdelight: -> createdelightcore:
//   - #forge:cobblestone -> #c:cobblestone，#forge:slimeballs -> #c:slime_balls
//   - cosmopolitan 未安装：4 条 molasses 压榨配方与对应移除项不写入
//   - make_growing_cluster 由参考包 AE2/processor&cellcasing.js 内联到此（原为跨文件函数）
//   - vintageimprovements.pressurizing / createmetallurgy.casting_in_basin 在 1.21.1 存在，签名不变
ServerEvents.recipes((e) => {
  const { vintageimprovements, create, createmetallurgy, create_new_age } = e.recipes;

  const makeGrowingCluster = (transitionItems, fluid, amount) => {
    const fluidIngredient =
      typeof fluid === 'string'
        ? fluid.startsWith('#')
          ? { fluidTag: fluid.substring(1), amount: amount, tag: {} }
          : Fluid.of(fluid, amount)
        : fluid;

    for (let index = 1; index < transitionItems.length; index++) {
      const item = transitionItems[index];
      const lastItem = transitionItems[index - 1];
      e.recipes.create
        .sequenced_assembly(item, lastItem, [create.filling(lastItem, [lastItem, fluidIngredient])])
        .loops(4)
        .transitionalItem(lastItem)
        .id(`createdelightcore:filling/${item.split(':')[1]}`);
    }
  };

  remove_recipes_output(e, ['minecraft:enchanted_golden_apple']);

  vintageimprovements
    .pressurizing('minecraft:glowstone_dust', 'minecraft:glow_berries')
    .heated()
    .id('createdelightcore:pressurizing/glowstone_dust');

  create
    .filling('minecraft:golden_apple', ['minecraft:apple', Fluid.of('createmetallurgy:molten_gold', 450)])
    .id('createdelightcore:filling/golden_apple');
  create
    .filling('minecraft:golden_carrot', ['minecraft:carrot', Fluid.of('createmetallurgy:molten_gold', 30)])
    .id('createdelightcore:filling/golden_carrot');

  createmetallurgy
    .casting_in_basin(
      'cratedelight:golden_carrot_crate',
      ['farmersdelight:carrot_crate', Fluid.of('createmetallurgy:molten_gold', 450)],
      100,
      true
    )
    .id('createdelightcore:casting_in_basin/golden_carrot_crate');

  vintageimprovements
    .pressurizing(['minecraft:deepslate'], [Fluid.lava(50), '#c:cobblestone'])
    .heated()
    .id('createdelightcore:pressurizing/deepslate');

  create
    .sequenced_assembly(
      [
        CreateItem.of('minecraft:budding_amethyst', 0.1),
        CreateItem.of('minecraft:amethyst_block', 0.9),
      ],
      'minecraft:amethyst_block',
      [
        create.filling('minecraft:amethyst_block', [
          'minecraft:amethyst_block',
          Fluid.of('createdelightcore:spent_liquor', 1000),
        ]),
        // 序列组装步骤必须是配方 JSON：energising 的 KubeJS 包装器建的是整条配方，不能当步骤用
        {
          type: 'create_new_age:energising',
          energy_needed: 20000,
          ingredients: [{ item: 'minecraft:amethyst_block' }],
          results: [{ id: 'minecraft:amethyst_block' }],
        },
      ]
    )
    .transitionalItem('minecraft:amethyst_block')
    .loops(1)
    .id('createdelightcore:sequenced_assembly/budding_amethyst_from_amethyst_block');

  makeGrowingCluster(
    [
      'minecraft:amethyst_shard',
      'minecraft:small_amethyst_bud',
      'minecraft:medium_amethyst_bud',
      'minecraft:large_amethyst_bud',
      'minecraft:amethyst_cluster',
    ],
    'minecraft:water',
    50
  );

  const iner1 = 'create_new_age:incomplete_enchanted_golden_apple';
  create
    .sequenced_assembly('minecraft:enchanted_golden_apple', 'minecraft:apple', [
      create.filling(iner1, [iner1, Fluid.of('create_enchantment_industry:experience', 120)]),
      create.deploying(iner1, [iner1, 'minecraft:gold_block']),
      create.deploying(iner1, [iner1, 'minecraft:gold_block']),
      {
        type: 'create_new_age:energising',
        energy_needed: 2000000,
        ingredients: [{ item: iner1 }],
        results: [{ id: iner1 }],
      },
    ])
    .loops(4)
    .transitionalItem(iner1)
    .id('minecraft:enchanted_golden_apple');

  vintageimprovements
    .vacuumizing('minecraft:blaze_rod', [
      'minecraft:blaze_powder',
      'minecraft:blaze_powder',
      'minecraft:blaze_powder',
      'minecraft:blaze_powder',
      'minecraft:stick',
    ])
    .id('createdelightcore:vacuumizing/blaze_rod');

  e.replaceInput({ id: 'minecraft:sticky_piston' }, 'minecraft:slime_ball', '#c:slime_balls');
});

ServerEvents.tags('minecraft:item', (e) => {
  e.add('create:upright_on_belt', [
    'minecraft:small_amethyst_bud',
    'minecraft:medium_amethyst_bud',
    'minecraft:large_amethyst_bud',
    'minecraft:amethyst_cluster',
  ]);
});
