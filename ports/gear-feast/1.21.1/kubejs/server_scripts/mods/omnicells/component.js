if (global.hasAllMods(['ae2', 'ae2omnicells', 'create', 'createutilities'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:ae2/omnicells/component/${path}`;
    const tiers = ['1k', '4k', '16k', '64k', '256k', '1m', '4m', '16m', '64m', '256m'];

    function addOmniCellComponent(result, firstLayer, processor, previousComponent, glass) {
      create
        .mechanical_crafting(
          Item.of(result, 18),
          [
            'AAAAAAAAA',
            'AAAAAAAAA',
            'BBBBBBBBB',
            'CCCCCCCCC',
            'DDDDDDDDD',
            'CCCCCCCCC',
            'BBBBBBBBB',
            'AAAAAAAAA',
            'AAAAAAAAA',
          ],
          {
            A: firstLayer,
            B: processor,
            C: previousComponent,
            D: glass,
          }
        )
        .id(id(`mechanical_crafting/${result.split(':')[1]}`));
    }

    function addComponentChain(cfg) {
      tiers.forEach((tier, index) => {
        const result = `${cfg.prefix}${tier}`;
        const previous = index === 0 ? cfg.firstInput : `${cfg.prefix}${tiers[index - 1]}`;

        addOmniCellComponent(
          result,
          index === 0 ? cfg.firstLayer : 'minecraft:redstone',
          cfg.processor,
          previous,
          index === 0 ? 'ae2:cell_component_1k' : '#createdelightcore:quartz_glass'
        );
      });
    }

    addComponentChain({
      prefix: 'ae2omnicells:omni_cell_component_',
      processor: 'ae2omnicells:omni_link_processor',
      firstLayer: 'minecraft:redstone',
      firstInput: 'createutilities:void_steel_ingot',
    });

    addComponentChain({
      prefix: 'ae2omnicells:complex_omni_cell_component_',
      processor: 'ae2omnicells:complex_link_processor',
      firstLayer: 'minecraft:glowstone_dust',
      firstInput: 'ae2omnicells:charged_ender_ingot',
    });

    addComponentChain({
      prefix: 'ae2omnicells:quantum_omni_cell_component_',
      processor: 'ae2omnicells:multidimensional_expansion_processor',
      firstLayer: 'ae2:ender_dust',
      firstInput: 'ae2omnicells:charged_ender_ingot',
    });
  });
}
