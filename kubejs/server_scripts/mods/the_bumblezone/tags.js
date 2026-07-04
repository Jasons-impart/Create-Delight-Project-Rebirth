if (global.hasMod('the_bumblezone')) {
  ServerEvents.tags('item', (event) => {
    event.add('the_bumblezone:crystalline_flower/cannot_consume', [
      '#minecraft:logs',
      '#minecraft:leaves',
      '#c:stones',
      '#minecraft:stairs',
      '#minecraft:slabs',
      '#c:cobblestones',
      '#minecraft:dirt',
      '#c:gravels',
      '#c:sands',
      'minecraft:clay_ball',
      'minecraft:clay',
      '#c:nuggets/iron',
      '#c:nuggets/gold',
    ]);

    if (global.itemExists('create:experience_nugget')) {
      event.add('the_bumblezone:crystalline_flower/xp_2_when_consumed', 'create:experience_nugget');
    }

    if (global.itemExists('create:experience_block')) {
      event.add('the_bumblezone:crystalline_flower/xp_5_when_consumed', 'create:experience_block');
    }
  });
}
