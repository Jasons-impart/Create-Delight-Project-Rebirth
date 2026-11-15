if (global.hasAllMods(['casualnessdelight', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:casualnessdelight/${path}`;

    const itemId = (stack) => String(stack).replace(/^\d+x\s+/, '');

    const removeIfPresent = (recipeId) => {
      if (event.findRecipeIds(recipeId).length > 0) {
        event.remove({ id: recipeId });
      }
    };

    const deepFrying = (output, input, time) => {
      event.recipes.casualnessdelight
        .deep_frying(Item.of(output), Ingredient.of(input), 0.35, time)
        .id(id(`deep_frying/${itemId(output).split(':')[1]}`));

      if (global.hasAllMods(['create', 'butchercraft'])) {
        event.recipes.create
          .mixing(output, ['butchercraft:lard', Ingredient.of(input)])
          .heated()
          .id(id(`animal_frying/${itemId(output).split(':')[1]}`));
      }

      if (global.hasAllMods(['create_bic_bit', 'createdieselgenerators'])) {
        event.recipes.create_bic_bit
          .deep_frying(
            output,
            [Fluid.of('createdieselgenerators:plant_oil', 25), Ingredient.of(input)],
            time
          )
          .heated()
          .id(id(`plant_frying/${itemId(output).split(':')[1]}`));
      }
    };

    [
      'farmersdelight:cooking/phantom_puff',
      'casualnessdelight:raw_spring_roll',
      'casualnessdelight:deep_frying_pan',
      'create_deepfried:mixing/raw_chicken_nuggets',
      'dungeonsdelight:fried_ghast_calamari_from_smoking',
    ].forEach(removeIfPresent);

    if (global.hasMod('farmersdelight')) {
      event.recipes.farmersdelight
        .cooking(
          'misc',
          [
            'minecraft:phantom_membrane',
            Ingredient.of('#c:cheese'),
            Ingredient.of('#c:foods/milk'),
          ],
          '2x casualnessdelight:phantom_puff',
          1.0,
          200
        )
        .id(id('cooking/phantom_puff'));
    }

    event
      .shapeless('createdelightcore:yorkshire_pudding_and_beef', [
        '#c:foods/cooked_beef',
        'casualnessdelight:yorkshire_pudding',
      ])
      .id(id('crafting/yorkshire_pudding_and_beef'));

    event.recipes.create
      .mixing('casualnessdelight:raw_gluten', ['#c:foods/dough', Fluid.water(500)])
      .id(id('mixing/raw_gluten'));

    event
      .shapeless('casualnessdelight:raw_spring_roll', [
        '#c:foods/raw_meat',
        '#c:foods/dough',
        '#c:crops/cabbage',
      ])
      .id(id('crafting/raw_spring_roll'));

    if (global.hasAllMods(['butchercraft', 'createdieselgenerators'])) {
      event
        .shaped('casualnessdelight:deep_frying_pan', ['AB ', 'CDC', 'CCC'], {
          A: 'minecraft:brick',
          B: 'minecraft:iron_bars',
          C: Ingredient.of('#c:plates/iron'),
          D: 'butchercraft:lard',
        })
        .id(id('crafting/deep_frying_pan_with_lard'));

      event
        .shaped('casualnessdelight:deep_frying_pan', ['AB ', 'CDC', 'CCC'], {
          A: 'minecraft:brick',
          B: 'minecraft:iron_bars',
          C: Ingredient.of('#c:plates/iron'),
          D: 'createdieselgenerators:plant_oil_bucket',
        })
        .id(id('crafting/deep_frying_pan_with_plant_oil'));
    }

    [
      ['casualnessdelight:potato_chip', 'casualnessdelight:potato_slice'],
      ['casualnessdelight:fried_fish', 'createdelightcore:unfried_fish'],
      ['casualnessdelight:tonkatsu', 'createdelightcore:unfried_tonkatsu'],
      ['casualnessdelight:fried_chicken_chip', 'createdelightcore:unfried_chicken_chip'],
      ['casualnessdelight:spring_roll', 'casualnessdelight:raw_spring_roll'],
      //  呃呃啊啊 ['casualnessdelight:plate_of_fried_dumpling', 'casualnessdelight:raw_fried_dumpling'],
      ['create_bic_bit:fries', 'create_bic_bit:raw_fries'],
      ['create_deepfried:donut', 'create_deepfried:raw_donut'],
      ['create_deepfried:onion_rings', 'create_deepfried:raw_onion_rings'],
      ['create_bic_bit:cheese_souffle', 'create_bic_bit:raw_cheese_souffle'],
      ['create_bic_bit:kroket', 'create_bic_bit:raw_kroket'],
      ['create_bic_bit:eggball', 'create_bic_bit:raw_eggball'],
      ['create_bic_bit:frikandel', 'create_bic_bit:raw_frikandel'],
      ['create_bic_bit:churros', 'create_bic_bit:raw_churros'],
      ['create_deepfried:panzerotto', 'create_deepfried:raw_panzerotto'],
      ['create_deepfried:blooming_onion', 'farmersdelight:onion'],
      ['create_deepfried:fried_chicken', 'minecraft:chicken'],
      ['create_deepfried:yuca_fries', 'createcafe:cassava_root'],
      ['create_deepfried:apfelkuchle', 'someassemblyrequired:apple_slices'],
      ['create_deepfried:tempura', 'create_deepfried:raw_tempura'],
      ['create_deepfried:berliner', 'create_bic_bit:sweet_dough'],
      ['create_deepfried:deepfried_chocolate_bar', 'create:bar_of_chocolate'],
      ['create_deepfried:calamari', 'createdelightcore:unfried_calamari'],
      ['create_bic_bit:bitterballen', 'create_bic_bit:raw_bitterballen'],
      ['create_bic_bit:oliebollen', 'ratatouille:salty_dough'],
      ['youkaishomecoming:oily_bean_curd', 'youkaishomecoming:tofu'],
      ['create_bic_bit:enderball', 'minecraft:ender_pearl'],
      ['create_deepfried:corn_dog', 'create_deepfried:raw_corn_dog'],
      ['mynethersdelight:fries_ghasta', 'mynethersdelight:ghasta'],
      ['dungeonsdelight:fried_ghast_calamari', 'createdelightcore:raw_ghast_calamari'],
      ['create_deepfried:arancini', 'create_deepfried:raw_arancini'],
      ['culturaldelights:empanada', 'createdelightcore:raw_empanada'],
    ].forEach((recipe) => deepFrying(recipe[0], recipe[1], 100));

    event
      .shapeless('casualnessdelight:fish_and_chips', [
        'vintagedelight:salt_dust',
        'casualnessdelight:fried_fish',
        '2x create_bic_bit:fries',
        'minecraft:bowl',
      ])
      .id(id('crafting/fish_and_chips'));

    [
      ['createdelightcore:unfried_fish', '#minecraft:fishes'],
      ['createdelightcore:unfried_tonkatsu', 'minecraft:porkchop'],
      ['createdelightcore:unfried_chicken_chip', 'butchercraft:chicken_breast'],
      ['createdelightcore:raw_ghast_calamari', 'dungeonsdelight:ghast_calamari'],
    ].forEach((recipe) => {
      event.recipes.create
        .mixing(recipe[0], [
          Ingredient.of(recipe[1]),
          'bakeries:flour',
          fluid_tag_ingredient('c:egg_yolk', 100),
        ])
        .id(id(`mixing/${itemId(recipe[0]).split(':')[1]}`));
    });

    event.recipes.create
      .mixing('create_deepfried:raw_corn_dog', [
        'minecraft:stick',
        Ingredient.of('#c:foods/sausage'),
        'createdelightcore:corn_flour',
        Fluid.water(50),
      ])
      .id(id('mixing/raw_corn_dog'));
  });
}

if (global.hasMod('casualnessdelight')) {
  LootJS.modifiers((event) => {
    event
      .addBlockModifier('casualnessdelight:spring_roll_medley')
      .replaceLoot('casualnessdelight:sweet_rice', 'casualnessdelight:spring_roll_medley')
      .removeLoot('minecraft:bowl');
  });
}
