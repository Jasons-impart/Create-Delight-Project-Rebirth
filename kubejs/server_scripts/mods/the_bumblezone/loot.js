if (global.hasAllMods(['the_bumblezone', 'createdelightcore', 'lootjs'])) {
  LootJS.modifiers((event) => {
    event
      .addBlockModifier('the_bumblezone:crystalline_flower')
      .replaceLoot(
        'the_bumblezone:crystalline_flower',
        'createdelightcore:unactivated_crystalline_flower'
      );
  });
}
