if (global.hasAllMods(['dungeonsdelight', 'trailandtales_delight'])) {
  ItemEvents.foodEaten('dungeonsdelight:soft_serve_sniffer_egg', (event) => {
    event.server.scheduleInTicks(1, () => {
      event.player.give('trailandtales_delight:sniffer_eggshell');
    });
  });
}
