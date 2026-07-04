if (global.hasMod('alexscaves')) {
  ServerEvents.tags('item', (event) => {
    const existingItems = (ids) => ids.filter((id) => global.itemExists(id));

    event.add(
      'alexscaves:ferromagnetic_items',
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

    event.add('c:ingots/uranium', 'alexscaves:uranium');
    event.add('createdelightcore:candy_cane', 'alexscaves:candy_cane');
    event.add(
      'c:gelatins',
      existingItems([
        'alexscaves:gelatin_red',
        'alexscaves:gelatin_green',
        'alexscaves:gelatin_yellow',
        'alexscaves:gelatin_blue',
        'alexscaves:gelatin_pink',
        'butchercraft:gelatin',
      ])
    );
    event.add(
      'c:creams',
      existingItems(['bakeries:bottle_cream', 'bakeries:cheese_cream', 'bakeries:foamed_cream'])
    );

    event.remove('minecraft:fishes', ['alexscaves:cooked_radgill', 'alexscaves:radgill']);
    event.add('create:upright_on_belt', [
      'alexscaves:sulfur_bud_small',
      'alexscaves:sulfur_bud_medium',
      'alexscaves:sulfur_bud_large',
      'alexscaves:sulfur_cluster',
    ]);

    event.add('alexscaves:sweetish_fish', [
      'alexscaves:sweetish_fish_blue',
      'alexscaves:sweetish_fish_red',
      'alexscaves:sweetish_fish_yellow',
      'alexscaves:sweetish_fish_green',
      'alexscaves:sweetish_fish_pink',
    ]);

    event.add('alexscaves:ice_cream_scoop', [
      'alexscaves:vanilla_ice_cream_scoop',
      'alexscaves:chocolate_ice_cream_scoop',
      'alexscaves:sweetberry_ice_cream_scoop',
    ]);
    event.add('alexscaves:ice_cream', [
      'alexscaves:vanilla_ice_cream',
      'alexscaves:chocolate_ice_cream',
      'alexscaves:sweetberry_ice_cream',
    ]);

    if (global.hasMod('neapolitan')) {
      event.add('createdelightcore:mint_candy', 'neapolitan:mint_candies');
    }

    event.add('createdelightcore:mint_candy', 'alexscaves:frostmint');
    event.add(
      'createdelightcore:fish_buckets',
      existingItems([
        'minecraft:cod_bucket',
        'minecraft:salmon_bucket',
        'minecraft:tropical_fish_bucket',
        'minecraft:pufferfish_bucket',
        'minecraft:axolotl_bucket',
        'alexsmobs:lobster_bucket',
        'alexsmobs:blobfish_bucket',
        'alexsmobs:stradpole_bucket',
        'alexsmobs:platypus_bucket',
        'alexsmobs:frilled_shark_bucket',
        'alexsmobs:mimic_octopus_bucket',
        'alexsmobs:terrapin_bucket',
        'alexsmobs:comb_jelly_bucket',
        'alexsmobs:cosmic_cod_bucket',
        'alexsmobs:devils_hole_pupfish_bucket',
        'alexsmobs:small_catfish_bucket',
        'alexsmobs:medium_catfish_bucket',
        'alexsmobs:large_catfish_bucket',
        'alexsmobs:flying_fish_bucket',
        'alexsmobs:mudskipper_bucket',
        'alexsmobs:triops_bucket',
        'alexscaves:trilocaris_bucket',
        'alexscaves:lanternfish_bucket',
        'alexscaves:tripodfish_bucket',
        'alexscaves:sea_pig_bucket',
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
      'alexscaves:ice_cream_scoop',
      existingItems([
        'createdelightcore:strawberry_ice_cream_scoop',
        'createdelightcore:banana_ice_cream_scoop',
        'createdelightcore:mint_ice_cream_scoop',
        'createdelightcore:adzuki_ice_cream_scoop',
        'createdelightcore:pomegranate_ice_cream_scoop',
        'createdelightcore:lime_ice_cream_scoop',
      ])
    );
    event.add('curios:belt', 'alexscaves:sack_of_sating');

    if (global.hasMod('create_new_age')) {
      event.add('create_new_age:magnet', [
        'alexscaves:block_of_scarlet_neodymium',
        'alexscaves:block_of_azure_neodymium',
      ]);
    }

    event.removeAll('alexscaves:restricted_biome_locators');
    event.remove('alexscaves:ferns', 'alexscaves:fiddlehead');
    event.removeAllTagsFrom(
      existingItems(['vintageimprovements:sulfur_chunk', 'vintageimprovements:sulfur'])
    );
  });

  ServerEvents.tags('block', (event) => {
    const existingBlocks = (ids) => ids.filter((id) => global.blockExists(id));

    event.add('minecraft:logs', 'alexscaves:licoroot');

    if (global.hasMod('create_new_age')) {
      event.add('create_new_age:magnet', [
        'alexscaves:block_of_scarlet_neodymium',
        'alexscaves:block_of_azure_neodymium',
      ]);
      event.add('create_new_age:magnet/force_16', [
        'alexscaves:block_of_scarlet_neodymium',
        'alexscaves:block_of_azure_neodymium',
      ]);
    }

    event.add(
      'c:ice_cream_blocks',
      existingBlocks([
        'alexscaves:vanilla_ice_cream',
        'alexscaves:chocolate_ice_cream',
        'alexscaves:sweetberry_ice_cream',
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
