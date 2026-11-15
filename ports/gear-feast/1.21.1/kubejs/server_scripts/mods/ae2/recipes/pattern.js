if (global.hasAllMods(['ae2', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/pattern/${path}`;
    const cellHousingHead = 'createdelightcore:cell_housing_curving_head';
    const incompleteBlankPattern = 'createdelightcore:incomplete_blank_pattern';

    event.remove({ id: 'ae2:network/crafting/patterns_blank' });

    create
      .sequenced_assembly('4x ae2:blank_pattern', '#c:plates/iron', [
        create.deploying(incompleteBlankPattern, [
          incompleteBlankPattern,
          Ingredient.of('#createdelightcore:quartz_vibrant_glass'),
        ]),
        create.deploying(incompleteBlankPattern, [
          incompleteBlankPattern,
          'ae2:certus_quartz_crystal',
        ]),
        vintageimprovements
          .curving(incompleteBlankPattern, incompleteBlankPattern)
          .itemAsHead(cellHousingHead),
      ])
      .transitionalItem(incompleteBlankPattern)
      .loops(1)
      .id(id('blank_pattern_from_vibrant_glass'));

    create
      .sequenced_assembly('4x ae2:blank_pattern', '#c:plates/iron', [
        create.deploying(incompleteBlankPattern, [
          incompleteBlankPattern,
          Ingredient.of('#c:dusts/glowstone'),
        ]),
        create.deploying(incompleteBlankPattern, [
          incompleteBlankPattern,
          Ingredient.of('#createdelightcore:quartz_glass'),
        ]),
        create.deploying(incompleteBlankPattern, [
          incompleteBlankPattern,
          'ae2:certus_quartz_crystal',
        ]),
        vintageimprovements
          .curving(incompleteBlankPattern, incompleteBlankPattern)
          .itemAsHead(cellHousingHead),
      ])
      .transitionalItem(incompleteBlankPattern)
      .loops(1)
      .id(id('blank_pattern_from_glowstone'));
  });
}

if (global.hasAllMods(['ae2', 'extendedae', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/extendedae/pattern/${path}`;
    const incompletePatternModifier = 'createdelightcore:incomplete_pattern_modifier';

    event.remove({ id: 'extendedae:pattern_modifier' });

    create
      .sequenced_assembly('extendedae:pattern_modifier', 'ae2:blank_pattern', [
        create.deploying(incompletePatternModifier, [
          incompletePatternModifier,
          'ae2:logic_processor',
        ]),
        create.deploying(incompletePatternModifier, [
          incompletePatternModifier,
          Ingredient.of('#c:dyes/green'),
        ]),
        vintageimprovements
          .curving(incompletePatternModifier, incompletePatternModifier)
          .itemAsHead('createdelightcore:cell_housing_curving_head'),
      ])
      .transitionalItem(incompletePatternModifier)
      .loops(1)
      .id(id('pattern_modifier'));
  });
}
