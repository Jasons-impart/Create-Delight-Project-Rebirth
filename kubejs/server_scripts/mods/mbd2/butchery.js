// MBD2 原生 schema；机器和配方类型在 Core 注册。
ServerEvents.recipes((event) => {
  if (!global.hasAllMods(['createdelightcore', 'mbd2'])) return;
  let mbd = event.recipes.createdelightcore;
  let butcher = (name, carcass, duration, blood, outputs) => {
    let recipe = mbd.butchery().inputItems(carcass).outputItems(outputs).duration(duration);
    if (blood > 0) recipe.outputFluids(`${blood}x butchercraft:blood_fluid`);
    recipe.perTick(true).inputStress(1024).id(`createdelightcore:butcher/${name}`);
  };
  butcher('chicken', 'butchercraft:chicken_carcass', 80, 500, [
    'minecraft:chicken',
    'butchercraft:heart',
    '2x butchercraft:lung',
    '2x butchercraft:kidney',
    'butchercraft:liver',
    'butchercraft:stomach',
    'butchercraft:tripe',
    '6x butchercraft:sinew',
    '5x butchercraft:fat',
    '6x minecraft:feather',
    'butchercraft:chicken_head_item',
  ]);
  butcher('chicken_head', 'butchercraft:chicken_head_item', 40, 0, [
    'butchercraft:chicken_skull_head_item',
    '2x butchercraft:eyeball',
    'butchercraft:brain',
    'butchercraft:wattle',
    'butchercraft:beak',
    '2x butchercraft:leather_scrap',
    'minecraft:feather',
  ]);
  butcher('cow', 'butchercraft:cow_carcass', 240, 3000, [
    '64x minecraft:beef',
    'butchercraft:heart',
    '2x butchercraft:lung',
    '2x butchercraft:kidney',
    'butchercraft:liver',
    '4x butchercraft:stomach',
    '8x butchercraft:tripe',
    '21x butchercraft:beef_roast',
    '6x butchercraft:beef_ribs',
    '9x butchercraft:cubed_beef',
    '3x butchercraft:oxtail',
    '30x butchercraft:beef_scraps',
    '24x butchercraft:beef_stewmeat',
    '14x minecraft:bone',
    '18x butchercraft:leather_scrap',
    '8x butchercraft:sinew',
    '8x butchercraft:fat',
    'butchercraft:cow_head_item',
    'butchercraft:cow_hide',
  ]);
  butcher('cow_head', 'butchercraft:cow_head_item', 40, 0, [
    'butchercraft:cow_skull_head_item',
    '2x butchercraft:eyeball',
    'butchercraft:brain',
    'butchercraft:tongue',
    '8x butchercraft:beef_scraps',
    '5x butchercraft:leather_scrap',
    '2x butchercraft:horn',
  ]);
  butcher('goat', 'butchercraft:goat_carcass', 160, 1000, [
    '10x butchercraft:goat_chop',
    'butchercraft:heart',
    '2x butchercraft:lung',
    '2x butchercraft:kidney',
    'butchercraft:liver',
    'butchercraft:stomach',
    '8x butchercraft:tripe',
    '7x butchercraft:goat_roast',
    '2x butchercraft:goat_ribs',
    '3x butchercraft:cubed_goat',
    '10x butchercraft:goat_scraps',
    '6x butchercraft:goat_stewmeat',
    '13x minecraft:bone',
    '6x butchercraft:leather_scrap',
    '20x butchercraft:sinew',
    '8x butchercraft:fat',
    'butchercraft:goat_head_item',
    'butchercraft:goat_hide',
  ]);
  butcher('goat_head', 'butchercraft:goat_head_item', 40, 0, [
    'butchercraft:goat_skull_head_item',
    '2x butchercraft:eyeball',
    'butchercraft:brain',
    'butchercraft:tongue',
    '8x butchercraft:goat_scraps',
    '4x butchercraft:leather_scrap',
  ]);
  butcher('pig', 'butchercraft:pig_carcass', 200, 2000, [
    '12x minecraft:porkchop',
    'butchercraft:heart',
    '2x butchercraft:lung',
    '2x butchercraft:kidney',
    'butchercraft:liver',
    'butchercraft:stomach',
    '8x butchercraft:tripe',
    '10x butchercraft:pork_roast',
    '6x butchercraft:pork_ribs',
    '4x butchercraft:cubed_pork',
    '14x butchercraft:pork_scraps',
    '10x butchercraft:pork_stewmeat',
    '16x minecraft:bone',
    '6x butchercraft:leather_scrap',
    '20x butchercraft:sinew',
    '10x butchercraft:fat',
    'butchercraft:pig_head_item',
    'butchercraft:pig_hide',
    '2x farmersdelight:ham',
  ]);
  butcher('pig_head', 'butchercraft:pig_head_item', 40, 0, [
    'butchercraft:pig_skull_head_item',
    '2x butchercraft:eyeball',
    'butchercraft:brain',
    'butchercraft:tongue',
    '8x butchercraft:pork_scraps',
    '3x butchercraft:leather_scrap',
  ]);
  butcher('sheep', 'butchercraft:sheep_carcass', 160, 1000, [
    '10x minecraft:mutton',
    'butchercraft:heart',
    '2x butchercraft:lung',
    '2x butchercraft:kidney',
    'butchercraft:liver',
    'butchercraft:stomach',
    '4x butchercraft:tripe',
    '8x butchercraft:lamb_roast',
    '3x butchercraft:lamb_ribs',
    '3x butchercraft:cubed_lamb',
    '10x butchercraft:lamb_scraps',
    '6x butchercraft:lamb_stewmeat',
    '14x minecraft:bone',
    '10x butchercraft:leather_scrap',
    '18x butchercraft:sinew',
    '8x butchercraft:fat',
    'butchercraft:sheep_head_item',
    'butchercraft:sheep_hide',
  ]);
  butcher('sheep_head', 'butchercraft:sheep_head_item', 40, 0, [
    'butchercraft:sheep_skull_head_item',
    '2x butchercraft:eyeball',
    'butchercraft:brain',
    'butchercraft:tongue',
    '8x butchercraft:lamb_scraps',
    '5x butchercraft:leather_scrap',
    '3x minecraft:string',
  ]);
  ['black', 'brown', 'gold', 'salt', 'splotched', 'white'].forEach((color) => {
    butcher(`${color}_rabbit`, `butchercraft:${color}_rabbit_carcass`, 120, 500, [
      'minecraft:rabbit',
      'butchercraft:heart',
      '2x butchercraft:lung',
      '2x butchercraft:kidney',
      'butchercraft:liver',
      'butchercraft:stomach',
      'butchercraft:tripe',
      '6x butchercraft:sinew',
      '5x butchercraft:fat',
      'minecraft:rabbit_foot',
      `butchercraft:rabbit_${color}_head_item`,
    ]);
    butcher(`rabbit_${color}_head`, `butchercraft:rabbit_${color}_head_item`, 40, 0, [
      'butchercraft:rabbit_skull_head_item',
      '2x butchercraft:eyeball',
      'butchercraft:brain',
      '3x butchercraft:rabbit_scraps',
      '2x butchercraft:leather_scrap',
      `butchercraft:${color}_bunny_ears`,
      `butchercraft:${color}_bunny_tail`,
    ]);
  });
});
