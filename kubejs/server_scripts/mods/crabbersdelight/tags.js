if (global.hasMod('crabbersdelight')) {
  ServerEvents.tags('item', (event) => {
    const existing = (ids) => ids.filter((id) => global.itemExists(id));

    event.add(
      'crabbersdelight:cooked_seafood',
      existing(['alexsmobsup:cooked_lobster_tail', 'oceanic_delight:shrimp_slices'])
    );
    event.add(
      'crabbersdelight:cooked_squid',
      existing(['oceanic_delight:grilled_squid_tentacles'])
    );
    event.add('crabbersdelight:raw_seafood', existing(['alexsmobsup:lobster_tail']));
    event.add(
      'crabbersdelight:lobster',
      existing([
        'crabbersdelight:clawster',
        'crabbersdelight:cooked_clawster',
        'alexsmobsup:lobster_tail',
        'alexsmobsup:cooked_lobster_tail',
        'alexscavesup:trilocaris_tail',
        'alexscavesup:cooked_trilocaris_tail',
      ])
    );
    event.add(
      'alexsmobsup:seal_foodstuffs',
      existing([
        'crabbersdelight:clawster',
        'crabbersdelight:cooked_crab',
        'crabbersdelight:crab',
        'crabbersdelight:crab_legs',
        'crabbersdelight:raw_clam_meat',
        'crabbersdelight:cooked_clam_meat',
        'crabbersdelight:shrimp',
        'crabbersdelight:cooked_shrimp',
        'oceanic_delight:shrimp_slices',
        'crabbersdelight:cooked_clawster',
      ])
    );
    event.add(
      'crabbersdelight:crab',
      existing(['crabbersdelight:crab', 'crabbersdelight:cooked_crab', 'crabbersdelight:crab_legs'])
    );
    event.add(
      'crabbersdelight:shrimps',
      existing([
        'crabbersdelight:shrimp',
        'crabbersdelight:cooked_shrimp',
        'oceanic_delight:shrimp_slices',
      ])
    );
    event.add(
      'c:shrimps',
      existing([
        'crabbersdelight:shrimp',
        'crabbersdelight:cooked_shrimp',
        'oceanic_delight:shrimp_slices',
      ])
    );
    event.add('c:foods/crab_meat', existing(['crabbersdelight:crab_legs']));
    event.add('c:foods/crab_leg', existing(['crabbersdelight:crab_legs']));
  });
}
