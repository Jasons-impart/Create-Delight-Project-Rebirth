// TACZ 1.1.7 stores identities in minecraft:custom_data; its own ingredient supports partial NBT.
if (global.hasAllMods(['tacz', 'ae2', 'megacells', 'createdelightcore'])) {
  ServerEvents.recipes((event) => {
    const itemIds = {
      attachment: 'tacz:attachment',
      ammo: 'tacz:ammo',
      gun: 'tacz:modern_kinetic_gun',
    };
    const keys = { attachment: 'AttachmentId', ammo: 'AmmoId', gun: 'GunId' };
    const data = (id, kind) => {
      const result = {};
      result[keys[kind]] = id;
      return result;
    };
    const output = (id, kind, count, mode, barrel) => {
      const nbt = data(id, kind);
      if (kind === 'gun')
        Object.assign(nbt, {
          GunCurrentAmmoCount: 0,
          GunFireMode: mode,
          HasBulletInBarrel: barrel,
        });
      return { id: itemIds[kind], count: count, components: { 'minecraft:custom_data': nbt } };
    };
    const part = (id, kind, partial) => ({
      type: 'tacz:nbt',
      items: itemIds[kind],
      nbt: data(id, kind),
      partial: partial,
    });
    const chargedCell = () => ({
      type: 'neoforge:components',
      items: 'megacells:mega_energy_cell',
      components: { 'ae2:stored_energy': 12800000 },
      strict: false,
    });
    const ingredient = (value) =>
      typeof value !== 'string'
        ? value
        : value.startsWith('#')
          ? { tag: value.slice(1) }
          : { item: value };
    const add = (name, recipe) => event.custom(recipe).id(`createdelightcore:tacz/${name}`);
    const shaped = (name, result, pattern, key) => {
      Object.keys(key).forEach((k) => (key[k] = ingredient(key[k])));
      add(name, { type: 'minecraft:crafting_shaped', pattern: pattern, key: key, result: result });
    };
    const shapeless = (name, result, ingredients) =>
      add(name, {
        type: 'minecraft:crafting_shapeless',
        ingredients: ingredients.map(ingredient),
        result: result,
      });
    const inscribe = (name, result, top, middle, bottom) => {
      const ingredients = { middle: ingredient(middle) };
      if (top !== 'minecraft:air') ingredients.top = ingredient(top);
      if (bottom !== 'minecraft:air') ingredients.bottom = ingredient(bottom);
      add(name, { type: 'ae2:inscriber', ingredients: ingredients, result: result, mode: 'press' });
    };
    const transform = (name, result, ingredients, explosion) =>
      add(name, {
        type: 'ae2:transform',
        ingredients: ingredients.map(ingredient),
        result: result,
        circumstance: explosion
          ? { type: 'explosion' }
          : { type: 'fluid', tag: 'createdelightcore:spent_liquor' },
      });
    // art_of_forging's life-fiber bracelet recipe is intentionally not migrated.

    shaped(
      'bracelet_niklas',
      output('applied_armorer:bracelet_niklas', 'attachment', 1),
      ['AAA', 'ABA', 'AAA'],
      { A: '#c:ingots/iron', B: 'northstar:durable_fabric' }
    );
    inscribe(
      'bracelet_aerial_wristband',
      output('applied_armorer:bracelet_aerial_wristband', 'attachment', 1),
      'createdelightcore:phase_transition_iron',
      part('applied_armorer:bracelet_niklas', 'attachment', false),
      '#c:ingots/electrum'
    );
    shaped(
      'si_double_sided_mirror',
      output('applied_armorer:si_double_sided_mirror', 'attachment', 1),
      ['A A', 'BCB'],
      { A: 'ae2:quartz_glass', B: 'megacells:sky_steel_ingot', C: 'ae2:fluix_crystal' }
    );
    shaped(
      'si_profession',
      output('applied_armorer:si_profession', 'attachment', 1),
      ['A  ', 'BBB'],
      { A: 'ae2:quartz_glass', B: 'megacells:sky_steel_ingot' }
    );
    shaped(
      'scope_xgs_905',
      output('applied_armorer:scope_xgs_905', 'attachment', 1),
      ['AAA', 'B B', 'AAA'],
      { A: 'megacells:sky_steel_ingot', B: 'ae2:quartz_glass' }
    );
    shaped(
      'si_simple_3',
      output('applied_armorer:si_simple_3', 'attachment', 1),
      [' A ', ' B ', ' A '],
      { A: 'megacells:sky_steel_ingot', B: 'ae2:quartz_glass' }
    );
    shaped('sight_type_3741', output('applied_armorer:sight_type_3741', 'attachment', 1), ['ABA'], {
      A: 'megacells:sky_steel_ingot',
      B: part('applied_armorer:si_simple_3', 'attachment', false),
    });
    shaped(
      'scope_ms_12',
      output('applied_armorer:si_ms_12', 'attachment', 1),
      [' A ', 'BCB', 'AAA'],
      {
        A: 'megacells:sky_steel_ingot',
        B: 'ae2:quartz_glass',
        C: part('applied_armorer:sight_type_3741', 'attachment', false),
      }
    );
    shaped(
      'scope_ms_14',
      output('applied_armorer:scope_ms_14', 'attachment', 1),
      ['AAA', 'BCB', 'AAA'],
      {
        A: 'megacells:sky_steel_ingot',
        B: 'ae2:quartz_glass',
        C: part('applied_armorer:si_ms_12', 'attachment', false),
      }
    );
    shaped(
      'muzzle_ns_1',
      output('applied_armorer:muzzle_ns_1', 'attachment', 1),
      ['AAA', 'B B', 'AAA'],
      { A: '#c:rods/iron', B: '#c:nuggets/iron' }
    );
    shaped(
      'muzzle_classic',
      output('applied_armorer:muzzle_classic', 'attachment', 1),
      [' A ', ' B ', ' A '],
      {
        A: 'megacells:sky_steel_ingot',
        B: part('applied_armorer:muzzle_ns_1', 'attachment', false),
      }
    );
    shaped(
      'bayonet_gladius',
      output('applied_armorer:bayonet_gladius', 'attachment', 1),
      [' A', ' B'],
      { A: 'megacells:sky_steel_ingot', B: '#c:rods/iron' }
    );
    shaped(
      'bayonet_er',
      output('applied_armorer:bayonet_er', 'attachment', 1),
      [' A ', ' A ', ' B '],
      {
        A: 'megacells:sky_steel_ingot',
        B: part('applied_armorer:bayonet_gladius', 'attachment', false),
      }
    );
    shaped(
      'bracelet_zenith',
      output('applied_armorer:bracelet_zenith', 'attachment', 1),
      ['ABC', 'DED', 'FGH'],
      {
        A: part('applied_armorer:bracelet_broken_handcuffs', 'attachment', false),
        B: part('applied_armorer:bracelet_aerial_wristband', 'attachment', false),
        C: part('applied_armorer:bracelet_broken_watch', 'attachment', false),
        D: 'ae2:quantum_entangled_singularity',
        E: part('applied_armorer:bracelet_niklas', 'attachment', false),
        F: part('applied_armorer:bracelet_koeis_armband', 'attachment', false),
        G: part('applied_armorer:bracelet_magma_wristband', 'attachment', false),
        H: part('applied_armorer:bracelet_exo', 'attachment', false),
      }
    );
    shaped(
      'grip_eazy',
      output('applied_armorer:grip_eazy', 'attachment', 1),
      ['   ', 'AAA', '   '],
      { A: 'megacells:sky_steel_ingot' }
    );
    shapeless('grip_lf11', output('applied_armorer:grip_lf11', 'attachment', 1), [
      part('applied_armorer:grip_eazy', 'attachment', false),
      'vintageimprovements:laser_item',
    ]);
    shaped(
      'grip_static_1',
      output('applied_armorer:grip_static_1', 'attachment', 1),
      ['AAA', 'BCB', 'AAA'],
      {
        A: 'megacells:sky_steel_ingot',
        B: 'ae2:fluix_crystal',
        C: part('applied_armorer:grip_eazy', 'attachment', false),
      }
    );
    shaped(
      'grip_storm',
      output('applied_armorer:grip_storm', 'attachment', 1),
      ['AAA', 'BCB', ' A '],
      { A: '#c:ingots/iron', B: 'ae2:fluix_crystal', C: 'megacells:sky_steel_ingot' }
    );
    shaped(
      'grip_hf_17',
      output('applied_armorer:grip_hf_17', 'attachment', 1),
      ['A A', 'BCD', '   '],
      {
        A: '#c:ingots/iron',
        B: '#c:gems/certus_quartz',
        C: part('applied_armorer:grip_eazy', 'attachment', false),
        D: 'megacells:sky_steel_ingot',
      }
    );
    shaped(
      'grip_light',
      output('applied_armorer:grip_light', 'attachment', 1),
      [' A ', ' B ', ' B '],
      { A: part('applied_armorer:grip_hf_17', 'attachment', false), B: 'megacells:sky_steel_ingot' }
    );
    shaped(
      'grip_stable',
      output('applied_armorer:grip_stable', 'attachment', 1),
      ['   ', 'BAB', 'BBB'],
      { A: part('applied_armorer:grip_eazy', 'attachment', false), B: 'megacells:sky_steel_ingot' }
    );
    shaped(
      'extended_mag_aa_1',
      output('applied_armorer:extended_mag_aa_1', 'attachment', 1),
      ['ABA', 'A A', 'ACA'],
      { A: '#c:gems/quartz', B: 'minecraft:quartz_block', C: 'ae2:cell_component_1k' }
    );
    shaped(
      'extended_mag_aa_2',
      output('applied_armorer:extended_mag_aa_2', 'attachment', 1),
      ['ABA', 'ACA', 'ADA'],
      {
        A: '#c:gems/certus_quartz',
        B: '#c:storage_blocks/certus_quartz',
        C: part('applied_armorer:extended_mag_aa_1', 'attachment', false),
        D: 'ae2:cell_component_4k',
      }
    );
    shaped(
      'extended_mag_aa_3',
      output('applied_armorer:extended_mag_aa_3', 'attachment', 1),
      ['ABA', 'ACA', 'ADA'],
      {
        A: '#c:gems/fluix',
        B: 'ae2:fluix_block',
        C: part('applied_armorer:extended_mag_aa_2', 'attachment', false),
        D: 'ae2:cell_component_16k',
      }
    );
    shaped(
      'extended_battery_aa_1',
      output('applied_armorer:extended_battery_aa_1', 'attachment', 1),
      ['ABA', 'BCB', 'ABA'],
      { A: '#c:gems/fluix', B: 'ae2:energy_cell', C: 'megacells:accumulation_processor' }
    );
    shaped(
      'extended_battery_aa_2',
      output('applied_armorer:extended_battery_aa_2', 'attachment', 1),
      ['ABA', 'BCB', 'ABA'],
      {
        A: 'ae2:energy_card',
        B: 'ae2:dense_energy_cell',
        C: part('applied_armorer:extended_battery_aa_1', 'attachment', false),
      }
    );
    shaped(
      'extended_battery_aa_3',
      output('applied_armorer:extended_battery_aa_3', 'attachment', 1),
      ['ABA', 'BCB', 'ABA'],
      {
        A: 'megacells:greater_energy_card',
        B: 'megacells:mega_energy_cell',
        C: part('applied_armorer:extended_battery_aa_2', 'attachment', false),
      }
    );
    shaped(
      'muzzle_commander',
      output('applied_armorer:muzzle_commander', 'attachment', 1),
      ['AAA', '   ', 'BAA'],
      { A: '#c:rods/iron', B: '#c:nuggets/iron' }
    );
    shaped(
      'muzzle_bs_mod4',
      output('applied_armorer:muzzle_bs_mod4', 'attachment', 1),
      ['ABA', '   ', 'ABA'],
      { A: '#c:rods/iron', B: '#c:nuggets/iron' }
    );
    shaped(
      'fluix_battery',
      output('applied_armorer:fluix_battery', 'ammo', 20),
      ['ABA', 'ACA', 'AAA'],
      { A: '#c:storage_blocks/sky_steel', B: 'ae2:fluix_block', C: chargedCell() }
    );
    shaped(
      'grip_sl_2',
      output('applied_armorer:grip_sl_2', 'attachment', 1),
      ['   ', 'ABA', '   '],
      {
        A: 'ae2:charged_certus_quartz_crystal',
        B: part('applied_armorer:grip_lf11', 'attachment', false),
      }
    );
    inscribe(
      'extended_mid_mag_aa_1',
      output('applied_armorer:extended_mid_mag_aa_1', 'attachment', 1),
      part('applied_armorer:extended_mag_aa_1', 'attachment', false),
      '#c:dusts/ender_pearl',
      part('applied_armorer:extended_mag_aa_1', 'attachment', false)
    );
    inscribe(
      'extended_mid_mag_aa_2',
      output('applied_armorer:extended_mid_mag_aa_2', 'attachment', 1),
      part('applied_armorer:extended_mag_aa_2', 'attachment', false),
      '#c:dusts/ender_pearl',
      part('applied_armorer:extended_mag_aa_2', 'attachment', false)
    );
    inscribe(
      'extended_mid_mag_aa_3',
      output('applied_armorer:extended_mid_mag_aa_3', 'attachment', 1),
      part('applied_armorer:extended_mag_aa_3', 'attachment', false),
      '#c:dusts/ender_pearl',
      part('applied_armorer:extended_mag_aa_3', 'attachment', false)
    );
    inscribe(
      'bracelet_broken_handcuffs',
      output('applied_armorer:bracelet_broken_handcuffs', 'attachment', 1),
      'minecraft:chain',
      part('applied_armorer:bracelet_niklas', 'attachment', false),
      'minecraft:pink_dye'
    );
    inscribe(
      'bracelet_broken_watch',
      output('applied_armorer:bracelet_broken_watch', 'attachment', 1),
      'createdieselgenerators:distillation_controller',
      part('applied_armorer:bracelet_niklas', 'attachment', false),
      'minecraft:air'
    );
    inscribe(
      'bracelet_magma_wristband',
      output('applied_armorer:bracelet_magma_wristband', 'attachment', 1),
      'alexscavesup:tectonic_shard',
      part('applied_armorer:bracelet_niklas', 'attachment', false),
      'minecraft:magma_block'
    );
    inscribe(
      'bracelet_exo',
      output('applied_armorer:bracelet_exo', 'attachment', 1),
      'createdelightcore:forged_steel_sheet',
      part('applied_armorer:bracelet_niklas', 'attachment', false),
      'ae2:singularity'
    );
    inscribe(
      'muzzle_chip_firefly',
      output('applied_armorer:muzzle_chip_firefly', 'attachment', 1),
      'ae2:calculation_processor',
      '#c:plates/iron',
      'ae2:logic_processor'
    );
    inscribe(
      'muzzle_chip_pcs_x1',
      output('applied_armorer:muzzle_chip_pcs_x1', 'attachment', 1),
      'ae2:speed_card',
      'createdelightcore:forged_steel_sheet',
      'ae2:calculation_processor'
    );
    inscribe(
      'muzzle_chip_atm_x2',
      output('applied_armorer:muzzle_chip_atm_x2', 'attachment', 1),
      'ae2:speed_card',
      part('applied_armorer:muzzle_chip_pcs_x1', 'attachment', false),
      'ae2:engineering_processor'
    );
    inscribe(
      'muzzle_chip_firework',
      output('applied_armorer:muzzle_chip_firework', 'attachment', 1),
      'ae2:energy_card',
      part('applied_armorer:muzzle_chip_firefly', 'attachment', false),
      'ae2:energy_cell'
    );
    inscribe(
      'muzzle_chip_hyper_propellant',
      output('applied_armorer:muzzle_chip_hyper_propellant', 'attachment', 1),
      'ae2:energy_card',
      part('applied_armorer:muzzle_chip_firework', 'attachment', false),
      'ae2:dense_energy_cell'
    );
    inscribe(
      'muzzle_chip_fat_boy',
      output('applied_armorer:muzzle_chip_fat_boy', 'attachment', 1),
      'megacells:greater_energy_card',
      part('applied_armorer:muzzle_chip_hyper_propellant', 'attachment', false),
      'megacells:mega_energy_cell'
    );
    inscribe(
      'niklas_pistol_semi_pride',
      output('applied_armorer:niklas_pistol_semi_pride', 'gun', 1, 'SEMI', false),
      'ae2:annihilation_core',
      part('applied_armorer:niklas_pistol_semi_union', 'gun', true),
      'ae2:basic_card'
    );
    inscribe(
      'niklas_pistol_semi_right',
      output('applied_armorer:niklas_pistol_semi_right', 'gun', 1, 'SEMI', false),
      'ae2:annihilation_core',
      part('applied_armorer:niklas_pistol_semi_pride', 'gun', true),
      'ae2:advanced_card'
    );
    inscribe(
      'niklas_pistol_double_win_win',
      output('applied_armorer:niklas_pistol_double_win_win', 'gun', 1, 'SEMI', true),
      part('applied_armorer:niklas_pistol_semi_union', 'gun', true),
      'ae2:singularity',
      part('applied_armorer:niklas_pistol_semi_union', 'gun', true)
    );
    inscribe(
      'moritz_rifle_ar77',
      output('applied_armorer:moritz_rifle_ar77', 'gun', 1, 'SEMI', false),
      'ae2:annihilation_core',
      part('applied_armorer:niklas_smg_freedom', 'gun', true),
      'ae2:basic_card'
    );
    inscribe(
      'niklas_lever_vigenere',
      output('applied_armorer:niklas_lever_vigenere', 'gun', 1, 'SEMI', false),
      'ae2:annihilation_core',
      part('applied_armorer:moritz_rifle_ar77', 'gun', true),
      'ae2:energy_card'
    );
    inscribe(
      'moritz_shotgun_sg914',
      output('applied_armorer:moritz_shotgun_sg914', 'gun', 1, 'SEMI', false),
      'ae2:annihilation_core',
      part('applied_armorer:moritz_rifle_ar77', 'gun', true),
      'ae2:speed_card'
    );
    inscribe(
      'moritz_sniper_semi_k30',
      output('applied_armorer:moritz_sniper_semi_k30', 'gun', 1, 'SEMI', false),
      'ae2:speed_card',
      part('applied_armorer:niklas_lever_vigenere', 'gun', true),
      'megacells:greater_energy_card'
    );
    inscribe(
      'moritz_mg_hmg22',
      output('applied_armorer:moritz_mg_hmg22', 'gun', 1, 'SEMI', false),
      'ae2:speed_card',
      part('applied_armorer:niklas_smg_freedom', 'gun', true),
      'ae2:energy_card'
    );
    inscribe(
      'moritz_gernade_gl3',
      output('applied_armorer:moritz_gernade_gl3', 'gun', 1, 'SEMI', false),
      'megacells:compression_card',
      part('applied_armorer:niklas_lever_vigenere', 'gun', true),
      'ae2:energy_card'
    );
    transform(
      'cluster_quartz_bullet',
      output('applied_armorer:cluster_quartz_bullet', 'ammo', 1),
      ['#c:dusts/ender_pearl', '#c:dusts/certus_quartz', part('tacz:12g', 'ammo', false)],
      false
    );
    transform(
      'hard_core_quartz_bullet',
      output('applied_armorer:hard_core_quartz_bullet', 'ammo', 1),
      [
        '#c:dusts/ender_pearl',
        '#c:dusts/certus_quartz',
        part('create_armorer:slap', 'ammo', false),
      ],
      false
    );
    transform(
      'etched_quartz_bullet',
      output('applied_armorer:etched_quartz_bullet', 'ammo', 1),
      [
        '#c:dusts/ender_pearl',
        '#c:dusts/certus_quartz',
        part('create_armorer:rbapb', 'ammo', false),
      ],
      false
    );
    transform(
      'fluix_infused_grenade',
      output('applied_armorer:fluix_infused_grenade', 'ammo', 1),
      ['#c:dusts/ender_pearl', '#c:dusts/certus_quartz', 'ae2:tiny_tnt'],
      false
    );
    transform(
      'niklas_pistol_semi_union',
      output('applied_armorer:niklas_pistol_semi_union', 'gun', 1, 'SEMI', false),
      [
        '#c:storage_blocks/sky_steel',
        '#c:storage_blocks/iron',
        'ae2:singularity',
        part('create_armorer:pistol_auto_stress', 'gun', true),
      ],
      false
    );
    transform(
      'niklas_smg_freedom',
      output('applied_armorer:niklas_smg_freedom', 'gun', 1, 'SEMI', false),
      [
        '#c:storage_blocks/sky_steel',
        '#c:storage_blocks/iron',
        'ae2:singularity',
        part('create_armorer:smg_auto_crank', 'gun', true),
      ],
      false
    );
    transform(
      'moritz_mg_emg_prototype',
      output('applied_armorer:moritz_mg_emg_prototype', 'gun', 1, 'AUTO', false),
      [
        part('applied_armorer:moritz_mg_hmg22', 'gun', true),
        part('applied_armorer:moritz_mg_hmg22', 'gun', true),
        part('applied_armorer:moritz_mg_hmg22', 'gun', true),
        part('applied_armorer:moritz_mg_hmg22', 'gun', true),
        'ae2:quantum_link',
      ],
      true
    );
  });
}
