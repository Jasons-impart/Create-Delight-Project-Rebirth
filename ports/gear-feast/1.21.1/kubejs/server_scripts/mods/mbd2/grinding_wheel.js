// 源：CDR 1.21.1 kubejs/server_scripts/mods/mbd2/grinding_wheel.js
// 原样可加载：仅用原版 shaped 配方，无需 kubejs-create。
if (global.hasAllMods(['createdelightcore', 'mbd2', 'create'])) {
  ServerEvents.recipes((event) => {
    event
      .shaped('createdelightcore:mechanic_grinding_wheel', ['AAA', 'ACB', 'AAA'], {
        A: 'create:andesite_alloy',
        B: 'create:shaft',
        C: 'minecraft:grindstone',
      })
      .id('createdelightcore:mbd2/mechanic_grinding_wheel');
  });
}
