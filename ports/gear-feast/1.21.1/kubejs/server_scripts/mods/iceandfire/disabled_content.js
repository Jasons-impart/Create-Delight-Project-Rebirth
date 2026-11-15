if (global.hasMod('iceandfire')) {
  CreateDelightCoreEvents.disabledItems((event) => {
    // No policy chain: use Core's full item-disable policy.
    const disabled = [];
    ['fire', 'ice', 'lightning'].forEach((element) => {
      ['sword', 'pickaxe', 'axe', 'shovel', 'hoe'].forEach((tool) => {
        disabled.push(`iceandfire:dragonsteel_${element}_${tool}`);
      });
    });
    ['sword', 'pickaxe', 'axe', 'shovel', 'hoe'].forEach((tool) => {
      disabled.push(`iceandfire:copper_${tool}`);
    });
    ['helmet', 'chestplate', 'leggings', 'boots'].forEach((piece) => {
      disabled.push(`iceandfire:armor_copper_metal_${piece}`);
    });
    event.items(disabled);
  });
}
