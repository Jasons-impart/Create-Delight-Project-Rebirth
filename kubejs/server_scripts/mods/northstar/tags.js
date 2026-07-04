if (global.hasMod('northstar')) {
  ServerEvents.tags('minecraft:worldgen/biome', (event) => {
    event.add('northstar:venus_biomes', [
      'northstar:venus_fungal_caverns',
      'northstar:venus_fungal_forest',
      'northstar:venus_lava_caves',
      'northstar:venus_sulfuric_caverns',
      'northstar:venusian_plains',
      'northstar:venusian_wastes',
    ]);
    event.add('northstar:mars_biomes', [
      'northstar:martian_crimsite_caverns',
      'northstar:martian_dunes',
      'northstar:martian_highlands',
      'northstar:martian_magmatic_caves',
      'northstar:martian_overgrown_caverns',
      'northstar:martian_peaks',
    ]);
    event.add('northstar:mercury_biomes', [
      'northstar:mercury_basins',
      'northstar:mercury_hills',
      'northstar:mercury_icy_caverns',
      'northstar:mercury_magmatic_caverns',
    ]);
  });

  ServerEvents.tags('block', (event) => {
    event.removeAll('northstar:tier_1_heat_resistance');
    event.removeAll('northstar:tier_2_heat_resistance');
    event.removeAll('northstar:tier_3_heat_resistance');

    event.add('northstar:tier_1_heat_resistance', [
      'northstar:tungsten_block',
      'northstar:tungsten_sheetmetal',
      'northstar:tungsten_plating',
      'northstar:tungsten_pillar',
    ]);

    event.add('northstar:tier_2_heat_resistance', [
      'northstar:titanium_sheetmetal',
      'northstar:titanium_plating',
      'northstar:titanium_pillar',
    ]);

    event.add('northstar:tier_3_heat_resistance', [
      'northstar:martian_steel_sheetmetal',
      'northstar:martian_steel_plating',
      'northstar:martian_steel_pillar',
      'northstar:martian_steel_blue_lamp',
      'northstar:martian_steel_lamp',
      'northstar:martian_steel_large_plating',
    ]);
  });

  ServerEvents.tags('item', (event) => {
    event.add('northstar:heat_resistant', [
      'minecraft:netherite_helmet',
      'minecraft:netherite_chestplate',
      'minecraft:netherite_boots',
      'create_jetpack:netherite_jetpack',
      'create_sa:netherite_jetpack_chestplate',
      'iceandfire:dragonsteel_ice_helmet',
      'iceandfire:dragonsteel_ice_chestplate',
      'iceandfire:dragonsteel_ice_leggings',
      'iceandfire:dragonsteel_ice_boots',
    ]);

    event.add('northstar:insulating', [
      'iceandfire:dragonsteel_fire_helmet',
      'iceandfire:dragonsteel_fire_chestplate',
      'iceandfire:dragonsteel_fire_leggings',
      'iceandfire:dragonsteel_fire_boots',
    ]);
  });

  ServerEvents.tags('entity_type', (event) => {
    event.add('northstar:can_survive_cold', '#createdelightcore:can_survive_northstar');
    event.add('northstar:can_survive_heat', '#createdelightcore:can_survive_northstar');
    event.add('northstar:doesnt_require_oxygen', '#createdelightcore:can_survive_northstar');

    event.add('createdelightcore:can_survive_northstar', [
      'iceandfire:mob_skull',
      'iceandfire:cyclops',
      'minecraft:sheep',
      'minecraft:chicken',
      'iceandfire:gorgon',
      'iceandfire:deathworm',
      'iceandfire:cockatrice',
      'iceandfire:myrmex_egg',
      'iceandfire:myrmex_queen',
      'iceandfire:myrmex_royal',
      'iceandfire:myrmex_sentinel',
      'iceandfire:myrmex_soldier',
      'iceandfire:myrmex_swarmer',
      'iceandfire:myrmex_worker',
      'iceandfire:dragon_egg',
      'iceandfire:dragon_skull',
      'iceandfire:fire_dragon',
      'iceandfire:ice_dragon',
      'iceandfire:lightning_dragon',
      'iceandfire:stymphalian_bird',
      'iceandfire:amphithere',
      'iceandfire:hydra',
      'alexsmobs:cosmic_cod',
      'alexscaves:teletor',
      'alexscaves:magnetron',
      'alexscaves:boundroid',
      'alexscaves:boundroid_winch',
      'alexscaves:ferrouslime',
      'alexscaves:notor',
      'alexscaves:nucleeper',
      'alexscaves:radgill',
      'alexscaves:brainiac',
      'alexscaves:raycat',
      'alexscaves:gammaroach',
      'alexscaves:tremorzilla',
    ]);
  });
}
