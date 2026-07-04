if (global.hasAllMods(['northstar_curios_compat', 'northstar'])) {
  ServerEvents.recipes((event) => {
    [
      [1, 'northstar:moon_stone', 'northstar:iron_space_suit_boots'],
      [2, 'northstar:mars_stone', 'northstar:martian_steel_space_suit_boots'],
    ].forEach((recipe) => {
      event
        .shaped(
          Item.of('minecraft:enchanted_book').enchant(
            'northstar_curios_compat:space_walk',
            recipe[0]
          ),
          ['AAA', 'ABA', 'ACA'],
          {
            A: recipe[1],
            B: 'minecraft:book',
            C: recipe[2],
          }
        )
        .id(`createdelightcore:northstar_curios_compat/crafting/space_walk_${recipe[0]}`);
    });
  });
}
