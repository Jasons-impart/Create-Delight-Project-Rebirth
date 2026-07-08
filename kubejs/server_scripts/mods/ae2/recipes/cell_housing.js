if (global.hasAllMods(['ae2', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/cell_housing/${path}`;
    const cellHousingHead = 'createdelightcore:cell_housing_curving_head';
    const redstoneDust = Ingredient.of('#c:dusts/redstone');
    const quartzGlass = Ingredient.of('#c:quartz_glass');
    const quartzGlassParts = 'createdelightcore:quartz_glass_parts';

    function addBasicHousing(cfg) {
      vintageimprovements
        .curving(Item.of(cfg.blank, 4), cfg.blankInput)
        .itemAsHead(cellHousingHead)
        .id(id(`curving/${cfg.blank.split(':')[1]}`));

      kubejs
        .shapeless(cfg.initial, [cfg.blank, redstoneDust.withCount(3)])
        .id(id(`shapeless/${cfg.initial.split(':')[1]}_from_dust`));

      kubejs
        .shapeless(cfg.initial, [cfg.blank, 'createdelightcore:redstone_paste'])
        .damageIngredient('createdelightcore:redstone_paste')
        .id(id(`shapeless/${cfg.initial.split(':')[1]}_from_paste`));

      create
        .sequenced_assembly(cfg.initial, cfg.blank, [
          create.deploying(cfg.blank, [cfg.blank, redstoneDust]),
        ])
        .loops(2)
        .transitionalItem(cfg.blank)
        .id(id(`sequenced_assembly/${cfg.initial.split(':')[1]}`));

      vintageimprovements
        .vacuumizing(cfg.initial, [cfg.blank, redstoneDust])
        .id(id(`vacuumizing/${cfg.initial.split(':')[1]}`));

      kubejs
        .shapeless(cfg.unformed, [cfg.initial, quartzGlass.withCount(2)])
        .id(id(`shapeless/${cfg.unformed.split(':')[1]}_from_glass`));

      kubejs
        .shapeless(cfg.unformed, [cfg.initial, quartzGlassParts])
        .id(id(`shapeless/${cfg.unformed.split(':')[1]}_from_parts`));

      create
        .sequenced_assembly(cfg.unformed, cfg.initial, [
          create.deploying(cfg.initial, [cfg.initial, quartzGlass]),
        ])
        .loops(2)
        .transitionalItem(cfg.initial)
        .id(id(`sequenced_assembly/${cfg.unformed.split(':')[1]}_from_glass`));

      create
        .deploying(cfg.unformed, [cfg.initial, quartzGlassParts])
        .id(id(`deploying/${cfg.unformed.split(':')[1]}_from_parts`));

      vintageimprovements
        .curving(cfg.result, cfg.unformed)
        .itemAsHead(cellHousingHead)
        .id(id(`curving/${cfg.result.split(':')[1]}`));
    }

    remove_recipes_id(event, [
      'ae2:network/cells/item_cell_housing',
      'ae2:network/cells/fluid_cell_housing',
    ]);

    addBasicHousing({
      blank: 'createdelightcore:item_cell_housing_blank',
      blankInput: Ingredient.of('#c:ingots/iron'),
      initial: 'createdelightcore:initial_processing_of_item_cell_housing',
      unformed: 'createdelightcore:unformed_item_cell_housing',
      result: 'ae2:item_cell_housing',
    });

    addBasicHousing({
      blank: 'createdelightcore:fluid_cell_housing_blank',
      blankInput: Ingredient.of('#c:ingots/copper'),
      initial: 'createdelightcore:initial_processing_of_fluid_cell_housing',
      unformed: 'createdelightcore:unformed_fluid_cell_housing',
      result: 'ae2:fluid_cell_housing',
    });
  });
}

if (global.hasAllMods(['ae2', 'megacells', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/megacells/cell_housing/${path}`;
    const cellHousingHead = 'createdelightcore:cell_housing_curving_head';
    const redstoneDust = Ingredient.of('#c:dusts/redstone');
    const skyDust = Ingredient.of('ae2:sky_dust');
    const quartzVibrantGlass = Ingredient.of('#c:quartz_vibrant_glass');
    const quartzVibrantGlassParts = 'createdelightcore:quartz_vibrant_glass_parts';

    function addMegaHousing(cfg) {
      vintageimprovements
        .curving(Item.of(cfg.blank, 4), cfg.blankInput)
        .itemAsHead(cellHousingHead)
        .id(id(`curving/${cfg.blank.split(':')[1]}`));

      kubejs
        .shapeless(cfg.initial, [cfg.blank, redstoneDust.withCount(3), skyDust.withCount(3)])
        .id(id(`shapeless/${cfg.initial.split(':')[1]}_from_dust`));

      kubejs
        .shapeless(cfg.initial, [
          cfg.blank,
          'createdelightcore:redstone_paste',
          'createdelightcore:sky_stone_paste',
        ])
        .damageIngredient('createdelightcore:redstone_paste')
        .damageIngredient('createdelightcore:sky_stone_paste')
        .id(id(`shapeless/${cfg.initial.split(':')[1]}_from_paste`));

      create
        .sequenced_assembly(cfg.initial, cfg.blank, [
          create.deploying(cfg.blank, [cfg.blank, redstoneDust]),
          create.deploying(cfg.blank, [cfg.blank, skyDust]),
        ])
        .loops(2)
        .transitionalItem(cfg.blank)
        .id(id(`sequenced_assembly/${cfg.initial.split(':')[1]}`));

      vintageimprovements
        .vacuumizing(cfg.initial, [cfg.blank, redstoneDust, skyDust])
        .id(id(`vacuumizing/${cfg.initial.split(':')[1]}`));

      kubejs
        .shapeless(cfg.unformed, [cfg.initial, quartzVibrantGlass.withCount(2)])
        .id(id(`shapeless/${cfg.unformed.split(':')[1]}_from_glass`));

      kubejs
        .shapeless(cfg.unformed, [cfg.initial, quartzVibrantGlassParts])
        .id(id(`shapeless/${cfg.unformed.split(':')[1]}_from_parts`));

      create
        .sequenced_assembly(cfg.unformed, cfg.initial, [
          create.deploying(cfg.initial, [cfg.initial, quartzVibrantGlass]),
        ])
        .loops(2)
        .transitionalItem(cfg.initial)
        .id(id(`sequenced_assembly/${cfg.unformed.split(':')[1]}_from_glass`));

      create
        .deploying(cfg.unformed, [cfg.initial, quartzVibrantGlassParts])
        .id(id(`deploying/${cfg.unformed.split(':')[1]}_from_parts`));

      vintageimprovements
        .curving(cfg.result, cfg.unformed)
        .itemAsHead(cellHousingHead)
        .id(id(`curving/${cfg.result.split(':')[1]}`));
    }

    remove_recipes_id(event, [
      'megacells:cells/mega_item_cell_housing',
      'megacells:cells/mega_fluid_cell_housing',
    ]);

    addMegaHousing({
      blank: 'createdelightcore:mega_item_cell_housing_blank',
      blankInput: Ingredient.of('#c:ingots/sky_steel'),
      initial: 'createdelightcore:initial_processing_of_mega_item_cell_housing',
      unformed: 'createdelightcore:unformed_mega_item_cell_housing',
      result: 'megacells:mega_item_cell_housing',
    });

    addMegaHousing({
      blank: 'createdelightcore:mega_fluid_cell_housing_blank',
      blankInput: 'createdelightcore:sky_copper_ingot',
      initial: 'createdelightcore:initial_processing_of_mega_fluid_cell_housing',
      unformed: 'createdelightcore:unformed_mega_fluid_cell_housing',
      result: 'megacells:mega_fluid_cell_housing',
    });
  });
}

