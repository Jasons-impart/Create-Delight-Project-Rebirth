if (global.hasAllMods(['lightmanscurrency', 'lctech'])) {
  ServerEvents.recipes((event) => {
    remove_recipes_type(event, ['lightmanscurrency:coin_mint']);
    remove_recipes_output(event, [
      'lightmanscurrency:wallet_copper',
      'lightmanscurrency:wallet_iron',
      'lightmanscurrency:wallet_gold',
      'lightmanscurrency:wallet_emerald',
      'lightmanscurrency:wallet_diamond',
      'lightmanscurrency:wallet_netherite',
      'lctech:battery',
      'lctech:battery_large',
    ]);
    remove_recipes_id(event, [
      'lightmanscurrency:atm',
      'lightmanscurrency:coinmint',
      'lightmanscurrency:trading_core',
      'lightmanscurrency:coins/coin_copper_from_pile',
      'lightmanscurrency:coins/coinpile_copper_from_coin',
      'lightmanscurrency:coins/coinpile_copper_from_block',
      'lightmanscurrency:coins/coinblock_copper_from_pile',
      'lightmanscurrency:coins/coin_iron_from_pile',
      'lightmanscurrency:coins/coinpile_iron_from_coin',
      'lightmanscurrency:coins/coinpile_iron_from_block',
      'lightmanscurrency:coins/coinblock_iron_from_pile',
      'lightmanscurrency:coins/coin_gold_from_pile',
      'lightmanscurrency:coins/coinpile_gold_from_coin',
      'lightmanscurrency:coins/coinpile_gold_from_block',
      'lightmanscurrency:coins/coinblock_gold_from_pile',
      'lightmanscurrency:coins/coin_emerald_from_pile',
      'lightmanscurrency:coins/coinpile_emerald_from_coin',
      'lightmanscurrency:coins/coinpile_emerald_from_block',
      'lightmanscurrency:coins/coinblock_emerald_from_pile',
      'lightmanscurrency:coins/coin_diamond_from_pile',
      'lightmanscurrency:coins/coinpile_diamond_from_coin',
      'lightmanscurrency:coins/coinpile_diamond_from_block',
      'lightmanscurrency:coins/coinblock_diamond_from_pile',
      'lightmanscurrency:coins/coin_netherite_from_pile',
      'lightmanscurrency:coins/coinpile_netherite_from_coin',
      'lightmanscurrency:coins/coinpile_netherite_from_block',
      'lightmanscurrency:coins/coinblock_netherite_from_pile',
      'lightmanscurrency:wallet/upgrade_wallet_iron_to_wallet_nether_star',
      'lightmanscurrency:wallet/upgrade_wallet_emerald_to_wallet_nether_star',
      'lightmanscurrency:wallet/upgrade_wallet_gold_to_wallet_nether_star',
      'lightmanscurrency:wallet/upgrade_wallet_diamond_to_wallet_nether_star',
      'lightmanscurrency:wallet/wallet_nether_star',
      'lightmanscurrency:wallet/upgrade_wallet_copper_to_wallet_nether_star',
    ]);

    event.replaceInput(
      [
        { id: 'lightmanscurrency:item_trader_interface' },
        { id: 'lctech:fluid_trader_interface' },
        { id: 'lctech:energy_trader_interface' },
      ],
      'minecraft:iron_ingot',
      'createutilities:void_steel_ingot'
    );
    event.replaceInput({}, 'lctech:battery', 'createaddition:modular_accumulator');
  });
}

if (global.hasAllMods(['lightmanscurrency', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    event.replaceInput(
      { id: 'lightmanscurrency:upgrades/coin_chest_magnet_upgrade_1' },
      'minecraft:ender_pearl',
      'create_sa:copper_magnet'
    );
    event.replaceInput(
      { id: 'lightmanscurrency:upgrades/network_upgrade' },
      'minecraft:ender_eye',
      'ae2:singularity'
    );
    event.replaceInput(
      { id: 'lightmanscurrency:cash_register' },
      'minecraft:ender_pearl',
      'lightmanscurrency:trading_core'
    );
    event.replaceInput(
      { id: 'lightmanscurrency:terminal' },
      'minecraft:ender_eye',
      'lightmanscurrency:trading_core'
    );
    event.replaceInput(
      { id: 'lightmanscurrency:gem_terminal' },
      'minecraft:ender_eye',
      'lightmanscurrency:trading_core'
    );

    event
      .shaped('lightmanscurrency:trading_core', ['AAA', 'ABA', 'AAA'], {
        A: 'createdelightcore:iron_coin',
        B: 'createdelightcore:gold_coin',
      })
      .id('createdelightcore:lightmanscurrency/crafting/trading_core');

    event
      .shaped('lightmanscurrency:atm', ['ABA', 'ACA', 'AAA'], {
        A: '#c:ingots/iron',
        B: '#c:glass_panes',
        C: 'lightmanscurrency:trading_core',
      })
      .id('createdelightcore:lightmanscurrency/crafting/atm');

    event
      .shapeless('lightmanscurrency:wallet_ender_dragon', [
        'lightmanscurrency:wallet_netherite',
        'minecraft:dragon_breath',
      ])
      .id(
        'createdelightcore:lightmanscurrency/wallet/upgrade_wallet_netherite_to_wallet_ender_dragon'
      );
  });
}
