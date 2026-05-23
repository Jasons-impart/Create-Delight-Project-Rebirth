(() => {
  const mods = Platform.getList();

  if (!mods.contains('alexscaves') || !mods.contains('cpapireforged')) {
    return;
  }

  const CustomPortalBuilder = Java.loadClass(
    'net.kyrptonaught.customportalapi.api.CustomPortalBuilder'
  );
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries');
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation');

  const id = (value) => ResourceLocation.parse(value);
  const exists = (registry, value) => registry.containsKey(id(value));
  const get = (registry, value) => registry.get(id(value));

  const portals = [
    {
      dimension: 'createdelightcore:magnetic_caves_dimension',
      frame: 'create_new_age:magnetite_block',
      item: 'create_new_age:overcharged_diamond',
      color: [112, 78, 173],
    },
    {
      dimension: 'createdelightcore:abyssal_chasm_dimension',
      frame: 'minecraft:dark_prismarine',
      water: true,
      color: [26, 29, 35],
    },
    {
      dimension: 'createdelightcore:forlorn_hollows_dimension',
      frame: 'minecraft:packed_mud',
      item: 'art_of_forging:shards_of_malice',
      color: [174, 0, 0],
    },
    {
      dimension: 'createdelightcore:primordial_caves_dimension',
      frame: 'create:limestone',
      item: 'minecraft:bone',
      color: [161, 119, 51],
    },
    {
      dimension: 'createdelightcore:toxic_caves_dimension',
      frame: 'alexscaves:sulfur',
      item: 'alexscaves:sulfur_dust',
      color: [102, 150, 54],
    },
    {
      dimension: 'createdelightcore:candy_cavity_dimension',
      frame: 'create_confectionery:candy_cane_block',
      fluid: 'create_confectionery:caramel',
      color: [216, 131, 51],
    },
  ];

  const canRegister = (portal) => {
    if (!exists(BuiltInRegistries.BLOCK, portal.frame)) {
      console.warn(
        `[createdelightcore] Skipping ${portal.dimension} portal: missing frame block ${portal.frame}`
      );
      return false;
    }

    if (portal.item && !exists(BuiltInRegistries.ITEM, portal.item)) {
      console.warn(
        `[createdelightcore] Skipping ${portal.dimension} portal: missing ignition item ${portal.item}`
      );
      return false;
    }

    if (portal.fluid && !exists(BuiltInRegistries.FLUID, portal.fluid)) {
      console.warn(
        `[createdelightcore] Skipping ${portal.dimension} portal: missing ignition fluid ${portal.fluid}`
      );
      return false;
    }

    return true;
  };

  StartupEvents.postInit(() => {
    portals.filter(canRegister).forEach((portal) => {
      const builder = CustomPortalBuilder.beginPortal()
        .frameBlock(id(portal.frame))
        .destDimID(id(portal.dimension))
        .tintColor(portal.color[0], portal.color[1], portal.color[2]);

      if (portal.water) {
        builder.lightWithWater();
      } else if (portal.item) {
        builder.lightWithItem(get(BuiltInRegistries.ITEM, portal.item));
      } else if (portal.fluid) {
        builder.lightWithFluid(get(BuiltInRegistries.FLUID, portal.fluid));
      }

      builder.registerPortal();
    });
  });
})();
