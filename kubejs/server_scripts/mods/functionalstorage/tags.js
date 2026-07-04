if (global.hasMod('functionalstorage')) {
  ServerEvents.tags('block', (event) => {
    event.add('create:non_movable', [
      'functionalstorage:storage_controller',
      'functionalstorage:framed_storage_controller',
      'functionalstorage:controller_extension',
      'functionalstorage:framed_controller_extension',
    ]);
  });
}
