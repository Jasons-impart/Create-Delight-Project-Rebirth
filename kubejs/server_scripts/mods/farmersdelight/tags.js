if (global.hasMod('farmersdelight')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => id.startsWith('#') || global.itemExists(id));
    const addTags = (tags, ids) => {
      const items = existingItems(ids);

      tags.forEach((tag) => event.add(tag, items));
    };

    addTags(['c:popcorn', 'forge:popcorn'], ['corn_delight:caramel_popcorn']);
    addTags(['neapolitan:vanilla'], ['neapolitan:dried_vanilla_pods']);
    addTags(
      ['createdelightcore:cabbage_leaves'],
      ['dumplings_delight:chinese_cabbage_leaf', 'farmersdelight:cabbage_leaf']
    );
    addTags(
      ['c:salad_ingredients/cabbage', 'forge:salad_ingredients/cabbage'],
      ['dumplings_delight:chinese_cabbage', 'dumplings_delight:chinese_cabbage_leaf']
    );
    addTags(
      [
        'c:vegetables/cabbage',
        'forge:vegetables/cabbage',
        'c:crops/cabbage',
        'forge:crops/cabbage',
      ],
      ['dumplings_delight:chinese_cabbage', 'dumplings_delight:chinese_cabbage_leaf']
    );
    addTags(
      [
        'c:vegetables/eggplant',
        'forge:vegetables/eggplant',
        'c:crops/eggplant',
        'forge:crops/eggplant',
      ],
      ['culturaldelights:eggplant', 'culturaldelights:cut_eggplant', 'dumplings_delight:eggplant']
    );
    addTags(
      ['c:foods/raw_meat', 'forge:meat/raw'],
      [
        'farmersdelight:chicken_cuts',
        'farmersdelight:mutton_chops',
        'mynethersdelight:hoglin_loin',
        'minecraft:beef',
        'minecraft:mutton',
        'minecraft:chicken',
        'minecraft:rabbit',
        'alexsdelight:bison_mince',
        'alexsmobs:kangaroo_meat',
        'alexsdelight:kangaroo_shank',
        'alexsdelight:loose_moose_rib',
        'alexsdelight:raw_bunfungus_drumstick',
        'alexsdelight:raw_bison',
        'alexsdelight:raw_bunfungus',
        'farmersdelight:minced_beef',
        'silentsdelight:warden_heart',
        'silentsdelight:minced_warden_heart',
        'casualnessdelight:raw_donkey_meat',
        'luncheonmeatsdelight:minced_pork',
        'minersdelight:arthropod',
      ]
    );
    addTags(
      ['c:ground_meat/raw', 'forge:meat/processed/raw'],
      [
        '#c:ground_meat/raw/beef',
        '#c:ground_meat/raw/pork',
        '#c:ground_meat/raw/chicken',
        '#c:ground_meat/raw/rabbit',
        '#c:ground_meat/raw/lamb',
        '#c:ground_meat/raw/goat',
      ]
    );
    addTags(
      ['c:ground_meat/raw/beef', 'forge:meat/processed/raw/beef'],
      [
        'alexsdelight:bison_mince',
        'farmersdelight:minced_beef',
        'butchercraft:beef_scraps',
        'butchercraft:ground_beef',
        'butchercraft:cubed_beef',
        'butchercraft:beef_stewmeat',
      ]
    );
    addTags(
      ['c:ground_meat/raw/pork', 'forge:meat/processed/raw/pork'],
      [
        'butchercraft:pork_scraps',
        'butchercraft:ground_pork',
        'butchercraft:cubed_pork',
        'butchercraft:pork_stewmeat',
        'farmersdelight:bacon',
        'luncheonmeatsdelight:minced_pork',
      ]
    );
    addTags(
      ['c:ground_meat/raw/chicken', 'forge:meat/processed/raw/chicken'],
      [
        'farmersdelight:chicken_cuts',
        'butchercraft:chicken_scraps',
        'butchercraft:ground_chicken',
        'butchercraft:cubed_chicken',
        'butchercraft:chicken_stewmeat',
      ]
    );
    addTags(
      ['c:ground_meat/raw/rabbit', 'forge:meat/processed/raw/rabbit'],
      [
        'butchercraft:rabbit_scraps',
        'butchercraft:ground_rabbit',
        'butchercraft:cubed_rabbit',
        'butchercraft:rabbit_stewmeat',
      ]
    );
    addTags(
      ['c:ground_meat/raw/lamb', 'forge:meat/processed/raw/lamb'],
      [
        'butchercraft:lamb_scraps',
        'butchercraft:ground_lamb',
        'butchercraft:cubed_lamb',
        'butchercraft:lamb_stewmeat',
      ]
    );
    addTags(
      ['c:ground_meat/raw/goat', 'forge:meat/processed/raw/goat'],
      [
        'butchercraft:goat_scraps',
        'butchercraft:ground_goat',
        'butchercraft:cubed_goat',
        'butchercraft:goat_stewmeat',
      ]
    );
    addTags(
      ['c:foods/cooked_beef', 'forge:beef/cooked'],
      ['minecraft:cooked_beef', 'farmersdelight:beef_patty']
    );
    addTags(['c:milk/milk_bottle', 'forge:milk/milk_bottle'], ['vintagedelight:nut_milk_bottle']);
    addTags(['c:cheese', 'forge:cheese'], ['trailandtales_delight:cheese_slice']);
    addTags(
      [
        'c:crops/cucumber',
        'c:vegetables/cucumber',
        'forge:crops/cucumber',
        'forge:vegetables/cucumber',
      ],
      ['vintagedelight:cucumber', 'culturaldelights:cut_cucumber']
    );
    addTags(
      ['c:pickles', 'forge:pickle'],
      ['culturaldelights:pickle', 'culturaldelights:cut_pickle']
    );
    addTags(['c:seeds/corn', 'forge:seeds/corn'], ['culturaldelights:corn_kernels']);
    addTags(
      ['c:foods/sausage', 'forge:sausage/raw'],
      ['ratatouille:raw_sausage', 'butchercraft:blood_sausage', 'dungeonsdelight:snifferwurst']
    );
    addTags(
      ['c:foods/cooked_sausage', 'forge:sausage/cooked'],
      [
        'ratatouille:sausage',
        'createdelightcore:salami',
        'butchercraft:cooked_blood_sausage',
        'dungeonsdelight:cooked_snifferwurst',
      ]
    );
    addTags(['mynethersdelight:curry_meats'], ['ratatouille:raw_sausage']);
    addTags(['mynethersdelight:hot_spice'], ['vintagedelight:ghost_pepper']);

    event.remove('c:vegetables/ghost_pepper', existingItems(['vintagedelight:ghost_pepper']));
    event.remove('forge:vegetables/ghost_pepper', existingItems(['vintagedelight:ghost_pepper']));
  });
}
