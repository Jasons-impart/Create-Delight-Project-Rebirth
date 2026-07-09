if (global.hasMod('iceandfire')) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:iceandfire/${path}`;

    remove_recipes_id(event, [
      'iceandfire:copper_nuggets_to_ingot',
      'iceandfire:copper_ingot_to_nuggets',
      'iceandfire:armor_copper_metal_helmet',
      'iceandfire:armor_copper_metal_chestplate',
      'iceandfire:armor_copper_metal_leggings',
      'iceandfire:armor_copper_metal_boots',
      'iceandfire:copper_sword',
      'iceandfire:copper_shovel',
      'iceandfire:copper_pickaxe',
      'iceandfire:copper_axe',
      'iceandfire:copper_hoe',
    ]);

    const removableOutputs = [
      'iceandfire:dragonsteel_fire_sword',
      'iceandfire:dragonsteel_fire_pickaxe',
      'iceandfire:dragonsteel_fire_axe',
      'iceandfire:dragonsteel_fire_shovel',
      'iceandfire:dragonsteel_fire_hoe',
      'iceandfire:dragonsteel_ice_pickaxe',
      'iceandfire:dragonsteel_ice_sword',
      'iceandfire:dragonsteel_ice_axe',
      'iceandfire:dragonsteel_ice_shovel',
      'iceandfire:dragonsteel_ice_hoe',
      'iceandfire:dragonsteel_lightning_sword',
      'iceandfire:dragonsteel_lightning_pickaxe',
      'iceandfire:dragonsteel_lightning_axe',
      'iceandfire:dragonsteel_lightning_shovel',
      'iceandfire:dragonsteel_lightning_hoe',
      'dreadsteel:dreadsteel_ingot',
    ].filter((item) => true);

    if (removableOutputs.length) {
      remove_recipes_output(event, removableOutputs);
    }

    event.replaceInput(
      { id: 'iceandfire:dragon_meal' },
      Ingredient.of('#iceandfire:dragon_food_meat'),
      Ingredient.of('#c:foods/raw_meat')
    );

    event.recipes.create
      .haunting(CreateItem.of('iceandfire:rotten_egg', 0.25), 'minecraft:egg')
      .id(id('haunting/rotten_egg'));

    [
      ['fire', 'fire'],
      ['ice', 'ice'],
      ['lightning', 'lightning'],
    ].forEach(([name, path]) => {
      const bloodFluid = `createdelightcore:${name}_dragon_blood`;
      const flesh = `iceandfire:${name}_dragon_flesh`;
      const heart = `iceandfire:${name}_dragon_heart`;
      const bloodBottle = `iceandfire:${name}_dragon_blood`;
      const dragonboneSword = `iceandfire:dragonbone_sword_${path}`;

      event.recipes.create
        .mixing(Fluid.of(bloodFluid, 30), flesh)
        .id(id(`mixing/${path}_dragon_blood_from_flesh`));

      event.recipes.create
        .mixing(Fluid.of(bloodFluid, 90), heart)
        .id(id(`mixing/${path}_dragon_blood_from_heart`));

      event.recipes.create
        .filling(dragonboneSword, ['iceandfire:dragonbone_sword', Fluid.of(bloodFluid, 250)])
        .id(id(`filling/dragonbone_sword_${path}`));

      event.recipes.create
        .filling(bloodBottle, ['minecraft:glass_bottle', Fluid.of(bloodFluid, 250)])
        .id(id(`filling/${path}_dragon_blood_bottle`));

      event.recipes.create
        .emptying([Fluid.of(bloodFluid, 250), 'minecraft:glass_bottle'], bloodBottle)
        .id(id(`emptying/${path}_dragon_blood_bottle`));
    });
  });
}
