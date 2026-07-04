if (global.hasAllMods(['ae2', 'create', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    const { create, kubejs, minecraft, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:ae2/material/${path}`;

    const cellHousingHead = 'createdelightcore:cell_housing_curving_head';
    const incompleteAnnihilationCore = 'createdelightcore:incomplete_annihilation_core';
    const incompleteFormationCore = 'createdelightcore:incomplete_formation_core';

    const certusQuartzGem = Ingredient.of('#c:gems/certus_quartz');
    const fluixDust = Ingredient.of('#c:dusts/fluix');
    const quartzGem = Ingredient.of('#c:gems/quartz');

    vintageimprovements
      .curving('4x createdelightcore:quartz_glass_parts', 'ae2:quartz_glass')
      .itemAsHead(cellHousingHead)
      .id(id('curving/quartz_glass_parts'));

    vintageimprovements
      .curving('4x createdelightcore:quartz_vibrant_glass_parts', 'ae2:quartz_vibrant_glass')
      .itemAsHead(cellHousingHead)
      .id(id('curving/quartz_vibrant_glass_parts'));

    kubejs
      .shapeless(cellHousingHead, ['#c:storage_blocks/iron', '#ae2:knife'])
      .damageIngredient('#ae2:knife')
      .id(id('cell_housing_curving_head'));

    create
      .mixing('ae2:fluix_pearl', [
        Ingredient.of('#c:ender_pearls'),
        Ingredient.of('#c:gems/fluix').withCount(2),
      ])
      .id(id('mixing/fluix_pearl_from_gems'));

    create
      .mixing('ae2:fluix_pearl', [
        Ingredient.of('#c:ender_pearls'),
        Ingredient.of('#c:dusts/fluix').withCount(2),
      ])
      .id(id('mixing/fluix_pearl_from_dusts'));

    create
      .mixing('ae2:fluix_pearl', [
        Ingredient.of('#c:ender_pearls'),
        Ingredient.of('#c:gems/fluix'),
        Ingredient.of('#c:dusts/fluix'),
      ])
      .id(id('mixing/fluix_pearl_from_gem_and_dust'));

    kubejs
      .shaped('ae2:annihilation_core', ['AAA', 'BCD', 'AAA'], {
        A: '#c:plates/iron',
        B: '#c:gems/quartz',
        C: '#c:dusts/fluix',
        D: 'ae2:logic_processor',
      })
      .id(id('annihilation_core'));

    kubejs
      .shaped('4x ae2:annihilation_core', ['AAA', 'BCD', 'AAA'], {
        A: '#c:plates/steel',
        B: '#c:gems/quartz',
        C: '#c:dusts/fluix',
        D: 'ae2:logic_processor',
      })
      .id(id('annihilation_core_from_steel'));

    create
      .sequenced_assembly('4x ae2:annihilation_core', 'createdelightcore:steel_sheet', [
        create.deploying(incompleteAnnihilationCore, [incompleteAnnihilationCore, quartzGem]),
        create.deploying(incompleteAnnihilationCore, [
          incompleteAnnihilationCore,
          'ae2:logic_processor',
        ]),
        create.deploying(incompleteAnnihilationCore, [incompleteAnnihilationCore, fluixDust]),
      ])
      .transitionalItem(incompleteAnnihilationCore)
      .loops(1)
      .id(id('sequenced_assembly/annihilation_core'));

    kubejs
      .shaped('ae2:formation_core', ['AAA', 'BCD', 'AAA'], {
        A: '#c:plates/iron',
        B: '#c:gems/certus_quartz',
        C: '#c:dusts/fluix',
        D: 'ae2:logic_processor',
      })
      .id(id('formation_core'));

    kubejs
      .shaped('4x ae2:formation_core', ['AAA', 'BCD', 'AAA'], {
        A: '#c:plates/steel',
        B: '#c:gems/certus_quartz',
        C: '#c:dusts/fluix',
        D: 'ae2:logic_processor',
      })
      .id(id('formation_core_from_steel'));

    create
      .sequenced_assembly('4x ae2:formation_core', 'createdelightcore:steel_sheet', [
        create.deploying(incompleteFormationCore, [incompleteFormationCore, certusQuartzGem]),
        create.deploying(incompleteFormationCore, [incompleteFormationCore, 'ae2:logic_processor']),
        create.deploying(incompleteFormationCore, [incompleteFormationCore, fluixDust]),
      ])
      .transitionalItem(incompleteFormationCore)
      .loops(1)
      .id(id('sequenced_assembly/formation_core'));

    kubejs
      .shaped('createdelightcore:space_casing', ['ABA', 'CDC', 'ACA'], {
        A: 'createdelightcore:phase_transition_iron',
        B: 'ae2:singularity',
        C: 'ae2:fluix_pearl',
        D: '#c:storage_blocks/sky_steel',
      })
      .id(id('space_casing'));

    minecraft
      .stonecutting(Item.of('createdelightcore:iron_casing', 4), '#c:storage_blocks/iron')
      .id(id('stonecutting/iron_casing'));

    minecraft
      .stonecutting(Item.of('createdelightcore:sky_steel_casing', 4), '#c:storage_blocks/sky_steel')
      .id(id('stonecutting/sky_steel_casing'));

    create
      .item_application(
        [CreateItem.of('ae2:flawless_budding_quartz', 0.5)],
        ['ae2:flawed_budding_quartz', 'ae2:flawed_budding_quartz']
      )
      .id(id('item_application/flawless_budding_quartz'));

    create
      .item_application(
        [CreateItem.of('ae2:flawed_budding_quartz', 0.5)],
        ['ae2:chipped_budding_quartz', 'ae2:chipped_budding_quartz']
      )
      .id(id('item_application/flawed_budding_quartz'));

    create
      .item_application(
        [CreateItem.of('ae2:chipped_budding_quartz', 0.5)],
        ['ae2:damaged_budding_quartz', 'ae2:damaged_budding_quartz']
      )
      .id(id('item_application/chipped_budding_quartz'));

    create
      .item_application(
        [CreateItem.of('ae2:damaged_budding_quartz', 0.5)],
        ['ae2:quartz_block', 'ae2:quartz_block']
      )
      .id(id('item_application/damaged_budding_quartz'));

    kubejs
      .shaped('3x ae2:semi_dark_monitor', ['ABC', 'ADC', 'ABC'], {
        A: '#c:ingots/iron',
        B: '#c:dusts/glowstone',
        C: 'ae2:quartz_glass',
        D: '#c:dusts/redstone',
      })
      .id(id('semi_dark_monitor'));

    event.replaceInput(
      { id: 'ae2:network/parts/panels_semi_dark_monitor' },
      'minecraft:iron_ingot',
      '#c:plates/iron'
    );

    create
      .splashing(
        'ae2:fluix_covered_cable',
        Ingredient.of('#ae2:covered_cable').except('ae2:fluix_covered_cable')
      )
      .id(id('splashing/fluix_covered_cable'));

    create
      .splashing(
        'ae2:fluix_glass_cable',
        Ingredient.of('#ae2:glass_cable').except('ae2:fluix_glass_cable')
      )
      .id(id('splashing/fluix_glass_cable'));

    create
      .splashing(
        'ae2:fluix_covered_dense_cable',
        Ingredient.of('#ae2:covered_dense_cable').except('ae2:fluix_covered_dense_cable')
      )
      .id(id('splashing/fluix_covered_dense_cable'));

    create
      .splashing(
        'ae2:fluix_smart_cable',
        Ingredient.of('#ae2:smart_cable').except('ae2:fluix_smart_cable')
      )
      .id(id('splashing/fluix_smart_cable'));

    create
      .splashing(
        'ae2:fluix_smart_dense_cable',
        Ingredient.of('#ae2:smart_dense_cable').except('ae2:fluix_smart_dense_cable')
      )
      .id(id('splashing/fluix_smart_dense_cable'));
  });
}

if (global.hasAllMods(['ae2', 'create', 'vintageimprovements', 'createmetallurgy'])) {
  ServerEvents.recipes((event) => {
    const { vintageimprovements } = event.recipes;
    const cokeBlocks = [Fluid.of('minecraft:lava', 250)];

    for (let i = 0; i < 4; i++) {
      cokeBlocks.push('createmetallurgy:coke_block');
    }

    vintageimprovements
      .pressurizing('createdelightcore:mmd_diamond', cokeBlocks)
      .superheated()
      .id('createdelightcore:ae2/material/pressurizing/mmd_diamond');
  });
}

if (global.hasAllMods(['ae2', 'vintageimprovements', 'mynethersdelight'])) {
  ServerEvents.recipes((event) => {
    const { vintageimprovements } = event.recipes;
    const phaseTransitionIronIngredients = ['mynethersdelight:bullet_pepper'];

    for (let i = 0; i < 16; i++) {
      phaseTransitionIronIngredients.push(Ingredient.of('#c:storage_blocks/iron'));
    }

    vintageimprovements
      .pressurizing('createdelightcore:phase_transition_iron', phaseTransitionIronIngredients)
      .id('createdelightcore:ae2/material/pressurizing/phase_transition_iron');
  });
}

if (global.hasAllMods(['ae2', 'megacells', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    event.recipes.vintageimprovements
      .pressurizing('megacells:accumulation_processor_press', [
        'ae2:engineering_processor_press',
        'ae2:singularity',
        'ae2:calculation_processor_press',
        Fluid.of('minecraft:lava', 250),
      ])
      .id('createdelightcore:ae2/material/pressurizing/accumulation_processor_press');
  });
}

if (global.hasAllMods(['ae2', 'northstar'])) {
  ServerEvents.recipes((event) => {
    event.recipes.kubejs
      .shaped('4x ae2:fluix_covered_cable', [' A ', 'ABA', ' A '], {
        A: 'ae2:fluix_glass_cable',
        B: 'northstar:durable_fabric',
      })
      .id('createdelightcore:ae2/material/fluix_covered_cable_from_durable_fabric');
  });
}
