// priority: 1000

/**
 * 按配方 id 批量移除配方。
 * Removes recipes by exact recipe id.
 *
 * @param {unknown} event
 * @param {string[]} ids
 */
function remove_recipes_id(event, ids) {
  ids.forEach((id) => {
    if (!event.findRecipeIds(id).isEmpty()) {
      event.remove({ id: id });
    }
  });
}

/**
 * 按输出批量移除配方。
 * Removes recipes by output item or output item list.
 *
 * @param {unknown} event
 * @param {string|string[]} outputs
 */
function remove_recipes_output(event, outputs) {
  event.remove({ output: outputs });
}

/**
 * 按输入批量移除配方。
 * Removes recipes by input item or input item list.
 *
 * @param {unknown} event
 * @param {string|string[]} inputs
 */
function remove_recipes_input(event, inputs) {
  event.remove({ input: inputs });
}

/**
 * 按配方类型批量移除配方。
 * Removes recipes by recipe type.
 *
 * @param {unknown} event
 * @param {string[]} types
 */
function remove_recipes_type(event, types) {
  types.forEach((type) => {
    event.remove({ type: type });
  });
}

/**
 * 构造当前 KubeJS 可写入的流体 tag ingredient。
 * Creates a fluid tag ingredient JSON object for recipe schemas that accept it.
 *
 * @param {string} tag
 * @param {number} amount
 * @param {object=} nbt
 * @returns {object}
 */
function fluid_tag_ingredient(tag, amount, nbt) {
  const ingredient = {
    type: 'fluid_tag',
    fluid_tag: String(tag).replace(/^#/, ''),
    amount: Number(amount || 1000) | 0,
  };

  if (nbt) {
    ingredient.components = nbt;
  }

  return ingredient;
}
