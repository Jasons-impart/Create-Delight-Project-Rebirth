if (
  global.hasAllMods([
    'createdieselgenerators',
    'create',
    'createaddition',
    'createdeco',
    'vintageimprovements',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, createdieselgenerators, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:createdieselgenerators/${path}`;
    const fermenting = (path, results, ingredients, processingTime, heatRequirement) => {
      const basinRecipe = createdieselgenerators
        .basin_fermenting(results, ingredients)
        .processingTime(processingTime || 100)
        .id(id(`basin_fermenting/${path}`));
      const bulkRecipe = createdieselgenerators
        .bulk_fermenting(results, ingredients)
        .processingTime(Math.floor((processingTime || 100) / 2))
        .id(id(`bulk_fermenting/${path}`));

      if (heatRequirement) {
        basinRecipe.heatRequirement(heatRequirement);
        bulkRecipe.heatRequirement(heatRequirement);
      }
    };

    remove_recipes_type(event, [
      'createdieselgenerators:compression_molding',
      'createdieselgenerators:casting',
      'createdieselgenerators:hammering',
      'createdieselgenerators:wire_cutting',
    ]);
    remove_recipes_id(event, [
      'createdieselgenerators:crafting/diesel_engine',
      'createdieselgenerators:compacting/plant_oil',
      'createdieselgenerators:basin_fermenting/dough',
      'createdieselgenerators:crafting/burner',
      'createdieselgenerators:cutting/bar_mold',
      'createdieselgenerators:cutting/chain_mold',
      'createdieselgenerators:cutting/bowl_mold',
      'createdieselgenerators:cutting/lines_mold',
      'createdieselgenerators:basin_fermenting/fermented_spider_eye',
      'createdieselgenerators:crafting/wire_cutters',
      'createdieselgenerators:crafting/hammer',
      'createdieselgenerators:crafting/huge_diesel_engine',
      'createdieselgenerators:crafting/large_diesel_engine',
      'createdieselgenerators:crushing/wood_chip_logs',
      'createdieselgenerators:crafting/distillation_controller',
      'createdieselgenerators:crafting/andesite_girder',
      'createdieselgenerators:distillation/crude_oil',
      'createdieselgenerators:distillation/superheated_crude_oil',
    ]);

    if (!event.findRecipeIds('createdieselgenerators:crafting/engine_piston_from_rods').isEmpty()) {
      event.remove({ id: 'createdieselgenerators:crafting/engine_piston_from_rods' });
    }

    remove_recipes_id(event, [
      'createdieselgenerators:mechanical_crafting/chemcial_sprayer',
      'createdieselgenerators:deploying/chemical_sprayer_lighter',
      'createdieselgenerators:crafting/chemical_turret',
      'createdieselgenerators:crafting/chemical_turret_lighter',
    ]);

    create
      .crushing(
        [
          '31x createdieselgenerators:wood_chip',
          CreateItem.of('createdieselgenerators:wood_chip', 0.5),
          CreateItem.of('farmersdelight:tree_bark', 0.75),
        ],
        Ingredient.of('#minecraft:logs')
      )
      .id(id('crushing/wood_chip_logs_with_bark'));

    event.replaceInput(
      { mod: 'createdieselgenerators', not: { id: 'createdieselgenerators:crafting/basin_lid' } },
      'create:andesite_alloy',
      Ingredient.of('#c:ingots/steel')
    );
    event.replaceInput(
      { id: 'createdieselgenerators:crafting/basin_lid' },
      'create:andesite_alloy',
      'createdeco:industrial_iron_ingot'
    );
    event.replaceInput(
      { id: 'createdieselgenerators:basin_fermenting/fermentable' },
      'minecraft:bone_meal',
      'createdelightcore:dry_yeast'
    );
    event.replaceInput(
      { id: 'createdieselgenerators:bulk_fermenting/fermentable' },
      'minecraft:bone_meal',
      'createdelightcore:dry_yeast'
    );
    event.replaceInput(
      { id: 'createdieselgenerators:crafting/oil_barrel' },
      'create:iron_sheet',
      'createdelightcore:steel_sheet'
    );

    fermenting('biomass', Fluid.of('createdieselgenerators:ethanol', 250), [
      'createaddition:biomass',
      'createdelightcore:dry_yeast',
    ]);
    fermenting(
      'fermented_spider_eye',
      [Fluid.of('createdieselgenerators:ethanol', 100), 'minecraft:fermented_spider_eye'],
      ['minecraft:spider_eye', 'minecraft:sugar', 'createdelightcore:dry_yeast', Fluid.water(100)]
    );
    fermenting(
      'coal_sulfur',
      ['vintageimprovements:sulfur_chunk', CreateItem.of('vintageimprovements:sulfur_chunk', 0.25)],
      Ingredient.of('#minecraft:coals'),
      100,
      'heated'
    );

    kubejs
      .shaped('9x createdieselgenerators:distillation_controller', ['BBB', 'PCP', 'AIA'], {
        A: Ingredient.of('#c:ingots/steel'),
        B: Ingredient.of('#c:plates/steel'),
        I: Ingredient.of('#c:plates/iron'),
        C: 'minecraft:clock',
        P: 'create:fluid_pipe',
      })
      .id(id('crafting/distillation_controller'));

    create
      .sequenced_assembly(
        'createdieselgenerators:diesel_engine',
        'minecraft:polished_blackstone_slab',
        [
          create.deploying('createdelightcore:incomplete_diesel_engine', [
            'createdelightcore:incomplete_diesel_engine',
            Ingredient.of('#c:storage_blocks/bronze'),
          ]),
          create.deploying('createdelightcore:incomplete_diesel_engine', [
            'createdelightcore:incomplete_diesel_engine',
            'createdieselgenerators:engine_piston',
          ]),
          create.deploying('createdelightcore:incomplete_diesel_engine', [
            'createdelightcore:incomplete_diesel_engine',
            'createdieselgenerators:engine_piston',
          ]),
          create.deploying('createdelightcore:incomplete_diesel_engine', [
            'createdelightcore:incomplete_diesel_engine',
            'create:shaft',
          ]),
        ]
      )
      .transitionalItem('createdelightcore:incomplete_diesel_engine')
      .loops(1)
      .id(id('sequenced_assembly/diesel_engine'));

    create
      .sequenced_assembly(
        'createdieselgenerators:large_diesel_engine',
        'createdieselgenerators:diesel_engine',
        [
          create.deploying('createdelightcore:incomplete_large_diesel_engine', [
            'createdelightcore:incomplete_large_diesel_engine',
            Ingredient.of('#c:plates/bronze'),
          ]),
          create.pressing(
            'createdelightcore:incomplete_large_diesel_engine',
            'createdelightcore:incomplete_large_diesel_engine'
          ),
        ]
      )
      .transitionalItem('createdelightcore:incomplete_large_diesel_engine')
      .loops(3)
      .id(id('sequenced_assembly/large_diesel_engine'));

    create
      .sequenced_assembly(
        'createdieselgenerators:huge_diesel_engine',
        Ingredient.of('#c:storage_blocks/bronze'),
        [
          vintageimprovements.turning(
            'createdelightcore:incomplete_huge_diesel_engine',
            'createdelightcore:incomplete_huge_diesel_engine'
          ),
          create.deploying('createdelightcore:incomplete_huge_diesel_engine', [
            'createdelightcore:incomplete_huge_diesel_engine',
            'create:steam_engine',
          ]),
          create.deploying('createdelightcore:incomplete_huge_diesel_engine', [
            'createdelightcore:incomplete_huge_diesel_engine',
            Ingredient.of('#c:plates/steel'),
          ]),
          create.deploying('createdelightcore:incomplete_huge_diesel_engine', [
            'createdelightcore:incomplete_huge_diesel_engine',
            'create:steam_engine',
          ]),
          create.deploying('createdelightcore:incomplete_huge_diesel_engine', [
            'createdelightcore:incomplete_huge_diesel_engine',
            Ingredient.of('#c:plates/steel'),
          ]),
          create.pressing(
            'createdelightcore:incomplete_huge_diesel_engine',
            'createdelightcore:incomplete_huge_diesel_engine'
          ),
        ]
      )
      .transitionalItem('createdelightcore:incomplete_huge_diesel_engine')
      .loops(1)
      .id(id('sequenced_assembly/huge_diesel_engine'));

    vintageimprovements
      .turning('3x createdieselgenerators:oil_barrel', Ingredient.of('#c:storage_blocks/steel'))
      .id(id('turning/oil_barrel'));

    event
      .custom({
        type: 'create:compacting',
        ingredients: [
          {
            type: 'neoforge:difference',
            base: {
              tag: 'c:seeds',
            },
            subtracted: {
              item: 'youkaishomecoming:soybean',
            },
          },
        ],
        results: [
          {
            id: 'createdieselgenerators:plant_oil',
            amount: 100,
          },
        ],
      })
      .id(id('compacting/plant_oil'));

    create
      .compacting(Fluid.of('createdieselgenerators:plant_oil', 500), [
        '2x vintagedelight:roasted_peanut',
      ])
      .id(id('compacting/plant_oil_from_roasted_peanut'));

    create
      .sequenced_assembly('createdieselgenerators:sheet_metal_panel', 'create:iron_sheet', [
        vintageimprovements.hammering('create:iron_sheet', 'create:iron_sheet'),
      ])
      .transitionalItem('create:iron_sheet')
      .loops(1)
      .id(id('sequenced_assembly/sheet_metal_panel'));

    kubejs
      .shapeless('2x createdieselgenerators:andesite_girder', [
        'create:andesite_alloy',
        'create:metal_girder',
      ])
      .id(id('crafting/andesite_girder'));

    kubejs
      .shaped('minecraft:chest', ['AAA', 'A A', 'AAA'], {
        A: 'createdieselgenerators:chip_wood_block',
      })
      .id(id('crafting/chip_wood_chest'));
    kubejs
      .shaped('4x minecraft:chest', ['AAA', 'A A', 'AAA'], {
        A: 'createdieselgenerators:chip_wood_beam',
      })
      .id(id('crafting/chip_wood_chest_4x'));
  });
}
