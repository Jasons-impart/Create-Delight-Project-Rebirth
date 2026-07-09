if (global.hasMod('luncheonmeatsdelight')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, ['luncheonmeatsdelight:luncheon_meat_can_raw']);

    if (global.hasMod('bakeries')) {
      event
        .shapeless('luncheonmeatsdelight:luncheon_meat_sandwich', [
          'bakeries:sliced_toast',
          '2x luncheonmeatsdelight:luncheon_meat',
          '#c:foods/vegetable',
          'bakeries:sliced_toast',
        ])
        .id('createdelightcore:luncheonmeatsdelight/luncheon_meat_sandwich');

      event.recipes.create
        .cutting('2x bakeries:sliced_toast', 'luncheonmeatsdelight:small_toast')
        .id('createdelightcore:luncheonmeatsdelight/cutting/sliced_toast');
    }
  });

  if (global.hasMod('bakeries')) {
    BlockEvents.rightClicked('luncheonmeatsdelight:small_toast', (event) => {
      if (event.player.mainHandItem.hasTag('c:tools/knife')) {
        event.player.swing();
        event.block.set('air');
        event.block.popItem('2x bakeries:sliced_toast');
        event.cancel();
      }
    });
  }
}
