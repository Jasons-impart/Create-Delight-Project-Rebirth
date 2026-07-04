if (global.hasAllMods(['ae2', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:ae2/crystal/${path}`;

    function addGrowingStep(result, input, fluid, amount, path) {
      create
        .sequenced_assembly(result, input, [
          create.filling(input, [input, Fluid.of(fluid, amount)]),
        ])
        .loops(4)
        .transitionalItem(input)
        .id(id(`filling/${path}`));
    }

    event.remove({ id: 'create:milling/compat/ae2/sky_stone_block' });
    event.remove({ id: 'create:mixing/compat/ae2/fluix_crystal' });

    create
      .crushing('ae2:singularity', 'create:crushing_wheel')
      .id(id('crushing/singularity_from_crushing_wheel'));

    create
      .mechanical_crafting(
        'ae2:singularity',
        [
          'AAAAAAAAA',
          'AAAAAAAAA',
          'AAAAAAAAA',
          'AAAAAAAAA',
          'AAAAAAAAA',
          'AAAAAAAAA',
          'AAAAAAAAA',
          'AAAAAAAAA',
          'AAAAAAAAA',
        ],
        {
          A: 'ae2:matter_ball',
        }
      )
      .id(id('mechanical_crafting/singularity'));

    create.milling('4x ae2:sky_dust', 'ae2:sky_stone_block').id(id('milling/sky_dust'));

    create
      .crushing(
        ['4x ae2:sky_dust', CreateItem.of(Item.of('ae2:sky_dust', 2), 0.1)],
        'ae2:sky_stone_block'
      )
      .id(id('crushing/sky_dust'));

    create
      .mixing('createdelightcore:enriched_sky_stone_block', [
        'ae2:sky_stone_block',
        Ingredient.of('#c:dusts/redstone'),
      ])
      .id(id('mixing/enriched_sky_stone_block'));

    create
      .crushing(
        [
          '4x ae2:sky_dust',
          CreateItem.of(Item.of('ae2:sky_dust', 2), 0.3),
          CreateItem.of(Item.of('ae2:sky_dust', 2), 0.3),
        ],
        'createdelightcore:enriched_sky_stone_block'
      )
      .id(id('crushing/enriched_sky_stone_block'));

    create
      .mixing(Fluid.of('createdelightcore:sky_solution', 250), [
        Fluid.of('minecraft:water', 250),
        'ae2:sky_dust',
      ])
      .id(id('mixing/sky_solution'));

    create
      .mixing(
        ['2x minecraft:redstone', Fluid.of('createdelightcore:spent_liquor', 250)],
        [Fluid.of('createdelightcore:sky_solution', 250)]
      )
      .id(id('mixing/redstone_from_sky_solution'));

    event.recipes.vintageimprovements
      .turning(Item.of('ae2:cable_anchor', 64), Ingredient.of('#c:ingots/iron'))
      .id(id('turning/cable_anchor'));

    create
      .deploying(Item.of('ae2:fluix_upgrade_smithing_template', 2), [
        'minecraft:paper',
        'ae2:fluix_crystal',
      ])
      .id(id('deploying/fluix_upgrade_smithing_template'));

    create
      .mixing('2x createdelightcore:sky_copper_ingot', [
        Ingredient.of('#c:ingots/copper'),
        'ae2:charged_certus_quartz_crystal',
        'ae2:sky_stone_block',
        Fluid.of('minecraft:lava', 250),
      ])
      .id(id('mixing/sky_copper_ingot'));

    event.recipes.ae2
      .transform(
        Item.of('createdelightcore:sky_copper_ingot', 2),
        ['#c:ingots/copper', 'ae2:charged_certus_quartz_crystal', 'ae2:sky_stone_block'],
        { type: 'fluid', tag: 'minecraft:lava' }
      )
      .id(id('transform/sky_copper_ingot'));

    addGrowingStep(
      'ae2:small_quartz_bud',
      'ae2:certus_quartz_dust',
      'createdelightcore:spent_liquor',
      50,
      'small_quartz_bud'
    );
    addGrowingStep(
      'ae2:medium_quartz_bud',
      'ae2:small_quartz_bud',
      'createdelightcore:spent_liquor',
      50,
      'medium_quartz_bud'
    );
    addGrowingStep(
      'ae2:large_quartz_bud',
      'ae2:medium_quartz_bud',
      'createdelightcore:spent_liquor',
      50,
      'large_quartz_bud'
    );
    addGrowingStep(
      'ae2:quartz_cluster',
      'ae2:large_quartz_bud',
      'createdelightcore:spent_liquor',
      50,
      'quartz_cluster'
    );

    create
      .crushing(
        ['4x ae2:certus_quartz_dust', CreateItem.of(Item.of('ae2:certus_quartz_dust', 4), 0.25)],
        'ae2:quartz_cluster'
      )
      .id(id('crushing/certus_quartz_dust'));

    create
      .mixing('16x ae2:certus_quartz_crystal', [
        Fluid.water(500),
        Ingredient.of('ae2:certus_quartz_dust').withCount(8),
        Ingredient.of('ae2:charged_certus_quartz_crystal').withCount(8),
      ])
      .id(id('mixing/certus_quartz_crystal'));

    create
      .mixing('16x ae2:fluix_crystal', [
        Fluid.water(500),
        Ingredient.of('minecraft:redstone').withCount(8),
        Ingredient.of('ae2:charged_certus_quartz_crystal').withCount(8),
        Ingredient.of('minecraft:quartz').withCount(8),
      ])
      .id(id('mixing/fluix_crystal'));

    event.recipes.vintageimprovements
      .pressurizing(
        ['4x minecraft:glowstone_dust', Fluid.of('minecraft:water', 250)],
        [Fluid.of('createdelightcore:sky_solution', 250)]
      )
      .heated()
      .id(id('pressurizing/glowstone_from_sky_solution'));

    create
      .mixing(
        ['2x minecraft:glowstone_dust', Fluid.of('minecraft:water', 250)],
        [Fluid.of('createdelightcore:sky_solution', 250)]
      )
      .heated()
      .id(id('mixing/glowstone_from_sky_solution'));
  });
}

if (global.hasAllMods(['ae2', 'create', 'megacells'])) {
  ServerEvents.recipes((event) => {
    event.recipes.create
      .mixing('16x megacells:sky_steel_ingot', [
        Ingredient.of('#c:ingots/iron').withCount(8),
        Ingredient.of('ae2:charged_certus_quartz_crystal').withCount(8),
        Ingredient.of('ae2:sky_stone_block').withCount(8),
        Fluid.of('minecraft:lava', 500),
      ])
      .id('createdelightcore:ae2/megacells/crystal/mixing/sky_steel_ingot');
  });
}

if (global.hasAllMods(['ae2', 'createmetallurgy', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    event.recipes.vintageimprovements
      .pressurizing('create:polished_rose_quartz', [
        Fluid.of('createmetallurgy:molten_iron', 90),
        'ae2:certus_quartz_crystal',
      ])
      .secondaryFluidInput(0)
      .id('createdelightcore:ae2/crystal/pressurizing/polished_rose_quartz');
  });
}
