// Gateway 5 / Create 6: use native recipe serializers and data components.
// Core conditionally provides the original Dreadsteel ingot ID until Dreadsteel is installed.
ServerEvents.recipes((event) => {
  const pearl = 'gateways:gate_pearl';
  const gateway = (name) => `createdelightcore:${name}`;
  const result = (name) => ({
    id: pearl,
    count: 1,
    components: { 'gateways:gateway': gateway(name) },
  });

  const shaped = (name, pattern, key) => {
    event
      .custom({
        type: 'gateways:gate_recipe',
        pattern: pattern,
        key: key,
        result: { id: pearl },
        gateway: gateway(name),
      })
      .id(`createdelightcore:crafting/gateways/${name}`);
  };

  [
    ['ice', 'ice_dragon'],
    ['fire', 'fire_dragon_eyes'],
    ['lightning', 'lightning_dragon'],
  ].forEach(([element, name]) => {
    shaped(name, ['ABA', 'CDC', 'ABA'], {
      A: { item: `iceandfire:${element}_dragon_blood` },
      B: { item: `iceandfire:dragon_skull_${element}` },
      C: { tag: `iceandfire:scales/dragon/${element}` },
      D: { item: 'minecraft:nether_star' },
    });
  });
  shaped('ghast_trial', ['AAA', 'ABA', 'AAA'], {
    A: { item: 'minecraft:ghast_tear' },
    B: { item: 'minecraft:ender_pearl' },
  });

  const step = (type, ingredient, keepHeld) => {
    const recipe = {
      type: type,
      ingredients: [{ item: pearl }],
      results: [{ id: pearl }],
    };
    if (ingredient) recipe.ingredients.push({ item: ingredient });
    if (keepHeld) recipe.keep_held_item = true;
    return recipe;
  };
  const deploy = (item, keepHeld) => step('create:deploying', item, keepHeld);
  const cut = () => step('create:cutting');
  const press = () => step('create:pressing');
  const vibrate = () => step('vintageimprovements:vibrating');
  const fill = (fluid) => ({
    type: 'create:filling',
    ingredients: [{ item: pearl }, { type: 'fluid_stack', fluid: fluid, amount: 250 }],
    results: [{ id: pearl }],
  });
  const assembly = (name, loops, sequence) => {
    event
      .custom({
        type: 'create:sequenced_assembly',
        ingredient: { item: 'minecraft:ender_pearl' },
        transitional_item: { id: pearl },
        sequence: sequence,
        results: [result(name)],
        loops: loops,
      })
      .id(`createdelightcore:sequenced_assembly/${name}`);
  };

  assembly('the_gate_of_eternal_cold', 4, [
    deploy('iceandfire:dragonsteel_ice_ingot'),
    cut(),
    vibrate(),
    fill('createdelightcore:ice_dragon_blood'),
    deploy('createdelightcore:dread_heart'),
  ]);

  // Latest 1.20.1 pack supplies the replacement materials for these two trials.
  assembly('dream_no_more', 6, [
    deploy('alexscavesup:sweet_tooth'),
    press(),
    deploy('alexscavesup:enigmatic_engine'),
    vibrate(),
    deploy('alexsmobsup:void_worm_eye'),
    deploy('dungeonsdelight:monster_cake', true),
  ]);

  assembly('piercing_withering_trial', 4, [
    deploy('minecraft:wither_skeleton_skull'),
    cut(),
    vibrate(),
    deploy('minecraft:nether_star'),
    deploy('iceandfire:witherbone'),
    deploy('alexscavesup:immortal_embryo', true),
    deploy('createdelightcore:otherworld_note'),
  ]);

  assembly('sweettide_brokenpoint', 4, [
    deploy('alexscavesup:radiant_essence'),
    cut(),
    vibrate(),
    fill('alexscavesup:purple_soda'),
    deploy('alexscavesup:conversion_crucible'),
    deploy('alexscavesup:biome_treat'),
  ]);
  assembly('infinite_and_dark_trials', 2, [
    deploy('alexscavesup:pure_darkness'),
    cut(),
    vibrate(),
    deploy('createdelightcore:devil_eye'),
    deploy('alexscavesup:desolate_dagger', true),
    deploy('alexscavesup:dreadbow', true),
  ]);
  assembly('magnetic_storm_field', 4, [
    deploy('alexscavesup:telecore'),
    cut(),
    press(),
    deploy('alexscavesup:scarlet_neodymium_ingot'),
    deploy('alexscavesup:azure_neodymium_ingot'),
    deploy('alexscavesup:heart_of_iron'),
  ]);
  assembly('a_place_of_melting', 4, [
    deploy('alexscavesup:uranium'),
    cut(),
    press(),
    deploy('alexscavesup:fissile_core'),
    deploy('alexscavesup:nuclear_bomb', true),
    deploy('alexscavesup:tremorzilla_egg', true),
  ]);
  assembly('the_ancient_end', 4, [
    deploy('alexscavesup:heavy_bone'),
    press(),
    cut(),
    deploy('alexscavesup:amber_curiosity'),
    deploy('alexscavesup:tectonic_shard'),
    deploy('alexscavesup:extinction_spear', true),
  ]);
  assembly('the_legacy_of_the_abyss', 4, [
    deploy('alexscavesup:gazing_pearl'),
    press(),
    deploy('alexscavesup:enigmatic_engine'),
    vibrate(),
    deploy('alexscavesup:immortal_embryo'),
    deploy('alexscavesup:magic_conch', true),
  ]);
});
