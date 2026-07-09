if (global.hasMod('createoreexcavation')) {
  ServerEvents.tags('minecraft:worldgen/biome', (event) => {
    if (global.hasMod('alexscaves')) {
      event.add('createdelightcore:has_cocoa_liquor', '#alexscaves:is_candy_cavity');
    }

    if (global.hasMod('the_bumblezone')) {
      event.add('createdelightcore:has_honey', [
        'the_bumblezone:crystal_canyon',
        'the_bumblezone:floral_meadow',
        'the_bumblezone:hive_pillar',
        'the_bumblezone:hive_wall',
        'the_bumblezone:howling_constructs',
        'the_bumblezone:pollinated_fields',
        'the_bumblezone:pollinated_pillar',
        'the_bumblezone:sugar_water_floor',
      ]);
    }
  });

  ServerEvents.tags('item', (event) => {
    event.add(
      'createdelightcore:ore_cluster',
      [
        'createdelightcore:overworld_metal_ore_cluster',
        'createdelightcore:overworld_noble_metal_ore_cluster',
        'createdelightcore:nether_ore_cluster',
        'createdelightcore:moon_ore_cluster',
        'createdelightcore:mars_ore_cluster',
        'createdelightcore:mars_gemstone_cluster',
        'createdelightcore:mercury_ore_cluster',
        'createdelightcore:venus_ore_cluster',
        'createdelightcore:glacio_ore_cluster',
      ].filter((id) => global.itemExists(id))
    );
    event.add(
      'createoreexcavation:drills_diamonds',
      ['createoreexcavation:diamond_drill', 'createoreexcavation:netherite_drill'].filter((id) =>
        global.itemExists(id)
      )
    );
  });
}
