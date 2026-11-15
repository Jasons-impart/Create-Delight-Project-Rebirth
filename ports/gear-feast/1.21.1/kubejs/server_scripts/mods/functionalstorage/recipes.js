if (global.hasAllMods(['functionalstorage', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const transitional = 'createdelightcore:incomplete_fs_upgrade';
    const fsUpgrade = (input, result, a, b, c) => {
      create
        .sequenced_assembly(result, input, [
          create.deploying(transitional, [transitional, a]),
          create.deploying(transitional, [transitional, b]),
          create.deploying(transitional, [transitional, c]),
        ])
        .loops(1)
        .transitionalItem(transitional)
        .id(`createdelightcore:functionalstorage/${result.split(':')[1]}_sequenced_assembly`);
    };

    create
      .sequenced_assembly('functionalstorage:copper_upgrade', '#functionalstorage:drawer', [
        create.deploying(transitional, [transitional, 'minecraft:copper_ingot']),
        create.deploying(transitional, [transitional, 'minecraft:copper_block']),
        create.deploying(transitional, [transitional, 'minecraft:chest']),
      ])
      .loops(1)
      .transitionalItem(transitional)
      .id('createdelightcore:functionalstorage/copper_upgrade_sequenced_assembly');

    fsUpgrade(
      'functionalstorage:copper_upgrade',
      'functionalstorage:gold_upgrade',
      'minecraft:gold_ingot',
      'minecraft:gold_block',
      'minecraft:chest'
    );
    fsUpgrade(
      'functionalstorage:gold_upgrade',
      'functionalstorage:diamond_upgrade',
      'minecraft:diamond',
      'minecraft:diamond_block',
      'minecraft:chest'
    );
    fsUpgrade(
      '#functionalstorage:drawer',
      'functionalstorage:iron_downgrade',
      'minecraft:iron_ingot',
      'minecraft:iron_ingot',
      'minecraft:iron_ingot'
    );

    event.replaceInput(
      { id: 'functionalstorage:compacting_drawer' },
      'minecraft:stone',
      '#c:stones'
    );
    event.replaceInput(
      { id: 'functionalstorage:simple_compacting_drawer' },
      'minecraft:stone',
      '#c:stones'
    );
  });
}