if (
  global.hasAllMods(['ae2', 'ae2omnicells', 'create', 'createutilities', 'vintageimprovements'])
) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/omnicells/cell_housing/${path}`;
    const cellHousingHead = 'createdelightcore:cell_housing_curving_head';
    const enderPearlDust = Ingredient.of('#c:dusts/ender_pearl');
    const quartzGlass = 'createdelightcore:quartz_glass_parts';
    const quartzVibrantGlass = 'createdelightcore:quartz_vibrant_glass_parts';

    function addOmniHousing(cfg) {
      vintageimprovements
        .curving(Item.of(cfg.blank, 4), cfg.blankInput)
        .itemAsHead(cellHousingHead)
        .id(id(`curving/${cfg.blank.split(':')[1]}`));

      kubejs
        .shapeless(cfg.initial, cfg.initialIngredients)
        .id(id(`shapeless/${cfg.initial.split(':')[1]}`));

      create
        .sequenced_assembly(
          cfg.initial,
          cfg.blank,
          cfg.sequence.map((step) => create.deploying(cfg.blank, [cfg.blank, step]))
        )
        .loops(cfg.sequenceLoops)
        .transitionalItem(cfg.blank)
        .id(id(`sequenced_assembly/${cfg.initial.split(':')[1]}`));

      vintageimprovements
        .vacuumizing(cfg.initial, cfg.vacuumIngredients)
        .id(id(`vacuumizing/${cfg.initial.split(':')[1]}`));

      kubejs
        .shapeless(cfg.unformed, [cfg.initial, quartzVibrantGlass, quartzGlass])
        .id(id(`shapeless/${cfg.unformed.split(':')[1]}_from_parts`));

      create
        .sequenced_assembly(cfg.unformed, cfg.initial, [
          create.deploying(cfg.initial, [cfg.initial, quartzVibrantGlass]),
          create.deploying(cfg.initial, [cfg.initial, quartzGlass]),
        ])
        .loops(1)
        .transitionalItem(cfg.initial)
        .id(id(`sequenced_assembly/${cfg.unformed.split(':')[1]}_from_parts`));

      vintageimprovements
        .curving(cfg.result, cfg.unformed)
        .itemAsHead(cellHousingHead)
        .id(id(`curving/${cfg.result.split(':')[1]}`));
    }

    remove_recipes_id(event, [
      'ae2omnicells:cells/housing/omni_cell_housing',
      'ae2omnicells:cells/housing/complex_omni_cell_housing',
      'ae2omnicells:cells/housing/quantum_omni_cell_housing',
    ]);

    addOmniHousing({
      blank: 'createdelightcore:omni_cell_housing_blank',
      blankInput: 'createutilities:void_steel_ingot',
      initial: 'createdelightcore:initial_processing_of_omni_cell_housing',
      initialIngredients: [
        'createdelightcore:omni_cell_housing_blank',
        enderPearlDust.withCount(3),
      ],
      vacuumIngredients: ['createdelightcore:omni_cell_housing_blank', enderPearlDust],
      sequence: [enderPearlDust],
      sequenceLoops: 2,
      unformed: 'createdelightcore:unformed_omni_cell_housing',
      result: 'ae2omnicells:omni_cell_housing',
    });

    if (global.itemExists('createdelightcore:forged_steel_sheet')) {
      addOmniHousing({
        blank: 'createdelightcore:complex_omni_cell_housing_blank',
        blankInput: 'createdelightcore:forged_steel_sheet',
        initial: 'createdelightcore:initial_processing_of_complex_omni_cell_housing',
        initialIngredients: [
          'createdelightcore:complex_omni_cell_housing_blank',
          enderPearlDust.withCount(3),
          'ae2omnicells:complex_link_processor',
        ],
        vacuumIngredients: [
          'createdelightcore:complex_omni_cell_housing_blank',
          enderPearlDust,
          'ae2omnicells:complex_link_processor',
        ],
        sequence: [enderPearlDust, enderPearlDust, 'ae2omnicells:complex_link_processor'],
        sequenceLoops: 1,
        unformed: 'createdelightcore:unformed_complex_omni_cell_housing',
        result: 'ae2omnicells:complex_omni_cell_housing',
      });
    }

    addOmniHousing({
      blank: 'createdelightcore:quantum_omni_cell_housing_blank',
      blankInput: 'ae2omnicells:charged_ender_ingot',
      initial: 'createdelightcore:initial_processing_of_quantum_omni_cell_housing',
      initialIngredients: [
        'createdelightcore:quantum_omni_cell_housing_blank',
        enderPearlDust.withCount(3),
        'ae2omnicells:multidimensional_expansion_processor',
      ],
      vacuumIngredients: [
        'createdelightcore:quantum_omni_cell_housing_blank',
        enderPearlDust,
        'ae2omnicells:multidimensional_expansion_processor',
      ],
      sequence: [
        enderPearlDust,
        enderPearlDust,
        'ae2omnicells:multidimensional_expansion_processor',
      ],
      sequenceLoops: 1,
      unformed: 'createdelightcore:unformed_quantum_omni_cell_housing',
      result: 'ae2omnicells:quantum_omni_cell_housing',
    });
  });
}
