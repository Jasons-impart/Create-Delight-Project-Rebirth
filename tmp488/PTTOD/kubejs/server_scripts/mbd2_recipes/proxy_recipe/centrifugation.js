/**
 * 
 * @param {Internal.RecipesEventJS} e 
 * @param {(Internal.OutputFluid_|OutputItem_)[]} results 
 * @param {(Internal.InputFluid_|InputItem_)[]} ingredients 
 * @param {number|string} [processingTime=100]
 * @param {number} [minimalRPM=100]
 * @returns {Special.Recipes.CentrifugationVintageimprovements}
 */
function centrifugation(e, results, ingredients, processingTime, minimalRPM) {
  processingTime = processingTime || 100
  minimalRPM = minimalRPM || 100
  let vintageRecipe = e.recipes.vintageimprovements.centrifugation(results, ingredients)
    .processingTime(processingTime)
    .minimalRPM(minimalRPM)
  return vintageRecipe
}

