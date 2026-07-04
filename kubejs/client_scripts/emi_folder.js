const FOLD_NAMESPACE = 'createdelightcore';

const groupId = (key) => `${FOLD_NAMESPACE}:${key}`;

const groupName = (key) => `translate:emi_group.${FOLD_NAMESPACE}.${key}`;

const ids = (paths) =>
  (Array.isArray(paths) ? paths : [paths]).map((path) =>
    path.includes(':') ? path : `minecraft:${path}`
  );

const COLORS = global.COLORS;

const colorIds = (suffix, mod) => {
  mod = mod || 'minecraft';
  return COLORS.map((variantColor) => `${mod}:${variantColor}_${suffix}`);
};

const colorSuffixIds = (base) => {
  const result = [base];
  COLORS.forEach((variantColor) => result.push(`${base}_${variantColor}`));
  return result;
};

const COLOR_MATCHES = COLORS.slice().sort((a, b) => b.length - a.length);

const splitId = (id) => {
  const value = id.includes(':') ? id : `minecraft:${id}`;
  const index = value.indexOf(':');
  return {
    namespace: value.substring(0, index),
    path: value.substring(index + 1),
  };
};

const replaceColor = (path, color, replacement) => {
  if (path.indexOf(`${color}_`) === 0) {
    return replacement + path.substring(color.length);
  }

  const suffix = `_${color}`;
  const suffixIndex = path.lastIndexOf(suffix);
  if (suffixIndex > 0 && suffixIndex === path.length - suffix.length) {
    return path.substring(0, path.length - color.length) + replacement;
  }

  const middle = `_${color}_`;
  const middleIndex = path.indexOf(middle);
  if (middleIndex >= 0) {
    return (
      path.substring(0, middleIndex + 1) +
      replacement +
      path.substring(middleIndex + 1 + color.length)
    );
  }

  return null;
};

const colorFamilyIds = (sample) => {
  const parsed = splitId(sample);
  if (parsed.namespace === 'minecraft' && parsed.path === 'shulker_box') {
    return [sample].concat(colorIds('shulker_box'));
  }

  let matchedColor;
  let replacedPath;
  for (let i = 0; i < COLOR_MATCHES.length; i++) {
    matchedColor = COLOR_MATCHES[i];
    replacedPath = replaceColor(parsed.path, matchedColor, '__COLOR__');
    if (replacedPath != null) {
      return COLORS.map(
        (targetColor) => `${parsed.namespace}:${replacedPath.replace('__COLOR__', targetColor)}`
      );
    }
  }

  return [sample];
};

const colorFamilyKey = (sample) => {
  const parsed = splitId(sample);
  let path = parsed.path;
  let keyPath;
  for (let i = 0; i < COLOR_MATCHES.length; i++) {
    keyPath = replaceColor(path, COLOR_MATCHES[i], '');
    if (keyPath != null) {
      path = keyPath.replace(/__+/g, '_').replace(/^_+|_+$/g, '');
      break;
    }
  }
  return `${parsed.namespace}_${path}`;
};

