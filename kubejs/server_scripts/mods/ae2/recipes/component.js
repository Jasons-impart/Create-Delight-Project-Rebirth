if (global.hasAllMods(['ae2', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const CELL_HOUSING_HEAD = 'createdelightcore:cell_housing_curving_head';
    const QUARTZ_GLASS = Ingredient.of('#c:quartz_glass');
    const REDSTONE_DUST = Ingredient.of('#c:dusts/redstone');
    const GLOWSTONE_DUST = Ingredient.of('#c:dusts/glowstone');

    const cellSizes = ['_256k', '_64k', '_16k', '_4k', '_1k'];
    const cellTypes = ['item_', 'fluid_'];

    cellTypes.forEach((type) => {
      cellSizes.forEach((size) => {
        event.remove({
          output: `ae2:${type}storage_cell${size}`,
          type: 'minecraft:crafting_shaped',
        });
      });
    });

    if (global.hasMod('ae2omnicells')) {
      event.replaceInput({ mod: 'ae2omnicells' }, 'ae2:quartz_glass', '#c:quartz_glass');
    }

    const { create, vintageimprovements } = event.recipes;
    const i1k = 'ae2:cell_component_1k';
    const i4k = 'ae2:cell_component_4k';
    const i16k = 'ae2:cell_component_16k';
    const i64k = 'ae2:cell_component_64k';
    const i256k = 'ae2:cell_component_256k';

    function curvingStep(transitionalItem) {
      return vintageimprovements
        .curving(transitionalItem, transitionalItem)
        .itemAsHead(CELL_HOUSING_HEAD);
    }

    function incompleteComponent(component) {
      return 'createdelightcore:incomplete_' + component.split(':')[1];
    }

    function componentRecipeId(component, suffix) {
      return 'createdelightcore:ae2/' + component.split(':')[1] + '_' + suffix;
    }

    function addCellComponentAssembly(
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
      i1k,
      'ae2:certus_quartz_crystal',
      '#c:quartz_glass',
      '#c:dusts/redstone',
      'ae2:logic_processor'
    );
    addShapedComponentRecipe(
      i4k,
      i1k,
      '#c:quartz_glass',
      '#c:dusts/redstone',
      'ae2:calculation_processor'
    );
    addShapedComponentRecipe(
      i16k,
      i4k,
      '#c:quartz_glass',
      '#c:dusts/glowstone',
      'ae2:calculation_processor'
    );
    addShapedComponentRecipe(
      i64k,
      i16k,
      '#c:quartz_glass',
      '#c:dusts/glowstone',
      'ae2:calculation_processor'
    );
    addShapedComponentRecipe(
      i256k,
      i64k,
      '#c:quartz_glass',
      'ae2:sky_dust',
      'ae2:calculation_processor'
    );

    addCellComponentAssembly(
      'ae2:certus_quartz_crystal',
      i1k,
      'createdelightcore:redstone_paste',
      'ae2:certus_quartz_crystal',
      'ae2:logic_processor',
      QUARTZ_GLASS,
      REDSTONE_DUST
    );

    addCellComponentAssembly(
      i1k,
      i4k,
      'createdelightcore:redstone_paste',
      i1k,
      'ae2:calculation_processor',
      QUARTZ_GLASS,
      REDSTONE_DUST
    );

    addCellComponentAssembly(
      i4k,
      i16k,
      'createdelightcore:glowstone_paste',
      i4k,
      'ae2:calculation_processor',
      QUARTZ_GLASS,
      GLOWSTONE_DUST
    );

    addCellComponentAssembly(
      i16k,
      i64k,
      'createdelightcore:glowstone_paste',
      i16k,
      'ae2:calculation_processor',
      QUARTZ_GLASS,
      GLOWSTONE_DUST
    );

    addCellComponentAssembly(
      i64k,
      i256k,
      'createdelightcore:sky_stone_paste',
      i64k,
      'ae2:calculation_processor',
      QUARTZ_GLASS,
      'ae2:sky_dust'
    );

    create
      .mechanical_crafting('ae2:cell_component_1k', ['ABA', 'BCB', 'ABA'], {
        A: '#c:dusts/redstone',
        B: '#c:gems/certus_quartz',
        C: 'ae2:logic_processor',
      })
      .id(componentRecipeId(i1k, 'mechanical_crafting'));
    create
      .mechanical_crafting('ae2:cell_component_4k', ['ABA', 'CDC', 'ACA'], {
        A: '#c:dusts/redstone',
        B: 'ae2:calculation_processor',
        C: 'ae2:cell_component_1k',
        D: 'ae2:quartz_glass',
      })
      .id(componentRecipeId(i4k, 'mechanical_crafting'));
    create
      .mechanical_crafting('ae2:cell_component_16k', ['ABA', 'CDC', 'ACA'], {
        A: '#c:dusts/glowstone',
        B: 'ae2:calculation_processor',
        C: 'ae2:cell_component_4k',
        D: 'ae2:quartz_glass',
      })
      .id(componentRecipeId(i16k, 'mechanical_crafting'));
    create
      .mechanical_crafting('ae2:cell_component_64k', ['ABA', 'CDC', 'ACA'], {
        A: '#c:dusts/glowstone',
        B: 'ae2:calculation_processor',
        C: 'ae2:cell_component_16k',
        D: 'ae2:quartz_glass',
      })
      .id(componentRecipeId(i64k, 'mechanical_crafting'));
    create
      .mechanical_crafting('ae2:cell_component_256k', ['ABA', 'CDC', 'ACA'], {
        A: 'ae2:sky_dust',
        B: 'ae2:calculation_processor',
        C: 'ae2:cell_component_64k',
        D: 'ae2:quartz_glass',
      })
      .id(componentRecipeId(i256k, 'mechanical_crafting'));

    remove_recipes_id(event, [
      'ae2:network/cells/item_storage_components_cell_1k_part',
      'ae2:network/cells/item_storage_components_cell_4k_part',
      'ae2:network/cells/item_storage_components_cell_16k_part',
      'ae2:network/cells/item_storage_components_cell_64k_part',
      'ae2:network/cells/item_storage_components_cell_256k_part',
    ]);
  });
}
