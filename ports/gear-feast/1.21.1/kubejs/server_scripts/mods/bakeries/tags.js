if (global.hasMod('bakeries')) {
  ServerEvents.tags('item', (event) => {
    event.removeAllTagsFrom([
      'bakeries:salted_dough',
      'bakeries:whole_wheat_flour',
      'bakeries:tomato',
      'bakeries:ground_coffee',
      'bakeries:whole_egg',
      'bakeries:cheese_cube',
    ]);
    event.remove('c:doughs', 'bakeries:whole_wheat_dough');

    if (global.hasMod('some_assembly_required')) {
      event.add('some_assembly_required:sandwich_bread', [
        'bakeries:sliced_toast',
        'bakeries:sliced_cheese_cocoa_toast',
        'bakeries:country_bread_slice',
      ]);
    }
  });
}