const COLOR_FOLD_SAMPLES = [
  'minecraft:white_wool',
  'minecraft:white_carpet',
  'minecraft:white_concrete',
  'minecraft:white_glazed_terracotta',
  'minecraft:red_concrete_powder',
  'minecraft:black_stained_glass',
  'quark:pink_framed_glass',
  'minecraft:light_gray_stained_glass_pane',
  'minecraft:shulker_box',
  'minecraft:light_gray_bed',
  'minecraft:orange_candle',
  'supplementaries:bunting_white',
  'minecraft:cyan_banner',
  'the_bumblezone:super_candle_red',
  'the_bumblezone:string_curtain_white',
  'lightmanscurrency:gacha_machine_white',
  'comforts:sleeping_bag_white',
  'comforts:hammock_white',
  'minecraft:white_terracotta',
  'quark:white_shingles',
  'quark:white_shingles_stairs',
  'quark:white_shingles_slab',
  'quark:white_shingles_vertical_slab',
  'quark:white_framed_glass_pane',
  'quark:white_shard',
  'supplementaries:candle_holder_white',
  'supplementaries:trapped_present_white',
  'supplementaries:present_white',
  'supplementaries:awning_white',
  'refurbished_furniture:white_sofa',
  'refurbished_furniture:white_stool',
  'refurbished_furniture:white_lamp',
  'refurbished_furniture:white_kitchen_cabinetry',
  'refurbished_furniture:white_kitchen_drawer',
  'refurbished_furniture:white_kitchen_sink',
  'refurbished_furniture:white_kitchen_storage_cabinet',
  'refurbished_furniture:white_grill',
  'refurbished_furniture:white_cooler',
  'refurbished_furniture:white_trampoline',
  'refurbished_furniture:white_toilet',
  'refurbished_furniture:white_basin',
  'refurbished_furniture:white_bath',
  'createdeco:white_shipping_container',
  'vintagedelight:salt_lamp_white',
  'vintagedelight:white_chefs_hat',
  'bakeries:sofa_white',
  'create:white_seat',
  'createadditionallogistics:white_short_seat',
  'createadditionallogistics:white_tall_seat',
  'interiors:white_floor_chair',
  'interiors:white_chair',
  'interiors:white_cushion',
  'alexscaves:radon_lamp_orange',
  'create_dragons_plus:white_dye_bucket',
  'create:white_postbox',
];

const CREATED_DELIGHT_BUCKETS = [
  'createdelightcore:fuel_mixtures_bucket',
  'createdelightcore:light_crude_oil_bucket',
  'createdelightcore:ethylene_fluid_bucket',
  'createdelightcore:spent_liquor_bucket',
  'createdelightcore:paper_pulp_bucket',
  'createdelightcore:unrefined_sugar_bucket',
  'createdelightcore:cryo_fuel_bucket',
  'createdelightcore:nut_milk_bucket',
  'createdelightcore:vinegar_bucket',
  'createdelightcore:radon_bucket',
  'createdelightcore:soya_milk_bucket',
  'createdelightcore:ancient_coffee_bucket',
  'createdelightcore:torchflower_tea_bucket',
  'createdelightcore:cherry_petal_tea_bucket',
  'createdelightcore:pitcher_plant_tea_bucket',
  'createdelightcore:fiddlehead_tea_bucket',
  'createdelightcore:scarlet_tea_bucket',
  'createdelightcore:lemon_black_tea_bucket',
  'createdelightcore:tea_mocha_bucket',
  'createdelightcore:saidi_tea_bucket',
  'createdelightcore:cornflower_tea_bucket',
  'createdelightcore:sakura_honey_tea_bucket',
  'createdelightcore:genmai_tea_bucket',
  'createdelightcore:green_water_bucket',
  'createdelightcore:white_tea_bucket',
  'createdelightcore:spring_soda_bucket',
  'createdelightcore:summer_cordial_bucket',
  'createdelightcore:autumn_tea_bucket',
  'createdelightcore:winter_glogg_bucket',
  'createdelightcore:apple_juice_bucket',
  'createdelightcore:mead_bucket',
  'createdelightcore:apple_cider_bucket',
  'createdelightcore:apple_wine_bucket',
  'createdelightcore:mellohi_wine_bucket',
  'createdelightcore:glowing_wine_bucket',
  'createdelightcore:solaris_wine_bucket',
  'createdelightcore:cherry_wine_bucket',
  'createdelightcore:creepers_crush_bucket',
  'createdelightcore:lilitu_wine_bucket',
  'createdelightcore:kelp_cider_bucket',
  'createdelightcore:eiswein_bucket',
  'createdelightcore:aegis_wine_bucket',
  'createdelightcore:chorus_wine_bucket',
  'createdelightcore:clark_wine_bucket',
  'createdelightcore:magnetic_wine_bucket',
  'createdelightcore:chenet_wine_bucket',
  'createdelightcore:nether_fizz_bucket',
  'createdelightcore:ice_lubricating_oil_bucket',
  'createdelightcore:cake_batter_bucket',
  'createdelightcore:sky_solution_bucket',
  'createdelightcore:jo_special_mixture_bucket',
  'createdelightcore:villagers_fright_bucket',
  'createdelightcore:jellie_wine_bucket',
  'createdelightcore:bottle_mojang_noir_bucket',
  'createdelightcore:netherite_nectar_bucket',
  'createdelightcore:lubricating_oil_bucket',
  'createdelightcore:egg_yolk_bucket',
  'createdelightcore:fire_dragon_blood_bucket',
  'createdelightcore:lightning_dragon_blood_bucket',
  'createdelightcore:unfermented_paper_pulp_bucket',
  'createdelightcore:yeast_bucket',
  'createdelightcore:noir_wine_bucket',
  'createdelightcore:red_wine_bucket',
  'createdelightcore:strad_wine_bucket',
  'createdelightcore:cristel_wine_bucket',
  'createdelightcore:bolvar_wine_bucket',
  'createdelightcore:stal_wine_bucket',
  'createdelightcore:blazewine_pinot_bucket',
  'createdelightcore:ghastly_grenache_bucket',
  'createdelightcore:lava_fizz_bucket',
  'createdelightcore:artificial_egg_yolk_bucket',
  'createdelightcore:ice_dragon_blood_bucket',
  'createdelightcore:malice_solution_bucket',
];

