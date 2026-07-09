if (
  global.hasAllMods(['immersive_aircraft', 'man_of_many_planes', 'create', 'create_sa', 'quark'])
) {
  ServerEvents.recipes((event) => {
    const { create, kubejs } = event.recipes;
    const id = (path) => `createdelightcore:immersive_aircraft/${path}`;

    remove_recipes_id(event, [
      'immersive_aircraft:airship',
      'immersive_aircraft:quadrocopter',
      'immersive_aircraft:gyrodyne',
      'immersive_aircraft:biplane',
      'immersive_aircraft:boiler',
      'immersive_aircraft:steel_boiler',
      'immersive_aircraft:engine',
      'immersive_aircraft:propeller',
      'immersive_aircraft:industrial_gears',
      'immersive_aircraft:improved_landing_gear',
      'immersive_aircraft:rotary_cannon',
      'man_of_many_planes:scarlet_biplane',
      'man_of_many_planes:economy_plane',
    ]);

    kubejs
      .shaped('immersive_aircraft:rotary_cannon', [' A ', ' B ', ' C '], {
        A: 'minecraft:dispenser',
        B: 'immersive_aircraft:industrial_gears',
        C: '#c:ingots/steel',
      })
      .id(id('crafting/rotary_cannon'));

    create
      .mechanical_crafting('immersive_aircraft:quadrocopter', ['ABA', 'BCB', 'ADA'], {
        A: 'immersive_aircraft:propeller',
        B: 'minecraft:bamboo_planks',
        C: 'minecraft:scaffolding',
        D: 'immersive_aircraft:engine',
      })
      .id(id('mechanical_crafting/quadrocopter'));

    kubejs
      .shaped('immersive_aircraft:gyrodyne', [' A ', 'BCB', ' D '], {
        A: 'immersive_aircraft:propeller',
        B: 'immersive_aircraft:sail',
        C: 'immersive_aircraft:hull',
        D: 'minecraft:grindstone',
      })
      .id(id('crafting/gyrodyne'));

    create
      .mechanical_crafting(
        'immersive_aircraft:biplane',
        ['  A  ', '  B  ', 'CCDCC', '  E  ', ' CEC '],
        {
          A: 'immersive_aircraft:propeller',
          B: 'immersive_aircraft:engine',
          C: 'immersive_aircraft:hull',
          D: '#minecraft:wooden_trapdoors',
          E: '#minecraft:logs',
        }
      )
      .id(id('mechanical_crafting/biplane'));

    create
      .mechanical_crafting('immersive_aircraft:boiler', ['AAA', 'ABA', 'ACA', 'ADA', 'AAA'], {
        A: 'minecraft:copper_ingot',
        B: 'create_sa:small_filling_tank',
        C: 'create_sa:heat_engine',
        D: 'create_sa:small_fueling_tank',
      })
      .id(id('mechanical_crafting/boiler'));

    kubejs
      .shaped('immersive_aircraft:airship', ['AAA', 'BBA', 'BCD'], {
        A: 'immersive_aircraft:sail',
        B: 'immersive_aircraft:hull',
        C: 'immersive_aircraft:engine',
        D: 'immersive_aircraft:propeller',
      })
      .id(id('crafting/airship'));

    kubejs
      .shaped('immersive_aircraft:engine', ['AAA', 'BCB', 'ADA'], {
        A: 'minecraft:iron_ingot',
        B: 'create:mechanical_piston',
        C: 'create_sa:steam_engine',
        D: 'immersive_aircraft:boiler',
      })
      .id(id('crafting/engine'));

    kubejs
      .shaped('immersive_aircraft:propeller', ['AA ', ' B ', ' AA'], {
        A: 'minecraft:iron_ingot',
        B: 'create:andesite_alloy',
      })
      .id(id('crafting/propeller'));

    kubejs
      .shaped('immersive_aircraft:steel_boiler', ['AAA', 'ABA', 'ACA'], {
        A: '#c:ingots/steel',
        B: 'immersive_aircraft:boiler',
        C: 'create_sa:steam_engine',
      })
      .id(id('crafting/steel_boiler'));

    kubejs
      .shaped('immersive_aircraft:industrial_gears', [' AA', 'BCA', 'BB '], {
        A: 'create:large_cogwheel',
        B: 'create:cogwheel',
        C: 'create:shaft',
      })
      .id(id('crafting/industrial_gears'));

    kubejs
      .shaped('immersive_aircraft:improved_landing_gear', [' AB', 'CCA', 'CC '], {
        A: 'minecraft:iron_ingot',
        B: 'create:andesite_alloy',
        C: 'minecraft:dried_kelp',
      })
      .id(id('crafting/improved_landing_gear'));

    create
      .mechanical_crafting(
        'man_of_many_planes:scarlet_biplane',
        [' ABA ', 'CCDCC', ' CEC ', '  E  ', ' CAC '],
        {
          A: 'immersive_aircraft:improved_landing_gear',
          B: 'immersive_aircraft:enhanced_propeller',
          C: 'immersive_aircraft:hull_reinforcement',
          D: 'immersive_aircraft:biplane',
          E: 'create:railway_casing',
        }
      )
      .id(id('mechanical_crafting/scarlet_biplane'));

    create
      .mechanical_crafting('man_of_many_planes:economy_plane', ['ABC', 'DEB', 'ABC'], {
        A: 'immersive_aircraft:improved_landing_gear',
        B: 'immersive_aircraft:hull_reinforcement',
        C: 'immersive_aircraft:sail',
        D: 'immersive_aircraft:enhanced_propeller',
        E: 'immersive_aircraft:biplane',
      })
      .id(id('mechanical_crafting/economy_plane'));

    event.replaceInput(
      { output: 'immersive_aircraft:sail' },
      'minecraft:white_carpet',
      '#minecraft:wool_carpets'
    );
  });
}
