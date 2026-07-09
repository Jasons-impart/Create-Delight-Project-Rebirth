if (global.hasMod('minersdelight')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'minersdelight:string_from_gossypium',
      'minersdelight:baked_squid',
      'minersdelight:baked_squid_smoking',
      'minersdelight:baked_squid_campfire',
      'minersdelight:cutting/squid',
      'minersdelight:cutting/glow_squid',
      'minersdelight:baked_tentacles',
      'minersdelight:baked_tentacles_campfire',
      'minersdelight:baked_tentacles_smoking',
      'minersdelight:cutting/baked_squid',
      'minersdelight:vegan_hamburger',
    ]);

    if (global.hasMod('someassemblyrequired')) {
      event
        .shapeless('minersdelight:vegan_hamburger', [
          'someassemblyrequired:burger_bun',
          'minersdelight:vegan_patty',
          '#c:vegetables/cabbage',
          '#c:vegetables/tomato',
          '#c:vegetables/onion',
        ])
        .id('createdelightcore:minersdelight/vegan_hamburger');
    }
  });
}
