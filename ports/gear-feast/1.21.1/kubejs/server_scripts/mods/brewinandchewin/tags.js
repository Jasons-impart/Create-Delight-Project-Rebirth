if (global.hasMod('brewinandchewin')) {
  ServerEvents.tags('block', (event) => {
    const freezeSources = ['#c:ice_cream_blocks'];

    ['ratatouille:frozen_block', 'cmr:snowman_cooler'].forEach((block) => {
      if (global.blockExists(block)) {
        freezeSources.push(block);
      }
    });

    event.add('brewinandchewin:freeze_sources', freezeSources);
  });
}
