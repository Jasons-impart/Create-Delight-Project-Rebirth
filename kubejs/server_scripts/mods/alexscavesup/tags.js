if (global.hasMod('alexscavesup')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => global.itemExists(id));

    event.add(
      'alexscavesup:ferromagnetic_items',
      existingItems([
        'iceandfire:dragonsteel_fire_pickaxe',
        'iceandfire:dragonsteel_ice_pickaxe',
        'iceandfire:dragonsteel_lightning_pickaxe',
        'iceandfire:dragonsteel_fire_shovel',
        'iceandfire:dragonsteel_ice_shovel',
        'iceandfire:dragonsteel_lightning_shovel',
        'iceandfire:dragonsteel_fire_axe',
        'iceandfire:dragonsteel_ice_axe',
        'iceandfire:dragonsteel_lightning_axe',
        'iceandfire:dragonsteel_fire_sword',
        'iceandfire:dragonsteel_ice_sword',
        'iceandfire:dragonsteel_lightning_sword',
        'iceandfire:dragonsteel_fire_hoe',
        'iceandfire:dragonsteel_ice_hoe',
        'iceandfire:dragonsteel_lightning_hoe',
      ])
    );

    event.add('c:ingots/uranium', 'alexscavesup:uranium');
    event.add('createdelightcore:candy_cane', 'alexscavesup:candy_cane');
    event.add(
      'c:gelatins',
      existingItems([
        'alexscavesup:gelatin_red',
        'alexscavesup:gelatin_green',
        'alexscavesup:gelatin_yellow',
        'alexscavesup:gelatin_blue',
        'alexscavesup:gelatin_pink',
        'butchercraft:gelatin',
      ])
    );
    event.add(
      'c:creams',
      existingItems(['bakeries:bottle_cream', 'bakeries:cheese_cream', 'bakeries:foamed_cream'])
    );

    event.remove('minecraft:fishes', ['alexscavesup:cooked_radgill', 'alexscavesup:radgill']);
    event.add('create:upright_on_belt', [
      'alexscavesup:sulfur_bud_small',
      'alexscavesup:sulfur_bud_medium',
      'alexscavesup:sulfur_bud_large',
      'alexscavesup:sulfur_cluster',
    ]);

    event.add('alexscavesup:sweetish_fish', [
      'alexscavesup:sweetish_fish_blue',
      'alexscavesup:sweetish_fish_red',
      'alexscavesup:sweetish_fish_yellow',
      'alexscavesup:sweetish_fish_green',
      'alexscavesup:sweetish_fish_pink',
    ]);

    event.add('alexscavesup:ice_cream_scoop', [
      'alexscavesup:vanilla_ice_cream_scoop',
      'alexscavesup:chocolate_ice_cream_scoop',
      'alexscavesup:sweetberry_ice_cream_scoop',
    ]);
    event.add('alexscavesup:ice_cream', [
      'alexscavesup:vanilla_ice_cream',
      'alexscavesup:chocolate_ice_cream',
      'alexscavesup:sweetberry_ice_cream',
    ]);

    if (global.hasMod('neapolitan')) {
      event.add('createdelightcore:mint_candy', 'neapolitan:mint_candies');
    }

    event.add('createdelightcore:mint_candy', 'alexscavesup:frostmint');
    event.add(
      'createdelightcore:fish_buckets',
      existingItems([
        'minecraft:cod_bucket',
        'minecraft:salmon_bucket',
        'minecraft:tropical_fish_bucket',
        'minecraft:pufferfish_bucket',
        'minecraft:axolotl_bucket',
        'alexsmobsup:lobster_bucket',
        'alexsmobsup:blobfish_bucket',
        'alexsmobsup:stradpole_bucket',
        'alexsmobsup:platypus_bucket',
        'alexsmobsup:frilled_shark_bucket',
        'alexsmobsup:mimic_octopus_bucket',
        'alexsmobsup:terrapin_bucket',
        'alexsmobsup:comb_jelly_bucket',
        'alexsmobsup:cosmic_cod_bucket',
        'alexsmobsup:devils_hole_pupfish_bucket',
        'alexsmobsup:small_catfish_bucket',
        'alexsmobsup:medium_catfish_bucket',
        'alexsmobsup:large_catfish_bucket',
        'alexsmobsup:flying_fish_bucket',
        'alexsmobsup:mudskipper_bucket',
        'alexsmobsup:triops_bucket',
        'alexscavesup:trilocaris_bucket',
        'alexscavesup:lanternfish_bucket',
        'alexscavesup:tripodfish_bucket',
        'alexscavesup:sea_pig_bucket',
        'crabbersdelight:crab_bucket',
      ])
    );

    event.add(
      'createdelightcore:fission_fuel',
      existingItems([
        'createdelightcore:enriched_uraniumdust',
        'create_new_age:radioactive_thorium',
      ])
    );
    event.add(
      'alexscavesup:ice_cream_scoop',
      existingItems([
        'createdelightcore:strawberry_ice_cream_scoop',
        'createdelightcore:banana_ice_cream_scoop',
        'createdelightcore:mint_ice_cream_scoop',
        'createdelightcore:adzuki_ice_cream_scoop',
        'createdelightcore:pomegranate_ice_cream_scoop',
        'createdelightcore:lime_ice_cream_scoop',
      ])
    );
    event.add('curios:belt', 'alexscavesup:sack_of_sating');

    if (global.hasMod('create_new_age')) {
      event.add('create_new_age:magnet', [
        'alexscavesup:block_of_scarlet_neodymium',
        'alexscavesup:block_of_azure_neodymium',
      ]);
    }

    event.removeAll('alexscavesup:restricted_biome_locators');
    event.remove('alexscavesup:ferns', 'alexscavesup:fiddlehead');
    event.removeAllTagsFrom(
      existingItems(['vintageimprovements:sulfur_chunk', 'vintageimprovements:sulfur'])
    );
  });

  ServerEvents.tags('block', (event) => {
    const existingBlocks = (ids) => ids.filter((id) => global.blockExists(id));

    event.add('minecraft:logs', 'alexscavesup:licoroot');

    if (global.hasMod('create_new_age')) {
      event.add('create_new_age:magnet', [
        'alexscavesup:block_of_scarlet_neodymium',
        'alexscavesup:block_of_azure_neodymium',
      ]);
      event.add('create_new_age:magnet/force_16', [
        'alexscavesup:block_of_scarlet_neodymium',
        'alexscavesup:block_of_azure_neodymium',
      ]);
    }

    event.add(
      'c:ice_cream_blocks',
      existingBlocks([
        'alexscavesup:vanilla_ice_cream',
        'alexscavesup:chocolate_ice_cream',
        'alexscavesup:sweetberry_ice_cream',
        'neapolitan:strawberry_ice_cream_block',
        'neapolitan:banana_ice_cream_block',
        'neapolitan:adzuki_ice_cream_block',
        'collectorsreap:lime_ice_cream_block',
        'collectorsreap:pomegranate_ice_cream_block',
      ])
    );
  });

  ServerEvents.tags('fluid', (event) => {
    const existingFluids = (ids) => ids.filter((id) => global.fluidExists(id));

    event.add(
      'c:molten_neodymium',
      existingFluids([
        'createdelightcore:molten_scarlet_neodymium',
        'createdelightcore:molten_azure_neodymium',
      ])
    );
    event.add('c:sulfuric_acid', existingFluids(['vintageimprovements:sulfuric_acid']));
  });
}
