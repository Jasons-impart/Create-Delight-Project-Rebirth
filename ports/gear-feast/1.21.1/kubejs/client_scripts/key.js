// 源：参考包 1.20.1 kubejs/client_scripts/key.js
// 1.21.1 适配：Better Combat 键位类路径保持 net.bettercombat.client.Keybindings，
// toggleMineKeyBinding 字段仍在。
PlayerEvents.tick((event) => {
  if (CDClientJavaClasses.BetterCombat$KeyBindings.toggleMineKeyBinding.isDown()) {
    event.player.sendData('show_bettercombat_mine_key');
  }
});
