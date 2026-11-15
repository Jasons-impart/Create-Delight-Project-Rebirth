// 源：参考包 1.20.1 kubejs/server_scripts/Ice and Fire/collect_dragon_blood.js
// 1.21.1 适配：
//   - 龙类改为 com.iafenvoy.iceandfire.entity.DragonBaseEntity
//   - 原代码的 player.swing() 未定义，改为 e.player.swing()
//   - createdelight: -> createdelightcore:
// 注意：KubeJS 2101 的 Rhino 不允许脚本顶层块语句里出现 const
//（if/for/while/裸块会抛 redeclaration of var <name>），因此整体包进 IIFE。
(() => {
  if (!global.hasAllMods(['iceandfire', 'createdelightcore'])) {
    return;
  }

  const $DragonBaseEntity = Java.loadClass(
    'com.iafenvoy.iceandfire.entity.DragonBaseEntity'
  );

  const BLOOD_BY_TYPE = {
    'iceandfire:fire_dragon': 'iceandfire:fire_dragon_blood',
    'iceandfire:ice_dragon': 'iceandfire:ice_dragon_blood',
    'iceandfire:lightning_dragon': 'iceandfire:lightning_dragon_blood',
  };

  // 1.21.1 的 ItemEvents.entityInteracted 不支持按物品过滤，需在回调里判断
  ItemEvents.entityInteracted((event) => {
    if (event.item.id !== 'createdelightcore:blood_collection_device') return;

    const player = event.player;
    if (player.cooldowns.isOnCooldown(player.mainHandItem.item)) return;

    const entity = event.target;
    if (!entity) return;

    // 限制主手使用
    if (
      player.mainHandItem.id !== 'createdelightcore:blood_collection_device' ||
      player.offHandItem.id !== 'minecraft:glass_bottle'
    ) {
      return;
    }

    if (!(entity instanceof $DragonBaseEntity)) return;

    const dragon = entity;
    if (!dragon.isTame() || !dragon.isAlive() || dragon.isDeadOrDying()) return;

    const blood = BLOOD_BY_TYPE[String(dragon.type)];
    if (!blood) return;

    const damage = Math.max(50, dragon.maxHealth * 0.1);
    dragon.hurt(player.damageSources().genericKill(), damage);
    player.give(blood);
    player.addItemCooldown(player.mainHandItem.item, 60);
    player.mainHandItem.shrink(1);
    player.offHandItem.shrink(1);
    player.swing(event.hand);
  });
})();
