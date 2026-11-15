if (
  global.hasAllMods(['ae2', 'ae2omnicells', 'create', 'createutilities', 'vintageimprovements'])
) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/omnicells/processor/${path}`;
    const universalPress = 'createdelightcore:universal_press';
    const ultimateUniversalPress = 'createdelightcore:ultimate_universal_press';
    const redstoneDust = Ingredient.of('#c:dusts/redstone');
    const voidSteelBlock = Ingredient.of('#c:storage_blocks/void_steel');
    const asIngredient = (value) =>
      typeof value === 'string' && value.startsWith('#') ? Ingredient.of(value) : value;
    const asJson = (value) => {
      if (typeof value === 'string') {
        return value.startsWith('#') ? { tag: value.slice(1) } : { item: value };
      }
      if (value && value.tag) return { tag: value.tag };
      return { item: String(value) };
    };
    const inscriber = (output, ingredients, path) =>
      event
        .custom({
          type: 'ae2:inscriber',
          ingredients: ingredients,
          mode: 'inscribe',
          result: { id: output },
        })
        .id(id(path));
    const transform = (output, count, ingredients, circumstance, path) =>
      event
        .custom({
          type: 'ae2:transform',
          circumstance: circumstance,
          ingredients: ingredients,
          result: { count: count, id: output },
        })
        .id(id(path));

    function addCurving(result, input, head, path) {
      vintageimprovements
        .curving(result, input)
        .itemAsHead(head)
        .id(id(`curving/${path}`));
    }

    function addProcessor(cfg) {
      const initial = `createdelightcore:initial_processing_of_printed_${cfg.name}_processor`;
      const inscribed = `createdelightcore:${cfg.name}_processor_inscribed`;

      addCurving(cfg.printed, asIngredient(cfg.material), cfg.press, cfg.printed.split(':')[1]);
      addCurving(cfg.press, cfg.copyInput, cfg.press, `${cfg.press.split(':')[1]}_duplicate`);
      addCurving(
        cfg.printed,
        asIngredient(cfg.material),
        ultimateUniversalPress,
        `${cfg.printed.split(':')[1]}_from_ultimate_universal_press`
      );

      inscriber(
        cfg.printed,
        {
          top: { item: ultimateUniversalPress },
          middle: asJson(cfg.material),
        },
        `inscriber/${cfg.printed.split(':')[1]}_from_ultimate_universal_press`
      );

      kubejs
        .shapeless(initial, [cfg.printed, redstoneDust.withCount(2)])
        .id(id(`shapeless/${initial.split(':')[1]}_from_dust`));

      kubejs
        .shapeless(initial, [cfg.printed, 'createdelightcore:redstone_paste'])
        .damageIngredient('createdelightcore:redstone_paste')
        .id(id(`shapeless/${initial.split(':')[1]}_from_paste`));

      create
        .sequenced_assembly(
          initial,
          cfg.printed,
          create.deploying(cfg.printed, [cfg.printed, redstoneDust])
        )
        .transitionalItem(cfg.printed)
        .loops(2)
        .id(id(`sequenced_assembly/${initial.split(':')[1]}_from_dust`));

      create
        .sequenced_assembly(
          initial,
          cfg.printed,
          create.deploying(cfg.printed, [cfg.printed, 'createdelightcore:redstone_paste'])
        )
        .transitionalItem(cfg.printed)
        .loops(1)
        .id(id(`sequenced_assembly/${initial.split(':')[1]}_from_paste`));

      vintageimprovements
        .vacuumizing(initial, [cfg.printed, redstoneDust])
        .id(id(`vacuumizing/${initial.split(':')[1]}`));

      kubejs
        .shapeless(inscribed, [initial, 'ae2:printed_silicon'])
        .id(id(`shapeless/${inscribed.split(':')[1]}`));

      create
        .deploying(inscribed, [initial, 'ae2:printed_silicon'])
        .id(id(`deploying/${inscribed.split(':')[1]}`));

      vintageimprovements
        .curving(Item.of(cfg.result, 2), inscribed)
        .mode(2)
        .id(id(`curving/${cfg.result.split(':')[1]}`));
    }

    remove_recipes_id(event, [
      'ae2omnicells:omni_link_print_press',
      'ae2omnicells:complex_link_print_press',
      'ae2omnicells:multidimensional_expansion_print_press',
    ]);

    transform(
      'ae2omnicells:omni_link_print_press',
      1,
      [
        { item: universalPress },
        { item: 'createutilities:void_steel_ingot' },
        { item: 'ae2omnicells:charged_ender_ingot' },
      ],
      { type: 'explosion' },
      'transform/omni_link_print_press'
    );

    transform(
      'ae2omnicells:complex_link_print_press',
      1,
      [
        { item: universalPress },
        { item: 'minecraft:netherite_scrap' },
        { item: 'ae2omnicells:charged_ender_ingot' },
      ],
      { type: 'explosion' },
      'transform/complex_link_print_press'
    );

    transform(
      'ae2omnicells:multidimensional_expansion_print_press',
      1,
      [
        { item: universalPress },
        { item: 'ae2:singularity' },
        { item: 'ae2omnicells:charged_ender_ingot' },
      ],
      { type: 'explosion' },
      'transform/multidimensional_expansion_print_press'
    );

    addCurving(
      ultimateUniversalPress,
      'ae2omnicells:singularity_block',
      ultimateUniversalPress,
      'ultimate_universal_press_duplicate'
    );
    inscriber(
      ultimateUniversalPress,
      {
        top: { item: ultimateUniversalPress },
        middle: { item: 'ae2omnicells:singularity_block' },
      },
      'inscriber/ultimate_universal_press_duplicate'
    );

    addProcessor({
      name: 'omni_link',
      material: 'createutilities:void_steel_ingot',
      printed: 'ae2omnicells:omni_link_circuit_print',
      press: 'ae2omnicells:omni_link_print_press',
      copyInput: voidSteelBlock,
      result: 'ae2omnicells:omni_link_processor',
    });

    addProcessor({
      name: 'complex_link',
      material: 'minecraft:netherite_scrap',
      printed: 'ae2omnicells:complex_link_circuit_print',
      press: 'ae2omnicells:complex_link_print_press',
      copyInput: voidSteelBlock,
      result: 'ae2omnicells:complex_link_processor',
    });

    addProcessor({
      name: 'multidimensional_expansion',
      material: 'ae2:singularity',
      printed: 'ae2omnicells:multidimensional_expansion_circuit_print',
      press: 'ae2omnicells:multidimensional_expansion_print_press',
      copyInput: voidSteelBlock,
      result: 'ae2omnicells:multidimensional_expansion_processor',
    });
  });
}

if (global.hasAllMods(['ae2', 'ae2omnicells', 'iceandfire', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    event
      .custom({
        type: 'ae2:transform',
        circumstance: { type: 'explosion' },
        ingredients: [
          { item: 'ae2omnicells:omni_link_print_press' },
          { item: 'ae2omnicells:complex_link_print_press' },
          { item: 'ae2omnicells:multidimensional_expansion_print_press' },
          {
            type: 'neoforge:compound',
            children: [
              { item: 'iceandfire:dragonsteel_fire_block' },
              { item: 'iceandfire:dragonsteel_ice_block' },
              { item: 'iceandfire:dragonsteel_lightning_block' },
            ],
          },
          { item: 'createdelightcore:universal_press' },
        ],
        result: { count: 4, id: 'createdelightcore:ultimate_universal_press' },
      })
      .id('createdelightcore:ae2/omnicells/processor/transform/ultimate_universal_press');
  });
}
