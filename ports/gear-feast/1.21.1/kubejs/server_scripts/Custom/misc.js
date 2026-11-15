// 源：参考包 1.20.1 kubejs/server_scripts/Custom/misc.js
// 1.21.1 适配：
//   - createdelight: -> createdelightcore:，alexscaves: -> alexscavesup:
//   - #forge:* -> #c:*
//   - 参考包 util/recipes.js 的 fermenting 改为 createdieselgenerators 原生
//     basin_fermenting / bulk_fermenting（与上游 mods/createdieselgenerators 写法一致）
ServerEvents.recipes((e) => {
  const { create, createaddition, createmetallurgy } = e.recipes;

  const fermenting = (results, ingredients, processingTime, heatRequirement) => {
    if (!global.hasMod('createdieselgenerators')) return;

    const basinRecipe = e.recipes.createdieselgenerators
      .basin_fermenting(results, ingredients)
      .processingTime(processingTime || 100)
      .id(`createdelightcore:basin_fermenting/${String(results).split(':')[1]}`);
    const bulkRecipe = e.recipes.createdieselgenerators
      .bulk_fermenting(results, ingredients)
      .processingTime(Math.floor((processingTime || 100) / 2))
      .id(`createdelightcore:bulk_fermenting/${String(results).split(':')[1]}`);

    if (heatRequirement) {
      basinRecipe.heatRequirement(heatRequirement);
      bulkRecipe.heatRequirement(heatRequirement);
    }
  };

  e.replaceInput({ id: 'explorerscompass:explorers_compass' }, 'minecraft:cracked_stone_bricks', '#c:ingots/steel');

  fermenting(
    'farmersdelight:rich_soil',
    ['farmersdelight:organic_compost', Fluid.water(100), '#c:mushrooms'],
    600
  );
  fermenting(
    'mynethersdelight:resurgent_soil',
    ['mynethersdelight:letios_compost', Fluid.lava(100), ['minecraft:warped_fungus', 'minecraft:crimson_fungus']],
    600,
    'heated'
  );

  create
    .filling('createdelightcore:fuel_hotcream', [
      'mynethersdelight:powder_cannon',
      Fluid.of('createdelightcore:fuel_mixtures', 50),
    ])
    .id('createdelightcore:filling/fuel_hotcream');

  createmetallurgy
    .grinding('createdelightcore:needle', Ingredient.of('#c:rods/iron'))
    .id('createdelightcore:polishing/needle');

  const iner = 'alexscavesup:polymer_plate';
  e.custom({
    type: 'create:sequenced_assembly',
    ingredient: { item: iner },
    transitional_item: { id: iner },
    results: [{ id: 'createdelightcore:blood_collection_device' }],
    loops: 1,
    sequence: [
      {
        type: 'createaddition:rolling',
        ingredients: [{ item: iner }],
        results: [{ id: iner }],
      },
      {
        type: 'create:deploying',
        ingredients: [{ item: iner }, { item: 'createdelightcore:needle' }],
        results: [{ id: iner }],
      },
    ],
  }).id('createdelightcore:sequenced_assembly/blood_collection_device');
});
