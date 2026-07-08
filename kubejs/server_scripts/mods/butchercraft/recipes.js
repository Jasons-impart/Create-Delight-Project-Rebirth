if (global.hasAllMods(['butchercraft', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create, farmersdelight, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:butchercraft/${path}`;
    const removeIfPresent = (recipeId) => {
      if (!event.findRecipeIds(recipeId).isEmpty()) {
        event.remove({ id: recipeId });
      }
    };
    const itemId = (stack) => String(stack).replace(/^\d+x\s+/, '');

    const createCutting = (output, input, path) => {
      create.cutting(output, input).id(id(`cutting/${path}`));
    };
    const fdCutting = (input, outputs, path) => {
      farmersdelight
        .cutting(input, 'butchercraft:butcher_knife', outputs)
        .id(id(`cutting/${path}`));
    };
    const milling = (output, input, path) => {
      create.milling(output, input).id(id(`milling/${path}`));
    };

    if (global.hasMod('supplementaries')) {
      removeIfPresent('supplementaries:soap');

      event
        .shapeless('supplementaries:soap', [
          Item.of('minecraft:water_bucket'),
          '4x supplementaries:ash',
          'butchercraft:lard',
        ])
        .id(id('crafting/soap'));
    }

    create
      .emptying(
        [Fluid.of('butchercraft:blood_fluid', 250), 'minecraft:glass_bottle'],
        ['butchercraft:blood_fluid_bottle']
      )
      .id(id('emptying/blood_bottle'));

    create
      .filling('butchercraft:blood_fluid_bottle', [
        'minecraft:glass_bottle',
        Fluid.of('butchercraft:blood_fluid', 250),
      ])
      .id(id('filling/blood_bottle'));

    create
      .splashing(
        ['minecraft:slime_ball', CreateItem.of('minecraft:slime_ball', 0.1)],
        'butchercraft:gelatin'
      )
      .id(id('splashing/gelatin'));
    kubejs
      .shapeless('minecraft:slime_ball', ['minecraft:water_bucket', 'butchercraft:gelatin'])
      .id(id('crafting/gelatin_to_slime_ball'));
    create
      .mixing('minecraft:slime_ball', [Fluid.water(250), 'butchercraft:gelatin'])
      .id(id('mixing/gelatin_to_slime_ball'));

    const animals = [
      ['beef', 'minecraft:beef', 'minecraft:cooked_beef'],
      ['pork', 'minecraft:porkchop', 'minecraft:cooked_porkchop'],
      ['lamb', 'minecraft:mutton', 'minecraft:cooked_mutton'],
      ['goat', 'butchercraft:goat_chop', 'butchercraft:cooked_goat_chop'],
    ];

    animals.forEach(([animal, rawMeat, cookedMeat]) => {
      createCutting(
        `butchercraft:${animal}_roast`,
        `butchercraft:${animal}_ribs`,
        `${animal}_ribs`
      );
      createCutting(
        `butchercraft:cooked_${animal}_roast`,
        `butchercraft:cooked_${animal}_ribs`,
        `cooked_${animal}_ribs`
      );
      createCutting(`4x ${rawMeat}`, `butchercraft:${animal}_roast`, `${animal}_roast`);
      createCutting(
        `4x ${cookedMeat}`,
        `butchercraft:cooked_${animal}_roast`,
        `cooked_${animal}_roast`
      );

      fdCutting(
        `butchercraft:${animal}_ribs`,
        [`butchercraft:${animal}_roast`, '4x minecraft:bone'],
        `${animal}_ribs_fd`
      );
      fdCutting(
        `butchercraft:cooked_${animal}_ribs`,
        [`butchercraft:cooked_${animal}_roast`, '4x minecraft:bone'],
        `cooked_${animal}_ribs_fd`
      );
      fdCutting(
        `butchercraft:cubed_${animal}`,
        [`2x butchercraft:${animal}_stewmeat`],
        `cubed_${animal}`
      );
      fdCutting(
        `butchercraft:cooked_cubed_${animal}`,
        [`2x butchercraft:cooked_${animal}_stewmeat`],
        `cooked_cubed_${animal}`
      );
      fdCutting(`butchercraft:${animal}_roast`, [`4x ${rawMeat}`], `${animal}_roast_fd`);
      fdCutting(
        `butchercraft:cooked_${animal}_roast`,
        [`4x ${cookedMeat}`],
        `cooked_${animal}_roast_fd`
      );
      fdCutting(rawMeat, [`2x butchercraft:cubed_${animal}`], `${animal}_meat`);
      fdCutting(cookedMeat, [`2x butchercraft:cooked_cubed_${animal}`], `cooked_${animal}_meat`);

      milling(
        `butchercraft:ground_${animal}`,
        `butchercraft:${animal}_stewmeat`,
        `${animal}_stewmeat`
      );
      milling(
        `2x butchercraft:ground_${animal}`,
        `butchercraft:cubed_${animal}`,
        `cubed_${animal}`
      );
      milling(
        `4x butchercraft:ground_${animal}`,
        `butchercraft:${animal}_scraps`,
        `${animal}_scraps`
      );
      milling(
        `butchercraft:cooked_ground_${animal}`,
        `butchercraft:cooked_${animal}_stewmeat`,
        `cooked_${animal}_stewmeat`
      );
      milling(
        `2x butchercraft:cooked_ground_${animal}`,
        `butchercraft:cooked_cubed_${animal}`,
        `cooked_cubed_${animal}`
      );
      milling(
        `4x butchercraft:cooked_ground_${animal}`,
        `butchercraft:cooked_${animal}_scraps`,
        `cooked_${animal}_scraps`
      );
      milling(`4x butchercraft:ground_${animal}`, rawMeat, animal);
      milling(`4x butchercraft:cooked_ground_${animal}`, cookedMeat, `cooked_${animal}`);
    });

    const poultryCuts = [
      ['chicken_breast', ['2x butchercraft:cubed_chicken']],
      ['chicken_leg', ['butchercraft:cubed_chicken', 'minecraft:bone']],
      ['chicken_thigh', ['butchercraft:cubed_chicken', 'minecraft:bone']],
      ['chicken_wing', ['butchercraft:cubed_chicken', 'minecraft:bone']],
      ['cooked_chicken_breast', ['2x butchercraft:cooked_cubed_chicken']],
      ['cooked_chicken_leg', ['butchercraft:cooked_cubed_chicken', 'minecraft:bone']],
      ['cooked_chicken_thigh', ['butchercraft:cooked_cubed_chicken', 'minecraft:bone']],
      ['cooked_chicken_wing', ['butchercraft:cooked_cubed_chicken', 'minecraft:bone']],
      ['rabbit_saddle', ['2x butchercraft:cubed_rabbit']],
      ['rabbit_leg', ['butchercraft:cubed_rabbit', 'minecraft:bone']],
      ['rabbit_thigh', ['butchercraft:cubed_rabbit', 'minecraft:bone']],
      ['cooked_rabbit_saddle', ['2x butchercraft:cooked_cubed_rabbit']],
      ['cooked_rabbit_leg', ['butchercraft:cooked_cubed_rabbit', 'minecraft:bone']],
      ['cooked_rabbit_thigh', ['butchercraft:cooked_cubed_rabbit', 'minecraft:bone']],
    ];

    poultryCuts.forEach(([input, outputs]) => {
      fdCutting(`butchercraft:${input}`, outputs, input);
    });

    ['chicken', 'rabbit'].forEach((animal) => {
      fdCutting(
        `butchercraft:cubed_${animal}`,
        [`2x butchercraft:${animal}_stewmeat`],
        `cubed_${animal}`
      );
      fdCutting(
        `butchercraft:cooked_cubed_${animal}`,
        [`2x butchercraft:cooked_${animal}_stewmeat`],
        `cooked_cubed_${animal}`
      );
      milling(
        `butchercraft:ground_${animal}`,
        `butchercraft:${animal}_stewmeat`,
        `${animal}_stewmeat`
      );
      milling(
        `2x butchercraft:ground_${animal}`,
        `butchercraft:cubed_${animal}`,
        `cubed_${animal}`
      );
      milling(
        `4x butchercraft:ground_${animal}`,
        `butchercraft:${animal}_scraps`,
        `${animal}_scraps`
      );
      milling(
        `butchercraft:cooked_ground_${animal}`,
        `butchercraft:cooked_${animal}_stewmeat`,
        `cooked_${animal}_stewmeat`
      );
      milling(
        `2x butchercraft:cooked_ground_${animal}`,
        `butchercraft:cooked_cubed_${animal}`,
        `cooked_cubed_${animal}`
      );
      milling(
        `4x butchercraft:cooked_ground_${animal}`,
        `butchercraft:cooked_${animal}_scraps`,
        `cooked_${animal}_scraps`
      );
    });

    const largeSkulls = [
      'butchercraft:cow_skull_head_item',
      'butchercraft:sheep_skull_head_item',
      'butchercraft:pig_skull_head_item',
      'butchercraft:goat_skull_head_item',
    ];
    if (largeSkulls.length > 0) {
      create
        .crushing(
          ['4x minecraft:bone_meal', CreateItem.of(Item.of('4x minecraft:bone_meal'), 0.25)],
          Ingredient.of(largeSkulls)
        )
        .id(id('crushing/large_skull_head'));
    }

    const smallSkulls = [
      'butchercraft:chicken_skull_head_item',
      'butchercraft:rabbit_skull_head_item',
    ];
    if (smallSkulls.length > 0) {
      create
        .crushing(
          ['3x minecraft:bone_meal', CreateItem.of(Item.of('2x minecraft:bone_meal'), 0.25)],
          Ingredient.of(smallSkulls)
        )
        .id(id('crushing/small_skull_head'));
    }

    [
      ['cow_hide', '8x minecraft:leather'],
      ['pig_hide', '6x minecraft:leather'],
      ['sheep_hide', '6x minecraft:leather'],
      ['goat_hide', '6x minecraft:leather'],
    ].forEach(([hide, leather]) => {
      createCutting(leather, `butchercraft:${hide}`, `${hide}_create`);
      fdCutting(`butchercraft:${hide}`, [leather], hide);
    });

    kubejs
      .shapeless('8x butchercraft:blood_sausage_mix', [
        Ingredient.of('#c:ground_meat/raw'),
        Ingredient.of('#c:ground_meat/raw'),
        Ingredient.of('#c:ground_meat/raw'),
        Ingredient.of('#c:ground_meat/raw'),
        Ingredient.of('#c:ground_meat/raw'),
        Ingredient.of('#c:ground_meat/raw'),
        'butchercraft:fat',
        'ratatouille:wheat_kernels',
        'butchercraft:blood_fluid_bottle',
      ])
      .id(id('crafting/blood_sausage_mix'));

    if (global.fluidExists('butchercraft:blood_fluid')) {
      create
        .mixing('8x butchercraft:blood_sausage_mix', [
          Ingredient.of('#c:ground_meat/raw').withCount(6),
          Fluid.of('butchercraft:blood_fluid', 250),
          'butchercraft:fat',
          'ratatouille:wheat_kernels',
        ])
        .id(id('mixing/blood_sausage_mix'));
    }
  });
}
