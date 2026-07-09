if (global.hasAllMods(['createcafe', 'create', 'vintageimprovements', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const { create, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:createcafe/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    [
      'createcafe:mixing/sugar_melting',
      'createcafe:filling/tamarind_tea_filling',
      'createcafe:filling/lavender_tea_filling',
      'createcafe:filling/aloe_tea_filling',
      'createcafe:filling/blackberry_tea_filling',
      'createcafe:filling/guava_tea_filling',
      'createcafe:filling/passionfruit_tea_filling',
      'createcafe:filling/redlove_tea_filling',
      'createcafe:filling/apricot_tea_filling',
      'createcafe:filling/barberry_tea_filling',
      'createcafe:filling/jackfruit_tea_filling',
      'createcafe:filling/gooseberry_tea_filling',
      'createcafe:filling/mandarin_tea_filling',
      'createcafe:filling/starfruit_tea_filling',
      'createcafe:filling/dragonfruit_tea_filling',
      'createcafe:filling/papaya_tea_filling',
      'createcafe:filling/coconut_tea_filling',
      'createcafe:filling/grapefruit_tea_filling',
      'createcafe:filling/mana_tea_filling',
      'createcafe:filling/pomelo_tea_filling',
      'createcafe:filling/citron_tea_filling',
      'createcafe:filling/raspberry_tea_filling',
      'createcafe:filling/yucca_tea_filling',
      'createcafe:filling/plum_tea_filling',
      'createcafe:filling/coffee/banana_iced_coffee_filling',
      'createcafe:filling/coffee/caramel_iced_coffee_filling',
      'createcafe:filling/coffee/mint_iced_coffee_filling',
      'createcafe:filling/coffee/strawberry_iced_coffee_filling',
      'createcafe:filling/coffee/vanilla_iced_coffee_filling',
      'createcafe:sequenced_assembly/oreo_assembling',
      'createcafe:milling/oreo_milling',
      'createcafe:crushing/oreo_crushing',
      'createcafe:mixing/raw_boba_to_boba_mixing',
    ].forEach(removeIfPresent);

    create
      .mixing(Fluid.of('createdelightcore:base_syrup', 125), 'minecraft:sugar')
      .heated()
      .id(id('mixing/base_syrup_from_sugar'));

    vintageimprovements
      .vacuumizing('minecraft:sugar', Fluid.of('createdelightcore:base_syrup', 125))
      .id(id('vacuumizing/base_syrup_to_sugar'));

    create
      .compacting('createdelightcore:base_syrup', Fluid.of('createdelightcore:base_syrup', 1000))
      .id(id('compacting/base_syrup_block'));

    [
      ['vanilla', 'createdelightcore:vanilla_syrup', 'neapolitan:dried_vanilla_pods'],
      ['banana', 'createdelightcore:banana_syrup', 'neapolitan:banana'],
      ['strawberry', 'createdelightcore:strawberry_syrup', 'neapolitan:strawberries'],
      ['mint', 'createdelightcore:mint_syrup', 'neapolitan:mint_leaves'],
    ].forEach((syrup) => {
      const name = syrup[0];
      const fluid = syrup[1];
      const ingredient = syrup[2];

      create
        .mixing(Fluid.of(fluid, 250), [Fluid.of('createdelightcore:base_syrup', 250), ingredient])
        .heated()
        .id(id(`mixing/syrups/${name}_syrup`));

      create.compacting(fluid, Fluid.of(fluid, 1000)).id(id(`compacting/${name}_syrup_block`));
    });

    create
      .mixing('createcafe:boba', [
        'createcafe:raw_boba',
        Fluid.of('createdelightcore:base_syrup', 250),
      ])
      .heated()
      .id(id('mixing/boba'));

    [
      ['vanilla', 'createcafe:vanilla_iced_coffee', 'createdelightcore:vanilla_syrup'],
      ['strawberry', 'createcafe:strawberry_iced_coffee', 'createdelightcore:strawberry_syrup'],
      ['mint', 'createcafe:mint_iced_coffee', 'createdelightcore:mint_syrup'],
      ['banana', 'createcafe:banana_iced_coffee', 'createdelightcore:banana_syrup'],
    ].forEach((coffee) => {
      const name = coffee[0];
      const output = coffee[1];
      const fluid = coffee[2];

      create
        .filling(output, ['createcafe:iced_coffee', Fluid.of(fluid, 250)])
        .id(id(`filling/coffee/${name}_iced_coffee`));
    });

    create
      .mixing(Fluid.of('createdelightcore:filling', 1000), [
        Fluid.of('createdelightcore:base_syrup', 1000),
        'bakeries:foamed_cream',
      ])
      .heated()
      .id(id('mixing/oreo_filling'));

    event
      .custom({
        type: 'create:sequenced_assembly',
        ingredient: {
          item: 'createcafe:oreo_half',
        },
        transitional_item: {
          id: 'createcafe:oreo_incomplete',
        },
        sequence: [
          {
            type: 'create:filling',
            ingredients: [
              {
                item: 'createcafe:oreo_incomplete',
              },
              {
                type: 'neoforge:single',
                fluid: 'createdelightcore:filling',
                amount: 250,
              },
            ],
            results: [
              {
                id: 'createcafe:oreo_incomplete',
              },
            ],
          },
          {
            type: 'create:deploying',
            ingredients: [
              {
                item: 'createcafe:oreo_incomplete',
              },
              {
                item: 'createcafe:oreo_half',
              },
            ],
            results: [
              {
                id: 'createcafe:oreo',
              },
            ],
          },
        ],
        results: [
          {
            id: 'createcafe:oreo',
            count: 1,
          },
        ],
        loops: 1,
      })
      .id(id('sequenced_assembly/oreo_assembling'));

    create
      .milling(
        ['2x createcafe:oreo_crushed', CreateItem.of('createcafe:oreo_crushed', 0.25)],
        'createcafe:oreo'
      )
      .id(id('milling/oreo'));
    create
      .crushing(
        ['2x createcafe:oreo_crushed', CreateItem.of('createcafe:oreo_crushed', 0.25)],
        'createcafe:oreo'
      )
      .id(id('crushing/oreo'));

    create.milling('createcafe:oreo_crushed', 'createcafe:oreo_half').id(id('milling/oreo_half'));
  });
}
