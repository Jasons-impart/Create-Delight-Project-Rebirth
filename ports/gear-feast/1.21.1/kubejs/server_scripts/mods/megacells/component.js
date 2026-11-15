if (global.hasAllMods(['ae2', 'create', 'megacells', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const CELL_HOUSING_HEAD = 'createdelightcore:cell_housing_curving_head';
    const QUARTZ_VIBRANT_GLASS = Ingredient.of('#c:quartz_vibrant_glass');
    const ENDER_PEARL_DUST = Ingredient.of('#c:dusts/ender_pearl');

    const cellSizes = ['_256m', '_64m', '_16m', '_4m', '_1m'];
    const cellTypes = ['item_', 'fluid_'];

    cellTypes.forEach((type) => {
      cellSizes.forEach((size) => {
        event.remove({
          output: `megacells:${type}storage_cell${size}`,
          type: 'minecraft:crafting_shaped',
        });
      });
    });

    const { create, vintageimprovements } = event.recipes;
    const i256k = 'ae2:cell_component_256k';
    const i1m = 'megacells:cell_component_1m';
    const i4m = 'megacells:cell_component_4m';
    const i16m = 'megacells:cell_component_16m';
    const i64m = 'megacells:cell_component_64m';
    const i256m = 'megacells:cell_component_256m';

    function curvingStep(transitionalItem) {
      return vintageimprovements
        .curving(transitionalItem, transitionalItem)
        .itemAsHead(CELL_HOUSING_HEAD);
    }

    function incompleteComponent(component) {
      return 'createdelightcore:incomplete_' + component.split(':')[1];
    }

    function componentRecipeId(component, suffix) {
      return 'createdelightcore:ae2/megacells/' + component.split(':')[1] + '_' + suffix;
    }

    function addFirstMegaCellAssembly(
      input,
      output,
      paste,
      previousComponent,
      processor,
      glassPart,
      catalyst
    ) {
      const transitionalItem = incompleteComponent(output);
      create
        .sequenced_assembly(output, input, [
          create.deploying(transitionalItem, [transitionalItem, paste]),
          create.deploying(transitionalItem, [transitionalItem, previousComponent]),
          create.deploying(transitionalItem, [transitionalItem, processor]),
          create.deploying(transitionalItem, [transitionalItem, glassPart]),
          curvingStep(transitionalItem),
        ])
        .loops(1)
        .transitionalItem(transitionalItem)
        .id(componentRecipeId(output, 'sequenced_assembly_a'));

      create
        .sequenced_assembly(output, input, [
          create.deploying(transitionalItem, [transitionalItem, catalyst]),
          create.deploying(transitionalItem, [transitionalItem, catalyst]),
          create.deploying(transitionalItem, [transitionalItem, previousComponent]),
          create.deploying(transitionalItem, [transitionalItem, processor]),
          create.deploying(transitionalItem, [transitionalItem, glassPart]),
          curvingStep(transitionalItem),
        ])
        .loops(1)
        .transitionalItem(transitionalItem)
        .id(componentRecipeId(output, 'sequenced_assembly_b'));

      create
        .sequenced_assembly(output, input, [
          vintageimprovements.vacuumizing(transitionalItem, [transitionalItem, catalyst]),
          create.deploying(transitionalItem, [transitionalItem, previousComponent]),
          create.deploying(transitionalItem, [transitionalItem, processor]),
          create.deploying(transitionalItem, [transitionalItem, glassPart]),
          curvingStep(transitionalItem),
        ])
        .loops(1)
        .transitionalItem(transitionalItem)
        .id(componentRecipeId(output, 'sequenced_assembly_c'));
    }

    function addMegaCellUpgradeAssembly(
      input,
      output,
      previousComponent,
      processor,
      glassPart,
      catalyst
    ) {
      const transitionalItem = incompleteComponent(output);
      create
        .sequenced_assembly(output, input, [
          create.deploying(transitionalItem, [transitionalItem, catalyst]),
          create.deploying(transitionalItem, [transitionalItem, catalyst]),
          create.deploying(transitionalItem, [transitionalItem, previousComponent]),
          create.deploying(transitionalItem, [transitionalItem, processor]),
          create.deploying(transitionalItem, [transitionalItem, glassPart]),
          curvingStep(transitionalItem),
        ])
        .loops(1)
        .transitionalItem(transitionalItem)
        .id(componentRecipeId(output, 'sequenced_assembly_a'));

      create
        .sequenced_assembly(output, input, [
          vintageimprovements.vacuumizing(transitionalItem, [transitionalItem, catalyst]),
          create.deploying(transitionalItem, [transitionalItem, previousComponent]),
          create.deploying(transitionalItem, [transitionalItem, processor]),
          create.deploying(transitionalItem, [transitionalItem, glassPart]),
          curvingStep(transitionalItem),
        ])
        .loops(1)
        .transitionalItem(transitionalItem)
        .id(componentRecipeId(output, 'sequenced_assembly_b'));
    }

    function addShapedComponentRecipe(result, ingr1, ingr2, ingr3, ingr4) {
      event.recipes.kubejs
        .shaped(result, ['ADA', 'CBC', 'ACA'], {
          A: ingr1,
          B: ingr2,
          C: ingr3,
          D: ingr4,
        })
        .id(componentRecipeId(result, 'shaped'));
    }

    addShapedComponentRecipe(
      i1m,
      i256k,
      '#c:quartz_vibrant_glass',
      'ae2:sky_dust',
      'megacells:accumulation_processor'
    );
    addShapedComponentRecipe(
      i4m,
      i1m,
      '#c:quartz_vibrant_glass',
      '#c:dusts/ender_pearl',
      'megacells:accumulation_processor'
    );
    addShapedComponentRecipe(
      i16m,
      i4m,
      '#c:quartz_vibrant_glass',
      '#c:dusts/ender_pearl',
      'megacells:accumulation_processor'
    );
    addShapedComponentRecipe(
      i64m,
      i16m,
      '#c:quartz_vibrant_glass',
      'ae2:matter_ball',
      'megacells:accumulation_processor'
    );
    addShapedComponentRecipe(
      i256m,
      i64m,
      '#c:quartz_vibrant_glass',
      'ae2:matter_ball',
      'megacells:accumulation_processor'
    );

    addFirstMegaCellAssembly(
      i256k,
      i1m,
      'createdelightcore:sky_stone_paste',
      i256k,
      'megacells:accumulation_processor',
      QUARTZ_VIBRANT_GLASS,
      'ae2:sky_dust'
    );

    addMegaCellUpgradeAssembly(
      i1m,
      i4m,
      i1m,
      'megacells:accumulation_processor',
      QUARTZ_VIBRANT_GLASS,
      ENDER_PEARL_DUST
    );

    addMegaCellUpgradeAssembly(
      i4m,
      i16m,
      i4m,
      'megacells:accumulation_processor',
      QUARTZ_VIBRANT_GLASS,
      ENDER_PEARL_DUST
    );

    addMegaCellUpgradeAssembly(
      i16m,
      i64m,
      i16m,
      'megacells:accumulation_processor',
      QUARTZ_VIBRANT_GLASS,
      'ae2:matter_ball'
    );

    addMegaCellUpgradeAssembly(
      i64m,
      i256m,
      i64m,
      'megacells:accumulation_processor',
      QUARTZ_VIBRANT_GLASS,
      'ae2:matter_ball'
    );

    create
      .mechanical_crafting('megacells:cell_component_1m', ['ABA', 'CDC', 'ACA'], {
        A: 'ae2:sky_dust',
        B: 'megacells:accumulation_processor',
        C: 'ae2:cell_component_256k',
        D: 'ae2:quartz_vibrant_glass',
      })
      .id(componentRecipeId(i1m, 'mechanical_crafting'));
    create
      .mechanical_crafting('megacells:cell_component_4m', ['ABA', 'CDC', 'ACA'], {
        A: '#c:dusts/ender_pearl',
        B: 'megacells:accumulation_processor',
        C: 'megacells:cell_component_1m',
        D: 'ae2:quartz_vibrant_glass',
      })
      .id(componentRecipeId(i4m, 'mechanical_crafting'));
    create
      .mechanical_crafting('megacells:cell_component_16m', ['ABA', 'CDC', 'ACA'], {
        A: '#c:dusts/ender_pearl',
        B: 'megacells:accumulation_processor',
        C: 'megacells:cell_component_4m',
        D: 'ae2:quartz_vibrant_glass',
      })
      .id(componentRecipeId(i16m, 'mechanical_crafting'));
    create
      .mechanical_crafting('megacells:cell_component_64m', ['ABA', 'CDC', 'ACA'], {
        A: 'ae2:matter_ball',
        B: 'megacells:accumulation_processor',
        C: 'megacells:cell_component_16m',
        D: 'ae2:quartz_vibrant_glass',
      })
      .id(componentRecipeId(i64m, 'mechanical_crafting'));
    create
      .mechanical_crafting('megacells:cell_component_256m', ['ABA', 'CDC', 'ACA'], {
        A: 'ae2:matter_ball',
        B: 'megacells:accumulation_processor',
        C: 'megacells:cell_component_64m',
        D: 'ae2:quartz_vibrant_glass',
      })
      .id(componentRecipeId(i256m, 'mechanical_crafting'));

    remove_recipes_id(event, [
      'megacells:cells/cell_component_1m',
      'megacells:cells/cell_component_4m',
      'megacells:cells/cell_component_16m',
      'megacells:cells/cell_component_64m',
      'megacells:cells/cell_component_256m',
    ]);
  });
}

if (global.hasAllMods(['ae2', 'megacells', 'functionalstorage'])) {
  ServerEvents.recipes((event) => {
    const { kubejs } = event.recipes;
    const id = (path) => `createdelightcore:ae2/megacells/bulk/${path}`;

    event.remove({ output: 'megacells:mega_interface' });
    event.remove({ output: 'megacells:mega_pattern_provider' });

    event.replaceInput(
      { id: 'megacells:crafting/bulk_cell_component' },
      'megacells:cell_component_1m',
      'functionalstorage:copper_upgrade'
    );
    event.replaceInput(
      { id: 'megacells:crafting/bulk_cell_component' },
      'ae2:spatial_cell_component_2',
      'functionalstorage:copper_upgrade'
    );

    kubejs
      .shapeless('megacells:bulk_item_cell', [
        'megacells:bulk_cell_component',
        'megacells:mega_item_cell_housing',
      ])
      .id(id('bulk_item_cell'));
  });
}
