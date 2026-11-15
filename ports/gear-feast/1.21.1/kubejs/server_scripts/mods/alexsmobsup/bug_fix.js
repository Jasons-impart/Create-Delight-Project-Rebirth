// 源：参考包 1.20.1 kubejs/client_scripts/bug_fix.js
// 1.21.1 适配：
//   - 服务端方块事件（原文件放在 client_scripts，实际依赖服务端 BlockEvents）
//   - alexsmobs:capsid -> alexsmobsup:capsid
//   - NBT 读取改为 1.21 的 ListTag API
BlockEvents.rightClicked('alexsmobsup:capsid', (event) => {
  const player = event.player;
  const mainHandItem = player.mainHandItem;
  const data = event.block.entityData;

  let entityId = 'unknown';
  if (data) {
    const items = data.getList('Items');
    if (items && !items.isEmpty()) {
      entityId = items.getCompound(0).getString('id');
    }
  }

  const sameItem =
    (entityId == 'create:minecart_contraption' &&
      mainHandItem?.id == 'create:minecart_contraption') ||
    (entityId.search('present') != -1 && mainHandItem?.id.search('present') != -1) ||
    (entityId.search('functionalstorage') != -1 &&
      mainHandItem?.id.search('functionalstorage') != -1);

  if (sameItem) {
    event.cancel();
    player.sendInventoryUpdate();
  }
});
