if (global.hasAllMods(['ae2', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/card/${path}`;
    const incompleteBasicCard = 'createdelightcore:incomplete_basic_card';
    const incompleteAdvancedCard = 'createdelightcore:incomplete_advanced_card';

    remove_recipes_id(event, ['ae2:materials/basiccard', 'ae2:materials/advancedcard']);

    kubejs
      .shaped('ae2:basic_card', ['ABB', 'CDB', 'ABB'], {
        A: '#c:ingots/gold',
        B: '#c:plates/iron',
        C: '#c:dusts/redstone',
        D: 'ae2:calculation_processor',
      })
      .id(id('basic_card'));

    create
      .sequenced_assembly(Item.of('ae2:basic_card', 8), 'ae2:calculation_processor', [
        create.deploying(incompleteBasicCard, [
          incompleteBasicCard,
          Ingredient.of('#c:ingots/gold'),
        ]),
        create.deploying(incompleteBasicCard, [
          incompleteBasicCard,
          Ingredient.of('#c:ingots/steel'),
        ]),
        create.deploying(incompleteBasicCard, [
          incompleteBasicCard,
          Ingredient.of('#c:dusts/redstone'),
        ]),
        vintageimprovements.laser_cutting(incompleteBasicCard, incompleteBasicCard),
      ])
      .transitionalItem(incompleteBasicCard)
      .loops(1)
      .id(id('sequenced_assembly/basic_card'));

    kubejs
      .shaped('ae2:advanced_card', ['ABB', 'CDB', 'ABB'], {
        A: '#c:gems/diamond',
        B: '#c:plates/iron',
        C: '#c:dusts/redstone',
        D: 'ae2:calculation_processor',
      })
      .id(id('advanced_card'));

    create
      .sequenced_assembly(Item.of('ae2:advanced_card', 8), 'ae2:calculation_processor', [
        create.deploying(incompleteAdvancedCard, [
          incompleteAdvancedCard,
          Ingredient.of('#c:gems/diamond'),
        ]),
        create.deploying(incompleteAdvancedCard, [
          incompleteAdvancedCard,
          Ingredient.of('#c:ingots/steel'),
        ]),
        create.deploying(incompleteAdvancedCard, [
          incompleteAdvancedCard,
          Ingredient.of('#c:dusts/redstone'),
        ]),
        vintageimprovements.laser_cutting(incompleteAdvancedCard, incompleteAdvancedCard),
      ])
      .transitionalItem(incompleteAdvancedCard)
      .loops(1)
      .id(id('sequenced_assembly/advanced_card'));
  });
}
