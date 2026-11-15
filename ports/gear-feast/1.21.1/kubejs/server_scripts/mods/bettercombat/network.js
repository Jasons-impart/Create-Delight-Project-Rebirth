// 源：参考包 1.20.1 kubejs/server_scripts/Better Combat/network.js
// 1.21.1 适配：Component.translate -> Text.translate，提示改走 displayClientMessage。
NetworkEvents.dataReceived('show_bettercombat_mine_key', (event) => {
  if (!event.player.persistentData.getBoolean('betterCombatMineKey')) {
    event.player.displayClientMessage(
      Text.translate('message.createdelight.show_bettercombat_mine_key'),
      false
    );
  }
  event.player.persistentData.putBoolean('betterCombatMineKey', true);
});
