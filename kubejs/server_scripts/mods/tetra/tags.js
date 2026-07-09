if (global.hasMod('tetra')) {
  ServerEvents.tags('block', (event) => {
    if (global.blockExists('ae2:mysterious_cube')) {
      event.add('tetra:scannable', 'ae2:mysterious_cube');
    }

    if (global.hasMod('iceandfire')) {
      event.add('tetra:scannable', '#iceandfire:dragon_environment_blocks');
    }
  });
}
