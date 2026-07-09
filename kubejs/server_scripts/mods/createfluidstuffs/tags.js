if (global.hasAllMods(['createfluidstuffs', 'vintageimprovements'])) {
  ServerEvents.tags('block', (event) => {
    event.add(
      'fluid:tap_fillable',
      ['vintageimprovements:vacuum_chamber', 'vintageimprovements:centrifuge'].filter((id) =>
        global.blockExists(id)
      )
    );
  });
}
