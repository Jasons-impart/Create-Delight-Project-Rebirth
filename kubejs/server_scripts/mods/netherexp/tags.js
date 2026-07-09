if (global.hasMod('netherexp')) {
  ServerEvents.tags('item', (event) => {
    event.add(
      'c:ham',
      ['farmersdelight:ham', 'netherexp:hogham'].filter((id) => global.itemExists(id))
    );
    event.add(
      'c:cooked_ham',
      ['farmersdelight:smoked_ham', 'netherexp:cooked_hogham'].filter((id) => global.itemExists(id))
    );

    if (global.itemExists('netherexp:glowcheese')) {
      event.removeAllTagsFrom('netherexp:glowcheese');
    }
  });

  ServerEvents.tags('block', (event) => {
    if (global.blockExists('netherexp:shroomnight')) {
      event.add('create:tree_attachments', 'netherexp:shroomnight');
    }
  });
}
