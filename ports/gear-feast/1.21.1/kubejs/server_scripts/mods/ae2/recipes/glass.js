if (global.hasAllMods(['ae2', 'create'])) {
  ServerEvents.recipes((event) => {
    const { create } = event.recipes;
    const id = (path) => `createdelightcore:ae2/glass/${path}`;

    create
      .mixing(Item.of('ae2:quartz_vibrant_glass', 4), [
        Ingredient.of('ae2:quartz_glass').withCount(4),
        Ingredient.of('#c:dusts/glowstone'),
      ])
      .id(id('quartz_vibrant_glass'));

    create
      .mixing('4x ae2:quartz_glass', [
        Ingredient.of('#c:glass_blocks').withCount(4),
        Ingredient.of('#c:dusts/certus_quartz'),
      ])
      .id(id('quartz_glass'));
  });
}
