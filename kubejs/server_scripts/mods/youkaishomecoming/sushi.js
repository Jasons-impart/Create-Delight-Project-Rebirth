if (global.hasMod('youkaishomecoming')) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:youkaishomecoming/${path}`;

    const ingredientOf = (value) => {
      if (Array.isArray(value)) {
        return value.map(ingredientOf);
      }
      if (typeof value === 'string' && value.startsWith('#')) {
        return { tag: value.slice(1) };
      }
      return { item: value };
    };

    const resultOf = (value) => {
      const match = /^(\d+)x\s+(.+)$/.exec(value);
      if (match) {
        return { id: match[2], count: Number(match[1]) };
      }
      return { id: value };
    };

    const cuisineMixed = (result, base, first, second, path) => {
      event
        .custom({
          type: 'youkaishomecoming:cuisine_mixed',
          result: resultOf(result),
          base: base,
          first: (Array.isArray(first) ? first : [first]).map(ingredientOf),
          second: second.map(ingredientOf),
        })
        .id(id(path));
    };

    const cuisineOrdered = (result, base, input, path) => {
      event
        .custom({
          type: 'youkaishomecoming:cuisine_ordered',
          result: resultOf(result),
          base: base,
          input: input.map(ingredientOf),
        })
        .id(id(path));
    };

    remove_recipes_id(event, ['farmersdelight:salmon_roll', 'farmersdelight:cod_roll']);

    if (global.hasMod('create_bic_bit')) {
      cuisineMixed(
        'youkaishomecoming:california_roll',
        'youkaishomecoming:california',
        'create_bic_bit:mayonnaise_bottle',
        [
          'youkaishomecoming:cucumber_slice',
          'youkaishomecoming:tamagoyaki_slice',
          'youkaishomecoming:imitation_crab',
        ],
        'cuisine/california_roll'
      );
    }

    cuisineOrdered(
      '2x youkaishomecoming:tobiko_gunkan',
      'youkaishomecoming:gunkan',
      ['#c:roe'],
      'cuisine/tobiko_gunkan'
    );
    cuisineOrdered(
      'youkaishomecoming:roe_california_roll',
      'youkaishomecoming:california_roll',
      ['#c:roe'],
      'cuisine/roe_california_roll'
    );
    cuisineOrdered(
      'farmersdelight:kelp_roll',
      'youkaishomecoming:hosomaki',
      ['youkaishomecoming:soy_sauce_bottle', 'minecraft:carrot'],
      'cuisine/kelp_roll'
    );

    if (global.hasMod('culturaldelights')) {
      cuisineOrdered(
        '2x culturaldelights:pufferfish_roll',
        'youkaishomecoming:sushi',
        ['#c:pufferfish'],
        'cuisine/pufferfish_roll'
      );
      cuisineOrdered(
        '2x culturaldelights:tropical_roll',
        'youkaishomecoming:sushi',
        ['#c:tropical'],
        'cuisine/tropical_roll'
      );
      cuisineMixed(
        'culturaldelights:midori_roll',
        'youkaishomecoming:futomaki',
        'youkaishomecoming:soy_sauce_bottle',
        [
          'youkaishomecoming:cucumber_slice',
          'youkaishomecoming:cucumber_slice',
          'culturaldelights:cut_avocado',
          'culturaldelights:cut_avocado',
        ],
        'cuisine/midori_roll'
      );
      cuisineMixed(
        'culturaldelights:chicken_roll',
        'youkaishomecoming:futomaki',
        'youkaishomecoming:soy_sauce_bottle',
        [
          ['minecraft:carrot', 'minecraft:beetroot'],
          ['minecraft:carrot', 'minecraft:beetroot'],
          '#c:foods/cooked_chicken',
          '#c:foods/cooked_chicken',
        ],
        'cuisine/chicken_roll'
      );
    }

    if (global.hasMod('crabbersdelight')) {
      cuisineOrdered(
        '2x createdelightcore:fugu_roll',
        'youkaishomecoming:sushi',
        ['crabbersdelight:cooked_pufferfish_slice'],
        'cuisine/fugu_roll'
      );
    }

    if (global.hasMod('collectorsreap')) {
      cuisineOrdered(
        '2x collectorsreap:uni_roll',
        'youkaishomecoming:gunkan',
        ['collectorsreap:uni'],
        'cuisine/uni_roll'
      );
      cuisineOrdered(
        '2x collectorsreap:clam_roll',
        'youkaishomecoming:sushi',
        ['#c:foods/raw_clam'],
        'cuisine/clam_roll'
      );
    }

    if (global.hasMod('alexscavesup')) {
      cuisineOrdered(
        '2x createdelightcore:radgill_sushi',
        'youkaishomecoming:sushi',
        ['alexscavesup:radgill'],
        'cuisine/radgill_sushi'
      );
      cuisineMixed(
        'alexscavesup:deep_sea_sushi_roll',
        'youkaishomecoming:futomaki',
        'youkaishomecoming:soy_sauce_bottle',
        [
          'alexscavesup:tripodfish',
          'alexscavesup:sea_pig',
          'alexscavesup:lanternfish',
          'youkaishomecoming:cucumber_slice',
        ],
        'cuisine/deep_sea_sushi_roll'
      );
    }

    if (global.hasMod('silentsdelight')) {
      cuisineOrdered(
        'silentsdelight:sculk_sensor_tendril_roll',
        'youkaishomecoming:hosomaki',
        ['youkaishomecoming:soy_sauce_bottle', 'silentsdelight:sculk_sensor_tendril'],
        'cuisine/sculk_sensor_tendril_roll'
      );
    }
  });
}
