if (global.hasMod('crabbersdelight')) {
  ServerEvents.tags('item', (event) => {
    const existing = (ids) => ids.filter((id) => global.itemExists(id));

    event.add(
      'crabbersdelight:cooked_seafood',
      existing(['alexsmobs:cooked_lobster_tail', 'oceanic_delight:shrimp_slices'])
    );
    event.add(
      'crabbersdelight:cooked_squid',
      existing(['oceanic_delight:grilled_squid_tentacles'])
    );
    event.add('crabbersdelight:raw_seafood', existing(['alexsmobs:lobster_tail']));
    event.add(
      'crabbersdelight:lobster',
      existing([
        'crabbersdelight:clawster',
        'crabbersdelight:cooked_clawster',
        'alexsmobs:lobster_tail',
        'alexsmobs:cooked_lobster_tail',
        'alexscaves:trilocaris_tail',
        'alexscaves:cooked_trilocaris_tail',
      ])
    );
    event.add(
      'alexsmobs:seal_foodstuffs',
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
