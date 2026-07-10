// Manual migration queue.
// These old 1.20.1 Vintage Improvements recipes exceed the current 1.21.1
// Create/Vintage Improvements 4 item-output limit. Do not auto-port by
// truncating outputs or by splitting into competing recipes with the same input.

ServerEvents.recipes((e) => {
  e.recipes.vintageimprovements
    .vibrating(
      [
        Item.of('createoreexcavation:raw_redstone').withChance(0.75),
        Item.of('minecraft:raw_iron').withChance(0.6),
        Item.of('create:raw_zinc').withChance(0.6),
        Item.of('minecraft:coal').withChance(0.5),
        Item.of('minecraft:raw_copper').withChance(0.25),
        Item.of('createdelightcore:raw_tin').withChance(0.25),
      ],
      ['createdelight:overworld_metal_ore_cluster']
    )
    .id('createdelight:vibrating/raw_ore_from_overworld_metal_ore_cluster');

  e.recipes.vintageimprovements
    .vacuumizing(
      [
        Item.of('4x create:veridium').withChance(0.5),
        Item.of('4x create:asurine').withChance(0.5),
        Item.of('4x create:crimsite').withChance(0.5),
        Item.of('4x create:scoria').withChance(0.25),
        Item.of('4x create:ochrum').withChance(0.2),
      ],
      ['createdelight:overworld_metal_ore_cluster', 'ae2:matter_ball']
    )
    .id('createdelight:vacuumizing/overworld_metal_ore_cluster');

  e.recipes.vintageimprovements
    .vibrating(
      [
        Item.of('createoreexcavation:raw_diamond').withChance(0.2),
        Item.of('createoreexcavation:raw_emerald').withChance(0.3),
        Item.of('minecraft:lapis_lazuli', 4).withChance(0.4),
        Item.of('iceandfire:raw_silver').withChance(0.25),
        Item.of('minecraft:raw_gold').withChance(0.25),
      ],
      ['createdelight:overworld_noble_metal_ore_cluster']
    )
    .id('createdelight:vibrating/raw_ore_from_overworld_noble_metal_ore_cluster');

  e.recipes.vintageimprovements
    .vibrating(
      [
        Item.of('create:raw_zinc'),
        Item.of('northstar:rutile_concentrate'),
        Item.of('northstar:raw_glowstone_ore'),
        Item.of('minecraft:lapis_lazuli', 2).withChance(0.5),
        Item.of('createoreexcavation:raw_redstone').withChance(0.2),
        Item.of('northstar:lunar_sapphire_shard').withChance(0.3),
      ],
      ['createdelight:moon_ore_cluster']
    )
    .id('createdelight:vibrating/raw_ore_from_moon_ore_cluster');

  e.recipes.vintageimprovements
    .vibrating(
      [
        Item.of('minecraft:raw_iron'),
        Item.of('minecraft:quartz'),
        Item.of('northstar:raw_martian_iron_ore', 2).withChance(0.4),
        Item.of('create:raw_zinc').withChance(0.3),
        Item.of('minecraft:raw_copper').withChance(0.4),
        Item.of('createoreexcavation:raw_redstone').withChance(0.4),
        Item.of('northstar:raw_titanium_ore').withChance(0.4),
      ],
      ['createdelight:mars_ore_cluster']
    )
    .id('createdelight:vibrating/raw_ore_from_mars_ore_cluster');

  e.recipes.vintageimprovements
    .vibrating(
      [
        Item.of('minecraft:quartz'),
        Item.of('minecraft:raw_iron'),
        Item.of('northstar:raw_titanium_ore'),
        Item.of('minecraft:raw_gold'),
        Item.of('create:raw_zinc').withChance(0.5),
        Item.of('createoreexcavation:raw_redstone').withChance(0.25),
        Item.of('createoreexcavation:raw_diamond').withChance(0.1),
      ],
      ['createdelight:venus_ore_cluster']
    )
    .id('createdelight:vibrating/raw_ore_from_venus_ore_cluster');

  e.recipes.vintageimprovements
    .vibrating(
      [
        Item.of('createoreexcavation:raw_redstone').withChance(0.2),
        Item.of('minecraft:lapis_lazuli'),
        Item.of('northstar:raw_glowstone_ore'),
        Item.of('createmetallurgy:raw_tungsten'),
        Item.of('minecraft:raw_gold').withChance(0.75),
        Item.of('northstar:raw_titanium_ore').withChance(0.5),
      ],
      ['createdelight:mercury_ore_cluster']
    )
    .id('createdelight:vibrating/raw_ore_from_mercury_ore_cluster');
});
