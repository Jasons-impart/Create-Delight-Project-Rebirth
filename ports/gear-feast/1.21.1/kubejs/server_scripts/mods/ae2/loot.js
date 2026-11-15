if (global.hasAllMods(['ae2', 'lootjs'])) {
  LootJS.modifiers((event) => {
    const pressLoot = [
      'megacells:accumulation_processor_press',
      'ae2omnicells:omni_link_print_press',
      'ae2omnicells:complex_link_print_press',
      'ae2omnicells:multidimensional_expansion_print_press',
    ].filter((item) => global.itemExists(item));

    pressLoot.forEach((item) => {
      event.addBlockModifier('ae2:mysterious_cube').removeLoot(item);
    });
  });
}
