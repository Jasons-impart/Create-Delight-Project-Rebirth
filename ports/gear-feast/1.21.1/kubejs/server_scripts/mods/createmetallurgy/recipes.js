if (
  global.hasAllMods([
    'createmetallurgy',
    'create',
    'vintageimprovements',
    'createfluidstuffs',
    'createdeco',
    'createaddition',
    'createdelightcore',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, createmetallurgy, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:createmetallurgy/${path}`;
    const oreDustByproducts = {
      'createmetallurgy:iron_dust': ['minecraft:redstone', 0.75],
      'createmetallurgy:copper_dust': ['minecraft:clay_ball', 0.5],
      'createmetallurgy:zinc_dust': ['minecraft:gunpowder', 0.5],
      'createmetallurgy:gold_dust': ['minecraft:quartz', 0.5],
      'createmetallurgy:tungsten_dust': ['2x minecraft:gold_nugget', 0.5],
      'createdelightcore:tin_dust': ['minecraft:glowstone_dust', 0.5],
      'createdelightcore:silver_dust': ['vintageimprovements:sulfur_chunk', 0.5],
    };
    const oreDustLines = [
      {
        dirtyDust: 'createmetallurgy:dirty_copper_dust',
        dust: 'createmetallurgy:copper_dust',
        crushedRaw: 'create:crushed_raw_copper',
        raw: 'minecraft:raw_copper',
        nugget: 'create:copper_nugget',
      },
      {
        dirtyDust: 'createmetallurgy:dirty_iron_dust',
        dust: 'createmetallurgy:iron_dust',
        crushedRaw: 'create:crushed_raw_iron',
        raw: 'minecraft:raw_iron',
        nugget: 'minecraft:iron_nugget',
      },
      {
        dirtyDust: 'createmetallurgy:dirty_gold_dust',
        dust: 'createmetallurgy:gold_dust',
        crushedRaw: 'create:crushed_raw_gold',
        raw: 'minecraft:raw_gold',
        nugget: 'minecraft:gold_nugget',
      },
      {
        dirtyDust: 'createmetallurgy:dirty_tungsten_dust',
        dust: 'createmetallurgy:tungsten_dust',
        crushedRaw: 'createmetallurgy:crushed_raw_tungsten',
        raw: 'createmetallurgy:raw_tungsten',
        nugget: 'createmetallurgy:tungsten_nugget',
      },
      {
        dirtyDust: 'createmetallurgy:dirty_zinc_dust',
        dust: 'createmetallurgy:zinc_dust',
        crushedRaw: 'create:crushed_raw_zinc',
        raw: 'create:raw_zinc',
        nugget: 'create:zinc_nugget',
      },
      {
        dirtyDust: 'createdelightcore:dirty_tin_dust',
        dust: 'createdelightcore:tin_dust',
        crushedRaw: 'create:crushed_raw_tin',
        raw: 'createdelightcore:raw_tin',
        nugget: 'createdelightcore:tin_nugget',
      },
      {
        dirtyDust: 'createdelightcore:dirty_silver_dust',
        dust: 'createdelightcore:silver_dust',
        crushedRaw: 'create:crushed_raw_silver',
        raw: 'iceandfire:raw_silver',
        nugget: 'iceandfire:silver_nugget',
      },
    ];
    const oreDustLine = (line) => {
      const byproduct = oreDustByproducts[line.dust];
      const path = (item) => item.split(':')[1];

      vintageimprovements
        .pressurizing(
          [Item.of(line.dirtyDust, 2), CreateItem.of(Item.of(line.dirtyDust), 0.66)],
          [Fluid.of('vintageimprovements:sulfuric_acid', 100), line.raw]
        )
        .superheated()
        .id(id(`pressurizing/${path(line.dirtyDust)}`));

      vintageimprovements
        .centrifugation(
          [
            line.dust,
            CreateItem.of(line.dust, 0.25),
            CreateItem.of(Item.of(byproduct[0]), byproduct[1]),
          ],
          line.dirtyDust
        )
        .id(id(`centrifugation/${path(line.dirtyDust)}`));

      vintageimprovements
        .centrifugation(
          [Item.of(line.nugget, 12), CreateItem.of(Item.of(line.nugget, 6), 0.25)],
          line.crushedRaw
        )
        .id(id(`centrifugation/${path(line.nugget)}`));

      vintageimprovements
        .vibrating(Item.of(line.nugget, 18), line.crushedRaw)
        .id(id(`vibrating/${path(line.nugget)}`));

      create
        .splashing(
          [Item.of(line.nugget, 9), CreateItem.of(Item.of(byproduct[0]), byproduct[1])],
          line.crushedRaw
        )
        .id(id(`splashing/${path(line.crushedRaw)}`));

      create
        .splashing([line.dust, CreateItem.of(Item.of(byproduct[0]), byproduct[1])], line.dirtyDust)
        .id(id(`splashing/${path(line.dirtyDust)}`));

      if (event.findRecipeIds(`createmetallurgy:milling/${path(line.raw)}`).isEmpty()) {
        create
          .crushing([line.crushedRaw, CreateItem.of('create:experience_nugget', 0.75)], line.raw)
          .id(id(`crushing/${path(line.raw)}`));
      }

      if (event.findRecipeIds(`createmetallurgy:milling/${path(line.crushedRaw)}`).isEmpty()) {
        create
          .milling([line.dirtyDust, CreateItem.of(line.dirtyDust, 0.25)], line.crushedRaw)
          .id(id(`milling/${path(line.crushedRaw)}`));
      }
    };

    remove_recipes_id(event, [
      'createmetallurgy:sequenced_assembly/industrial_crucible',
      'createmetallurgy:crafting/content/mechanical_belt_grinder',
      'createmetallurgy:crafting/materials/sandpaper_belt',
      'createmetallurgy:crushing/raw_wolframite',
      'createmetallurgy:alloying/necromium',
      'createmetallurgy:alloying/netherite',
      'createmetallurgy:alloying/steel',
      'createmetallurgy:alloying/electrum',
      'createmetallurgy:alloying/brass',
    ]);

    event.replaceInput(
      { id: 'createmetallurgy:crafting/materials/tungsten_wire_spool' },
      'minecraft:stick',
      'createaddition:spool'
    );
    event.replaceInput(
      { id: 'createmetallurgy:crafting/materials/graphite' },
      'minecraft:coal',
      '#minecraft:coals'
    );
    event.replaceInput(
      { mod: 'createmetallurgy', not: 'createmetallurgy:alloying/obdurium' },
      'create:andesite_alloy',
      'createdeco:industrial_iron_ingot'
    );
    event.replaceInput(
      { id: 'createmetallurgy:alloying/obdurium' },
      'create:andesite_alloy',
      'createmetallurgy:steel_ingot'
    );
    event.replaceInput({ output: 'createmetallurgy:coke' }, '#c:ores/coal', '#minecraft:coals');

    oreDustLines.forEach(oreDustLine);

    event
      .shaped('createmetallurgy:sandpaper_belt', ['AAA', 'A A', 'AAA'], {
        A: '#create:sandpaper',
      })
      .id(id('crafting/materials/sandpaper_belt'));

    event
      .shapeless('createmetallurgy:refractory_mortar', [
        'minecraft:water_bucket',
        '6x #minecraft:sand',
        '2x minecraft:clay_ball',
      ])
      .replaceIngredient('minecraft:water_bucket', 'minecraft:bucket')
      .id(id('crafting/refractory_mortar'));

    createmetallurgy
      .alloying(Fluid.of('createmetallurgy:molten_netherite', 30), [
        Fluid.of('createmetallurgy:molten_gold', 90),
        'minecraft:netherite_scrap',
      ])
      .heatRequirement('superheated')
      .id(id('alloying/netherite'));

    createmetallurgy
      .alloying(Fluid.of('createmetallurgy:molten_steel', 270), [
        Fluid.of('createmetallurgy:molten_iron', 270),
        Ingredient.of('#c:coal_coke'),
      ])
      .heatRequirement('superheated')
      .id(id('alloying/steel'));

    createmetallurgy
      .alloying(Fluid.of('createmetallurgy:molten_electrum', 30), [
        Fluid.of('createmetallurgy:molten_silver', 15),
        Fluid.of('createmetallurgy:molten_gold', 15),
      ])
      .processingTime(40)
      .heatRequirement('heated')
      .id(id('alloying/electrum'));

    createmetallurgy
      .alloying(Fluid.of('createmetallurgy:molten_brass', 30), [
        Fluid.of('createmetallurgy:molten_zinc', 15),
        Fluid.of('createmetallurgy:molten_copper', 15),
      ])
      .processingTime(40)
      .heatRequirement('heated')
      .id(id('alloying/brass'));

    createmetallurgy
      .alloying(Fluid.of('createmetallurgy:molten_obdurium', 150), [
        Fluid.of('createmetallurgy:molten_steel', 90),
        Fluid.of('createmetallurgy:molten_tungsten', 60),
      ])
      .heatRequirement('superheated')
      .id(id('alloying/molten_obdurium_from_fluid'));

    create
      .mixing(Fluid.of('createmetallurgy:molten_bronze', 40), [
        Fluid.of('createmetallurgy:molten_tin', 10),
        Fluid.of('createmetallurgy:molten_copper', 30),
      ])
      .heated()
      .id(id('mixing/molten_bronze'));

    create
      .mixing(Fluid.of('createmetallurgy:molten_electrum', 30), [
        Fluid.of('createmetallurgy:molten_silver', 15),
        Fluid.of('createmetallurgy:molten_gold', 15),
      ])
      .heated()
      .id(id('mixing/molten_electrum'));

    create
      .mixing(Fluid.of('createmetallurgy:molten_brass', 30), [
        Fluid.of('createmetallurgy:molten_copper', 15),
        Fluid.of('createmetallurgy:molten_zinc', 15),
      ])
      .heated()
      .id(id('mixing/molten_brass'));

    create
      .mixing(Fluid.of('createdelightcore:molten_andesite', 270), [
        'minecraft:andesite',
        Fluid.of('createmetallurgy:molten_iron', 20),
      ])
      .heated()
      .id(id('mixing/molten_andesite_from_iron'));

    create
      .mixing(Fluid.of('createdelightcore:molten_andesite', 270), [
        'minecraft:andesite',
        Fluid.of('createmetallurgy:molten_zinc', 20),
      ])
      .heated()
      .id(id('mixing/molten_andesite_from_zinc'));

    create
      .pressing('createdelightcore:steel_sheet', 'createmetallurgy:steel_ingot')
      .id(id('pressing/steel_sheet'));
    create
      .pressing('createmetallurgy:tungsten_sheet', 'createmetallurgy:tungsten_ingot')
      .id(id('pressing/tungsten_sheet'));

    createmetallurgy
      .casting_in_table('createdelightcore:steel_sheet', [
        Fluid.of('createmetallurgy:molten_steel', 90),
        'createmetallurgy:graphite_plate_mold',
      ])
      .processingTime(100)
      .id(id('casting_in_table/steel_sheet'));

    vintageimprovements
      .pressurizing('createmetallurgy:graphite', [
        Ingredient.of('#c:coal_coke'),
        Ingredient.of('#c:coal_coke'),
        'minecraft:clay_ball',
      ])
      .superheated()
      .id(id('pressurizing/graphite'));

    create
      .sequenced_assembly(
        'createmetallurgy:industrial_crucible',
        'createfluidstuffs:multi_fluid_tank',
        [
          create.pressing(
            'createmetallurgy:incomplete_industrial_crucible',
            'createmetallurgy:incomplete_industrial_crucible'
          ),
          create.deploying('createmetallurgy:incomplete_industrial_crucible', [
            'createmetallurgy:incomplete_industrial_crucible',
            'createmetallurgy:refractory_mortar',
          ]),
          create.deploying('createmetallurgy:incomplete_industrial_crucible', [
            'createmetallurgy:incomplete_industrial_crucible',
            Ingredient.of('#c:plates/obdurium'),
          ]),
          createmetallurgy.grinding(
            'createmetallurgy:incomplete_industrial_crucible',
            'createmetallurgy:incomplete_industrial_crucible'
          ),
        ]
      )
      .loops(1)
      .transitionalItem('createmetallurgy:incomplete_industrial_crucible')
      .id(id('sequenced_assembly/industrial_crucible'));

    vintageimprovements
      .hammering('createmetallurgy:obdurium_sheet', Ingredient.of('#c:ingots/obdurium'))
      .id(id('hammering/obdurium_sheet'));
  });
}
