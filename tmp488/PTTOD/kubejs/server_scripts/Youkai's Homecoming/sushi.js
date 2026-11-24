const $TableItemManager = Java.loadClass("dev.xkmc.youkaishomecoming.content.pot.table.item.TableItemManager")
const $FoodModelHelper = Java.loadClass("dev.xkmc.youkaishomecoming.content.pot.table.food.FoodModelHelper")
const {SUSHI_SAUCE, HOSOMAKI_SAUCE, FUTOMAKI_SAUCE, CAL_SAUCE, CAL_TOP_SAUCE, HOSOMAKI_INGREDIENT, FUTOMAKI_INGREDIENT, CAL_INGREDIENT, GUNKAN_TOP, SUSHI_TOP, CAL_COVER, COMPLETE_HOSOMAKI} = $TableItemManager
// 酱汁
let sauces = [SUSHI_SAUCE, HOSOMAKI_SAUCE, FUTOMAKI_SAUCE, CAL_SAUCE, CAL_TOP_SAUCE]
// 寿司卷馅料
let rools = [HOSOMAKI_INGREDIENT, FUTOMAKI_INGREDIENT, CAL_INGREDIENT]

let SushiTable = {}
/**
 * 
 * @param {Internal.VariantModelPart} part  来自$TableItemManager
 * @param {string} id 
 * @param {Internal.Ingredient_} ingrdient 
 * @returns {Internal.VariantModelPart$Entry}
 */
SushiTable.addMappingFromIngredient = function(part, id, ingrdient) {
  return part["addMapping(java.lang.String,java.util.function.Supplier)"](id, () => Ingredient.of(ingrdient))
}
/**
 * 
 * @param {string} id 
 * @param {string} path 
 * @param {Internal.Ingredient_} ingredient 
 * @param {VariantModelPart[]} parts  来自$TableItemManager
 */
SushiTable.addBulk = function(id, path, ingredient, parts) {
  parts.forEach(part => {
    SushiTable.addMappingFromIngredient(part, id, ingredient).tex(`youkaishomecoming:block/table/${path}`)
  })
}


// 用例
// SushiTable.addMappingFromIngredient($TableItemManager.SUSHI_TOP, "sculk_sensor_tendril", "silentsdelight:sculk_sensor_tendril") 

// const {HOSOMAKI_INGREDIENT, FUTOMAKI_INGREDIENT, CAL_INGREDIENT} = $TableItemManager
// let rolls = [HOSOMAKI_INGREDIENT, FUTOMAKI_INGREDIENT, CAL_INGREDIENT]
// SushiTable.addBulk("squid_tentacles", "ingredient/squid_tentacles", "#oceanic_delight:squid_tentacles", rolls);

//$FoodModelHelper用例
// let model = $FoodModelHelper.hosomaki("sculk_sensor_tendril_roll") //取物品id的path
// $FoodModelHelper.map("silentsdelight:sculk_sensor_tendril_roll", model)
ServerEvents.recipes(e => {
  const{youkaishomecoming} = e.recipes
  SushiTable.addBulk("mayonnaise", "sauce/mayonnaise", "create_bic_bit:mayonnaise_bottle", sauces)
  SushiTable.addMappingFromIngredient(CAL_COVER, "roe", "#forge:roe")
  SushiTable.addMappingFromIngredient(GUNKAN_TOP, "roe", "#forge:roe")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "pufferfish", "#forge:pufferfish")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "cooked_pufferfish", "crabbersdelight:cooked_pufferfish_slice")
  SushiTable.addMappingFromIngredient(GUNKAN_TOP, "uni", "collectorsreap:uni")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "tropical", "#forge:tropical")
  youkaishomecoming.cuisine_ordered(
    "2x oceanic_delight:shrimp_roll",
    "youkaishomecoming:sushi",
    [
      "#forge:shrimps",
      "minecraft:dried_kelp"
    ]
  ).id("createdelight:shrimp_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "shrimp", "#forge:shrimps")
  youkaishomecoming.cuisine_ordered(
    "2x culturaldelights:calamari_roll",
    "youkaishomecoming:sushi",
    [
      '#oceanic_delight:squid_tentacles',
      "minecraft:dried_kelp"
    ]
  ).id("createdelight:calamari_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "squid", '#oceanic_delight:squid_tentacles')
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "clam", "#forge:raw_clam")
  youkaishomecoming.cuisine_ordered(
    '2x cavedelight:trilocaris_roll',
    "youkaishomecoming:sushi",
    [
      'cavedelight:raw_trilocaris_slice'
    ]
  ).id("createdelight:trilocaris_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "trilocaris", 'cavedelight:raw_trilocaris_slice')
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "radgill", "alexscaves:radgill")
  SushiTable.addBulk("tendril", "ingredient/tendril", "silentsdelight:sculk_sensor_tendril", rools)
  $FoodModelHelper.map("silentsdelight:sculk_sensor_tendril_roll", $FoodModelHelper.hosomaki("sculk_sensor_tendril_roll"))
  youkaishomecoming.cuisine_mixed(
    'oceanic_delight:sea_pickle_roll',
    "youkaishomecoming:futomaki",
    'youkaishomecoming:soy_sauce_bottle',
    [
      '#oceanic_delight:squid_tentacles',
      '#oceanic_delight:squid_tentacles',
      "#forge:sea_pickles",
      "#forge:sea_pickles"
    ]
  ).id("createdelight:sea_pickle_roll")
  SushiTable.addBulk("sea_pickle", "ingredient/sea_pickle", "#forge:sea_pickles", rools)
  SushiTable.addBulk("squid", "ingredient/squid", "#oceanic_delight:squid_tentacles", rools)
  $FoodModelHelper.map("oceanic_delight:sea_pickle_roll", $FoodModelHelper.futomaki("sea_pickle_roll"))
  SushiTable.addBulk("avocado", "ingredient/avocado", "culturaldelights:cut_avocado", rools)
  $FoodModelHelper.map("culturaldelights:midori_roll", $FoodModelHelper.futomaki("midori_roll"))
  SushiTable.addBulk("chicken", "ingredient/chicken", '#forge:cooked_chicken', rools)
  $FoodModelHelper.map("culturaldelights:chicken_roll", $FoodModelHelper.futomaki("chicken_roll"))
  SushiTable.addBulk("tripodfish", "ingredient/tripodfish", 'alexscaves:tripodfish', rools)
  SushiTable.addBulk("sea_pig", "ingredient/sea_pig", 'alexscaves:sea_pig', rools)
  SushiTable.addBulk("lanternfish", "ingredient/lanternfish", 'alexscaves:lanternfish', rools)
  $FoodModelHelper.map("alexscaves:deep_sea_sushi_roll", $FoodModelHelper.futomaki("deep_sea_roll"))
})
