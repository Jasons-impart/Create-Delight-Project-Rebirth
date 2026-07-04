if (global.hasAllMods(['ae2', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, vintageimprovements, ae2 } = event.recipes;
    const id = (path) => `createdelightcore:ae2/processor/${path}`;

    const universalPress = 'createdelightcore:universal_press';
    const ultimateUniversalPress = 'createdelightcore:ultimate_universal_press';
    const redstoneDust = Ingredient.of('#c:dusts/redstone');
    const redstoneDust32 = Ingredient.of('#c:dusts/redstone').withCount(32);
    const glowstoneDust32 = Ingredient.of('#c:dusts/glowstone').withCount(32);
    const ironPlate = Ingredient.of('#c:plates/iron');
    const ironBlock = '#c:storage_blocks/iron';

    function addCurving(result, input, head, path) {
      vintageimprovements
        .curving(result, input)
        .itemAsHead(head)
        .id(id(`curving/${path}`));
    }

    function addProcessor(processor) {
      const initial = `createdelightcore:initial_processing_of_${processor.printed.split(':')[1]}`;
      const inscribed = `createdelightcore:${processor.name}_processor_inscribed`;

      addCurving(
        processor.printed,
        processor.material,
        processor.press,
        processor.printed.split(':')[1]
      );
      addCurving(
        processor.press,
        processor.copyInput || ironBlock,
        processor.press,
        `${processor.press.split(':')[1]}_duplicate`
      );

      if (processor.allowUltimatePress !== false) {
        addCurving(
          processor.printed,
          processor.material,
          ultimateUniversalPress,
          `${processor.printed.split(':')[1]}_from_ultimate_universal_press`
        );
        ae2
          .inscriber(
            processor.printed,
            {
              top: ultimateUniversalPress,
              middle: processor.material,
            },
            'inscribe'
          )
          .id(id(`inscriber/${processor.printed.split(':')[1]}_from_ultimate_universal_press`));
      }

      if (processor.allowUniversalPress !== false) {
        addCurving(
          processor.printed,
          processor.material,
          universalPress,
          `${processor.printed.split(':')[1]}_from_universal_press`
        );
        ae2
          .inscriber(
            processor.printed,
            {
              top: universalPress,
              middle: processor.material,
            },
            'inscribe'
          )
          .id(id(`inscriber/${processor.printed.split(':')[1]}_from_universal_press`));
      }

      kubejs
        .shapeless(initial, [processor.printed, Ingredient.of(processor.dust).withCount(2)])
        .id(id(`shapeless/${initial.split(':')[1]}_from_dust`));

      create
        .sequenced_assembly(
          initial,
          processor.printed,
          create.deploying(processor.printed, [processor.printed, processor.dust])
        )
        .transitionalItem(processor.printed)
        .loops(2)
        .id(id(`sequenced_assembly/${initial.split(':')[1]}_from_dust`));

      vintageimprovements
        .vacuumizing(initial, [processor.printed, processor.dust])
        .id(id(`vacuumizing/${initial.split(':')[1]}_from_dust`));

      if (processor.paste) {
        kubejs
          .shapeless(initial, [processor.printed, processor.paste])
          .damageIngredient(processor.paste)
          .id(id(`shapeless/${initial.split(':')[1]}_from_paste`));

        create
          .sequenced_assembly(
            initial,
            processor.printed,
            create.deploying(processor.printed, [processor.printed, processor.paste])
          )
          .transitionalItem(processor.printed)
          .loops(1)
          .id(id(`sequenced_assembly/${initial.split(':')[1]}_from_paste`));
      }

      kubejs
        .shapeless(inscribed, [initial, 'ae2:printed_silicon'])
        .id(id(`shapeless/${inscribed.split(':')[1]}`));

      create
        .deploying(inscribed, [initial, 'ae2:printed_silicon'])
        .id(id(`deploying/${inscribed.split(':')[1]}`));

      vintageimprovements
        .curving(Item.of(processor.result, 2), inscribed)
        .mode(2)
        .id(id(`curving/${processor.result.split(':')[1]}`));
    }

    create
      .mixing('createdelightcore:redstone_paste', [redstoneDust32, ironPlate])
      .heated()
      .id(id('mixing/redstone_paste'));

    create
      .mixing('createdelightcore:glowstone_paste', [glowstoneDust32, ironPlate])
      .heated()
      .id(id('mixing/glowstone_paste'));

    create
      .mixing('createdelightcore:sky_stone_paste', [
        Ingredient.of('ae2:sky_dust').withCount(32),
        ironPlate,
      ])
      .heated()
      .id(id('mixing/sky_stone_paste'));

    addCurving(
      'ae2:printed_silicon',
      'ae2:silicon',
      universalPress,
      'printed_silicon_from_universal_press'
    );
    addCurving(
      'ae2:printed_silicon',
      'ae2:silicon',
      ultimateUniversalPress,
      'printed_silicon_from_ultimate_universal_press'
    );
    addCurving('ae2:printed_silicon', 'ae2:silicon', 'ae2:silicon_press', 'printed_silicon');
    addCurving('ae2:silicon_press', ironBlock, 'ae2:silicon_press', 'silicon_press_duplicate');
    addCurving(universalPress, ironBlock, universalPress, 'universal_press_duplicate');

    ae2
      .inscriber(
        'ae2:printed_silicon',
        {
          top: ultimateUniversalPress,
          middle: 'ae2:silicon',
        },
        'inscribe'
      )
      .id(id('inscriber/printed_silicon_from_ultimate_universal_press'));

    ae2
      .inscriber(
        'ae2:printed_silicon',
        {
          top: universalPress,
          middle: 'ae2:silicon',
        },
        'inscribe'
      )
      .id(id('inscriber/printed_silicon_from_universal_press'));

    ae2
      .inscriber(
        universalPress,
        {
          top: universalPress,
          middle: ironBlock,
        },
        'inscribe'
      )
      .id(id('inscriber/universal_press_duplicate'));

    addProcessor({
      name: 'engineering',
      material: '#c:gems/diamond',
      printed: 'ae2:printed_engineering_processor',
      press: 'ae2:engineering_processor_press',
      dust: redstoneDust,
      paste: 'createdelightcore:redstone_paste',
      result: 'ae2:engineering_processor',
    });
    addProcessor({
      name: 'calculation',
      material: 'ae2:certus_quartz_crystal',
      printed: 'ae2:printed_calculation_processor',
      press: 'ae2:calculation_processor_press',
      dust: redstoneDust,
      paste: 'createdelightcore:redstone_paste',
      result: 'ae2:calculation_processor',
    });
    addProcessor({
      name: 'logic',
      material: 'minecraft:gold_ingot',
      printed: 'ae2:printed_logic_processor',
      press: 'ae2:logic_processor_press',
      dust: redstoneDust,
      paste: 'createdelightcore:redstone_paste',
      result: 'ae2:logic_processor',
    });

    ae2
      .transform(
        Item.of(universalPress, 5),
        [
          'ae2:silicon_press',
          'ae2:logic_processor_press',
          'ae2:engineering_processor_press',
          'ae2:calculation_processor_press',
        ],
        { type: 'fluid', tag: 'minecraft:water' }
      )
      .id(id('transform/universal_press'));
  });
}

