if (global.hasMod('tacz')) {
  // Replace the old ModCreativeTabs Hotai icon substitutions through KubeJS's public API.
  let gunIcons = {
    pistol: 'pistol_auto_stress',
    sniper: 'sniper_semi_clockwork',
    rifle: 'rifle_assult_crane',
    shotgun: 'shotgun_pump_bearing',
    smg: 'smg_auto_crank',
    rpg: 'special_melee_wrench',
    mg: 'mg_platemag_flywheel',
  };
  Object.entries(gunIcons).forEach(([tab, gun]) => {
    StartupEvents.modifyCreativeTab(`tacz:${tab}`, (event) => {
      event.setIcon(
        Item.of('tacz:modern_kinetic_gun', {
          'minecraft:custom_data': { GunId: `create_armorer:${gun}` },
        })
      );
    });
  });
  let attachmentIcons = {
    grip: 'create_armorer:grip_gantry_shaft',
    stock: 'applied_armorer:bracelet_zenith',
    muzzle: 'create_armorer:muzzle_refit_brass_retractor',
    scope: 'create_armorer:scope_telephoto',
  };
  Object.entries(attachmentIcons).forEach(([tab, attachment]) => {
    StartupEvents.modifyCreativeTab(`tacz:${tab}`, (event) => {
      event.setIcon(
        Item.of('tacz:attachment', {
          'minecraft:custom_data': { AttachmentId: attachment },
        })
      );
    });
  });
}
