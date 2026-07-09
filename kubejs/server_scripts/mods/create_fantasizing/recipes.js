if (
  global.hasAllMods(['create_fantasizing', 'create', 'create_sa', 'alexscaves', 'ae2', 'megacells'])
) {
  ServerEvents.recipes((event) => {
    const { create, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:create_fantasizing/${path}`;

    remove_recipes_id(event, [
      'create_fantasizing:transporter',
      'create_fantasizing:compact_hydraulic_engine',
      'create_fantasizing:compact_wind_engine',
      'create_fantasizing:sturdy_conduit',
      'create_fantasizing:sturdy_heavy_core',
      'create_fantasizing:compacting/powder_snow_to_block',
      'create_fantasizing:mixing/powder_snow',
      'create_fantasizing:mechanical_crafting/block_placer',
    ]);

    create
      .emptying(
        [Fluid.of('create_fantasizing:powder_snow', 1000), 'minecraft:bucket'],
        'minecraft:powder_snow_bucket'
      )
      .id('create:empty_minecraft_powder_snow_bucket_of_create_fantasizing_powder_snow');

    kubejs
      .shaped('create_fantasizing:sturdy_conduit', ['A', 'B', 'C'], {
        A: 'alexscaves:enigmatic_engine',
        B: 'create_sa:hydraulic_engine',
        C: 'create:sturdy_sheet',
      })
      .id(id('crafting/sturdy_conduit'));

    kubejs
      .shaped('create_fantasizing:sturdy_heavy_core', ['A', 'B', 'C'], {
        A: 'megacells:sky_steel_block',
        B: 'create_sa:heat_engine',
        C: 'create:sturdy_sheet',
      })
      .id(id('crafting/sturdy_heavy_core'));

    kubejs
      .shaped('create_fantasizing:transporter', ['A', 'B', 'C'], {
        A: 'create:brass_funnel',
        B: 'create_sa:heat_engine',
        C: 'create:brass_funnel',
      })
      .id(id('crafting/transporter'));

    create
      .sequenced_assembly(
        'create_fantasizing:compact_hydraulic_engine',
        'create_fantasizing:sturdy_conduit',
        [
          create.deploying('create_fantasizing:incomplete_compact_hydraulic_engine', [
            'create_fantasizing:incomplete_compact_hydraulic_engine',
            'alexscaves:sea_glass_shards',
          ]),
          create.filling('create_fantasizing:incomplete_compact_hydraulic_engine', [
            'create_fantasizing:incomplete_compact_hydraulic_engine',
            Fluid.water(250),
          ]),
        ]
      )
      .loops(8)
      .transitionalItem('create_fantasizing:incomplete_compact_hydraulic_engine')
      .id(id('sequenced_assembly/compact_hydraulic_engine'));

    create
      .sequenced_assembly(
        'create_fantasizing:compact_wind_engine',
        'create_fantasizing:sturdy_heavy_core',
        [
          create.deploying('create_fantasizing:incomplete_compact_wind_engine', [
            'create_fantasizing:incomplete_compact_wind_engine',
            Ingredient.of('#c:gems/fluix'),
          ]),
          create.filling('create_fantasizing:incomplete_compact_wind_engine', [
            'create_fantasizing:incomplete_compact_wind_engine',
            Fluid.of('createdelightcore:spent_liquor', 250),
          ]),
        ]
      )
      .loops(8)
      .transitionalItem('create_fantasizing:incomplete_compact_wind_engine')
      .id(id('sequenced_assembly/compact_wind_engine'));
  });
}
