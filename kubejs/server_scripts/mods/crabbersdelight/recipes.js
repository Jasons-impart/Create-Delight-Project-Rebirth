if (global.hasMod('crabbersdelight')) {
  ServerEvents.recipes((event) => {
    const { farmersdelight } = event.recipes;
    const id = (path) => `createdelightcore:crabbersdelight/${path}`;

    if (global.hasMod('sullysmod')) {
      remove_recipes_id(event, [
        'crabbersdelight:lanternfish_from_barrel',
        'crabbersdelight:lanternfish_barrel',
      ]);
    }

    remove_recipes_id(event, [
      'crabbersdelight:cooked_squid_tentacles',
      'crabbersdelight:cooked_squid_tentacles_from_campfire_cooking',
      'crabbersdelight:cooked_squid_tentacles_from_smoking',
      'crabbersdelight:cooked_glow_squid_tentacles_from_campfire_cooking',
      'crabbersdelight:cooked_glow_squid_tentacles',
      'crabbersdelight:cooked_glow_squid_tentacles_from_smoking',
      'crabbersdelight:glow_squid_barrel',
      'crabbersdelight:squid_barrel',
      'crabbersdelight:glow_squid_from_barrel',
      'crabbersdelight:squid_from_barrel',
    ]);

    if (global.hasMod('alexsmobs')) {
      remove_recipes_id(event, [
        'alexsmobs:cooked_lobster_tail_campfire',
        'alexsmobs:cooked_lobster_tail_smoke',
        'alexsmobs:cooked_lobster_tail',
      ]);

      event.replaceInput(
        { id: 'crabbersdelight:cooking/stuffed_nautilus_shell' },
        Ingredient.of('#c:foods/cooked_fish'),
        Ingredient.of('#alexsmobs:shoebill_foodstuffs')
      );

      farmersdelight
        .cutting('crabbersdelight:clawster', '#c:tools/knife', [
          'alexsmobs:lobster_tail',
          { chance: 0.3, count: 1, id: 'alexsmobs:lobster_tail' },
        ])
        .id(id('cutting/clawster'));
      farmersdelight
        .cutting('crabbersdelight:cooked_clawster', '#c:tools/knife', [
          'alexsmobs:cooked_lobster_tail',
          { chance: 0.3, count: 1, id: 'alexsmobs:cooked_lobster_tail' },
        ])
        .id(id('cutting/cooked_clawster'));

      farmersdelight
        .cooking('meals', ['alexsmobs:lobster_tail'], 'alexsmobs:cooked_lobster_tail', 1.0, 200)
        .id(id('cooking/cooked_lobster_tail'));
    }

    event.replaceInput(
      { id: 'crabbersdelight:cooking/crab_cakes' },
      'crabbersdelight:crab',
      '#crabbersdelight:crab'
    );

    event.remove({ id: 'crabbersdelight:cooking/seafood_gumbo' });
    farmersdelight
      .cooking(
        'meals',
        [
          '#crabbersdelight:lobster',
          '#crabbersdelight:shrimps',
          '#c:crops/onion',
          'farmersdelight:rice',
          '#c:foods/cooked_pork',
        ],
        'crabbersdelight:seafood_gumbo',
        1.0,
        200,
        'minecraft:bowl'
      )
      .id(id('cooking/seafood_gumbo'));
  });
}
