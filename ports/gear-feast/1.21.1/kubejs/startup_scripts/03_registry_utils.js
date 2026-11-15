// priority: 900
// 源：CDR 1.21.1 kubejs/startup_scripts/util.js
// 本地适配：hasMod / hasAllMods 已在 00_port_core.js 定义，此处不重复定义；
// 仅补入注册表查询与全局工具函数。

const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries');
const FluidWrapper = Java.loadClass('dev.latvian.mods.kubejs.fluid.FluidWrapper');
const RegistryAccessContainer = Java.loadClass(
  'dev.latvian.mods.kubejs.util.RegistryAccessContainer'
);
const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation');

global.registryIdExists = function (registry, id) {
  return registry.containsKey(ResourceLocation.parse(id));
};

global.itemExists = function (id) {
  return global.registryIdExists(BuiltInRegistries.ITEM, id);
};

global.itemIdFromStack = function (stack) {
  return String(stack).replace(/^\d+x\s+/, '');
};

global.itemStackExists = function (stack) {
  const item = global.itemIdFromStack(stack);
  return item.startsWith('#') || global.itemExists(item);
};

global.blockExists = function (id) {
  return global.registryIdExists(BuiltInRegistries.BLOCK, id);
};

global.fluidExists = function (id) {
  return global.registryIdExists(BuiltInRegistries.FLUID, id);
};

global.getFluidIdsInIngredient = function (fluidIngredient) {
  const result = FluidWrapper.ingredientOfString(
    RegistryAccessContainer.current.nbt(),
    String(fluidIngredient)
  );

  if (result.error().isPresent()) {
    throw new Error(
      `Invalid fluid ingredient ${fluidIngredient}: ${result.error().get().message()}`
    );
  }

  const ids = [];
  result
    .result()
    .get()
    .getStacks()
    .forEach((stack) => {
      const id = String(BuiltInRegistries.FLUID.getKey(stack.getFluid()));

      if (id !== 'minecraft:empty' && !ids.includes(id)) {
        ids.push(id);
      }
    });

  return ids.sort();
};

// Expands a fluid tag into concrete fluid ids for code paths that must store
// one exact fluid id instead of a tag, such as item NBT or startup registration.
global.getFluidIdsInTag = function (tag) {
  const id = String(tag);
  return global.getFluidIdsInIngredient(id.startsWith('#') ? id : `#${id}`);
};
