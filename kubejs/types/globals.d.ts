interface JavaContainsCollection<T> {
  contains(value: T): boolean;
}

interface JavaRegistryLike {
  containsKey(key: unknown): boolean;
}

interface CreatedelightGlobalHelpers {
  /** 当前已加载 mod id 列表。Raw Platform.getList() result used by helper predicates. */
  MOD_LIST: JavaContainsCollection<string>;

  /** 可以无限抽取的流体列表。Startup-safe list of fluids that can be treated as infinite sources. */
  INFINITE_SOURCE_FLUIDS: string[];

  /** 原版十六色列表。 */
  COLORS: string[];

  /** 检查指定 mod 是否已加载。Returns true when the given mod id is loaded. */
  hasMod(modId: string): boolean;

  /** 检查列表里的 mod 是否全部已加载。Returns true only when every mod id in the list is loaded. */
  hasAllMods(modIds: string[]): boolean;

  /** 检查列表里是否至少有一个 mod 已加载。Returns true when at least one mod id in the list is loaded. */
  hasAnyMod(modIds: string[]): boolean;

  /** 检查指定注册表中是否存在 id。Returns true when an id exists in the given Minecraft registry. */
  registryIdExists(registry: JavaRegistryLike, id: string): boolean;

  /** 检查物品 id 是否存在于注册表。Returns true when an item id exists in the item registry. */
  itemExists(id: string): boolean;

  /** 从 KubeJS 交易/配方栈字符串中取物品 id，如 '8x minecraft:wheat' -> 'minecraft:wheat'。 */
  itemIdFromStack(stack: string): string;

  /** 检查 KubeJS 栈字符串对应物品是否存在；tag ingredient 直接视为存在。 */
  itemStackExists(stack: string): boolean;

  /** 检查方块 id 是否存在于注册表。Returns true when a block id exists in the block registry. */
  blockExists(id: string): boolean;

  /** 检查流体 id 是否存在于注册表。Returns true when a fluid id exists in the fluid registry. */
  fluidExists(id: string): boolean;

  /** 展开流体 ingredient，如 '#c:water' 或 '@create'。Expands a fluid ingredient into concrete fluid ids; use during server reload events. */
  getFluidIdsInIngredient(fluidIngredient: string): string[];

  /** 展开流体 tag，可带或不带 '#'。Expands a fluid tag into concrete ids for NBT or registration code that cannot store tags. */
  getFluidIdsInTag(tag: string): string[];
}

declare const global: typeof globalThis & CreatedelightGlobalHelpers;

/** 按配方 id 批量移除配方。Removes recipes by exact recipe id. */
declare function remove_recipes_id(event: unknown, ids: string[]): void;

/** 按输出批量移除配方。Removes recipes by output item or output item list. */
declare function remove_recipes_output(event: unknown, outputs: string | string[]): void;

/** 按输入批量移除配方。Removes recipes by input item or input item list. */
declare function remove_recipes_input(event: unknown, inputs: string | string[]): void;

/** 按配方类型批量移除配方。Removes recipes by recipe type. */
declare function remove_recipes_type(event: unknown, types: string[]): void;

/** 构造流体 tag ingredient JSON。Creates a fluid tag ingredient JSON object. */
declare function fluid_tag_ingredient(tag: string, amount?: number, nbt?: object): object;
