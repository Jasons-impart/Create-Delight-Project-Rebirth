if (global.hasMod('minersdelight')) {
  ServerEvents.tags('item', (event) => {
    if (global.itemExists('culturaldelights:cooked_squid')) {
      event.add('c:cooked_fishes/squid', 'culturaldelights:cooked_squid');
    }

    if (global.itemExists('alexscaves:vesper_wing')) {
      event.add('minersdelight:bat_wing', 'alexscaves:vesper_wing');
    }

    event.removeAll('c:squid');
    event.add(
      'c:squid',
      ['culturaldelights:squid', 'culturaldelights:glow_squid'].filter((id) =>
        global.itemExists(id)
      )
    );
  });
}
