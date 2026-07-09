if (global.hasMod('someassemblyrequired')) {
  ServerEvents.tags('item', (event) => {
    if (global.itemExists('someassemblyrequired:tomato_slices')) {
      event.add('c:vegetables/tomato', 'someassemblyrequired:tomato_slices');
    }

    if (global.itemExists('someassemblyrequired:sliced_onion')) {
      event.add('c:vegetables/onion', 'someassemblyrequired:sliced_onion');
      event.add('festival_delicacies:onion', 'someassemblyrequired:sliced_onion');
      event.add('c:fermentable', 'someassemblyrequired:sliced_onion');
    }

    if (global.itemExists('someassemblyrequired:chopped_beetroot')) {
      event.add('c:vegetables/beetroot', 'someassemblyrequired:chopped_beetroot');
    }

    if (global.itemExists('someassemblyrequired:chopped_carrot')) {
      event.add('c:vegetables/carrots', 'someassemblyrequired:chopped_carrot');
    }
  });
}
