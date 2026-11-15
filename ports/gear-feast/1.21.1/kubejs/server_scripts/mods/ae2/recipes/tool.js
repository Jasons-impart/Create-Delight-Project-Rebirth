if (global.hasAllMods(['ae2', 'create', 'createmetallurgy'])) {
  ServerEvents.recipes((event) => {
    const { create, createmetallurgy } = event.recipes;
    const id = (path) => `createdelightcore:ae2/tool/${path}`;
    const incompleteEntropyManipulator = 'createdelightcore:incomplete_entropy_manipulator';
    const incompleteChargedStaff = 'createdelightcore:incomplete_charged_staff';

    event.remove({ id: 'ae2:tools/misctools_entropy_manipulator' });
    event.remove({ id: 'ae2:tools/misctools_charged_staff' });

    create
      .sequenced_assembly('ae2:entropy_manipulator', '#c:rods/iron', [
        create.deploying(incompleteEntropyManipulator, [
          incompleteEntropyManipulator,
          'ae2:energy_cell',
        ]),
        create.deploying(incompleteEntropyManipulator, [
          incompleteEntropyManipulator,
          'ae2:engineering_processor',
        ]),
        create.deploying(incompleteEntropyManipulator, [
          incompleteEntropyManipulator,
          'ae2:fluix_crystal',
        ]),
        createmetallurgy.grinding(incompleteEntropyManipulator, incompleteEntropyManipulator),
      ])
      .transitionalItem(incompleteEntropyManipulator)
      .loops(1)
      .id(id('entropy_manipulator'));

    create
      .sequenced_assembly('ae2:charged_staff', '#c:rods/iron', [
        create.deploying(incompleteChargedStaff, [
          incompleteChargedStaff,
          'ae2:charged_certus_quartz_crystal',
        ]),
        createmetallurgy.grinding(incompleteChargedStaff, incompleteChargedStaff),
      ])
      .transitionalItem(incompleteChargedStaff)
      .loops(1)
      .id(id('charged_staff'));
  });
}

if (global.hasMod('ae2')) {
  ServerEvents.recipes((event) => {
    const { kubejs } = event.recipes;
    const id = (path) => `createdelightcore:ae2/tool/${path}`;

    event.remove({ id: 'ae2:decorative/quartz_fixture_from_anchors' });

    kubejs
      .shapeless('ae2:meteorite_compass', [
        '#c:plates/copper',
        'minecraft:baked_potato',
        '#c:plates/zinc',
        '#minecraft:compasses',
      ])
      .keepIngredient('#c:plates/copper')
      .keepIngredient('#c:plates/zinc')
      .keepIngredient('minecraft:baked_potato')
      .id(id('meteorite_compass'));

    kubejs
      .shapeless('ae2:guide', [
        '#c:plates/copper',
        'minecraft:baked_potato',
        '#c:plates/zinc',
        'minecraft:book',
      ])
      .keepIngredient('#c:plates/copper')
      .keepIngredient('#c:plates/zinc')
      .keepIngredient('minecraft:baked_potato')
      .id(id('guide'));

    kubejs
      .shaped('4x ae2:quartz_fixture', ['A', 'B'], {
        A: 'ae2:charged_certus_quartz_crystal',
        B: 'ae2:cable_anchor',
      })
      .id(id('quartz_fixture'));
  });
}
