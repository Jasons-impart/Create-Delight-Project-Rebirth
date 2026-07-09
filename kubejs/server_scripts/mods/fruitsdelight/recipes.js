if (global.hasAllMods(['fruitsdelight', 'create'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['fruitsdelight:apple_from_apple_crate', 'fruitsdelight:apple_crate']);

    event.remove({
      output: [
        'vintagedelight:apple_sauce_jar',
        'vintagedelight:sweet_berry_jam_jar',
        'vintagedelight:glow_berry_jam_jar',
        'vintagedelight:gearo_berry_jam_jar',
      ],
    });

    event.replaceInput(
      { mod: 'fruitsdelight', input: 'minecraft:slime_ball' },
      'minecraft:slime_ball',
      '#c:gelatin'
    );

    event.recipes.create
      .mixing(Fluid.of('fruitsdelight:kiwi_juice', 250), '2x fruitsdelight:kiwi')
      .id('createdelightcore:fruitsdelight/mixing/flowing_kiwi_juice');

    event.recipes.create
      .mixing(Fluid.of('fruitsdelight:hamimelon_juice', 250), '4x fruitsdelight:hamimelon_slice')
      .id('createdelightcore:fruitsdelight/mixing/flowing_hamimelon_juice');
  });
}
