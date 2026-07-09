if (global.hasMod('create_bs')) {
  ServerEvents.recipes((event) => {
    const id = (path) => `createdelightcore:create_bs/${path}`;

    remove_recipes_id(event, [
      'create_bs:crafting/alt_diamond_item_vault',
      'create_bs:crafting/alt_gold_item_vault',
      'create_bs:crafting/alt_iron_item_vault',
      'create_bs:crafting/copper_item_vault',
      'create_bs:crafting/crystal_item_vault',
      'create_bs:crafting/diamond_item_vault',
      'create_bs:crafting/emerald_item_vault',
      'create_bs:crafting/gold_item_vault',
      'create_bs:crafting/iron_item_vault',
      'create_bs:crafting/netherite_item_vault',
      'create_bs:crafting/obsidian_item_vault',
      'create_bs:crafting/wooden_item_vault',
    ]);

    if (global.hasMod('createdieselgenerators')) {
      event
        .shaped('3x create_bs:wooden_item_vault', ['ABA', 'BCB', 'ABA'], {
          A: '#minecraft:logs',
          B: 'createdieselgenerators:wood_chip',
          C: 'minecraft:barrel',
        })
        .id(id('crafting/wooden_item_vault'));
    }

    event
      .shaped('5x create_bs:copper_item_vault', ['ABA', 'BAB', 'ABA'], {
        A: 'create:item_vault',
        B: '#c:storage_blocks/copper',
      })
      .id(id('crafting/copper_item_vault'));

    event
      .shaped('5x create_bs:iron_item_vault', ['ABA', 'BAB', 'ABA'], {
        A: 'create:item_vault',
        B: '#c:storage_blocks/iron',
      })
      .id(id('crafting/iron_item_vault'));
    event
      .shaped('5x create_bs:iron_item_vault', ['ABA', 'CAC', 'ABA'], {
        A: 'create_bs:copper_item_vault',
        B: '#c:ingots/iron',
        C: '#c:storage_blocks/iron',
      })
      .id(id('crafting/alt_iron_item_vault'));

    event
      .shaped('5x create_bs:gold_item_vault', ['ABA', 'BAB', 'ABA'], {
        A: 'create_bs:iron_item_vault',
        B: '#c:storage_blocks/gold',
      })
      .id(id('crafting/gold_item_vault'));
    event
      .shaped('5x create_bs:gold_item_vault', ['ABA', 'CAC', 'ABA'], {
        A: 'create_bs:emerald_item_vault',
        B: '#c:ingots/gold',
        C: '#c:storage_blocks/gold',
      })
      .id(id('crafting/alt_gold_item_vault'));

    event
      .shaped('5x create_bs:emerald_item_vault', ['ABA', 'BAB', 'ABA'], {
        A: 'create_bs:iron_item_vault',
        B: '#c:storage_blocks/emerald',
      })
      .id(id('crafting/emerald_item_vault'));

    event
      .shaped('5x create_bs:crystal_item_vault', ['ABA', 'CAC', 'ABA'], {
        A: 'create_bs:gold_item_vault',
        B: '#c:glass_blocks',
        C: '#c:storage_blocks/diamond',
      })
      .id(id('crafting/crystal_item_vault'));

    event
      .shaped('5x create_bs:diamond_item_vault', ['ABA', 'BAB', 'ABA'], {
        A: 'create_bs:gold_item_vault',
        B: '#c:storage_blocks/diamond',
      })
      .id(id('crafting/diamond_item_vault'));
    event
      .shaped('5x create_bs:diamond_item_vault', ['ABA', 'BAB', 'ABA'], {
        A: 'create_bs:crystal_item_vault',
        B: '#c:gems/diamond',
      })
      .id(id('crafting/alt_diamond_item_vault'));

    event
      .shaped('5x create_bs:obsidian_item_vault', ['ABA', 'BAB', 'ABA'], {
        A: 'create_bs:diamond_item_vault',
        B: '#c:obsidians',
      })
      .id(id('crafting/obsidian_item_vault'));

    event
      .shaped('5x create_bs:netherite_item_vault', ['ABA', 'CAC', 'ABA'], {
        A: 'create_bs:diamond_item_vault',
        B: '#c:ingots/netherite',
        C: '#c:storage_blocks/gold',
      })
      .id(id('crafting/netherite_item_vault'));
  });
}
