if (
  global.hasAllMods([
    'vintageimprovements',
    'create',
    'createmetallurgy',
    'createaddition',
    'createutilities',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, createaddition, createmetallurgy, vintageimprovements } = event.recipes;
    const id = (path) => `createdelightcore:vintageimprovements/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };

    event.remove({ output: '#vintageimprovements:small_springs' });
    remove_recipes_id(event, [
      'vintageimprovements:craft/grinder_belt',
      'vintageimprovements:craft/belt_grinder',
      'vintageimprovements:pressurizing/sulfur_trioxide',
      'vintageimprovements:rolling/netherite_rod',
      'vintageimprovements:rolling/netherite_plate',
      'vintageimprovements:rolling/andesite_plate',
      'vintageimprovements:crushing/scoria',
      'vintageimprovements:crushing/basalt',
      'vintageimprovements:pressurizing/sulfur_dioxide',
      'vintageimprovements:craft/spring_coiling_machine',
      'vintageimprovements:grinder_polishing/rose_quartz',
      'vintageimprovements:sequenced_assembly/recipe_card',
      'vintageimprovements:pressurizing/sulfur_trioxide_alt',
    ]);
    [
      'vintageimprovements:rolling/nethersteel_rod',
      'vintageimprovements:rolling/nethersteel_plate',
    ].forEach(removeIfPresent);

    vintageimprovements
      .pressurizing(Fluid.of('vintageimprovements:sulfur_trioxide', 500), [
        Fluid.of('vintageimprovements:sulfur_dioxide', 500),
        'vintageimprovements:vanadium_nugget',
      ])
      .processingTime(200)
      .secondaryFluidOutput(0)
      .superheated()
      .id(id('pressurizing/sulfur_trioxide'));

    createmetallurgy
      .grinding(
        ['2x create:polished_rose_quartz', CreateItem.of('create:polished_rose_quartz', 0.5)],
        'create:rose_quartz'
      )
      .id(id('grinder_polishing/rose_quartz'));

    createmetallurgy
      .grinding(
        [
          '2x createutilities:polished_amethyst',
          CreateItem.of('createutilities:polished_amethyst', 0.5),
        ],
        'minecraft:amethyst_shard'
      )
      .id(id('sandpaper_polishing/polished_amethyst'));

    const incompleteRecipeCard = 'vintageimprovements:incomplete_recipe_card';
    create
      .sequenced_assembly('vintageimprovements:recipe_card', 'create:brass_sheet', [
        create.deploying(incompleteRecipeCard, [incompleteRecipeCard, 'minecraft:redstone']),
        create.pressing(incompleteRecipeCard, incompleteRecipeCard),
        createmetallurgy.grinding(incompleteRecipeCard, incompleteRecipeCard),
      ])
      .loops(3)
      .transitionalItem(incompleteRecipeCard)
      .id(id('sequenced_assembly/recipe_card'));

    event.replaceInput(
      { mod: 'vintageimprovements' },
      'vintageimprovements:iron_spring',
      '#c:springs/between_500_2_1000'
    );

    event
      .custom({
        type: 'createaddition:rolling',
        ingredients: [{ item: 'minecraft:netherite_ingot' }],
        results: [{ id: 'vintageimprovements:netherite_rod', count: 2 }],
      })
      .id(id('rolling/netherite_ingot'));
    event
      .custom({
        type: 'createaddition:rolling',
        ingredients: [{ item: 'vintageimprovements:netherite_sheet' }],
        results: [{ id: 'vintageimprovements:netherite_wire', count: 2 }],
      })
      .id(id('rolling/netherite_sheet'));

    event
      .shaped('vintageimprovements:spring_coiling_machine', ['CA ', 'ABD', 'CA '], {
        A: 'create:iron_sheet',
        B: 'vintageimprovements:spring_coiling_machine_wheel',
        C: 'create:andesite_casing',
        D: 'createaddition:iron_rod',
      })
      .id(id('craft/spring_coiling_machine'));
  });
}