if (global.hasAllMods(['ae2', 'megacells', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, vintageimprovements, ae2, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:ae2/megacells/processor/${path}`;
    const fluixDust = Ingredient.of('#c:dusts/fluix');
    const skySteelIngot = '#c:ingots/sky_steel';

    vintageimprovements
      .curving('megacells:printed_accumulation_processor', skySteelIngot)
      .itemAsHead('megacells:accumulation_processor_press')
      .id(id('curving/printed_accumulation_processor'));

    vintageimprovements
      .curving('megacells:accumulation_processor_press', '#c:storage_blocks/iron')
      .itemAsHead('megacells:accumulation_processor_press')
      .id(id('curving/accumulation_processor_press_duplicate'));

    const initial = 'createdelightcore:initial_processing_of_printed_accumulation_processor';
    const inscribed = 'createdelightcore:accumulation_processor_inscribed';

    kubejs
      .shapeless(initial, ['megacells:printed_accumulation_processor', fluixDust.withCount(2)])
      .id(id('shapeless/initial_processing_of_printed_accumulation_processor'));

    create
      .sequenced_assembly(
        initial,
        'megacells:printed_accumulation_processor',
        create.deploying('megacells:printed_accumulation_processor', [
          'megacells:printed_accumulation_processor',
          fluixDust,
        ])
      )
      .transitionalItem('megacells:printed_accumulation_processor')
      .loops(2)
      .id(id('sequenced_assembly/initial_processing_of_printed_accumulation_processor'));

    vintageimprovements
      .vacuumizing(initial, ['megacells:printed_accumulation_processor', fluixDust])
      .id(id('vacuumizing/initial_processing_of_printed_accumulation_processor'));

    kubejs
      .shapeless(inscribed, [initial, 'ae2:printed_silicon'])
      .id(id('shapeless/accumulation_processor_inscribed'));

    create
      .deploying(inscribed, [initial, 'ae2:printed_silicon'])
      .id(id('deploying/accumulation_processor_inscribed'));

    vintageimprovements
      .curving(Item.of('megacells:accumulation_processor', 2), inscribed)
      .mode(2)
      .id(id('curving/accumulation_processor'));

    ae2
      .inscriber(
        'megacells:printed_accumulation_processor',
        {
          top: 'megacells:accumulation_processor_press',
          middle: skySteelIngot,
        },
        'inscribe'
      )
      .id(id('inscriber/printed_accumulation_processor'));
  });
}
