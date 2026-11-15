if (global.hasAllMods(['tetra', 'create', 'vintageimprovements', 'createmetallurgy'])) {
  ServerEvents.recipes((event) => {
    const { create, createmetallurgy, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:tetra/${path}`;

    const pristineAssembly = (result, input, path, chance) => {
      const outputs = chance >= 1 ? result : CreateItem.of(result, chance);

      create
        .sequenced_assembly(outputs, input, [
          vintageimprovements.laser_cutting(input, input),
          createmetallurgy.grinding(input, input),
        ])
        .loops(1)
        .transitionalItem(input)
        .id(id(`sequenced_assembly/${path}`));
    };

    pristineAssembly('tetra:pristine_lapis', 'minecraft:lapis_lazuli', 'pristine_lapis', 0.11);
    pristineAssembly('tetra:pristine_emerald', 'minecraft:emerald', 'pristine_emerald', 0.11);
    pristineAssembly(
      'tetra:pristine_emerald',
      'createoreexcavation:raw_emerald',
      'pristine_emerald_from_raw_emerald',
      1
    );
    pristineAssembly('tetra:pristine_diamond', 'minecraft:diamond', 'pristine_diamond', 0.11);
    pristineAssembly(
      'tetra:pristine_diamond',
      'createoreexcavation:raw_diamond',
      'pristine_diamond_from_raw_diamond',
      1
    );
    pristineAssembly(
      'tetra:pristine_amethyst',
      'minecraft:amethyst_shard',
      'pristine_amethyst',
      0.11
    );
    pristineAssembly('tetra:geode', 'minecraft:deepslate', 'geode', 0.011);

    create
      .cutting(
        [
          '3x minecraft:diamond',
          CreateItem.of(Item.of('minecraft:diamond', 2), 0.25),
          CreateItem.of('minecraft:diamond', 0.5),
        ],
        'tetra:pristine_diamond'
      )
      .id(id('cutting/pristine_diamond'));

    create
      .cutting(
        [
          '3x minecraft:emerald',
          CreateItem.of(Item.of('minecraft:emerald', 2), 0.25),
          CreateItem.of('minecraft:emerald', 0.5),
        ],
        'tetra:pristine_emerald'
      )
      .id(id('cutting/pristine_emerald'));

    create
      .cutting(
        [
          '4x minecraft:amethyst_shard',
          CreateItem.of(Item.of('minecraft:amethyst_shard', 3), 0.25),
          CreateItem.of(Item.of('minecraft:amethyst_shard', 2), 0.5),
        ],
        'tetra:pristine_amethyst'
      )
      .id(id('cutting/pristine_amethyst'));

    create
      .cutting(
        [
          '4x minecraft:lapis_lazuli',
          CreateItem.of(Item.of('minecraft:lapis_lazuli', 3), 0.25),
          CreateItem.of(Item.of('minecraft:lapis_lazuli', 2), 0.5),
        ],
        'tetra:pristine_lapis'
      )
      .id(id('cutting/pristine_lapis'));
  });
}
