if (global.hasAllMods(['bakeries', 'create', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const { bakeries, create, createaddition, kubejs, minecraft, vintageimprovements } =
      event.recipes;
    const id = (path) => `createdelightcore:bakeries/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const asIngredient = (ingredient) =>
      typeof ingredient === 'string' && ingredient.startsWith('#')
        ? Ingredient.of(ingredient)
        : ingredient;
    const repeatedIngredient = (ingredient, count) => {
      const ingredients = [];
      for (let i = 0; i < count; i++) {
        ingredients.push(asIngredient(ingredient));
      }
      return ingredients;
    };
    const oven = (input, output, time, min, perfect, max) => {
      bakeries.oven(output, input, time, min, perfect, max).id(id(`oven/${output.split(':')[1]}`));
    };
    const breadKnife = (input, output) => {
      const outputId = String(output).replace(/^\d+x\s+/, '');

      bakeries.bread_knife([output], input).id(id(`bread_knife/${outputId.split(':')[1]}`));
      create.cutting(output, input).id(id(`cutting/${outputId.split(':')[1]}`));
    };

    [
      'farmersdelight:wheat_dough_from_eggs',
      'create:crafting/appliances/dough',
      'create:splashing/wheat_flour',
      'create:mixing/dough_by_mixing',
      'bakeries:blender/bottle_cream',
      'bakeries:blender/butter_cube',
      'bakeries:bottle_milk',
      'bakeries:butter_cube',
      'bakeries:salt',
      'bakeries:pineapple_bun_dough',
      'bakeries:salt_croissant_dough',
      'bakeries:berry_bread_dough',
      'bakeries:mould_toast_dough',
      'bakeries:brown_sugar_roll_dough',
      'bakeries:meat_floss_bread_roll',
      'bakeries:focaccia',
      'bakeries:integration/create/mixing/cheese_cream',
      'bakeries:bagel_filled_sauce',
      'bakeries:cream_pumpkin_pie_dough',
      'bakeries:integration/create/mixing/foamed_cream',
      'bakeries:integration/create/mixing/butter_cube',
      'bakeries:soak_coffee_cut_cake_base',
      'bakeries:paper_cup',
      'bakeries:integration/create/milling/flour',
      'bakeries:integration/create/mixing/whole_wheat_dough',
      'bakeries:integration/create/mixing/sweet_dough',
      'bakeries:integration/create/mixing/meat_floss',
      'bakeries:integration/create/mixing/honey_butter',
      'bakeries:compat/create/mixing/cheese_cream',
      'bakeries:compat/create/mixing/foamed_cream',
      'bakeries:compat/create/mixing/butter_cube',
      'bakeries:compat/create/mixing/whole_wheat_dough',
      'bakeries:compat/create/mixing/sweet_dough',
      'bakeries:compat/create/mixing/meat_floss',
      'bakeries:compat/create/mixing/honey_butter',
      'bakeries:compat/create/milling/flour',
      'bakeries:compat/create/bagel_dough',
      'bakeries:compat/create/whole_wheat_bagel_dough',
      'bakeries:compat/create/cutting/sliced_toast',
      'bakeries:compat/create/cutting/sliced_cheese_cocoa_toast',
      'bakeries:compat/create/cutting/country_bread_slice',
      'bakeries:compat/create/cutting/sliced_pound_cake',
      'bakeries:compat/create/cutting/cut_cake_base',
      'bakeries:blender/meat_floss',
      'bakeries:blender/mould_pound_cake_paste',
      'bakeries:blender/mould_basque_cake_paste',
      'bakeries:cheese_cocoa_toast_dough',
      'bakeries:integration/create/mixing/crispy_dough',
      'bakeries:bread_knife/sliced_toast',
      'bakeries:bread_knife/sliced_cheese_cocoa_toast',
      'bakeries:bread_knife/country_bread_slice',
      'bakeries:oven/bagel',
      'bakeries:oven/whole_wheat_bagel',
      'bakeries:oven/round_bread',
      'bakeries:oven/baguette',
      'bakeries:oven/croissant',
      'bakeries:oven/salt_croissant',
      'bakeries:oven/brown_sugar_roll',
      'bakeries:oven/pineapple_bun',
      'bakeries:oven/country_bread',
      'bakeries:oven/ciabatta',
      'bakeries:oven/toast',
      'bakeries:oven/cheese_cocoa_toast',
      'bakeries:oven/focaccia',
      'bakeries:oven/cup_cake',
      'bakeries:oven/rice_bread',
      'bakeries:oven/egg_tart',
      'bakeries:oven/coffee_bean',
      'bakeries:dough_crafting_table/bagel_dough',
      'bakeries:dough_crafting_table/bagel_dough__fermentation_gameplay',
      'bakeries:dough_crafting_table/baguette_dough',
      'bakeries:dough_crafting_table/baguette_dough__fermentation_gameplay',
      'bakeries:dough_crafting_table/ciabatta_dough',
      'bakeries:dough_crafting_table/ciabatta_dough__fermentation_gameplay',
      'bakeries:dough_crafting_table/country_bread_dough',
      'bakeries:dough_crafting_table/country_bread_dough__fermentation_gameplay',
      'bakeries:dough_crafting_table/croissant_dough',
      'bakeries:dough_crafting_table/round_bread_dough',
      'bakeries:dough_crafting_table/round_bread_dough__fermentation_gameplay',
      'bakeries:dough_crafting_table/whole_wheat_bagel_dough',
      'bakeries:dough_crafting_table/whole_wheat_bagel_dough__fermentation_gameplay',
    ].forEach(removeIfPresent);

    event.remove({
      output: [
        'vintagedelight:oat_dough',
        'bakeries:sweet_dough',
        'bakeries:whole_wheat_dough',
        'bakeries:whole_wheat_flour',
        'bakeries:whole_wheat_flour_bag',
        'bakeries:salted_dough',
        'bakeries:pastry',
        'bakeries:cocoa_dough',
        'bakeries:cocoa_powder',
        'bakeries:olive_oil',
        'bakeries:ground_coffee',
        'bakeries:coffee_bean',
      ],
    });

    event.replaceInput({ id: 'bakeries:menu' }, 'minecraft:gray_wool', 'minecraft:item_frame');
    event.replaceInput({}, 'bakeries:bottle_cream', 'bakeries:foamed_cream');
    event.replaceInput({}, 'bakeries:cake_paste_bucket', 'createdelightcore:cake_batter_bucket');

    create
      .mixing('4x bakeries:honey_butter', [
        Fluid.of('create:honey', 250),
        '2x createdelightcore:butter',
      ])
      .id(id('mixing/honey_butter'));

    if (global.hasMod('createdeco')) {
      vintageimprovements
        .curving('bakeries:mould', 'createdeco:industrial_iron_sheet')
        .mode(4)
        .id(id('curving/mould'));
    }

    if (global.hasMod('vintagedelight')) {
      kubejs
        .shapeless('vintagedelight:salt_dust', 'bakeries:raw_salt_block')
        .id(id('crafting/salt_dust'));
    }

    create
      .milling(CreateItem.of('bakeries:flour', 0.85), 'create:wheat_flour')
      .id(id('milling/flour'));

    vintageimprovements
      .vacuumizing(
        [Fluid.water(200), 'createdelightcore:dry_yeast'],
        Fluid.of('createdelightcore:yeast', 250)
      )
      .secondaryFluidOutput(0)
      .id(id('vacuumizing/dry_yeast'));
    create
      .mixing(Fluid.of('createdelightcore:yeast', 250), [
        Fluid.water(200),
        'createdelightcore:dry_yeast',
      ])
      .id(id('mixing/yeast_fluid'));
    create
      .filling('bakeries:bottle_yeast', [
        'minecraft:glass_bottle',
        Fluid.of('createdelightcore:yeast', 250),
      ])
      .id(id('filling/bottle_yeast'));
    create
      .emptying(
        ['minecraft:glass_bottle', Fluid.of('createdelightcore:yeast', 250)],
        'bakeries:bottle_yeast'
      )
      .id(id('emptying/bottle_yeast'));

    if (global.hasMod('createdieselgenerators')) {
      const { createdieselgenerators } = event.recipes;
      const fermenting = (path, results, ingredients, processingTime) => {
        createdieselgenerators
          .basin_fermenting(results, ingredients)
          .processingTime(processingTime || 100)
          .id(id(`basin_fermenting/${path}`));
        createdieselgenerators
          .bulk_fermenting(results, ingredients)
          .processingTime(Math.floor((processingTime || 100) / 2))
          .id(id(`bulk_fermenting/${path}`));
      };

      fermenting(
        'yeast_from_mushrooms',
        Fluid.of('createdelightcore:yeast', 250),
        [Ingredient.of('#c:mushrooms'), 'create:wheat_flour', 'minecraft:sugar', Fluid.water(250)],
        300
      );
      fermenting(
        'yeast_from_yeast',
        Fluid.of('createdelightcore:yeast', 500),
        [Fluid.of('createdelightcore:yeast', 250), 'create:wheat_flour'],
        300
      );
      fermenting(
        'yeast_from_dry_yeast',
        Fluid.of('createdelightcore:yeast', 500),
        ['createdelightcore:dry_yeast', 'create:wheat_flour', Fluid.water(500)],
        300
      );
    }

    create
      .mixing('bakeries:whole_wheat_dough', [Fluid.water(50), 'create:wheat_flour'])
      .id(id('mixing/whole_wheat_dough'));
    create
      .splashing('bakeries:whole_wheat_dough', 'create:wheat_flour')
      .id(id('splashing/whole_wheat_dough'));

    create
      .mixing(
        '5x create:dough',
        ['createdelightcore:dry_yeast']
          .concat(repeatedIngredient('bakeries:flour', 5))
          .concat(Fluid.water(250))
      )
      .id(id('mixing/create_dough'));

    [
      ['farmersdelight:wheat_dough', 'createdelightcore:egg_yolk'],
      ['farmersdelight:wheat_dough', 'createdelightcore:artificial_egg_yolk'],
      ['bakeries:sweet_dough', 'createdelightcore:egg_yolk', 'minecraft:sugar'],
      ['bakeries:sweet_dough', 'createdelightcore:artificial_egg_yolk', 'minecraft:sugar'],
    ].forEach(([output, fluid, sugar]) => {
      const ingredients = ['createdelightcore:dry_yeast'];
      if (sugar) {
        ingredients.push(sugar);
      }
      create
        .mixing(
          `5x ${output}`,
          ingredients.concat(repeatedIngredient('bakeries:flour', 5)).concat(Fluid.of(fluid, 250))
        )
        .id(id(`mixing/${output.split(':')[1]}_${fluid.split(':')[1]}`));
    });

    if (global.hasMod('farmersdelight')) {
      create
        .mixing('bakeries:sweet_dough', ['farmersdelight:wheat_dough', 'minecraft:sugar'])
        .id(id('mixing/sweet_dough'));
    }

    create
      .mixing('4x bakeries:meat_floss', ['minecraft:cooked_porkchop', 'minecraft:sugar'])
      .processingTime(200)
      .id(id('mixing/meat_floss'));
    minecraft
      .smoking(Item.of('minecraft:bread'), 'bakeries:whole_wheat_dough', 0.7, 100)
      .id(id('smoking/bread_from_whole_wheat_dough'));

    kubejs
      .shapeless('createdelightcore:puff_pastry', [
        'createdelightcore:butter',
        'createdelightcore:oil_dough',
      ])
      .id(id('crafting/puff_pastry'));

    create
      .sequenced_assembly('4x bakeries:round_bread_dough', 'bakeries:sweet_dough', [
        vintageimprovements.curving('bakeries:sweet_dough', 'bakeries:sweet_dough').mode(2),
        create.cutting('bakeries:sweet_dough', 'bakeries:sweet_dough'),
      ])
      .loops(1)
      .transitionalItem('bakeries:sweet_dough')
      .id(id('sequenced_assembly/round_bread_dough'));
    vintageimprovements
      .curving('2x bakeries:bagel_dough', 'bakeries:sweet_dough')
      .mode(1)
      .id(id('curving/bagel_dough'));
    vintageimprovements
      .curving('2x bakeries:whole_wheat_bagel_dough', 'bakeries:whole_wheat_dough')
      .mode(1)
      .id(id('curving/whole_wheat_bagel_dough'));

    if (global.hasMod('ratatouille')) {
      create
        .sequenced_assembly('2x bakeries:ciabatta_dough', 'ratatouille:salty_dough', [
          vintageimprovements.curving('ratatouille:salty_dough', 'ratatouille:salty_dough').mode(1),
          create.cutting('ratatouille:salty_dough', 'ratatouille:salty_dough'),
        ])
        .loops(1)
        .transitionalItem('ratatouille:salty_dough')
        .id(id('sequenced_assembly/ciabatta_dough'));
      vintageimprovements
        .curving('bakeries:country_bread_dough', 'ratatouille:salty_dough')
        .mode(2)
        .id(id('curving/country_bread_dough'));
      if (global.hasMod('createaddition')) {
        createaddition
          .rolling('bakeries:baguette_dough', 'ratatouille:salty_dough')
          .id(id('rolling/baguette_dough'));
      }
    }

    if (global.hasMod('createaddition')) {
      createaddition
        .rolling('bakeries:croissant_dough', 'createdelightcore:puff_pastry')
        .id(id('rolling/croissant_dough'));
    }

    [
      // 呃呃啊啊: bakeries:berry_bread_dough is missing for now.
      // ['bakeries:berry_bread_dough', ['bakeries:round_bread_dough', 'minecraft:sweet_berries']],
      ['bakeries:salt_croissant_dough', ['bakeries:croissant_dough', 'vintagedelight:salt_dust']],
      ['bakeries:meat_floss_bread_roll', ['bakeries:sliced_toast', 'bakeries:meat_floss']],
      [
        'bakeries:pineapple_bun_dough',
        ['bakeries:round_bread_dough', 'createdelightcore:butter', 'minecraft:sugar'],
      ],
      [
        'bakeries:brown_sugar_roll_dough',
        ['bakeries:round_bread_dough', 'createdelightcore:butter', 'bakeries:brown_sugar_cube'],
      ],
      [
        'bakeries:mould_toast_dough',
        [
          'bakeries:round_bread_dough',
          'bakeries:round_bread_dough',
          'bakeries:round_bread_dough',
          'bakeries:mould',
        ],
      ],
    ].forEach(([output, inputs]) => {
      kubejs.shapeless(output, inputs.map(asIngredient)).id(id(`crafting/${output.split(':')[1]}`));
    });

    create
      .sequenced_assembly('bakeries:pineapple_bun_dough', 'bakeries:round_bread_dough', [
        create.deploying('bakeries:round_bread_dough', [
          'bakeries:round_bread_dough',
          'createdelightcore:butter',
        ]),
        create.deploying('bakeries:round_bread_dough', [
          'bakeries:round_bread_dough',
          'minecraft:sugar',
        ]),
      ])
      .loops(1)
      .transitionalItem('bakeries:round_bread_dough')
      .id(id('sequenced_assembly/pineapple_bun_dough'));
    create
      .sequenced_assembly('bakeries:brown_sugar_roll_dough', 'bakeries:round_bread_dough', [
        create.deploying('bakeries:round_bread_dough', [
          'bakeries:round_bread_dough',
          'createdelightcore:butter',
        ]),
        create.deploying('bakeries:round_bread_dough', [
          'bakeries:round_bread_dough',
          'bakeries:brown_sugar_cube',
        ]),
      ])
      .loops(1)
      .transitionalItem('bakeries:round_bread_dough')
      .id(id('sequenced_assembly/brown_sugar_roll_dough'));

    if (global.hasAllMods(['trailandtales_delight', 'ratatouille'])) {
      kubejs
        .shapeless('bakeries:mould_cheese_cocoa_toast_dough', [
          'bakeries:mould_toast_dough',
          'trailandtales_delight:cheese_slice',
          'trailandtales_delight:cheese_slice',
          'trailandtales_delight:cheese_slice',
          'ratatouille:cocoa_powder',
          'ratatouille:cocoa_powder',
          'ratatouille:cocoa_powder',
        ])
        .id(id('crafting/mould_cheese_cocoa_toast_dough'));
      create
        .sequenced_assembly('bakeries:mould_cheese_cocoa_toast_dough', 'bakeries:mould', [
          create.deploying('bakeries:mould', ['bakeries:mould', 'bakeries:round_bread_dough']),
          create.deploying('bakeries:mould', [
            'bakeries:mould',
            'trailandtales_delight:cheese_slice',
          ]),
          create.deploying('bakeries:mould', ['bakeries:mould', 'ratatouille:cocoa_powder']),
        ])
        .loops(3)
        .transitionalItem('bakeries:mould')
        .id(id('sequenced_assembly/mould_cheese_cocoa_toast_dough'));
      create
        .sequenced_assembly(
          'bakeries:mould_cheese_cocoa_toast_dough',
          'bakeries:mould_toast_dough',
          [
            create.deploying('bakeries:mould_toast_dough', [
              'bakeries:mould_toast_dough',
              'trailandtales_delight:cheese_slice',
            ]),
            create.deploying('bakeries:mould_toast_dough', [
              'bakeries:mould_toast_dough',
              'ratatouille:cocoa_powder',
            ]),
          ]
        )
        .loops(3)
        .transitionalItem('bakeries:mould_toast_dough')
        .id(id('sequenced_assembly/mould_cheese_cocoa_toast_dough_from_toast'));
    }

    if (global.hasMod('vintagedelight')) {
      // 呃呃啊啊: bakeries:berry_bread_dough is missing for now.
      // create
      //   .deploying(
      //     [Item.of('bakeries:berry_bread_dough')],
      //     ['bakeries:round_bread_dough', 'minecraft:sweet_berries']
      //   )
      //   .id(id('deploying/berry_bread_dough'));
      create
        .deploying(
          [Item.of('bakeries:salt_croissant_dough')],
          ['bakeries:croissant_dough', 'vintagedelight:salt_dust']
        )
        .id(id('deploying/salt_croissant_dough'));
    }
    create
      .deploying(
        [Item.of('bakeries:meat_floss_bread_roll')],
        ['bakeries:sliced_toast', 'bakeries:meat_floss']
      )
      .id(id('deploying/meat_floss_bread_roll'));

    if (global.hasMod('someassemblyrequired')) {
      create
        .sequenced_assembly('2x bakeries:baguette_with_filling', 'bakeries:baguette', [
          create.cutting('bakeries:baguette', 'bakeries:baguette'),
          create.deploying('bakeries:baguette', [
            'bakeries:baguette',
            Ingredient.of('#c:vegetables/tomato'),
          ]),
          create.deploying('bakeries:baguette', [
            'bakeries:baguette',
            Ingredient.of('#c:foods/cooked_pork'),
          ]),
          create.cutting('bakeries:baguette', 'bakeries:baguette'),
        ])
        .loops(1)
        .transitionalItem('bakeries:baguette')
        .id(id('sequenced_assembly/baguette_with_filling'));
      create
        .sequenced_assembly('2x bakeries:tomato_cheese_croissant_sandwich', 'bakeries:croissant', [
          create.cutting('bakeries:croissant', 'bakeries:croissant'),
          create.deploying('bakeries:croissant', [
            'bakeries:croissant',
            Ingredient.of('#c:vegetables/tomato'),
          ]),
          create.deploying('bakeries:croissant', [
            'bakeries:croissant',
            Ingredient.of('#c:cheese'),
          ]),
        ])
        .loops(1)
        .transitionalItem('bakeries:croissant')
        .id(id('sequenced_assembly/tomato_cheese_croissant_sandwich'));
    }

    [
      ['bakeries:bagel_dough', 'bakeries:bagel', 200, 200, 225, 250],
      ['bakeries:whole_wheat_bagel_dough', 'bakeries:whole_wheat_bagel', 300, 260, 300, 340],
      ['bakeries:round_bread_dough', 'bakeries:round_bread', 100, 155, 180, 205],
      // 呃呃啊啊: bakeries:berry_bread_dough is missing for now.
      // ['bakeries:berry_bread_dough', 'bakeries:berry_bread', 100, 150, 180, 210],
      ['bakeries:baguette_dough', 'bakeries:baguette', 200, 190, 220, 250],
      ['bakeries:croissant_dough', 'bakeries:croissant', 200, 175, 210, 245],
      ['bakeries:salt_croissant_dough', 'bakeries:salt_croissant', 220, 190, 225, 260],
      ['bakeries:brown_sugar_roll_dough', 'bakeries:brown_sugar_roll', 200, 170, 205, 240],
      ['bakeries:pineapple_bun_dough', 'bakeries:pineapple_bun', 200, 170, 205, 240],
      ['bakeries:country_bread_dough', 'bakeries:country_bread', 300, 260, 300, 340],
      ['bakeries:ciabatta_dough', 'bakeries:ciabatta', 160, 140, 165, 190],
      ['bakeries:mould_toast_dough', 'bakeries:mould_toast', 400, 340, 390, 440],
      [
        'bakeries:mould_cheese_cocoa_toast_dough',
        'bakeries:mould_cheese_cocoa_toast',
        400,
        340,
        390,
        440,
      ],
      ['bakeries:focaccia_dough', 'bakeries:focaccia', 200, 170, 205, 240],
      ['bakeries:paper_cup_cake_paste', 'bakeries:cup_cake', 100, 80, 110, 140],
      // 呃呃啊啊: bakeries:yuntui_mooncake is missing for now.
      // ['bakeries:raw_yuntui_mooncake', 'bakeries:yuntui_mooncake', 100, 80, 110, 140],
      ['bakeries:rice_bread_dough', 'bakeries:rice_bread', 100, 80, 110, 140],
      ['bakeries:raw_egg_tart', 'bakeries:egg_tart', 100, 80, 110, 140],
    ].forEach(([input, output, time, min, perfect, max]) =>
      oven(input, output, time, min, perfect, max)
    );

    if (global.hasAllMods(['ratatouille', 'createdieselgenerators'])) {
      // 呃呃啊啊: frycooks_delight:canola_oil is missing for now.
      // kubejs
      //   .shaped('bakeries:focaccia_dough', ['ABC', ' D '], {
      //     A: Ingredient.of('#c:vegetables/onion'),
      //     B: Ingredient.of('#c:vegetables/tomato'),
      //     C: 'frycooks_delight:canola_oil',
      //     D: 'ratatouille:salty_dough',
      //   })
      //   .id(id('crafting/focaccia_dough'));
      create
        .mixing('bakeries:focaccia_dough', [
          Fluid.of('createdieselgenerators:plant_oil', 250),
          Ingredient.of('#c:vegetables/onion'),
          Ingredient.of('#c:vegetables/tomato'),
          'ratatouille:salty_dough',
        ])
        .id(id('mixing/focaccia_dough'));
    }

    vintageimprovements
      .vacuumizing(
        [Fluid.water(150), 'bakeries:brown_sugar_cube'],
        Fluid.of('createdelightcore:unrefined_sugar', 200)
      )
      .secondaryFluidOutput(0)
      .heated()
      .id(id('vacuumizing/brown_sugar_cube'));

    breadKnife('bakeries:toast', '4x bakeries:sliced_toast');
    breadKnife('bakeries:cheese_cocoa_toast', '4x bakeries:sliced_cheese_cocoa_toast');
    breadKnife('bakeries:country_bread', '6x bakeries:country_bread_slice');
    breadKnife('bakeries:pound_cake', '4x bakeries:sliced_pound_cake');

    create
      .filling('bakeries:paper_cup_cake_paste', [
        'bakeries:paper_cup',
        Fluid.of('createdelightcore:cake_batter', 250),
      ])
      .id(id('filling/paper_cup_cake_paste'));

    if (global.hasMod('ratatouille')) {
      breadKnife('ratatouille:cake_base', '2x bakeries:cut_cake_base');
    }

    create
      .filling('bakeries:soak_coffee_cut_cake_base', [
        'bakeries:cut_cake_base',
        Fluid.of('createdelightcore:espresso_fluid', 250),
      ])
      .id(id('filling/soak_coffee_cut_cake_base'));

    if (global.hasMod('cosmopolitan')) {
      create
        .compacting('bakeries:foamed_cream', [Fluid.of('cosmopolitan:cream', 250)])
        .heated()
        .id(id('compacting/foamed_cream'));
    }
    create
      .mixing('2x bakeries:cheese_cream', ['bakeries:foamed_cream', Ingredient.of('#c:cheese')])
      .id(id('mixing/cheese_cream'));

    create
      .sequenced_assembly('bakeries:mould_pound_cake_paste', 'bakeries:mould', [
        create.filling('bakeries:mould', [
          'bakeries:mould',
          Fluid.of('createdelightcore:cake_batter', 500),
        ]),
        create.deploying('bakeries:mould', ['bakeries:mould', Ingredient.of('#c:animal_oil')]),
      ])
      .loops(1)
      .transitionalItem('bakeries:mould')
      .id(id('sequenced_assembly/mould_pound_cake_paste'));
    create
      .sequenced_assembly('bakeries:mould_basque_cake_paste', 'bakeries:mould_two', [
        create.filling('bakeries:mould_two', [
          'bakeries:mould_two',
          Fluid.of('createdelightcore:cake_batter', 500),
        ]),
        create.deploying('bakeries:mould_two', ['bakeries:mould_two', Ingredient.of('#c:cheese')]),
      ])
      .loops(1)
      .transitionalItem('bakeries:mould_two')
      .id(id('sequenced_assembly/mould_basque_cake_paste'));

    if (global.hasMod('ratatouille')) {
      if (global.hasMod('cosmopolitan')) {
        create
          .sequenced_assembly('bakeries:cream_cake', 'bakeries:cut_cake_base', [
            create.filling('bakeries:cut_cake_base', [
              'bakeries:cut_cake_base',
              Fluid.of('cosmopolitan:cream', 250),
            ]),
            create.deploying('bakeries:cut_cake_base', [
              'bakeries:cut_cake_base',
              'bakeries:cut_cake_base',
            ]),
            create.filling('bakeries:cut_cake_base', [
              'bakeries:cut_cake_base',
              Fluid.of('cosmopolitan:cream', 250),
            ]),
            create.deploying('bakeries:cut_cake_base', [
              'bakeries:cut_cake_base',
              'minecraft:sweet_berries',
            ]),
          ])
          .loops(1)
          .transitionalItem('bakeries:cut_cake_base')
          .id(id('sequenced_assembly/cream_cake'));
      }
      create
        .sequenced_assembly('bakeries:cream_cake', 'bakeries:cut_cake_base', [
          create.deploying('bakeries:cut_cake_base', [
            'bakeries:cut_cake_base',
            Ingredient.of('#c:creams'),
          ]),
          create.deploying('bakeries:cut_cake_base', [
            'bakeries:cut_cake_base',
            'bakeries:cut_cake_base',
          ]),
          create.deploying('bakeries:cut_cake_base', [
            'bakeries:cut_cake_base',
            Ingredient.of('#c:creams'),
          ]),
          create.deploying('bakeries:cut_cake_base', [
            'bakeries:cut_cake_base',
            'minecraft:sweet_berries',
          ]),
        ])
        .loops(1)
        .transitionalItem('bakeries:cut_cake_base')
        .id(id('sequenced_assembly/cream_cake_from_item_cream'));
      create
        .sequenced_assembly('bakeries:tiramisu', 'bakeries:soak_coffee_cut_cake_base', [
          create.deploying('bakeries:soak_coffee_cut_cake_base', [
            'bakeries:soak_coffee_cut_cake_base',
            'bakeries:cheese_cream',
          ]),
          create.deploying('bakeries:soak_coffee_cut_cake_base', [
            'bakeries:soak_coffee_cut_cake_base',
            'bakeries:soak_coffee_cut_cake_base',
          ]),
          create.deploying('bakeries:soak_coffee_cut_cake_base', [
            'bakeries:soak_coffee_cut_cake_base',
            'bakeries:cheese_cream',
          ]),
          create.deploying('bakeries:soak_coffee_cut_cake_base', [
            'bakeries:soak_coffee_cut_cake_base',
            'ratatouille:cocoa_powder',
          ]),
        ])
        .loops(1)
        .transitionalItem('bakeries:soak_coffee_cut_cake_base')
        .id(id('sequenced_assembly/tiramisu'));
    }
    // 呃呃啊啊: bakeries:scone_dough is missing for now.
    // create
    //   .cutting('8x bakeries:scone_dough', 'createdelightcore:puff_pastry')
    //   .id(id('cutting/scone_dough'));

    // 呃呃啊啊: bakeries:cream_pumpkin_pie_dough is missing for now.
    // if (global.hasMod('farmersdelight')) {
    //   kubejs
    //     .shapeless('bakeries:cream_pumpkin_pie_dough', [
    //       'createdelightcore:puff_pastry',
    //       'farmersdelight:pumpkin_slice',
    //       'bakeries:foamed_cream',
    //     ])
    //     .id(id('crafting/cream_pumpkin_pie_dough'));
    // }

    // 呃呃啊啊: bakeries:scone_dough is missing for now.
    // bakeries
    //   .dough_crafting_table('8x bakeries:scone_dough', 'createdelightcore:puff_pastry')
    //   .id(id('dough_crafting_table/scone_dough'));

    if (global.hasMod('create_bic_bit')) {
      create
        .filling('bakeries:bagel_filled_sauce', [
          'bakeries:bagel',
          Fluid.of('create_bic_bit:mayonnaise', 250),
        ])
        .id(id('filling/bagel_filled_sauce'));
    }

    create
      .compacting('bakeries:flat_croissant', 'bakeries:croissant')
      .id(id('compacting/flat_croissant'));

    vintageimprovements
      .curving(['bakeries:mould', 'bakeries:toast'], 'bakeries:mould_toast')
      .mode(2)
      .id(id('curving/mould_toast'));
    vintageimprovements
      .curving(
        ['bakeries:mould', 'bakeries:cheese_cocoa_toast'],
        'bakeries:mould_cheese_cocoa_toast'
      )
      .mode(2)
      .id(id('curving/mould_cheese_cocoa_toast'));
    vintageimprovements
      .curving(['bakeries:mould', 'bakeries:pound_cake'], 'bakeries:mould_pound_cake')
      .mode(2)
      .id(id('curving/mould_pound_cake'));
    vintageimprovements
      .curving(['bakeries:mould_two', 'bakeries:basque_cake'], 'bakeries:mould_basque_cake')
      .mode(2)
      .id(id('curving/mould_basque_cake'));
    vintageimprovements
      .curving('3x bakeries:egg_tart_shell', 'createdelightcore:puff_pastry')
      .mode(1)
      .id(id('curving/egg_tart_shell'));

    kubejs
      .shaped('4x bakeries:paper_cup', ['   ', 'A A', ' A '], {
        A: 'bakeries:silicone_paper',
      })
      .id(id('crafting/paper_cup'));

    bakeries
      .dough_crafting_table('2x bakeries:bagel_dough', 'bakeries:sweet_dough')
      .id(id('dough_crafting_table/bagel_dough'));
    bakeries
      .dough_crafting_table('4x bakeries:round_bread_dough', 'bakeries:sweet_dough')
      .id(id('dough_crafting_table/round_bread_dough'));
    bakeries
      .dough_crafting_table('2x bakeries:whole_wheat_bagel_dough', 'bakeries:whole_wheat_dough')
      .id(id('dough_crafting_table/whole_wheat_bagel_dough'));
    bakeries
      .dough_crafting_table('bakeries:croissant_dough', 'createdelightcore:puff_pastry')
      .id(id('dough_crafting_table/croissant_dough'));

    if (global.hasMod('ratatouille')) {
      bakeries
        .dough_crafting_table('bakeries:baguette_dough', 'ratatouille:salty_dough')
        .id(id('dough_crafting_table/baguette_dough'));
      bakeries
        .dough_crafting_table('2x bakeries:ciabatta_dough', 'ratatouille:salty_dough')
        .id(id('dough_crafting_table/ciabatta_dough'));
      bakeries
        .dough_crafting_table('bakeries:country_bread_dough', 'ratatouille:salty_dough')
        .id(id('dough_crafting_table/country_bread_dough'));
    }
  });
}
