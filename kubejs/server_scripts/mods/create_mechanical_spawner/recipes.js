if (
  global.hasAllMods([
    'create_mechanical_spawner',
    'createdelightcore',
    'create',
    'vintageimprovements',
  ])
) {
  ServerEvents.recipes((event) => {
    const { create, vintageimprovements } = event.recipes;

    event.replaceInput(
      { id: 'create_mechanical_spawner:mechanical_spawner' },
      'minecraft:emerald',
      'alexscaves:amber_monolith'
    );
    event.replaceInput(
      [
        { id: 'create_mechanical_spawner:mechanical_spawner' },
        { id: 'create_mechanical_spawner:loot_collector' },
      ],
      'create:brass_ingot',
      'createdelightcore:bronze_ingot'
    );
    event.replaceInput(
      [
        { id: 'create_mechanical_spawner:mechanical_spawner' },
        { id: 'create_mechanical_spawner:loot_collector' },
      ],
      'create:brass_sheet',
      'vintageimprovements:bronze_sheet'
    );

    event.remove({ mod: 'create_mechanical_spawner', type: 'create:mixing' });

    vintageimprovements
      .vacuumizing(
        '16x createdelightcore:inferior_genetic_seed',
        Array(8)
          .fill('createaddition:biomass')
          .concat('ae2:singularity', Fluid.of('netherexp:ectoplasm', 250))
      )
      .id('createdelightcore:create_mechanical_spawner/vacuumizing/inferior_genetic_seed');

    [
      ['normal_genetic_seed', 'inferior_genetic_seed', 50],
      ['refined_genetic_seed', 'normal_genetic_seed', 100],
      ['pure_genetic_seed', 'refined_genetic_seed', 200],
    ].forEach((recipe) => {
      create
        .emptying(
          [
            Fluid.of('create_mechanical_spawner:spawn_fluid_random', recipe[2]),
            CreateItem.of(`createdelightcore:${recipe[0]}`, 0.4),
          ],
          `createdelightcore:${recipe[1]}`
        )
        .id(`createdelightcore:create_mechanical_spawner/emptying/${recipe[0]}`);
    });

    [
      ['inferior_genetic_seed', 50],
      ['normal_genetic_seed', 100],
      ['refined_genetic_seed', 200],
      ['pure_genetic_seed', 400],
    ].forEach((recipe) => {
      create
        .compacting(
          Fluid.of('create_mechanical_spawner:spawn_fluid_random', recipe[1]),
          `createdelightcore:${recipe[0]}`
        )
        .id(
          `createdelightcore:create_mechanical_spawner/compacting/spawn_fluid_random_from_${recipe[0]}`
        );
    });

    const seedTiers = [
      ['inferior_genetic_seed', 0.5, 1],
      ['normal_genetic_seed', 0.65, 1.5],
      ['refined_genetic_seed', 0.8, 2],
      ['pure_genetic_seed', 0.95, 2.5],
      ['flawless_genetic_seed', 1, 4],
    ];

    const inputExists = (input) => {
      if (typeof input !== 'string') {
        return true;
      }

      const id = String(input).replace(/^\d+x\s+/, '');
      return true;
    };

    const createSpawnFluid = (inputs, output, baseAmount, minSeedIndex) => {
      seedTiers.slice(minSeedIndex).forEach((seed) => {
        const amount = Math.floor(baseAmount * seed[2]);
        const seedId = `createdelightcore:${seed[0]}`;
        const outputs = [Fluid.of(output, amount)];

        if (seed[1] >= 1) {
          outputs.push(seedId);
        } else {
          outputs.push(CreateItem.of(seedId, seed[1]));
        }

        create
          .mixing(
            outputs,
            inputs.concat(seedId, Fluid.of('create_mechanical_spawner:spawn_fluid_random', amount))
          )
          .id(
            `createdelightcore:create_mechanical_spawner/mixing/${output.split(':')[1]}_from_${seed[0]}`
          );
      });
    };

    createSpawnFluid(
      ['2x minecraft:rotten_flesh'],
      'create_mechanical_spawner:spawn_fluid_zombie',
      100,
      0
    );
    createSpawnFluid(
      ['2x minecraft:bone'],
      'create_mechanical_spawner:spawn_fluid_skeleton',
      100,
      0
    );
    createSpawnFluid(
      ['2x minecraft:blaze_powder'],
      'create_mechanical_spawner:spawn_fluid_blaze',
      100,
      2
    );
    createSpawnFluid(
      ['2x minecraft:gunpowder'],
      'create_mechanical_spawner:spawn_fluid_creeper',
      100,
      1
    );
    createSpawnFluid(
      ['minecraft:rotten_flesh', Fluid.water(250)],
      'create_mechanical_spawner:spawn_fluid_drowned',
      100,
      1
    );
    createSpawnFluid(
      ['minecraft:ghast_tear'],
      'create_mechanical_spawner:spawn_fluid_ghast',
      100,
      2
    );
    createSpawnFluid(['ae2:ender_dust'], 'create_mechanical_spawner:spawn_fluid_enderman', 100, 2);
    createSpawnFluid(
      ['minecraft:magma_cream'],
      'create_mechanical_spawner:spawn_fluid_magma_cube',
      100,
      1
    );
    createSpawnFluid(
      ['minecraft:slime_ball'],
      'create_mechanical_spawner:spawn_fluid_slime',
      100,
      1
    );
    createSpawnFluid(
      ['minecraft:spider_eye', '2x minecraft:string'],
      'create_mechanical_spawner:spawn_fluid_spider',
      100,
      1
    );
    createSpawnFluid(
      ['createdelightcore:emerald_coin', Fluid.of('butchercraft:blood_fluid', 500)],
      'create_mechanical_spawner:spawn_fluid_evoker',
      200,
      3
    );
    createSpawnFluid(
      ['minecraft:gold_block', Fluid.of('butchercraft:blood_fluid', 500)],
      'create_mechanical_spawner:spawn_fluid_pigling',
      100,
      3
    );
    createSpawnFluid(
      ['minecraft:glowstone_dust', 'minecraft:redstone'],
      'create_mechanical_spawner:spawn_fluid_witch',
      100,
      3
    );
    createSpawnFluid(
      ['the_bumblezone:honeycomb_brood_block'],
      'create_mechanical_spawner:spawn_fluid_bee',
      100,
      2
    );
  });
}
