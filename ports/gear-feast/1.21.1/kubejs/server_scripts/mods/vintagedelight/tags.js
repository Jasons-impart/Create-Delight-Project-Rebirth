if (global.hasMod('vintagedelight')) {
  ServerEvents.tags('item', (event) => {
    event.add(
      'minecraft:logs',
      ['vintagedelight:magic_vine', 'vintagedelight:magic_vine_block'].filter((id) =>
        global.itemExists(id)
      )
    );
    event.add(
      'c:stripped_logs',
      ['vintagedelight:stripped_magic_vine', 'vintagedelight:stripped_magic_vine_block'].filter(
        (id) => global.itemExists(id)
      )
    );
    event.add(
      'minecraft:planks',
      ['vintagedelight:vine_tile'].filter((id) => global.itemExists(id))
    );
    event.add(
      'c:seeds',
      [
        'vintagedelight:oat_seeds',
        'vintagedelight:peanut',
        'vintagedelight:cucumber_seeds',
        'vintagedelight:ghost_pepper_seeds',
      ].filter((id) => global.itemExists(id))
    );
    event.add('vintagedelight:sweet_jam_bottles', '#fruitsdelight:jelly');
  });
}
