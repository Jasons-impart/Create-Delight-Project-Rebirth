if (global.hasMod('collectorsreap')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => global.itemExists(id));

    event.add('c:foods/crab_leg', existingItems(['collectorsreap:chieftain_leg']));
    event.add(
      'c:foods/shrimps',
      existingItems(['collectorsreap:tiger_prawn', 'collectorsreap:cooked_tiger_prawn'])
    );
    event.add(
      'c:foods/crab_meat',
      existingItems(['collectorsreap:chieftain_claw', 'collectorsreap:chieftain_leg'])
    );
    event.add(
      'c:foods/raw_clam',
      existingItems(['collectorsreap:clam_meat', 'crabbersdelight:raw_clam_meat'])
    );
  });
}