RecipeViewerEvents.fold((event) => {
  const options = { spread: 4, color: 'rainbow' };
  const fold = (key, filter) => event.fold(groupId(key), groupName(key), filter, options);
  const foldIds = (key, paths) => event.foldId(groupId(key), groupName(key), ids(paths), options);

  fold('test', '#alexscaves:rock_candies');
  fold('glass_cables', '#ae2:glass_cable');
  fold('potions_drinkable', 'minecraft:potion');
  fold('potions_splash', 'minecraft:splash_potion');
  fold('potions_lingering', 'minecraft:lingering_potion');
  fold('suspicious_stews', 'minecraft:suspicious_stew');
  fold('goat_horns', 'minecraft:goat_horn');
  fold('paintings', 'minecraft:painting');
  fold('chests', '#c:chests');
  fold('bamboo_spikes', '#supplementaries:bamboo_spikes');
  fold('smart_cables', '#ae2:smart_cable');
  fold('smart_dense_cables', '#ae2:smart_dense_cable');
  fold('covered_cables', '#ae2:covered_cable');
  fold('covered_dense_cables', '#ae2:covered_dense_cable');
  fold('accessories_hats', '#accessories:hat');

  foldIds('enchanted_books', ['enchanted_book']);
  foldIds('seed_pouches', 'quark:seed_pouch');
  event.foldSpawnEggs(groupId('spawn_eggs'), groupName('spawn_eggs'), options);
  event.foldMod(groupId('citadel'), groupName('citadel'), '@citadel', options);
  fold('arrows', '#minecraft:arrows');
  fold('canvas_signs', '#farmersdelight:canvas_signs');
  fold('cannon_boats', '#supplementaries:cannon_boats');
  fold('card_display', '#lightmanscurrency:traders/card_display');
  fold('cave_paintings', { blockTag: '#alexscaves:cave_paintings' });
  fold('hanging_canvas_signs', '#farmersdelight:hanging_canvas_signs');
  fold('jelly_bean', 'alexscaves:jelly_bean');
  fold('jam', '#fruitsdelight:jam');
  foldIds('music_cd', 'netmusic:music_cd');
  fold('music_discs', '#c:music_discs');
  fold('portstones', { blockTag: '#waystones:portstones' });
  fold('sharestones', { blockTag: '#waystones:sharestones' });
  fold('waystones', { blockTag: '#waystones:waystones' });
  foldIds('freezers', colorSuffixIds('lightmanscurrency:freezer'));
  foldIds('vending_machines', colorSuffixIds('lightmanscurrency:vending_machine'));
  foldIds('large_vending_machines', colorSuffixIds('lightmanscurrency:vending_machine_large'));
  foldIds('createdelightcore_buckets', CREATED_DELIGHT_BUCKETS);
  COLOR_FOLD_SAMPLES.forEach((sample) => foldIds(colorFamilyKey(sample), colorFamilyIds(sample)));
});
