if (global.hasMod('ae2')) {
  ServerEvents.tags('item', (event) => {
    if (global.hasMod('ae2omnicells')) {
      event.add('ae2:inscriber_presses', [
        'ae2omnicells:omni_link_print_press',
        'ae2omnicells:complex_link_print_press',
        'ae2omnicells:multidimensional_expansion_print_press',
      ]);
    }

    if (global.hasMod('megacells')) {
      event.add('ae2:inscriber_presses', 'megacells:accumulation_processor_press');
    }

    event.add('vintageimprovements:curving_heads', '#ae2:inscriber_presses');
    event.add('create:upright_on_belt', [
      'ae2:small_quartz_bud',
      'ae2:medium_quartz_bud',
      'ae2:large_quartz_bud',
      'ae2:quartz_cluster',
    ]);

    event.add('createdelightcore:quartz_glass', 'ae2:quartz_glass');
    event.add('createdelightcore:quartz_vibrant_glass', 'ae2:quartz_vibrant_glass');
    event.add('createdelightcore:glowstone', 'minecraft:glowstone_dust');
    event.add('createdelightcore:sky_stone', 'ae2:sky_dust');
    event.add('createdelightcore:redstone', 'minecraft:redstone');
  });

  ServerEvents.tags('block', (event) => {
    event.add('ae2:growth_acceleratable', ['minecraft:brown_mushroom', 'minecraft:red_mushroom']);

    if (global.hasMod('farmersdelight')) {
      event.add('ae2:growth_acceleratable', [
        'farmersdelight:brown_mushroom_colony',
        'farmersdelight:red_mushroom_colony',
      ]);
    }

    if (global.hasMod('farmersrespite')) {
      event.add('ae2:growth_acceleratable', [
        'farmersrespite:tea_bush',
        'farmersrespite:small_tea_bush',
      ]);
    }

    if (global.hasMod('neapolitan')) {
      event.add('ae2:growth_acceleratable', [
        'neapolitan:vanilla_vine',
        'neapolitan:strawberry_bush',
        'neapolitan:small_banana_frond',
        'neapolitan:banana_frond',
        'neapolitan:large_banana_frond',
        'neapolitan:mint',
      ]);
    }

    if (global.hasMod('mynethersdelight')) {
      event.add('ae2:growth_acceleratable', [
        'mynethersdelight:crimson_fungus_colony',
        'mynethersdelight:warped_fungus_colony',
        'mynethersdelight:powdery_cannon',
        'mynethersdelight:bullet_pepper',
      ]);
    }

    if (global.hasMod('collectorsreap')) {
      event.add('ae2:growth_acceleratable', [
        'collectorsreap:portobello_colony',
        'collectorsreap:portobello',
      ]);
    }
  });

  ServerEvents.tags('fluid', (event) => {
    if (global.fluidExists('createdelightcore:spent_liquor')) {
      event.add('createdelightcore:spent_liquor', 'createdelightcore:spent_liquor');
    }
  });
}
