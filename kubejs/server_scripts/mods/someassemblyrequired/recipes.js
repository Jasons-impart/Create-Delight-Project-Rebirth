if (global.hasAllMods(['someassemblyrequired', 'create'])) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:someassemblyrequired/${path}`;
    const ovenBaking = (input, output, count, time) => {
      if (global.hasMod('refurbished_furniture')) {
        event
          .custom({
            type: 'refurbished_furniture:oven_baking',
            category: 'food',
            ingredient: { item: input },
            result: {
              count: count || 1,
              id: output,
            },
            time: time || 100,
          })
          .id(id(`oven_baking/${output.split(':')[1]}`));
      }

      if (global.hasMod('ratatouille')) {
        event.recipes.ratatouille
          .baking(Item.of(output, count || 1), input)
          .processingTime(time || 100)
          .id(id(`baking/${output.split(':')[1]}`));
      }
    };
    const toasterHeating = (input, output, time) => {
      if (!global.hasMod('refurbished_furniture')) {
        return;
      }

      event
        .custom({
          type: 'refurbished_furniture:toaster_heating',
          category: 'food',
          ingredient: { item: input },
          result: { id: output },
          time: time || 300,
        })
        .id(id(`toaster_heating/${output.split(':')[1]}`));
    };

    remove_recipes_id(event, [
      'someassemblyrequired:crafting_shapeless/raw_burger_bun',
      'someassemblyrequired:cutting/create/bread_slice',
    ]);

    event.remove({ output: 'someassemblyrequired:toasted_bread_slice' });

    ovenBaking('createdelightcore:oil_dough', 'someassemblyrequired:burger_bun', 1, 100);

    toasterHeating(
      'someassemblyrequired:bread_slice',
      'someassemblyrequired:toasted_bread_slice',
      300
    );

    event.recipes.create
      .cutting('2x someassemblyrequired:bread_slice', 'minecraft:bread')
      .id(id('cutting/bread_slice'));

    if (global.hasMod('farmersdelight')) {
      event.recipes.farmersdelight
        .cutting('minecraft:bread', '#c:tools/knife', ['2x someassemblyrequired:bread_slice'])
        .id(id('cutting/bread_slice_fd'));
    }
  });
}
