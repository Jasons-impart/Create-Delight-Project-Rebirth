if (global.hasAllMods(['ae2', 'create', 'createaddition', 'vintageimprovements'])) {
  ServerEvents.recipes((event) => {
    event.recipes.create
      .mechanical_crafting('ae2:inscriber', ['AABAA', 'CDEDC', 'FGHGF', 'CIHIC', 'AAAAA'], {
        A: '#c:ingots/iron',
        B: '#c:storage_blocks/copper',
        C: '#c:gems/fluix',
        D: 'vintageimprovements:curving_press',
        E: 'createaddition:alternator',
        F: '#c:glass_blocks',
        G: 'vintageimprovements:concave_curving_head',
        H: '#vintageimprovements:springs/iron',
        I: 'create:depot',
      })
      .id('createdelightcore:ae2/createaddition/machine/inscriber');
  });
}
